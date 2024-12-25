import { Delete, Upload } from '@mui/icons-material';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { CreateImagePanel, Modal, ModalMessage, MUITable } from '../..';
import { completeImageUrl, deleteImageById, readImages } from '../../../services';
import { Image } from '../../../services/types';
import { useAppContext } from "../../../store/appContext/useAppContext";
import { CustomCell } from '../MUITable/MUITable';
import { HeadCell } from '../MUITable/TableHead';
import { CustomSelectedToolbarProps } from '../MUITable/Toolbar';

const CustomToolbar = ({ setCreateImageModal }: { setCreateImageModal: () => void }) => {
  return (
    <Tooltip title="Subir imagen">
      <IconButton
        aria-label="edit"
        color="info"
        size="large"
        onClick={() => {
          setCreateImageModal();
        }}
      >
        <Upload fontSize='inherit' />
      </IconButton>
    </Tooltip>
  );
}

interface ImagesSelectedToolbarProps extends CustomSelectedToolbarProps<Image> {
  fetchCallback: () => void;
  messageCallback: (severity: string, message: string) => void;
}

const CustomSelectedToolbar = ({ selected, fetchCallback, messageCallback }: ImagesSelectedToolbarProps) => {
  const { tokens } = useAppContext();

  /**
   * Handles the deletion of selected images.
   * @function
   * @async
   * @param {MUIDataTableIsRowCheck} selectedRows - Selected rows in the table.
   * @returns {Promise<void>}
   */
  const handleDeleteImage = async (selected: readonly Image[]): Promise<void> => {
    try {
      for (const image of selected) {
        await deleteImageById(image.id, tokens?.access_token ?? "");
      }
      fetchCallback();
      messageCallback("success", "Imagen/es eliminada/s correctamente.");
    }
    catch (error) {
      messageCallback("error", "Ha ocurrido un error al eliminar la/s imagen/es.");
      console.error(error);
    }
  };

  return (
    <Stack id='game-options' direction="row">
      <Tooltip title="Borrar">
        <IconButton
          aria-label="delete"
          color="error"
          size="large"
          onClick={() => {
            if (!selected) return;
            handleDeleteImage(selected);
          }}
        >
          <Delete fontSize='inherit' />
        </IconButton>
      </Tooltip>
    </Stack>
  )
};

const CustomCells: CustomCell<Image>[] = [
  {
    id: "image",
    render: (row: Image) => <img src={completeImageUrl(row.image ?? '')} width="50" height="auto" />,
  }
]

const headCells: HeadCell<Image>[] = [
  { id: "id", label: "ID", numeric: false },
  { id: "image", label: "Imagen", numeric: false },
];

/**
 * Images MUI DataTable component.
 * 
 * Allows to display, and delete images.
 * 
 * @example
 * const ref = useRef();
 * 
 * return (
 *   <ImagesDataTable ref={ref} />
 * );
 * 
 * @component
 * @param {React.ForwardedRef} ref Ref to allow quick navigation.
 * 
 * @property imagesData: <Image[]> - List of images fetched from the API.
 * @property imagesSelected: <[]> - Rows selected in the table.
 * @property modalMessageAttr: <{openModal: boolean, severity: string, message: string}> - Attributes for the modal message.
 * @property modalAttr: <{openModal: boolean, title: string, children: React.ReactNode}> - Attributes for the modal.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
export const ImagesDataTable = () => {

  const { tokens } = useAppContext();
  const [imagesData, setImagesData] = useState<Image[]>([]);

  // Variable de atributos del modal de mensajes (feedback al usuario)
  const [modalMessageAttr, setModalMessageAttr] = useState({
    openModal: false,
    severity: "info",
    message: "Sample Message",
  });

  /**
   * Closes the modal with a message and resets its attributes.
   * 
   * @function
   * 
   * @returns {void}
   */
  const closeModalMessage = useCallback((): void => {
    setModalMessageAttr({
      openModal: false,
      severity: "info",
      message: "Sample Message",
    });
  }, []);

  /**
   * Opens a modal with a message.
   * 
   * @function
   * @param {string} severity - Severity of the message.
   * @param {string} message - Content of the message.
   * 
   * @returns {void}
   */
  const openModalMessage = useCallback((severity: string, message: string): void => {
    setModalMessageAttr({
      openModal: true,
      severity: severity,
      message: message,
    });
  }, []);

  // Variables de atributos de los modales
  const [modalAttr, setModalAttr] = useState({
    openModal: false,
    title: "Hello, I'm a Modal",
    children: (<><p>Sample Content</p></>),
  });

  /**
   * Closes the modal and resets its attributes.
   * 
   * @function
   * 
   * @returns {void}
   */
  const handleCloseModal = useCallback((): void => {
    setModalAttr({
      openModal: false,
      title: "Hello, I'm a Modal",
      children: (<><p>Sample Content</p></>),
    });
  }, []);

  /**
   * Fetches images data from the server.
   * @function
   * @async
   * @returns {Promise<void>}
   */
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const imageResponse = await readImages(tokens?.access_token ?? "");
      setImagesData(imageResponse?.data);
    } catch (error) {
      openModalMessage("error", "Ha ocurrido un error al cargar las imágenes.");
      console.error(error);
    }
  }, [tokens, openModalMessage]);

  // Métodos extra para cambiar el contenido del modal por el
  // componente de creación o modificación de imágenes
  const setCreateImageModal = () => {
    setModalAttr({
      openModal: true,
      title: "Agregar imagen",
      children: (<>
        <CreateImagePanel
          openModalMessage={openModalMessage}
          closeModal={handleCloseModal}
          fetchData={fetchData}
        />
      </>),
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <MUITable
        title="Imágenes"
        data={imagesData}
        headCells={headCells as HeadCell<unknown>[]}
        customCells={CustomCells as CustomCell<object>[]}
        CustomToolbar={() => <CustomToolbar setCreateImageModal={setCreateImageModal} />}
        CustomSelectedToolbar={(props) => (
          <CustomSelectedToolbar
            data={props.data as Image[]}
            selected={props.selected as readonly Image[]}
            fetchCallback={fetchData}
            messageCallback={openModalMessage} />
        )}
      />
      <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
      <Modal handleCloseModal={handleCloseModal} {...modalAttr} />
    </>
  )
};
