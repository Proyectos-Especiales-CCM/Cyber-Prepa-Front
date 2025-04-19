import React, { CSSProperties, useEffect, useState } from 'react';
import { Game, PlayResponse } from '../../services/types';
import { createPlay } from '../../services';
import { Loading } from '..';
import { Box, Button, TextField } from '@mui/material';
import { SnackbarComponent } from '../SnackbarComponent';

interface AddStudentProps {
  cardGame: Game;
  style: CSSProperties;
}

const AddStudentButton: React.FC<AddStudentProps> = ({ cardGame, style }) => {
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

  const regexPattern = /^[Aa]\d{8}$/;

  const isValidString = (inputString: string): boolean => {
    return regexPattern.test(inputString);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setStudentId(inputValue);

    if (inputValue.length === 9 && !isValidString(inputValue)) {
      setInputState('error');
    } else if (inputValue.length === 9 && isValidString(inputValue)) {
      setInputState('success');
      await addStudent(inputValue);
    } else {
      setInputState('standard');
    }
  };

  const addStudent = async (studentId: string) => {
    try {
      setIsLoading(true);
      const response: PlayResponse = await createPlay(false, studentId.toLowerCase(), cardGame.id, accessToken);

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
      setStudentId("");
      setInputState('standard')
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addStudent(studentId);
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
    <div id={`add-student-game-${cardGame.id}`} style={style}>
      <Box
        display="flex"
        flexDirection="row"
        gap={2}
      >
        <input type="hidden" name="game_id" value={`${cardGame.id}`} />
        <div>

        <form onSubmit={handleSubmit} id='createUserPanel'>
          <TextField
            value={studentId}
            type="text"
            name="student_id"
            id="student_id"
            placeholder="Matricula de estudiante"
            aria-label="Matricula de estudiante"
            aria-describedby="basic-addon2"
            onChange={handleInputChange}
            variant="filled"
            sx={{
              backgroundColor: '#1a1a1a',
              height: 55,
              width: 350,
              color: '#ffffff',
              borderRadius: 2,
              borderWidth: 0.5,
              borderStyle: 'solid',
              borderColor: '#5f5f5f',
              '& .MuiInputBase-input': {
                color: '#dfdfdf', // Changes input text color
                fontSize: '1rem',
                '&::placeholder': {
                  color: 'white', // Changes placeholder text color
                  opacity: 1, // [optional] Override the default opacity; Material-UI reduces the placeholder's opacity
                }
              },
              '& .MuiFilledInput-root': {
                'before': {
                  borderBottomColor: 'white',
                },
                'after': {
                  borderBottomColor: 'white',
                },
              },
            }}
            focused={inputState !== 'standard'}
            color={inputState === 'success' ? 'success' : 'error'}
          />

          <Button
            size="large"
            variant="contained"
            color='success'
            type='submit'
            id='submit-new-player-button'
            sx={{
              marginLeft: '1rem',
              height: 55,
            }}
            disabled={isLoading}
          >
            {isLoading ? <Loading /> : 'Agregar estudiante'}
          </Button>

        </form>
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

      </Box>
    </div>
  );
};

export default AddStudentButton;
