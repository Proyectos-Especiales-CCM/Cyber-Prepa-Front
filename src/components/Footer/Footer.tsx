import { FC, ReactElement } from "react";
import { Typography, Box, Container, Stack, Hidden, Link } from "@mui/material";
import { Copyright, GitHub } from "@mui/icons-material";
import { CyberPrepaLogo } from "../CyberPrepaLogo";
import './Footer.css';

interface CustomTypographyLinkProps {
  text: string;
  href?: string | undefined;
}


const CustomTypographyLink: React.FC<CustomTypographyLinkProps> = ({ text, href }) => {
  const isExternalLink = href && (href.startsWith("http") || href.startsWith("www"));

  return (
    <Typography
      variant="h6"
      noWrap
      component="a"
      href={href}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
      sx={{
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      {text}
    </Typography>
  );
};

export const Footer: FC = (): ReactElement => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "#101216",
        paddingTop: "1rem",
        paddingBottom: "2rem",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" justifyContent="center">
          <Stack alignContent="center" spacing={1}>
            <div>
              <Copyright sx={{ mr: '1rem' }} />
              <CustomTypographyLink text={`${new Date().getFullYear()}`} />
            </div>
            <Box className="logoContainer">
              <CyberPrepaLogo size={"80"} display="block" />
            </Box>
          </Stack>
          <Box
            sx={{
              color: 'white',
              fontSize: '1.5rem',
              marginLeft: '0.5rem',
              marginRight: '0.5rem',
            }}
          >
            |
          </Box>
          <Stack alignContent="center" spacing={1}>
            <CustomTypographyLink text="Github" href="https://github.com/Proyectos-Especiales-CCM" />
            <a
              href="https://github.com/Proyectos-Especiales-CCM"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <GitHub sx={{ width: '80px', my: '1rem', fontSize: '4rem' }} />
            </a>
          </Stack>
          <Box
            sx={{
              color: 'white',
              fontSize: '1.5rem',
            }}
          >
            <Hidden smDown>
              |
            </Hidden>
          </Box>
          <Stack alignContent="center" spacing={1}>
            <CustomTypographyLink text="Tec de Monterrey" href="https://www.tec.mx" />
            <a
              href="https://www.tec.mx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="logo_tec.webp" alt="Logo Tec de Monterrey" style={{
                  margin: '1rem',
                  width: '55px',
                  height: '55px'
                }} />
              </div>
            </a>
          </Stack>
          <Hidden mdDown>
            <Box
              sx={{
                color: 'white',
                fontSize: '1.5rem',
                marginLeft: '1rem',
                marginRight: '1rem',
              }}
            >
              |
            </Box>
          </Hidden>
          <Stack direction={'column'}>
            <Typography
              variant="h6"
              noWrap
              align="center"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Soporte
            </Typography>
            <Typography variant="body2" color="white" align="center" sx={{ my: 2 }}>
              Hecho con ❤️ por estudiantes del Tec de Monterrey
            </Typography>
            <Typography variant="body2" color="white" align="center">
              Contactanos a través de:
            </Typography>
            <Typography variant="body2" color="gray" align="center">
              <Link href="mailto:A01656583@tec.mx" color="inherit">
                A01656583@tec.mx
              </Link>
            </Typography>
            <Typography variant="body2" color="gray" align="center">
              <Link href="https://wa.me/525635046140" color="inherit" target="_blank">
                +52 56 3504 6140 (WhatsApp)
              </Link>
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box >
  );
};

export default Footer;
