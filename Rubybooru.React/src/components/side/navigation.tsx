import { Box, Link, Theme, styled } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const ulStyles = {
  margin: "0 0 1rem",
  padding: 0,
  textAlign: "center",
};

const liStyles = (theme: Theme) => ({
  listStyle: "none",
  display: "inline-block",
  "&::before": {
    content: "'■'",
    display: "inline-block",
    padding: "4px .7rem 0",
    verticalAlign: "top",
    fontSize: "1rem",
    color: theme.palette.secondary.main,
  },
  "&:first-child::before": {
    display: "none",
  },
});

const StyledRouterLink = styled(RouterLink)((props) => ({
  color: props.theme.palette.primary.main,
}));

export const Navigation = () => {
  return (
    <Box component="nav">
      <Box component="ul" sx={ulStyles}>
        <Box component="li" sx={liStyles}>
          <Link href="#">Search</Link>
        </Box>
        <Box component="li" sx={liStyles}>
          <StyledRouterLink to="/untagged/" title="Untagged images">
            Untagged
          </StyledRouterLink>
        </Box>
        <Box component="li" sx={liStyles}>
          <Link href="#">Duplicates</Link>
        </Box>
        <Box component="li" sx={liStyles}>
          <StyledRouterLink title="Tags" to="/tags/">
            Tags
          </StyledRouterLink>
        </Box>
      </Box>
    </Box>
  );
};
