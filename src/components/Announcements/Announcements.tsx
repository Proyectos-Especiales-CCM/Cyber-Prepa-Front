import { Add } from "@mui/icons-material";
import { createTheme, Divider, IconButton, Stack, ThemeProvider, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { readAnnouncements } from "../../services/rental/readAnnouncements";
import { Announcement as AnnouncementType } from "../../services/types";
import { useAppContext } from "../../store/appContext/useAppContext";
import { Modal } from "../Modal";
import { Announcement } from "./Announcement";
import { CreateUpdateAnnouncementPanel } from "./CreateUpdateAnnouncementPanel";
import { SnackbarComponent } from "../SnackbarComponent";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const Announcements = ({ lastMessage }: { lastMessage: MessageEvent<any> | null }) => {
  const { tokens, admin } = useAppContext()
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [filteredAnn, setFilteredAnn] = useState<AnnouncementType[]>([]);
  const [modalAttr, setModalAttr] = useState<any>({ open: false, title: 'Crear nuevo anuncio', announcement: null })

  // Snackbar state
  const [snackbarAttr, setSnackbarAttr] = useState<any>({ open: false, message: '', severity: 'success' });

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarAttr({ ...snackbarAttr, open: false });
  };

  const filterAnnouncements = (announcements: AnnouncementType[]) => {
    const now = new Date();
    return announcements.filter((announcement) => {
      const startDate = new Date(announcement.start_at);
      const endDate = new Date(announcement.end_at);
      return startDate <= now && endDate >= now;
    });
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await readAnnouncements(tokens?.access_token || '', true);
      if (response) {
        setAnnouncements(response.data);
        setFilteredAnn(filterAnnouncements(response.data));
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  }, [tokens?.access_token]);

  useEffect(() => {
    fetchData();
    // Initialize interval to filter announcements every minute
    const interval = setInterval(() => {
      setFilteredAnn(filterAnnouncements(announcements));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Listen for WebSocket messages and fetch data only when updated
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.message === "Announcements updated") {
          fetchData();
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage, fetchData]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Stack margin={2} spacing={2}>
        {admin ? (
          announcements && announcements.map((ann) => (
            <Announcement
              key={ann.id}
              announcement={ann}
              notVisibleYet={filteredAnn && !filteredAnn.some((a) => a.id === ann.id)}
              setAnnOnModal={(announcement) => {
                setModalAttr({ ...modalAttr, open: true, title: 'Modificar anuncio', announcement })
              }}
              openSnackbar={(message, severity) => {
                setSnackbarAttr({ ...snackbarAttr, open: true, message, severity })
              }}
            />
          ))
        ) : (
          filteredAnn && filteredAnn.map((ann) => (
            <Announcement
              key={ann.id}
              announcement={ann}
              notVisibleYet={false}
              setAnnOnModal={(announcement) => {
                setModalAttr({ ...modalAttr, open: true, title: 'Modificar anuncio', announcement })
              }}
              openSnackbar={(message, severity) => {
                setSnackbarAttr({ ...snackbarAttr, open: true, message, severity })
              }}
            />
          ))
        )}
      </Stack>
      {admin && (
        <Stack alignItems="end" margin={2}>
          <Stack
            onClick={() => { setModalAttr({ ...modalAttr, open: true, title: 'Crear nuevo anuncio' }) }}
            direction="row"
            spacing={0.5}
            sx={{ cursor: 'pointer' }}
          >
            <Typography alignContent="center" color="primary">Crear nuevo anuncio</Typography>
            <IconButton sx={{ marginLeft: "auto" }}>
              <Add />
            </IconButton>
          </Stack>
        </Stack>
      )}
      <Modal openModal={modalAttr.open} handleCloseModal={() => { setModalAttr({ ...modalAttr, open: false, announcement: null }) }} title={modalAttr.title}>
        <CreateUpdateAnnouncementPanel announcement={modalAttr.announcement} openSnackbar={(message, severity) => {
          setSnackbarAttr({ ...snackbarAttr, open: true, message, severity })
        }} closeModal={() => { setModalAttr({ ...modalAttr, open: false, announcement: null }) }} />
      </Modal>
      <SnackbarComponent open={snackbarAttr.open} onClose={handleClose} severity={snackbarAttr.severity} message={snackbarAttr.message} />
      {admin && (
        <Divider />
      )}
    </ThemeProvider>
  )
}