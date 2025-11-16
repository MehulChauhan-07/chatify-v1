// export type Theme = 'light' | 'dark' | 'ocean' | 'sunset' | 'forest' | 'galaxy'

// export const themes: Record<Theme, { name: string; description: string }> = {
export const themes= {
  light: {
    name: 'Light',
    description: 'Clean and bright'
  },
  dark: {
    name: 'Dark', 
    description: 'Easy on the eyes'
  },
  ocean: {
    name: 'Ocean Blue',
    description: 'Calm blue waves'
  },
  sunset: {
    name: 'Sunset Orange',
    description: 'Warm and energetic'
  },
  forest: {
    name: 'Forest Green',
    description: 'Natural and fresh'
  },
  galaxy: {
    name: 'Purple Galaxy',
    description: 'Mysterious and elegant'
  }
}

// export const applyTheme = (theme: Theme) => {
export const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

// export const getStoredTheme = (): Theme => {
export const getStoredTheme = ()=> {
  const stored = localStorage.getItem('theme')
//   const stored = localStorage.getItem('theme') as Theme
  return stored || 'light'
}