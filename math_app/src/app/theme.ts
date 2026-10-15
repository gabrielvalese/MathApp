import {
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
} from 'react-native-paper';

/**
 * Paleta principal do projeto
 *
 * Primary   -> #27313D (azul-marinho/cinza)
 * Secondary -> #FC5D29 (laranja/coral)
 * Tertiary  -> #F6F7F6 (neutro claro)
 */

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    primary: 'rgb(63, 78, 94)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(215, 223, 231)',
    onPrimaryContainer: 'rgb(18, 27, 36)',

    secondary: 'rgb(190, 59, 18)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(255, 220, 208)',
    onSecondaryContainer: 'rgb(62, 16, 4)',

    tertiary: 'rgb(82, 88, 85)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(225, 228, 226)',
    onTertiaryContainer: 'rgb(25, 29, 27)',

    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',

    background: 'rgb(250, 250, 249)',
    onBackground: 'rgb(27, 28, 29)',

    surface: 'rgb(250, 250, 249)',
    onSurface: 'rgb(27, 28, 29)',

    surfaceVariant: 'rgb(226, 228, 229)',
    onSurfaceVariant: 'rgb(70, 73, 76)',

    outline: 'rgb(116, 119, 122)',
    outlineVariant: 'rgb(198, 201, 203)',

    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',

    inverseSurface: 'rgb(47, 49, 51)',
    inverseOnSurface: 'rgb(240, 241, 240)',
    inversePrimary: 'rgb(177, 194, 211)',

    elevation: {
      level0: 'transparent',
      level1: 'rgb(245, 246, 246)',
      level2: 'rgb(240, 242, 242)',
      level3: 'rgb(235, 238, 238)',
      level4: 'rgb(233, 236, 236)',
      level5: 'rgb(230, 233, 233)',
    },

    surfaceDisabled: 'rgba(27, 28, 29, 0.12)',
    onSurfaceDisabled: 'rgba(27, 28, 29, 0.38)',
    backdrop: 'rgba(39, 49, 61, 0.4)',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,

    primary: 'rgb(181, 198, 215)',
    onPrimary: 'rgb(30, 42, 54)',
    primaryContainer: 'rgb(57, 70, 83)',
    onPrimaryContainer: 'rgb(215, 223, 231)',

    secondary: 'rgb(255, 181, 151)',
    onSecondary: 'rgb(92, 28, 5)',
    secondaryContainer: 'rgb(126, 42, 13)',
    onSecondaryContainer: 'rgb(255, 220, 208)',

    tertiary: 'rgb(198, 203, 200)',
    onTertiary: 'rgb(43, 48, 45)',
    tertiaryContainer: 'rgb(62, 67, 64)',
    onTertiaryContainer: 'rgb(225, 228, 226)',

    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',

    background: 'rgb(25, 30, 36)',
    onBackground: 'rgb(228, 231, 234)',

    surface: 'rgb(25, 30, 36)',
    onSurface: 'rgb(228, 231, 234)',

    surfaceVariant: 'rgb(68, 75, 82)',
    onSurfaceVariant: 'rgb(198, 202, 206)',

    outline: 'rgb(143, 149, 155)',
    outlineVariant: 'rgb(68, 75, 82)',

    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',

    inverseSurface: 'rgb(228, 231, 234)',
    inverseOnSurface: 'rgb(47, 49, 51)',
    inversePrimary: 'rgb(63, 78, 94)',

    elevation: {
      level0: 'transparent',
      level1: 'rgb(31, 37, 43)',
      level2: 'rgb(36, 42, 49)',
      level3: 'rgb(41, 48, 55)',
      level4: 'rgb(43, 50, 57)',
      level5: 'rgb(46, 53, 60)',
    },

    surfaceDisabled: 'rgba(228, 231, 234, 0.12)',
    onSurfaceDisabled: 'rgba(228, 231, 234, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.4)',
  },
};

/**
 * Cores-base da identidade visual.
 * Úteis quando você precisar da cor original, sem os tons Material 3.
 */
export const brandColors = {
  primary: '#27313D',
  secondary: '#FC5D29',
  tertiary: '#F6F7F6',
} as const;

/**
 * Cores extras para casos específicos da interface.
 */
export const appColors = {
  ...brandColors,
  white: '#FFFFFF',
  black: '#000000',
} as const;
