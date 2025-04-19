import { Button, FormHelperText, Stack, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { createAnnouncement } from "../../services/rental/createAnnouncement";
import { patchAnnouncementById } from "../../services/rental/patchAnnouncementById";
import { Announcement as AnnouncementType } from "../../services/types";
import { useAppContext } from "../../store/appContext/useAppContext";

interface CreateUpdateAnnouncementPanelProps {
  announcement?: AnnouncementType;
  openSnackbar: (message: string, severity: 'success' | 'error') => void;
  closeModal: () => void;
}

export const CreateUpdateAnnouncementPanel = ({ announcement, openSnackbar, closeModal }: CreateUpdateAnnouncementPanelProps) => {
  const { tokens } = useAppContext()

  const [title, setTitle] = useState<string>(announcement ? announcement.title : '');
  const [content, setContent] = useState<string>(announcement ? announcement.content : '');
  const [startTime, setStartTime] = useState<Dayjs | null>(announcement ? dayjs(announcement.start_at) : null);
  const [endTime, setEndTime] = useState<Dayjs | null>(announcement ? dayjs(announcement.end_at) : null);
  const [error, setError] = useState<string>('')

  const displayHelperTextTitle = () => {
    if (title && title.length < 5) {
      return 'Título inválido. Mínimo 5 caracteres';
    }
    return '';
  }

  const displayHelperTextContent = () => {
    if (content && content.length < 20) {
      return 'Contenido inválido. Mínimo 20 caracteres';
    }
    return '';
  }

  return (
    <>
      <Stack spacing={2} marginTop={3}>
        <TextField variant="outlined" label='Título' value={title} onChange={(e) => setTitle(e.target.value)} error={!!displayHelperTextTitle()} helperText={displayHelperTextTitle()} />
        <TextField variant="outlined" label='Contenido' value={content} onChange={(e) => setContent(e.target.value)} error={!!displayHelperTextContent()} helperText={displayHelperTextContent()} />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DateTimePicker
            label="Fecha y hora de inicio del anuncio"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            minDateTime={!announcement ? dayjs().add(1, 'minute') : undefined}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DateTimePicker
            label="Fecha y hora de fin del anuncio"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            minDateTime={startTime ? startTime.add(1, 'minute') : !announcement ? dayjs().add(1, 'minute') : undefined}
          />
        </LocalizationProvider>
        <FormHelperText error>{error}</FormHelperText>
        <Stack direction='row-reverse'>
          <Button
            color="success"
            size="large"
            variant='contained'
            sx={{ fontWeight: 'bold' }}
            onClick={() => {
              try {
                if (announcement) {
                  const requestBody = {
                    ...(title !== announcement.title && { title: title }),
                    ...(content !== announcement.content && { content: content }),
                    ...(startTime && startTime.toJSON() !== announcement.start_at && { start_at: startTime.toJSON() }),
                    ...(endTime && endTime.toJSON() !== announcement.end_at && { end_at: endTime.toJSON() }),
                  }
                  patchAnnouncementById(announcement.id, tokens?.access_token || '', requestBody)
                  openSnackbar('Anuncio actualizado', 'success');
                  closeModal();
                } else {
                  if (!title || !content || !startTime || !endTime) {
                    setError('Por favor completa todos los campos');
                    return;
                  }
                  createAnnouncement(title, content, startTime.toJSON(), endTime.toJSON(), tokens?.access_token || '')
                  openSnackbar('Anuncio creado', 'success');
                  closeModal();
                }
              } catch (error) {
                setError('Hubo un error al crear el anuncio');
                console.error('Error creating announcement:', error);
              }
            }}
          >
            {announcement ? 'Actualizar' : 'Crear'}
          </Button>
        </Stack>
      </Stack>
    </>
  )
}
