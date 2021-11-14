export const themes = {
  main: {
    secondary: '#250f0d',
    'secondary-dark': '#7f7f7f',
    success: '#008000',
    danger: '#ff0000',
    warning: '#ffc107',
  },
}

export type ThemeName = keyof typeof themes
export type ThemeType = typeof themes.main
