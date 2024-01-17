import './admin.css'
import MUIDataTable from "mui-datatables";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../../store/appContext/appContext";
import { useState } from "react";
import { useEffect } from "react";
import { readPlays, readGames, readStudents, readUsers } from "../../services";
import { playColumns, gameColumns, studentColumns, userColumns, tableOptions, ModalMessage, Modal } from "../../components";

function changeIdForName(playsData, gamesData) {
  playsData.forEach(play => {
    play.game = gamesData.find(game => game.id === play.game).name;
  });
  return playsData;
}

const AddUser = () => {
  const { tokens } = useAppContext();
  const [formAttr, setFormAttr] = useState({
    email: "",
    password: "",
    is_admin: false,
  });
  
  return (
    <>
      <p>Sample Content</p>
    </>
  );
}

const Admin = () => {
  const { tokens, admin } = useAppContext();

  const [gamesData, setGamesData] = useState([]);
  const [playsData, setPlaysData] = useState([]);
  const [sanctionsData, setSanctionsData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [modalAttr, setModalAttr] = useState({
    openModal: true,
    handleCloseModal: () => {
      setModalAttr({
        ...modalAttr,
        openModal: false,
      });
    },
    title: "Hello, I'm a Modal",
    children: (<><p>Sample Content</p></>),
  });
  const [modalMessageAttr, setModalMessageAttr] = useState({
    openModal: true,
    handleCloseModal: () => {
      setModalMessageAttr({
        ...modalMessageAttr,
        openModal: false,
      });
    },
    severity: "info",
    message: "Sample Message",
  });

  const setAddUserModal = () => {
    setModalAttr({
      ...modalAttr,
      openModal: true,
      title: "Añadir Usuario",
      children: (<><AddUser/></>),
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      let response = await readGames();
      const resGamesData = response?.data;
      response?.status === 200 ? setGamesData(resGamesData) : console.log(resGamesData);
      response = await readPlays(tokens?.access_token ?? "");
      response?.status === 200 ? setPlaysData(changeIdForName(response?.data, resGamesData)) : console.log(response?.data);
      //const response = await readSanctions(tokens?.access_token ?? "");
      //response?.status === 200 ? setSanctionsData(response?.data) : console.log(response?.data);
      if (admin === true) {
        response = await readStudents(tokens?.access_token ?? "");
        response?.status === 200 ? setStudentsData(response?.data) : console.log(response?.data);
        //response = await readBecarios(tokens?.access_token ?? "");
        //response?.status === 200 ? setBecariosData(response?.data) : console.log(response?.data);
        response = await readUsers(tokens?.access_token ?? "");
        response?.status === 200 ? setUsersData(response?.data) : console.log(response?.data);
      }
    };

    fetchData();
  }, [tokens, admin]);

  return (
    <>
      <Box sx={{width:'100%'}}>
        <MUIDataTable
          title={"Historial de Juegos"}
          data={playsData}
          columns={playColumns}
          options={tableOptions}
          className="cyber__table"
          />
        <MUIDataTable
          title={"Sanciones"}
          data={sanctionsData}
          columns={["Estudiante", "Fecha y hora", "Detalle"]}
          options={tableOptions}
          className="cyber__table"
          />
        {admin ? (
          <>
            <MUIDataTable
              title={"Catálogo de Juegos"}
              data={gamesData}
              columns={gameColumns}
              options={tableOptions}
              className="cyber__table"
              />
            <MUIDataTable
              title={"Estudiantes"}
              data={studentsData}
              columns={studentColumns}
              options={tableOptions}
              className="cyber__table"
              />
            <MUIDataTable
              title={"Historial de los Becarios"}
              data={[]}
              columns={["Usuario", "Fecha y hora", "Detalle"]}
              options={tableOptions}
              className="cyber__table"
              />
            <MUIDataTable
              title={"Usuarios"}
              data={usersData}
              columns={userColumns}
              options={{
                ...tableOptions,
                customToolbar: () => <Button variant='contained' color='success' onClick={setAddUserModal}>Añadir Usuario</Button>,
              }}
              className="cyber__table"
              />
          </>
        ) : (
          <></>
        )}
        <Modal {...modalAttr} />
        <ModalMessage {...modalMessageAttr} />
      </Box>
    </>
  )
}

export default Admin
