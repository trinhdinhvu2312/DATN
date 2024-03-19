import { experimental_extendTheme as extendTheme } from "@mui/material";
import { cyan, deepOrange, orange, teal } from "@mui/material/colors";

const theme = extendTheme({
  trello: {
    appBarHeight: "58px",
    boardBarHeight: "60px",
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
