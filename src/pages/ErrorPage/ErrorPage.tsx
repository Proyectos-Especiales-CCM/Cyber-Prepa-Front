import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/Constants';
import { Typography, Stack, Link as MUILink } from '@mui/material';

const ErrorPage = () => {
  return (
    <Stack spacing={2} alignItems='center' height='87vh' justifyContent='center' mx={2}>
      <Typography variant='h3'>404 - Página No Encontrada</Typography>
      <Typography variant='h5'>La página que estás buscando no existe.</Typography>
      <MUILink color="primary" component={Link} to={ROUTES.HOME}>
        Regresar al inicio
      </MUILink>
    </Stack>
  )
}

export default ErrorPage
