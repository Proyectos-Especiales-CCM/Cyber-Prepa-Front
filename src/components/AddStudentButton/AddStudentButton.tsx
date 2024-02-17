import React, { useEffect, useState } from 'react';
import { Game, PlayResponse } from '../../services/types';
import { createPlay } from '../../services';
import { Loading } from '..';
import { Box, Button, TextField } from '@mui/material';
import { SnackbarComponent } from '../SnackbarComponent';

interface AddStudentProps {
  cardGame: Game;
}

const AddStudentButton: React.FC<AddStudentProps> = ({ cardGame }) => {
  const [studentId, setStudentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [inputState, setInputState] = useState<'error' | 'success' | 'standard'>('standard');

  useEffect(() => {
    const tokensString = localStorage.getItem('tokens');
    if (tokensString) {
      const tokens = JSON.parse(tokensString);
      setAccessToken(tokens.access_token);
    }
  }, []);

  const regexPattern = /^A0\d{7}$/;

  const isValidString = (inputString: string): boolean => {
    return regexPattern.test(inputString);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setStudentId(inputValue);

    if (inputValue.length === 9 && !isValidString(inputValue)) {
      setInputState('error');
    } else if (inputValue.length === 9 && isValidString(inputValue)) {
      setInputState('success');
    } else {
      setInputState('standard');
    }
  };

  const addStudent = async () => {
    try {
      setIsLoading(true);
      const response: PlayResponse = await createPlay(false, studentId, cardGame.id, accessToken);

      if (response.detail === 'Invalid student id') {
        setAlertMessage('Matricula inválida, vuelve a intentarlo');
        setOpen(true);
      } else if (response.detail === 'Student is already playing') {
        setAlertMessage(`El estudiante ${studentId} ya se encuentra jugando`);
        setOpen(true);
      } else if (response.detail === 'Game time has expired') {
        setAlertMessage('El tiempo de juego ha expirado, porfavor finaliza el juego para todos');
        setOpen(true);
      } else if (response.detail === 'Student has sanctions') {
        setAlertMessage('El estudiante tiene sanción activa');
        setOpen(true);
      } else if (response.detail === 'Student has already played 3 times this week') {
        setAlertMessage('El estudiante ya ha jugado 3 veces esta semana');
        setOpen(true);
      } else if (response.detail === 'Student has already played today') {
        setAlertMessage('El estudiante ya ha jugado el día de hoy');
        setOpen(true);
      } else {
        setAlertMessage(`Estudiante ${studentId} agregado exitosamente`);
        setOpenSuccess(true);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleCloseSuccess = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  return (
      <div id={`add-student-game-${cardGame.id}`}>
        <Box
      display="flex"
      flexDirection="row"
      gap={2}
    >
        <input type="hidden" name="game_id" value={`${cardGame.id}`} />


        <div>

          <TextField
            type="text"
            name="student_id"
            placeholder="ID estudiante"
            aria-label="ID estudiante"
            aria-describedby="basic-addon2"
            onChange={handleInputChange}
            variant="filled"
            sx={{
              backgroundColor: 'rgba(160, 180, 226, 0.4)',
              height: 55,
              borderRadius: 0.7,
            }}
            color={inputState === 'success' ? 'success' : 'error'}
            focused={inputState !== 'standard'}
          />

        </div>

        {open && (

          <SnackbarComponent
            open={open}
            onClose={handleClose}
            severity="warning"
            message={alertMessage}
          />
        )}
        
        {openSuccess && (

          <SnackbarComponent
            open={openSuccess}
            onClose={handleCloseSuccess}
            severity="success"
            message={alertMessage}
          />
        )}

        <Button
          size="large"
          variant="contained"
          sx={{
            backgroundColor: 'rgba(70, 90, 126, 0.4)',
            height: 55,
          }}
          onClick={addStudent}
          disabled={isLoading}
        >
          {isLoading ? <Loading /> : 'Agregar estudiante'}
        </Button>
        </Box>
      </div>
  );
};

export default AddStudentButton;
