import React, { useEffect, useState } from 'react';
import { Game, PlayResponse } from '../../services/types';
import { createPlay } from '../../services';
import { Loading } from '..';
import { Box, TextField } from '@mui/material';
import { SnackbarComponent } from '../SnackbarComponent';

interface AddStudentProps {
  cardGame: Game;
}

const AddStudentButton: React.FC<AddStudentProps> = ({ cardGame }) => {
  const [studentId, setStudentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
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
        setAlertMessage(`El estudiante ${{studentId}} ya se encuentra jugando`);
        setOpen(true);
      } else if (response.detail === 'Game time has expired') {
        setAlertMessage('El tiempo de juego ha expirado');
        setOpen(true);
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

  return (
      <div className="" id={`add-student-game-${cardGame.id}`}>
        <Box
      display="flex"
      flexDirection="row"
      gap={2}
    >
        <input type="hidden" name="game_id" value={`${cardGame.id}`} />


        <div>

          <TextField
            type="text"
            className=""
            name="student_id"
            placeholder="ID estudiante"
            aria-label="ID estudiante"
            aria-describedby="basic-addon2"
            onChange={handleInputChange}
            variant="filled"
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

        <button
          onClick={addStudent}
          disabled={isLoading}
        >
          {isLoading ? <Loading /> : 'Agregar estudiante'}
        </button>
        </Box>
      </div>
  );
};

export default AddStudentButton;
