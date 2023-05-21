import { Box, Link, Theme } from "@mui/material";

const ulStyles = {
  margin: "0 0 1rem",
  padding: 0,
  textAlign: "center",
};

const liStyles = (theme: Theme) => ({
  listStyle: "none",
  display: "inline-block",
  ["&::before"]: {
    content: "'■'",
    display: "inline-block",
    padding: "4px .7rem 0",
    verticalAlign: "top",
    fontSize: "1rem",
    color: theme.palette.secondary.main,
  },
  ["&:first-child::before"]: {
    display: "none",
  },
});

export const Navigation = () => {
  return (
    <Box component="nav">
      <Box component="ul" sx={ulStyles}>
        <Box component="li" sx={liStyles}>
          <Link href="#">Search</Link>
        </Box>
        <Box component="li" sx={liStyles}>
          <Link href="#">Untagged</Link>
        </Box>
        <Box component="li" sx={liStyles}>
          <Link href="#">Duplicates</Link>
        </Box>
        <Box component="li" sx={liStyles}>
          <Link href="#">Tags</Link>
        </Box>
      </Box>
    </Box>
  );
};
