import { experimental_extendTheme as extendTheme } from "@mui/material";
import { cyan, deepOrange, orange, teal } from "@mui/material/colors";

const theme = extendTheme({
  trello: {
    appBarHeight: "48px",
    boardBarHeight: "58px",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: teal[500],
          secondary: deepOrange[500],
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: cyan[500],
          secondary: orange[500],
        },
      },
    },
  },
  // ...other properties
});

export default theme;
