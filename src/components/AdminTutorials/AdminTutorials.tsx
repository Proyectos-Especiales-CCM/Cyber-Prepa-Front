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
    },
    {
      title: "Modificar un juego",
      description: "Cómo ocultar/mostrar un juego o incluso cambiar su nombre o imagen.",
      steps: [
        { element: '#games-table', popover: { title: 'Tabla de Juegos', description: 'Aquí puedes ver los juegos del sistema.' } },
        {
          element: '#games-table tbody tr td span input',
          popover: {
            title: 'Seleccionar',
            description: 'Selecciona un juego para modificar.',
            onNextClick: () => {
              const checkbox = document.querySelector("#games-table tbody tr td span input");
              if (checkbox) {
                (checkbox as HTMLInputElement).click();
              }
              driverObj && driverObj.moveNext();
            }
          }
        },
        {
          element: '#hide-game-button',
          popover: {
            title: 'Ocultar',
            description: 'Para evitar que aparezca un juego en la página principal, puedes ocultarlo con este botón. Esta acción puede servir para ocasiones en dónde un juego no está disponible temporalmente o se ha roto.',
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const checkbox = document.querySelector("#games-table tbody tr td span input");
              if (checkbox) {
                (checkbox as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#show-game-button',
          popover: {
            title: 'Mostrar',
            description: 'En caso de que el juego esté oculto, puedes volver a hacerlo visible con este botón.',
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const checkbox = document.querySelector("#games-table tbody tr td span input");
              if (checkbox) {
                (checkbox as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#edit-game-button',
          popover: {
            title: 'Editar',
            description: 'Haz click en este botón para editar el juego seleccionado.',
            onNextClick: () => {
              const button = document.querySelector("#edit-game-button");
              if (button) {
                (button as HTMLInputElement).click();
              }
              driverObj?.moveNext();
            }
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const checkbox = document.querySelector("#games-table tbody tr td span input");
              if (checkbox) {
                (checkbox as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#name',
          popover: {
            title: 'Cambiar nombre',
            description: 'Ingresa un nuevo nombre para el juego.',
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const closeModalButton = document.querySelector("#close-modal-button");
              if (closeModalButton) {
                (closeModalButton as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#selected-imageId',
          popover: {
            title: 'Cambiar imagen',
            description: 'Si ya hay imagenes guardadas, aquí puedes seleccionar una de ellas.',
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const closeModalButton = document.querySelector("#close-modal-button");
              if (closeModalButton) {
                (closeModalButton as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#change-select-or-upload',
          popover: {
            title: 'Cómo subir una imagen',
            description: 'Si no hay una imagen que te guste, puedes cambiar el menú para subir una nueva imagen con este botón.',
            onNextClick: () => {
              const button = document.querySelector("#change-select-or-upload");
              if (button) {
                (button as HTMLInputElement).click();
              }
              driverObj?.moveNext();
            }
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const closeModalButton = document.querySelector("#close-modal-button");
              if (closeModalButton) {
                (closeModalButton as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#upload-image-input',
          popover: {
            title: 'Subir imagen',
            description: 'Ahora puedes subir una imagen nueva para el juego.',
            onPrevClick: () => {
              const button = document.querySelector("#change-select-or-upload");
              if (button) {
                (button as HTMLInputElement).click();
              }
              driverObj?.moveNext();
            }
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const closeModalButton = document.querySelector("#close-modal-button");
              if (closeModalButton) {
                (closeModalButton as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#submit-mod-game',
          popover: {
            title: 'Guardar cambios',
            description: 'Finaliza el proceso y espera el mensaje de confirmación.',
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const closeModalButton = document.querySelector("#close-modal-button");
              if (closeModalButton) {
                (closeModalButton as HTMLInputElement).click();
              }
            }
          }
        },
      ]
    },
    {
      title: "Añadir un nuevo juego",
      description: "Cómo agregar un nuevo juego al sistema.",
      steps: [
        {
          element: '#games-table',
          popover: {
            title: 'Tabla de Juegos',
            description: 'Aquí puedes ver los juegos del sistema.'
          }
        },
        {
          element: '#add-game-button',
          popover: {
            title: 'Iniciar proceso',
            description: 'Para agregar un nuevo juego, haz click en este botón.',
            onNextClick: () => {
              const button = document.querySelector("#add-game-button");
              if (button) {
                (button as HTMLInputElement).click();
              }
              driverObj?.moveNext();
            }
          }
        },
        {
          element: '#name',
          popover: {
            title: 'Nombre del juego',
            description: 'Ingresa un nombre para el nuevo, este nombre debe ser único y será visible para los estudiantes.',
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const closeModalButton = document.querySelector("#close-modal-button");
              if (closeModalButton) {
                (closeModalButton as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#show-game-checkbox',
          popover: {
            title: 'Visibilidad',
            description: 'Desmarca esta casilla si no quieres que el juego sea visible para los estudiantes en este momento. Siempre puedes cambiarlo después.',
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const closeModalButton = document.querySelector("#close-modal-button");
              if (closeModalButton) {
                (closeModalButton as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#selected-imageId',
          popover: {
            title: 'Seleccionar imagen',
            description: 'Si ya tienes la imagen del juego guardada, aquí puedes seleccionar una de ellas.',
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const closeModalButton = document.querySelector("#close-modal-button");
              if (closeModalButton) {
                (closeModalButton as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#change-select-or-upload',
          popover: {
            title: 'Cómo subir una imagen',
            description: 'Si no hay una imagen que te guste, puedes cambiar el menú para subir una nueva imagen con este botón.',
            onNextClick: () => {
              const button = document.querySelector("#change-select-or-upload");
              if (button) {
                (button as HTMLInputElement).click();
              }
              driverObj?.moveNext();
            }
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const closeModalButton = document.querySelector("#close-modal-button");
              if (closeModalButton) {
                (closeModalButton as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#upload-image-input',
          popover: {
            title: 'Subir imagen',
            description: 'Ahora puedes subir una nueva imagen para el juego.',
            onPrevClick: () => {
              const button = document.querySelector("#change-select-or-upload");
              if (button) {
                (button as HTMLInputElement).click();
              }
              driverObj?.moveNext();
            }
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const closeModalButton = document.querySelector("#close-modal-button");
              if (closeModalButton) {
                (closeModalButton as HTMLInputElement).click();
              }
            }
          }
        },
        {
          element: '#submit-game',
          popover: {
            title: 'Finalizar',
            description: 'Finaliza el proceso y espera el mensaje de confirmación.',
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const closeModalButton = document.querySelector("#close-modal-button");
              if (closeModalButton) {
                (closeModalButton as HTMLInputElement).click();
              }
            }
          }
        },
      ]
    }
  ]

  return (
    <Grid container spacing={2}>
      {tutorials.map((tutorial, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Card sx={{ padding: 2, height: '100%' }}>
            <Stack justifyContent='space-between' height='100%'>
              <div>
                <Typography variant='h4'>{tutorial.title}</Typography>
                <Typography sx={{ marginY: 1 }}>{tutorial.description}</Typography>
              </div>
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