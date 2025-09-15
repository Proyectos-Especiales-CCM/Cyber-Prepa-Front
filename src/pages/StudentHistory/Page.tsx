import { useState } from "react";
import { Input, Button, createTheme, ThemeProvider, Typography, Box, Stack } from "@mui/material";
import { readPlays, readStudentById } from "../../services";
import { useAppContext } from "../../store/appContext/useAppContext";
import { Play, Student } from "../../services/types";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Page() {
  const { tokens } = useAppContext();

  const [student, setStudent] = useState<Student | null>(null);
  const [plays, setPlays] = useState<Play[]>([]);
  const [inputId, setInputId] = useState<string>("");

  const getData = async (studentId: string) => {
    if (!studentId) return;

    try {
      // fetch student info
      const { data: studentData } = await readStudentById(studentId, tokens?.access_token);
      setStudent(studentData);

      // fetch plays
      const { data: playsData } = await readPlays(tokens?.access_token || "", undefined, studentId);
      setPlays(playsData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
        <p>Hola, consulta la información sobre un estudiante específico</p>

        <Stack direction='row' sx={{ maxWidth: '20 rem' }}>
          <Input
            type="text"
            placeholder="a01656583"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            sx={{ maxWidth: '10rem' }}
          />
          <Button onClick={() => getData(inputId)}>Buscar</Button>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem' }}>
          {student && (
            <Box sx={{ marginBottom: '1rem' }}>
              <h3>Estudiante</h3>
              <p><b>ID:</b> {student.id}</p>
              <p><b>Nombre:</b> {student.name}</p>
              <p><b>Jugó hoy:</b> {student.played_today}</p>
              <p><b>Veces jugadas esta semana:</b> {student.weekly_plays}</p>
              <p><b>Sanciones:</b> {student.sanctions_number}</p>
              <p><b>Olvidó credencial:</b> {student.forgoten_id ? "Sí" : "No"}</p>
            </Box>
          )}

          {plays.length > 0 && (
            <Box sx={{ marginBottom: 2, marginLeft: 2 }}>
              <h3>Plays</h3>
              <ul>
                {plays.map((play) => (
                  <li key={play.id}>
                    {play.time} - {play.game} - {play.ended ? <Typography display='inline' color="green">Terminado</Typography> : <Typography display='inline' color="orange">En curso</Typography>}
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
