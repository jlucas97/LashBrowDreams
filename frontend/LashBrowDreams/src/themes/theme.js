import { ThemeProvider, createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#A8CEC0',
      light: '#FCECA8',
      dark: '#FF7AA2',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#FCECA8',
      paper: '#eaf2d7',
    },
  },
});