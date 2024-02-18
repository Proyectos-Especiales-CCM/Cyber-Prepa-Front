// Hooks & Context imports
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/appContext/useAppContext";

// Header imports
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider, createTheme } from "@mui/material";
import { CyberPrepaLogo } from "..";
import "./Header.css"

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "black",
        },
      },
    },
  },
});


const Header = () => {
  
  const pages = ['Reglamento', 'Admin']

  const { logOut, user, admin } = useAppContext();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <CyberPrepaLogo
              size="35"
              display="flex"
            />
            
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Cyberprepa
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Button onClick={() => navigate(`/${page.toLowerCase()}`)}>
                      <Typography sx={{ color: "white" }} textAlign="center">{page}</Typography>
                    </Button>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <CyberPrepaLogo
              size="35"
              display="none"
            />

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Cyberprepa
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    paddingBottom:'0',
                    borderBottom: '2px solid transparent',
                        transition: 'border-bottom 0.3s ease',
                          '&:hover': {
                        borderBottom: '2px solid white',
                  }}}
                  onClick={() => {
                    handleCloseNavMenu()
                    navigate("/reglamento")
                  }}
                >
                  REGLAMENTO
                </Button>

                {user && admin ? (
                  <>
                    <Button
                      sx={{ 
                        my: 2,
                        color: 'white',
                        display: 'block',
                        paddingBottom:'0',
                        borderBottom: '2px solid transparent',
                        transition: 'border-bottom 0.3s ease',
                          '&:hover': {
                        borderBottom: '2px solid white',
                      }}}
                      onClick={() => {
                        handleCloseNavMenu()
                        navigate("/admin")
                      }}
                    >
                      ADMIN
                    </Button>
                  </>
                ) : null}

            </Box>

            

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <Button onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {user ? user.email : 'Login'}
                </Button>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {user ? (
                  <MenuItem key="logout" onClick={() => {
                    logOut();
                    handleCloseUserMenu();
                    navigate("/");
                  }}>
                    <Typography>Log out</Typography>
                  </MenuItem>
                ) : (<Button onClick={() => navigate("/login")}>Login</Button>)}
                    
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
export default Header;
