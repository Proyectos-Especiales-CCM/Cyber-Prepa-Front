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
            const checkbox = document.querySelector("#plays-table tbody tr td span input");
            if (checkbox) {
              (checkbox as HTMLInputElement).click();
            }
          }
        }
      ]
    },
    {
      title: "Crear nuevos usuarios",
      description: "Cómo agregar nuevos usuarios al sistema.",
      steps: [
        { element: '#users-table', popover: { title: 'Tabla de Usuarios', description: 'Aquí puedes ver los usuarios del sistema.' } },
        {
          element: '#create-user-button',
          popover: {
            title: 'Agregar',
            description: 'Haz click en este botón para agregar un nuevo usuario.',
            onNextClick: () => {
              const button = document.querySelector("#create-user-button");
              if (button) {
                (button as HTMLInputElement).click();
              }
              driverObj?.moveNext();
            }
          }
        },
        {
          element: '#email',
          popover: {
            title: 'Ingresar correo',
            description: 'Ingresa un correo valido para el nuevo usuario (terminado en @tec.mx).',
          },
          onDeselected: () => {
            if (driverObj?.isActive()) return;
            console.log("Deselected");
            const closeModalButton = document.querySelector("#close-modal-button");
            if (closeModalButton) {
              (closeModalButton as HTMLInputElement).click();
            }
          }
        },
        {
          element: '#pass',
          popover: {
            title: 'Ingresa contraseña',
            description: 'Ingresa una contraseña segura para el nuevo usuario, debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial.',
          },
          onDeselected: () => {
            if (driverObj?.isActive()) return;
            console.log("Deselected");
            const closeModalButton = document.querySelector("#close-modal-button");
            if (closeModalButton) {
              (closeModalButton as HTMLInputElement).click();
            }
          }
        },
        {
          element: '#is-admin-checkbox',
          popover: {
            title: 'Seleccionar tipo de usuario',
            description: 'Únicamente seleccionar esta casilla sí el usuario es administrador. Podrá borrar registros y crear/borrar nuevos juegos/usuarios, etc.',
          },
          onDeselected: () => {
            if (driverObj?.isActive()) return;
            console.log("Deselected");
            const closeModalButton = document.querySelector("#close-modal-button");
            if (closeModalButton) {
              (closeModalButton as HTMLInputElement).click();
            }
          }
        },
        {
          element: '#submit-new-user-button',
          popover: {
            title: 'Crear usuario',
            description: 'Finaliza el proceso y espera el mensaje de confirmación.',
          },
          onDeselected: () => {
            if (driverObj?.isActive()) return;
            console.log("Deselected");
            const closeModalButton = document.querySelector("#close-modal-button");
            if (closeModalButton) {
              (closeModalButton as HTMLInputElement).click();
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
              <Typography sx={{ marginY: 1 }}>{tutorial.description}</Typography>
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