import { Button } from '@mui/material';
import React, { CSSProperties, useState } from 'react';
import { Loading } from '..';
import { endPlaysById } from '../../services';
import { ApiResponse, EndPlayResponse, Game } from '../../services/types';
import { useAppContext } from '../../store/appContext/useAppContext';
import { SnackbarComponent } from '../SnackbarComponent';
import "./EndPlayForAllButton.css";

interface EndPlayForAllProps {
  cardGame: Game;
  style?: CSSProperties
}

const EndPlayForAllButton: React.FC<EndPlayForAllProps> = ({ cardGame, style }) => {
  const { tokens } = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const handleClose = (key: 'success' | 'error') => (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    key === 'success' ? setOpenSuccess(false) : setOpenError(false);
  };

  const endPlayForAllHandle = async () => {
    try {
      setIsLoading(true);
      const response: ApiResponse<EndPlayResponse> = await endPlaysById(cardGame.id, tokens?.access_token || '');

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
        color="error"
        onClick={endPlayForAllHandle}
        disabled={isLoading}
        sx={{
          height: 55,
          ...(style || {}),
        }}
      >
        {isLoading ? <Loading /> : 'Finalizar juego para todos'}
      </Button>
    </div>
  );
};

export default EndPlayForAllButton;
