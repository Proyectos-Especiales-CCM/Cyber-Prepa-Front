import { DriveStep } from "driver.js";
import { Button, Card, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { useAppContext } from "../../store/appContext/useAppContext";

interface Tutorial {
  title: string
  description: string
  steps: DriveStep[]
}

export const AdminTutorials = () => {
  const { driverObj } = useAppContext();

  const tutorials: Tutorial[] = [
    {
      title: "Borrar registros",
      description: "Cómo eliminar registros de las veces que los estudiantes han jugado.",
      steps: [
        { element: '#plays-table', popover: { title: 'Tabla de Partidas', description: 'Aquí puedes ver las partidas de los estudiantes.' } },
        {
          element: '#plays-table tbody tr td span input',
          popover: {
            title: 'Seleccionar',
            description: 'Selecciona una o varias partidas para eliminar.',
            onNextClick: () => {
              const checkbox = document.querySelector("#plays-table tbody tr td span input");
              if (checkbox) {
                (checkbox as HTMLInputElement).click();
              }
              driverObj && driverObj.moveNext();
            }
          }
        },
        {
          element: '#delete-play-button',
          popover: {
            title: 'Eliminar',
            description: 'Puedes eliminar las partidas seleccionadas con este botón.',
          },
          onDeselected: () => {
            console.log("Deselected");
            const checkbox = document.querySelector("#plays-table tbody tr td span input");
            if (checkbox) {
              (checkbox as HTMLInputElement).click();
            } else {
              console.log("Checkbox not found");
            }
          }
        }
      ]
    }
  ]

  return (
    <Grid container spacing={2}>
      {tutorials.map((tutorial, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Card sx={{ padding: 2 }}>
            <Stack>
              <Typography variant='h4'>{tutorial.title}</Typography>
              <Typography sx={{ marginTop: 1 }}>{tutorial.description}</Typography>
              <Button
                variant='outlined'
                sx={{ marginLeft: 'auto' }}
                onClick={() => {
                  driverObj?.setSteps(tutorial.steps);
                  driverObj?.drive();
                }}
              >
                Ver tutorial</Button>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
};    