import { isLocalStorageSupported } from './utils.js'


const Themes = {
  Light: 'Light',
  Dark: 'Dark',
  System: 'System',
}

const defaultTheme = (isLocalStorageSupported() ? localStorage.getItem('colorTheme') : Themes.Dark) || Themes.Dark


// CSS Vars

const colors = [
  {
    name: 'primary',
    values: {
      [Themes.Light]: '#3BCD9C',
      [Themes.Dark]: '#5FD3AC'
    }
  },
  {
    name: 'primary-hover',
    values: {
      [Themes.Light]: '#5FD3AC',
      [Themes.Dark]: '#3BCD9C'
    }
  },
  {
    name: 'on-primary',
    values: {
      [Themes.Light]: 'rgb(255 255 255)',
      [Themes.Dark]: 'rgb(255 255 255)'
    }
  },

  {
    name: 'secondary',
    values: {
      [Themes.Light]: 'rgb(40 48 58)',
      [Themes.Dark]: 'rgb(235 235 235)'
    }
  },
  {
    name: 'on-secondary',
    values: {
      [Themes.Light]: 'rgb(235 235 235)',
      [Themes.Dark]: 'rgb(40 48 58)'
    }
  },

  {
    name: 'success',
    values: {
      [Themes.Light]: 'rgb(92 184 92)',
      [Themes.Dark]: 'rgb(92 184 92)'
    }
  },
  {
    name: 'success-hover',
    values: {
      [Themes.Light]: 'rgb(76 174 76)',
      [Themes.Dark]: 'rgb(76 174 76)'
    }
  },
  {
    name: 'on-success',
    values: {
      [Themes.Light]: 'rgb(255 255 255)',
      [Themes.Dark]: 'rgb(255 255 255)'
    }
  },

  {
    name: 'danger',
    values: {
      [Themes.Light]: 'rgb(217 83 79)',
      [Themes.Dark]: 'rgb(217 83 79)'
    }
  },
  {
    name: 'danger-hover',
    values: {
      [Themes.Light]: 'rgb(194 65 61)',
      [Themes.Dark]: 'rgb(194 65 61)'
    }
  },
  {
    name: 'on-danger',
    values: {
      [Themes.Light]: 'rgb(255 255 255)',
      [Themes.Dark]: 'rgb(255 255 255)'
    }
  },

  {
    name: 'warning',
    values: {
      [Themes.Light]: 'rgb(240 173 78)',
      [Themes.Dark]: 'rgb(240 173 78)'
    }
  },
  {
    name: 'warning-hover',
    values: {
      [Themes.Light]: 'rgb(219 154 63)',
      [Themes.Dark]: 'rgb(219 154 63)'
    }
  },
  {
    name: 'on-warning',
    values: {
      [Themes.Light]: 'rgb(255 255 255)',
      [Themes.Dark]: 'rgb(255 255 255)'
    }
  },
  {
    name: 'on-warning-2',
    values: {
      [Themes.Light]: 'rgb(0 0 0)',
      [Themes.Dark]: 'rgb(0 0 0)'
    }
  },

  {
    name: 'background',
    values: {
      [Themes.Light]: 'rgb(235 235 235)',
      [Themes.Dark]: 'rgb(35 49 65)'
    }
  },
  {
    name: 'surface-primary',
    values: {
      [Themes.Light]: 'rgb(255 255 255)',
      [Themes.Dark]: 'rgb(72 91 113)'
    }
  },
  {
    name: 'surface-secondary',
    values: {
      [Themes.Light]: 'rgb(245 245 245)',
      [Themes.Dark]: 'rgb(45 62 79)'
    }
  },
  {
    name: 'overlay',
    values: {
      [Themes.Light]: 'rgb(245 245 245 / .8)',
      [Themes.Dark]: 'rgb(0 0 0 / .8)'
    }
  },
  {
    name: 'hover',
    values: {
      [Themes.Light]: 'rgb(102 102 102 / .075)',
      [Themes.Dark]: 'rgb(255 255 255 / .075)'
    }
  },

  {
    name: 'divider',
    values: {
      [Themes.Light]: 'rgb(171 182 194)',
      [Themes.Dark]: 'rgb(106 123 138)'
    }
  },

  {
    name: 'text-primary',
    values: {
      [Themes.Light]: 'rgb(40 48 58)',
      [Themes.Dark]: 'rgb(235 235 235)'
    }
  },
  {
    name: 'text-secondary',
    values: {
      [Themes.Light]: 'rgb(138 148 162)',
      [Themes.Dark]: 'rgb(170 172 176)'
    }
  },
  {
    name: 'text-help',
    values: {
      [Themes.Light]: 'rgb(76 155 232)',
      [Themes.Dark]: 'rgb(76 155 232)'
    }
  },

  {
    name: 'input-background',
    values: {
      [Themes.Light]: 'rgb(226 232 237)',
      [Themes.Dark]: 'rgb(66 86 107)'
    }
  },
  {
    name: 'input-placeholder',
    values: {
      [Themes.Light]: 'rgb(40 48 58 / .5)',
      [Themes.Dark]: 'rgb(235 235 235 / .5)'
    }
  },

  {
    name: 'table-accent',
    values: {
      [Themes.Light]: 'rgb(227 227 227)',
      [Themes.Dark]: 'rgb(40 56 72)'
    }
  },

  // Icon colors
  {
    name: 'icon-tunneling-1',
    values: {
      [Themes.Light]: 'rgb(78 93 108)',
      [Themes.Dark]: 'rgb(234 234 234)'
    }
  },
  {
    name: 'icon-tunneling-2',
    values: {
      [Themes.Light]: 'rgb(29 41 53)',
      [Themes.Dark]: 'rgb(205 205 205)'
    }
  },
]

const urls = [
  {
    name: 'logo-bg',
    values: {
      [Themes.Light]: 'url("/static/img/logo-bg/logo-bg_light.svg")',
      [Themes.Dark]: 'url("/static/img/logo-bg/logo-bg_dark.svg")'
    }
  },
  {
    name: 'loader',
    values: {
      [Themes.Light]: 'url("/static/img/loader/loader_light-scheme.svg")',
      [Themes.Dark]: 'url("/static/img/loader/loader_dark-scheme.svg")'
    }
  },
]

const shadows = [
  {
    name: 'top-nav',
    values: {
      [Themes.Light]: '0px 2px 10px rgb(0 0 0 / .1)',
      [Themes.Dark]: '0px 2px 10px rgb(0 0 0 / .3)'
    }
  },
]


// Get theme value (exclude "System")
function currentThemeValue(theme) {
  // Get system settings
  if (theme.value === Themes.System) {
    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all' && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return Themes.Light
    } else {
      return Themes.Dark
    }
  }
  // Return saved value since it's not "System"
  return theme.value
}


function initTheme(themeValue) {
  colors.forEach(function(color) {
    document.documentElement.style.setProperty(`--color-${color.name}`, color.values[themeValue])

    if (color.name === 'surface-secondary') {
      // Set the <meta name="theme-color"> tag to theme the browser nav bar (Safari)
      let meta = document.querySelector('meta[name="theme-color"]')
      meta.content = color.values[themeValue]
    }
  })

  urls.forEach(function(url) {
    document.documentElement.style.setProperty(`--url-${url.name}`, url.values[themeValue])
  })

  shadows.forEach(function(shadow) {
    document.documentElement.style.setProperty(`--shadow-${shadow.name}`, shadow.values[themeValue])
  })
}


export {
  Themes,
  defaultTheme,

  colors,
  urls,
  shadows,

  currentThemeValue,
  initTheme,
}
