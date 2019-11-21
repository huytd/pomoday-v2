module.exports = {
  variants: {
    borderColor: ['responsive', 'hover', 'focus'],
    backgroundColor: ['responsive', 'hover', 'focus'],
  },
  theme: {
    colors: {
      transparent: "var(--transparent)",
      white: "var(--white)",
      black: "var(--black)",
      tomato: "var(--tomato)",
      purple: "var(--purple)",
      green: "var(--green)",
      orange: "var(--orange)",
      control: "var(--control)",
      control2nd: "var(--control-brighter)",
      focus: "var(--control-focus)",
      background: "var(--background)",
      foreground: "var(--foreground)",
      stall: {
        light: "var(--foreground-light)",
        dim: "var(--foreground-dim)",
      }
    }
  }
};
