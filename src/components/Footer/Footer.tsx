import { FC, ReactElement } from "react";
import { Typography, Box, Container, Grid } from "@mui/material";

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
        ml: 2,
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
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              <CustomTypographyLink text={`${new Date().getFullYear()}`} />
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
              <CustomTypographyLink text="Github" href="https://www.github.com" />
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
              <CustomTypographyLink text="Tec de Monterrey" href="https://www.tec.mx" />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
