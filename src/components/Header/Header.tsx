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
import { Stack, ThemeProvider, createTheme } from "@mui/material";
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
            <Stack direction='row' width={1} justifyContent={{xs: 'space-between', sm: 'flex-start'}}>
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
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: {
                  xs: '.1rem',
                  sm: '.3rem',
                },
                color: 'inherit',
                textDecoration: 'none',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Cyberprepa
            </Typography>

            <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'right' }}>
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
                id="menu-appbar-logged-in"
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
                <MenuItem key={'/reglamento'} onClick={handleCloseNavMenu}>
                  <Button onClick={() => navigate('/reglamento')}>
                    <Typography sx={{ color: "white" }} textAlign="center">REGLAMENTO</Typography>
                  </Button>
                </MenuItem>
                {admin && (
                  <MenuItem key={'/admin'} onClick={handleCloseNavMenu}>
                    <Button onClick={() => navigate('/admin')}>
                      <Typography sx={{ color: "white" }} textAlign="center">ADMIN</Typography>
                    </Button>
                  </MenuItem>
                )}
                {user ? (
                  <MenuItem key={'/logout'} onClick={handleCloseNavMenu}>
                    <Button
                      onClick={() => {
                        logOut();
                        handleCloseUserMenu();
                        navigate("/");
                      }}
                    >
                      <Typography sx={{ color: "white" }} textAlign="center">LOGOUT</Typography>
                    </Button>
                  </MenuItem>
                ) : (
                  <MenuItem key={'/login'} onClick={handleCloseNavMenu}>
                    <Button onClick={() => navigate('/login')}>
                      <Typography sx={{ color: "white" }} textAlign="center">LOGIN</Typography>
                    </Button>
                  </MenuItem>
                )}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
              <Button
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  paddingBottom: '0',
                  borderBottom: '2px solid transparent',
                  transition: 'border-bottom 0.3s ease',
                  '&:hover': {
                    borderBottom: '2px solid white',
                  }
                }}
                onClick={() => {
                  handleCloseNavMenu()
                  navigate("/reglamento")
                }}
              >
                REGLAMENTO
              </Button>

              {admin ? (
                <>
                  <Button
                    sx={{
                      my: 2,
                      color: 'white',
                      display: 'block',
                      paddingBottom: '0',
                      borderBottom: '2px solid transparent',
                      transition: 'border-bottom 0.3s ease',
                      '&:hover': {
                        borderBottom: '2px solid white',
                      }
                    }}
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

            <Box sx={{ flexGrow: 0, display: { xs: 'none', sm: 'flex' } }}>
              {user ? (
                <>
                  <Tooltip title="Open settings">
                    <Button onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {user?.email}
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
                    <MenuItem key="logout" onClick={() => {
                      logOut();
                      handleCloseUserMenu();
                      navigate("/");
                    }}>
                      <Typography>Log out</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (<Button onClick={() => navigate("/login")}>Login</Button>)}
            </Box>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
export default Header;
