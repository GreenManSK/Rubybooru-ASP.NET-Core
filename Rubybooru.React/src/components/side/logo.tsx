import logoImg from "../../assets/logo.png";
import { Typography, Link } from "@mui/material";
import { hiddenStyle, mobileMediaQuery } from "../../styles.constants";

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

// TODO: Switch for navigation link
export const Logo = () => (
  <Typography variant="h1" sx={typographyStyles}>
    <Link sx={linkStyles}>
      <Typography sx={hiddenStyle}>Rubybooru</Typography>
    </Link>
  </Typography>
);
