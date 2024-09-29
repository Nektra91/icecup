import React, { useContext } from "react";
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Box, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/authContext/index";
import icecupLogo from "../../logo/icecup-logo.jpg";
import "./header.css";

const Header = () => {
  const authContext = useContext<AuthContextType | null>(AuthContext);
  const userLoggedIn = authContext?.userLoggedIn;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img src={icecupLogo} alt="Icecup Logo" className="logo" />
          <Typography variant="h6" component="div" sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/apply" className="nav-link">Apply</Link>
            {userLoggedIn && <Link to="/applications" className="nav-link">Applications</Link>}
            {userLoggedIn && <Link to="/competitions" className="nav-link">Competitions</Link>}
            <Link to="/faq" className="nav-link">FAQ</Link>
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link to="/home" className="nav-link menu-link">Home</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link to="/apply" className="nav-link menu-link">Apply</Link>
            </MenuItem>
            {userLoggedIn && <MenuItem onClick={handleClose}>
              <Link to="/applications" className="nav-link menu-link">Applications</Link>
            </MenuItem>}
            {userLoggedIn && <MenuItem onClick={handleClose}>
              <Link to="/competitions" className="nav-link menu-link">Competitions</Link>
            </MenuItem>}
            <MenuItem onClick={handleClose}>
              <Link to="/faq" className="nav-link menu-link">FAQ</Link>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;