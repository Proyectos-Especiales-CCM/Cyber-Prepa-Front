import { Button, Card, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { DriveStep } from "driver.js";
import { useAppContext } from "../../store/appContext/useAppContext";

interface Tutorial {
  title: string;
  description: React.ReactNode;
  steps: DriveStep[];
}

export const MainPageTutorials = () => {
  const { driverObj } = useAppContext();

  const tutorials: Tutorial[] = [
    {
      title: "Agregar un jugador",
      description: "Cómo introducir un jugador a cierto juego",
      steps: [
        {
          element: "#Billar 1",
          popover: {
            title: "Seleccionar ",
            description:
              "Aqui puedes seleccionar el juego al que hay que añadir",
            onNextClick: () => {
              const checkbox = document.querySelector("#Billar 1");
              if (checkbox) {
                (checkbox as HTMLInputElement).click();
              }
              driverObj && driverObj.moveNext();
            },
          },
        },
        {
          element: "#form input",
          popover: {
            title: "Ingresar Matricula",
            description: "Agrega la matrícula del usuario",
          },
        },
        {
          element: "#form button",
          popover: {
            title: "Agregar estudiante",
            description: "Presiona el botón para agregar un estudiante",
          },
        },
      ],
    },
    {
      title: "Cambiar de juego",
      description: "Cómo cambiar el juego actual de un alumno",
      steps: [
        {
          element: "#div ul div div button",
          popover: {
            title: "Seleccionar",
            description: "Aqui puedes seleccionar el juego actual del alumno",
            onNextClick: () => {
              const checkbox = document.querySelector("#Billar 1");
              if (checkbox) {
                (checkbox as HTMLInputElement).click();
              }
              driverObj && driverObj.moveNext();
            },
          },
        },
        {
          element: "#form input",
          popover: {
            title: "Ingresar Matricula",
            description: "Agrega la matricula del usuario",
          },
        },
        {
          element: "#form button",
          popover: {
            title: "Agregar estudiante",
            description: "Presiona el botón para agregar un estudiante",
          },
        },
      ],
    },
    {
      title: "Terminar la partida de un jugador",
      description: "Después de que terminó su tiempo",
      steps: [
        {
          popover: {
            title: "Seleccionar estudiante",
            description:
              "Elige el estudiante al que quieras eliminar del juego",
          },
        },
      ],
    },
    {
      title: "Alguien ya no quiso jugar",
      description: "En los primeros diez minutos",
      steps: [
        {
          popover: {
            title: "Mandar mensaje",
            description:
              "En este caso, debes notificar a un encargado para que borren el registro",
          },
        },
      ],
    },
  ];

  return (
    <Grid container spacing={2}>
      {tutorials.map((tutorial, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Card sx={{ padding: 2, height: "100%" }}>
            <Stack justifyContent="space-between" height="100%">
              <div>
                <Typography variant="h4">{tutorial.title}</Typography>
                <div style={{ margin: "0.5rem 0" }}>{tutorial.description}</div>
              </div>
              <Button
                variant="outlined"
                sx={{ marginLeft: "auto" }}
                onClick={() => {
                  driverObj?.setSteps(tutorial.steps);
                  driverObj?.drive();
                }}
              >
                Ver tutorial
              </Button>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
