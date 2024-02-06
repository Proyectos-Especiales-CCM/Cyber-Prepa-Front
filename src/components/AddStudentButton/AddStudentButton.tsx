import Alert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import { Game, PlayResponse } from '../../services/types';
import { createPlay } from '../../services';
import { Loading } from '..';
import Snackbar from '@mui/material/Snackbar';

interface AddStudentProps {
  cardGame: Game;
}

const AddStudentButton: React.FC<AddStudentProps> = ({ cardGame }) => {
  const [studentId, setStudentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
     const tokensString = localStorage.getItem('tokens');
     if (tokensString) {
       const tokens = JSON.parse(tokensString);
       setAccessToken(tokens.access_token);
     }
   }, []);

  const addStudent = async () => {
    try {
      setIsLoading(true);
      const response: PlayResponse = await createPlay(false, studentId, cardGame.id, accessToken);

      if (response.detail === 'Invalid student id') {
        setAlertMessage('Invalid student id');
        setOpen(true);
      } else if (response.detail === 'Student is already playing') {
        setAlertMessage('Student is already playing');
        setOpen(true);
      } else if (response.detail === 'Game time has expired') {
        setAlertMessage('Game time has expired');
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
    
      <div
        className=""
        id={`add-student-game-${cardGame.id}`}
      >
        <input type="hidden" name="game_id" value={`${cardGame.id}`} />

        <input
          type="text"
          className=""
          name="student_id"
          placeholder="ID estudiante"
          aria-label="ID estudiante"
          aria-describedby="basic-addon2"
          onChange={(e) => setStudentId(e.target.value)}
        />

        {open && (
          <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="warning"
              variant="filled"
              sx={{ width: '100%' }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        )}

        <button
          onClick={addStudent}
          className={isLoading ? 'submit gray' : 'submit'}
          disabled={isLoading}
        >
          {isLoading ? <Loading /> : 'Agregar estudiante'}
        </button>
      </div>
    
  );
};

export default AddStudentButton;
