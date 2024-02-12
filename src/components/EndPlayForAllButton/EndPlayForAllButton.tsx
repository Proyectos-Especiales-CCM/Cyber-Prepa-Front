import React, { useEffect, useState } from 'react';
import { ApiResponse, EndPlayResponse, Game } from '../../services/types';
import { Loading } from '..';
import { endPlaysById } from '../../services';
import { SnackbarComponent } from '../SnackbarComponent';
import { Button } from '@mui/material';
import "./EndPlayForAllButton.css"

interface EndPlayForAllProps {
  cardGame: Game;
}

const EndPlayForAllButton: React.FC<EndPlayForAllProps> = ({ cardGame }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    const tokensString = localStorage.getItem('tokens');
    if (tokensString) {
      const tokens = JSON.parse(tokensString);
      setAccessToken(tokens.access_token);
    }
  }, []);

  const handleClose = (key: 'success' | 'error') => (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    key === 'success' ? setOpenSuccess(false) : setOpenError(false);
  };

  const endPlayForAllHandle = async () => {
    try {
      setIsLoading(true);
      const response: ApiResponse<EndPlayResponse> = await endPlaysById(cardGame.id, accessToken);

      if (response.status === 200) {
        setAlertMessage('Juego terminado para todos');
        setOpenSuccess(true);
      } else {
        setAlertMessage('Error terminando juego, vuelve a intentarlo');
        setOpenError(true);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <SnackbarComponent
        open={openSuccess}
        onClose={handleClose('success')}
        severity="success"
        message={alertMessage}
      />

      <SnackbarComponent
        open={openError}
        onClose={handleClose('error')}
        severity="warning"
        message={alertMessage}
      />

      <Button
        className='button'
        size="large"
        variant="contained"
        onClick={endPlayForAllHandle}
        disabled={isLoading}
        sx={{
          height: 55,
          backgroundColor: '#133a71'
        }}
      >
        {isLoading ? <Loading /> : 'Finalizar juego para todos'}
      </Button>
    </div>
  );
};

export default EndPlayForAllButton;
