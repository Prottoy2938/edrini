import { theme } from "@chakra-ui/react";
// import { mode } from "@chakra-ui/theme-tools";
const customTheme = {
  ...theme,
  // styles: {
  //   global: (props) => ({
  //     body: {
  //       bg: mode("white", "black")(props),
  //       color: mode("black", "#E2E8F0")(props),
  //     },
  //   }),
  // },
  colors: {
    ...theme.colors,
    primary: {
      100: "#CFD1FD",
      200: "#A7ABFB",
      300: "#8388F9",
      400: "#6268F8",
      500: "#444BF7",
      600: "#262EF6",
      700: "#0B14F5",
      800: "#0911DD",
      900: "#080FC7",
    },

    grey: {
      50: "#f0f0fa",
      100: "#d1d3e1",
      200: "#b3b6c9",
      300: "#9499b4",
      400: "#777c9f",
      500: "#5d6385",
      600: "#484d69",
      700: "#34374b",
      800: "#1e212e",
      900: "#080b14",
    },

    cyan: {
      50: "#dbf4ff",
      100: "#addbff",
      200: "#7cc2ff",
      300: "#4aa9ff",
      400: "#1a91ff",
      500: "#0077e6",
      600: "#005db4",
      700: "#004282",
      800: "#002851",
      900: "#000e21",
    },
  },
};

export default customTheme;
