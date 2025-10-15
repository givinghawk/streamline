/**
 * Utility function to generate theme-aware class names
 * @param {string} darkClasses - Classes for dark mode
 * @param {string} lightClasses - Classes for light mode  
 * @param {string} theme - Current theme ('dark' or 'light')
 * @returns {string} Combined class string
 */
export const themeClass = (darkClasses, lightClasses, theme = 'dark') => {
  if (theme === 'light') {
    return lightClasses;
  }
  return darkClasses;
};

/**
 * Common theme-aware color classes
 */
export const themeColors = {
  // Background colors
  bg: {
    primary: (theme) => themeClass('bg-surface', 'bg-light-surface', theme),
    elevated: (theme) => themeClass('bg-surface-elevated', 'bg-light-surface-elevated', theme),
    elevated2: (theme) => themeClass('bg-surface-elevated2', 'bg-light-surface-elevated2', theme),
    elevated3: (theme) => themeClass('bg-surface-elevated3', 'bg-light-surface-elevated3', theme),
  },
  
  // Text colors
  text: {
    primary: (theme) => themeClass('text-white', 'text-gray-900', theme),
    secondary: (theme) => themeClass('text-gray-300', 'text-gray-700', theme),
    tertiary: (theme) => themeClass('text-gray-400', 'text-gray-600', theme),
    muted: (theme) => themeClass('text-gray-500', 'text-gray-500', theme),
  },
  
  // Border colors
  border: {
    primary: (theme) => themeClass('border-gray-700', 'border-gray-300', theme),
    secondary: (theme) => themeClass('border-gray-600', 'border-gray-400', theme),
  },
  
  // Input colors
  input: {
    bg: (theme) => themeClass('bg-surface-elevated2', 'bg-white', theme),
    border: (theme) => themeClass('border-gray-600', 'border-gray-300', theme),
    text: (theme) => themeClass('text-white', 'text-gray-900', theme),
    placeholder: (theme) => themeClass('placeholder-gray-400', 'placeholder-gray-500', theme),
  },
  
  // Hover states
  hover: {
    bg: (theme) => themeClass('hover:bg-surface-elevated2', 'hover:bg-gray-100', theme),
    bgElevated: (theme) => themeClass('hover:bg-surface-elevated3', 'hover:bg-gray-200', theme),
  },
};

/**
 * Get combined theme classes for common components
 */
export const getThemeClasses = (theme = 'dark') => ({
  // Card component
  card: `${themeColors.bg.elevated(theme)} rounded-lg shadow-${theme === 'light' ? 'lg' : 'material'} p-6 ${theme === 'light' ? 'border border-gray-200' : ''}`,
  
  // Button secondary
  btnSecondary: `btn ${themeColors.bg.elevated2(theme)} ${themeColors.hover.bgElevated(theme)} ${themeColors.text.secondary(theme)}`,
  
  // Input field
  input: `${themeColors.input.bg(theme)} border ${themeColors.input.border(theme)} rounded-md px-3 py-2 ${themeColors.input.text(theme)} ${themeColors.input.placeholder(theme)} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`,
  
  // Title bar
  titleBar: `fixed top-0 left-0 right-0 h-8 ${themeColors.bg.elevated(theme)} border-b ${themeColors.border.primary(theme)} flex items-center justify-between z-50 select-none`,
  
  // Main container
  container: `min-h-screen ${themeColors.bg.primary(theme)} ${themeColors.text.primary(theme)}`,
});
