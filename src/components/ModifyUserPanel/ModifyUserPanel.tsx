import { useState } from 'react';
import { Button, Grid, FormControl, InputLabel, Input, FormHelperText, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import { useAppContext } from "../../store/appContext/appContext";
import { patchUserById } from '../../services';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface ModifyUserPanelProps {
  openModalMessage: (severity: string, message: string) => void;
  closeModal: () => void;
  updateUsersData: () => Promise<void>;
  userId: number;
  prevEmail: string;
  prevIsAdmin: boolean;
  prevIsActive: boolean;
}

const ModifyUserPanel: React.FC<ModifyUserPanelProps> = ({ openModalMessage, closeModal, updateUsersData, userId, prevEmail, prevIsAdmin, prevIsActive }) => {
  const { tokens, admin } = useAppContext();
  const [email, setEmail] = useState(prevEmail);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isAdmin, setIsAdmin] = useState(prevIsAdmin);
  const [isActive, setIsActive] = useState(prevIsActive);

  const handleIsAdminChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAdmin(event.target.checked);
  };

  const handleIsActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.checked);
  };

  // Checa si el correo electrónico es válido
  const isEmailValid = () => {
    // Regular expression for email validation
    const emailRegex = /^[A-Z0-9._%+-]+@tec.mx/i;
    return emailRegex.test(email);
  };

  // Checa si la contraseña es válida
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
  const isPasswordValid = () => {
    return passwordRegex.test(password);
  };

  // Checa si las contraseñas coinciden
  const arePasswordsMatching = () => {
    return password === passwordConfirm;
  };

  // funcion para mostrar feedback sobre el correo electrónico
  const displayHelperTextEmail = () => {
    if (email && !isEmailValid()) {
      return 'Dirección de correo electrónico inválida';
    }
    return '';
  };

  // Checa si la contraseña es válida
  const displayHelperTextPassword = () => {
    // Validar que la contraseña tenga al menos 8 caracteres
    if (password && password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    // Informar si la contraseña no tiene al menos una mayúscula, una minúscula, un número y un caracter especial
    if (password && !passwordRegex.test(password)) {
      return 'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un caracter especial';
    }
    if (password && passwordConfirm && !arePasswordsMatching()) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  };

  // Handle submit
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!admin) {
      openModalMessage('error', 'No tienes permiso para realizar esta acción.');
      return;
    }

    // Validate email and password
    if (email && !isEmailValid()) {
      return;
    }
    if (password && (!arePasswordsMatching() || !isPasswordValid())) {
      return;
    }

    // Create request body
    const requestBody = {
      ...(email !== prevEmail && { email: email }),
      ...(password && { password: password }), 
      ...(isAdmin !== prevIsAdmin && { is_admin: isAdmin }),
      ...(isActive !== prevIsActive && { is_active: isActive }),
    };
    

    try {
      // Mandar request para crear el usuario
      await patchUserById(userId, tokens?.access_token || '', requestBody);
      // Cerrar modal y mostrar mensaje de éxito
      await updateUsersData();
      closeModal();
      openModalMessage('success', 'Usuario actualizado exitosamente.');
    } catch (error) {
      // Handle errors
      openModalMessage('error', 'Lo sentimos, ha ocurrido un error al actualizar el usuario.');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} id='createUserPanel'>
        <ThemeProvider theme={darkTheme}>
          <Grid container direction='column' spacing={2} padding={'1rem'}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="email">Correo</InputLabel>
                <Input
                  id="email"
                  aria-describedby="email-helper-text"
                  type='text'
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormHelperText error id="email-helper-text">{displayHelperTextEmail()}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="pass">Contraseña</InputLabel>
                <Input
                  id="pass"
                  aria-describedby="pass-helper-text"
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormHelperText error id="pass-helper-text">{displayHelperTextPassword()}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="c-pass">Confirmar Contraseña</InputLabel>
                <Input
                  id="c-pass"
                  aria-describedby="c-pass-helper-text"
                  type='password'
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <FormHelperText id="c-pass-helper-text">{displayHelperTextPassword()}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                sx={{ m: 3 }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox checked={isAdmin} onChange={handleIsAdminChange} name="is_admin" />
                    }
                    label="Administrador"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                sx={{ m: 3 }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox checked={isActive} onChange={handleIsActiveChange} name="is_active" />
                    }
                    label="Activo"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="info" type="submit">Actualizar</Button>
            </Grid>
          </Grid>
        </ThemeProvider>
      </form>
    </>
  )
}
export default ModifyUserPanel;
