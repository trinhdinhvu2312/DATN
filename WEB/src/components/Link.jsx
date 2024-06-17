// components/Link.js
import PropTypes from "prop-types";
import { Link as ReactRouterLink } from "react-router-dom";

import { Link as MuiLink } from "@mui/material";

const Link = ({ href, ...props }) => (
  <MuiLink
    {...props}
    component={ReactRouterLink}
    to={href ?? "#"}
    underline="hover"
    color="inherit"
  />
);

Link.propTypes = {
  href: PropTypes.any,
};

export default Link;
