from typing import List, Optional
import dataclasses
import time
import json
import hashlib

from rest_framework import serializers
from rest_framework.request import Request

from lib.cache import REDIS

from django.conf import settings

# message to device will expire in ..
LINKHELPER_MESSAGE_EXPIRATION_SECS = 60

# device is considered offline if does not call in ..
LINKHELPER_PRESENCE_EXPIRATION_SECS = 10


def redis__presence_prefix(client_ip: str) -> str:
    return f'printer_discovery:{client_ip}:presence'


def redis__device_info_prefix(client_ip: str, device_id: str) -> str:
    return f'printer_discovery:{client_ip}:device_info:{device_id}'


def redis__to_device_message_queue_prefix(client_ip: str, device_id: str) -> str:
    return f'printer_discovery:{client_ip}:messages_to:{device_id}'


class DeviceInfoSerializer(serializers.Serializer):
    device_id = serializers.CharField(
        required=True, min_length=32, max_length=32)
    hostname = serializers.CharField(
        required=True, max_length=253)
    os = serializers.CharField(
        required=True, max_length=253, allow_blank=True)
    arch = serializers.CharField(
        required=True, max_length=253, allow_blank=True)
    rpi_model = serializers.CharField(
        required=True, max_length=253, allow_blank=True)
    octopi_version = serializers.CharField(
        required=True, max_length=253, allow_blank=True)
    printerprofile = serializers.CharField(
        required=True, max_length=253, allow_blank=True)


class DeviceMessageSerializer(serializers.Serializer):
    device_id = serializers.CharField(
        required=True, min_length=32, max_length=32)
    type = serializers.CharField(required=True, max_length=64)
    data = serializers.DictField(required=True)


@dataclasses.dataclass
class DeviceInfo:
    device_id: str
    hostname: str
    os: str
    arch: str
    octopi_version: str
    rpi_model: str
    printerprofile: str

    @classmethod
    def from_dict(cls, data) -> 'DeviceInfo':
        serializer = DeviceInfoSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data
        return DeviceInfo(**{k: (v or '') for (k, v) in validated.items()})

    @classmethod
    def from_json(cls, raw: str) -> 'DeviceInfo':
        return DeviceInfo.from_dict(json.loads(raw))

    def to_json(self) -> str:
        return json.dumps(self.asdict())

    def asdict(self) -> dict:
        return dataclasses.asdict(self)


@dataclasses.dataclass
class DeviceMessage:
    device_id: str
    type: str
    data: dict

    @classmethod
    def from_dict(cls, data) -> 'DeviceMessage':
        serializer = DeviceMessageSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data
        return DeviceMessage(**{k: v for (k, v) in validated.items()})

    @classmethod
    def from_json(cls, raw: str) -> 'DeviceMessage':
        return DeviceMessage.from_dict(json.loads(raw))

    def to_json(self) -> str:
        return json.dumps(self.asdict())

    def asdict(self) -> dict:
        return dataclasses.asdict(self)


def redis__push_message_for_device(
    client_ip: str,
    device_id: str,
    message: DeviceMessage,
    cur_time: Optional[float] = None,
    expiration_secs: int = LINKHELPER_MESSAGE_EXPIRATION_SECS
) -> None:
    t = cur_time if cur_time is not None else time.time()
    raw = message.to_json()
    key = redis__to_device_message_queue_prefix(client_ip, device_id)
    with REDIS.pipeline() as conn:
        conn.zremrangebyscore(key, min="-inf", max=t - expiration_secs)
        conn.zadd(key, {raw: t})
        conn.expire(key, expiration_secs)
        conn.execute()


def redis__pull_messages_for_device(
    client_ip: str,
    device_id: str,
    message_count: int = 3,
    cur_time: Optional[float] = None,
    expiration_secs: int = LINKHELPER_MESSAGE_EXPIRATION_SECS
) -> List[DeviceMessage]:
    t = cur_time if cur_time is not None else time.time()
    key = redis__to_device_message_queue_prefix(client_ip, device_id)
    with REDIS.pipeline() as conn:
        conn.zremrangebyscore(key, min='-inf', max=t - expiration_secs)
        conn.zpopmin(key, message_count)
        ret = conn.execute()

    raw_messages = ret[1]
    messages = []
    for (raw, _) in raw_messages:
        msg = DeviceMessage.from_json(raw)
        if msg is not None:
            messages.append(msg)
    return messages


def redis__active_devices_for_client_ip(
    client_ip: str,
    cur_time: Optional[float] = None,
    expiration_secs: int = LINKHELPER_PRESENCE_EXPIRATION_SECS,
) -> List[DeviceInfo]:
    t = cur_time if cur_time is not None else time.time()

    # fetch active decice ids
    key = redis__presence_prefix(client_ip)
    with REDIS.pipeline() as conn:
        conn.zremrangebyscore(key, min="-inf", max=t - expiration_secs)
        conn.zrangebyscore(key, min=t - expiration_secs, max='+inf')
        ret1 = conn.execute()

    # fetch device info for all device id
    device_ids = ret1[1]
    with REDIS.pipeline() as conn:
        for device_id in device_ids:
            conn.get(redis__device_info_prefix(client_ip, device_id))
        ret2 = conn.execute()

    dinfos = []
    for device_info_raw in ret2:
        # might have expired in the meantime, skip it
        if not device_info_raw:
            continue

        dinfo = DeviceInfo.from_json(device_info_raw)
        if dinfo is not None:
            dinfos.append(dinfo)
    return dinfos


def redis__update_presence_for_device(
    client_ip: str,
    device_id: str,
    device_info: DeviceInfo,
    cur_time: Optional[float] = None,
    expiration_secs: int = LINKHELPER_PRESENCE_EXPIRATION_SECS,

) -> None:
    t = cur_time if cur_time is not None else time.time()
    raw = device_info.to_json()
    key = redis__presence_prefix(client_ip)
    info_key = redis__device_info_prefix(client_ip, device_id)
    with REDIS.pipeline() as conn:
        conn.zadd(key, {device_id: t})
        conn.expire(key, expiration_secs)
        conn.setex(info_key, expiration_secs, raw)
        conn.execute()
