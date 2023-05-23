import logoImg from "../../assets/logo.png";
import { Typography } from "@mui/material";
import { hiddenStyle, mobileMediaQuery } from "../../styles.constants";
import { Link as RouterLink } from "react-router-dom";
import styled from "@emotion/styled";

const width = 426;
const height = 167;

const typographyStyles = {
  margin: "10px auto 0",
  maxWidth: width,
  [mobileMediaQuery]: {
    maxWidth: width / 2,
  },
};

const linkStyles = {
  display: "block",
  maxHeight: height,
  width: "100%",
  paddingTop: `calc(100% * ${height} / ${width})`,
  backgroundImage: `url(${logoImg})`,
  backgroundSize: "cover",
};

const Link = styled(RouterLink)(linkStyles);

export const Logo = () => (
  <Typography variant="h1" sx={typographyStyles}>
    <Link to="/">
      <Typography sx={hiddenStyle}>Rubybooru</Typography>
    </Link>
  </Typography>
);
