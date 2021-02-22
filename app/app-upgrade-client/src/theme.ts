import { lightBlue, red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: lightBlue['500'],
      light: lightBlue['300'],
      dark: lightBlue['700'],
      contrastText: 'white'
    },
    secondary: {
      main: red['A100'],
      light: red['A200'],
      dark: red['A400'],
      contrastText: 'white'
    }
  }
});
