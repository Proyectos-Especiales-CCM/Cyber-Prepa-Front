import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { deleteAnnouncementById } from "../../services/rental/deleteAnnouncementById";
import { Announcement as AnnouncementType } from "../../services/types";
import { useAppContext } from "../../store/appContext/useAppContext";
import "./Announcement.css";

interface AnnouncementProps {
  announcement: AnnouncementType;
  notVisibleYet?: boolean;
  setAnnOnModal: (announcement: AnnouncementType) => void;
  openSnackbar: (message: string, severity: 'success' | 'error') => void;
}

export const Announcement = ({ announcement, notVisibleYet, setAnnOnModal, openSnackbar }: AnnouncementProps) => {
  const { admin, tokens } = useAppContext()

  return (
    <div className={`announcement ${notVisibleYet ? 'announcement-gray' : ''}`}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className="announcement__title"
      >
        <Typography variant="h4">{announcement.title}</Typography>
        {admin &&
          <>
            <Typography variant="h6" className="announcement__date">
              El anuncio se mostrará desde{" "}
              {dayjs(announcement.start_at).locale('es').format('DD/MM/YYYY HH:mm')} hasta{" "}
              {dayjs(announcement.end_at).locale('es').format('DD/MM/YYYY HH:mm')}
            </Typography>
            <Stack direction='row'>
              <IconButton onClick={() => setAnnOnModal(announcement)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => {
                deleteAnnouncementById(announcement.id, tokens!.access_token || '');
                openSnackbar("Anuncio eliminado", "success");
              }}>
                <Delete />
              </IconButton>
            </Stack>
          </>
        }
      </Stack>
      <Typography className="announcement__content">{announcement.content}</Typography>
    </div>
  )
}
