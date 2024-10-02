"use client";

// Hooks & Context imports
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import * as React from 'react';
import { AppBar, Toolbar, IconButton, Menu, Container, Button, Tooltip, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { ThemeProvider, createTheme } from '@mui/material';
import { useAuthContext } from '@/lib/context/auth/useAuthContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'black',
        },
      },
    },
  },
});

const Header = () => {
  const { logOut, user } = useAuthContext();
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu: () => void = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu: () => void = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <div className='w-full flex justify-between sm:justify-start'>
              <img src="/cybertec.svg" alt="Cyberprepa logo" className="size-10 m-2 self-center" />

              <a
                className="mr-2 text-xl flex font-mono font-bold tracking-[0.1rem] sm:tracking-[0.3rem] text-inherit no-underline justify-center items-center"
                href="/"
              >
                Cyberprepa
              </a>

              <div id="small-screen-menu" className="flex sm:hidden items-end">
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
                  <MenuItem onClick={() => { handleCloseNavMenu(); router.push('/reglamento'); }}>
                    <span>REGLAMENTO</span>
                  </MenuItem>
                  {user && [
                    <MenuItem key="admin" onClick={() => { handleCloseNavMenu(); router.push('/admin'); }}>
                      <span>ADMIN</span>
                    </MenuItem>,
                    <MenuItem key="logout" onClick={() => { logOut(); handleCloseUserMenu(); router.push('/'); }}>
                      <span>LOGOUT</span>
                    </MenuItem>
                  ]}
                  {!user && (
                    <MenuItem onClick={() => { handleCloseNavMenu(); router.push('/login'); }}>
                      <span>LOGIN</span>
                    </MenuItem>
                  )}
                </Menu>
              </div>

              <div id="large-screen-navigation-buttons" className="hidden sm:flex flex-grow">
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
                    },
                  }}
                  onClick={() => { handleCloseNavMenu(); router.push('/reglamento'); }}
                >
                  REGLAMENTO
                </Button>
                {user && (
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
                      },
                    }}
                    onClick={() => { handleCloseNavMenu(); router.push('/admin'); }}
                  >
                    ADMIN
                  </Button>
                )}
              </div>

              <div id="large-screen-auth-menu" className="hidden sm:flex flex-grow-0">
                {user ? (
                  <>
                    <Tooltip title="Open settings">
                      <Button onClick={handleOpenUserMenu}>
                        {user.email}
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
                      <MenuItem onClick={() => { logOut(); handleCloseUserMenu(); router.push('/'); }}>
                        <span>Log out</span>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button onClick={() => router.push('/login')}>
                    Login
                  </Button>
                )}
              </div>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
