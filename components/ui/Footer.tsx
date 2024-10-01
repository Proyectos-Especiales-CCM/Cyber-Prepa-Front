import { FC, ReactElement } from "react";
import { Container, Stack } from "@mui/material";
import { Copyright, GitHub } from "@mui/icons-material";

interface CustomTypographyLinkProps {
  text: string;
  href?: string | undefined;
}

const CustomTypographyLink: React.FC<CustomTypographyLinkProps> = ({ text, href }) => {
  const isExternalLink = href && (href.startsWith("http") || href.startsWith("www"));

  return (
    <a
      className="text-2xl flex flex-row flex-nowrap font-mono font-bold tracking-[.3rem] no-underline"
      href={href}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
    >
      {text}
    </a>
  );
};

export const Footer: FC = (): ReactElement => {
  return (
    <div className="text-white w-full py-6 shadow-[0_0_10px_rgba(0,0,0,0.1)]" >
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" justifyContent="center">
          <Stack alignContent="center" spacing={1}>
            <div className="flex items-center space-x-2">
              <Copyright />
              <CustomTypographyLink text={`${new Date().getFullYear()}`} />
            </div>
            <div className="flex justify-center items-center relative rounded-[35%] bg-white/20 overflow-hidden shadow-[0_0_20px_20px_rgba(255,255,255,0.2)]">
              <img src="/cybertec.svg" alt="Cyberprepa logo" className="size-20 my-4" />
            </div>
          </Stack>
          <div className="mx-2 text-2xl" >|</div>
          <Stack alignContent="center" spacing={1}>
            <CustomTypographyLink text="Github" href="https://github.com/Proyectos-Especiales-CCM" />
            <a
              href="https://github.com/Proyectos-Especiales-CCM"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="flex justify-center align-middle">
                <GitHub className="size-20 my-4" />
              </div>
            </a>
          </Stack>
          <div className="text-2xl hidden md:block">|</div>
          <Stack alignContent="center" spacing={1}>
            <CustomTypographyLink text="Tec de Monterrey" href="https://www.tec.mx" />
            <a
              href="https://www.tec.mx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex justify-center align-middle">
                <img src="logo_tec.webp" alt="Logo Tec de Monterrey" className="m-4 size-20" />
              </div>
            </a>
          </Stack>
          <div className="hidden lg:block text-2xl mx-4">|</div>
          <div className="flex flex-col">
            <div className="text-2xl text-center font-mono font-bold tracking-[.3rem] no-underline">
              Soporte
            </div>
            <div className="text-sm text-center my-2">
              Hecho con ❤️ por estudiantes del Tec de Monterrey
            </div>
            <div className="text-sm text-center">
              Contáctanos a través de:
            </div>
            <div className="text-sm text-gray-400 text-center underline">
              <a href="mailto:A01656583@tec.mx" className="text-inherit">
                A01656583@tec.mx
              </a>
            </div>
            <div className="text-sm text-gray-400 text-center underline">
              <a href="https://wa.me/525635046140" className="text-inherit" target="_blank">
                +52 56 3504 6140 (WhatsApp)
              </a>
            </div>
          </div>
        </Stack>
      </Container>
    </div >
  );
};

export default Footer;
