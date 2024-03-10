import { useState } from 'react';
import './styles.css';
// Import other necessary dependencies

const Reglamento = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const regulations = [
    { 
        id: 1,
        title: "Introducción al Reglamento", 
        description: "Este reglamento está basado en el Reglamento General de Estudiantes (RGE), del Instituto Tecnológico y de Estudios Superiores de Monterrey.", 
        backgroundClass: "background1" 
      },
      { 
        id: 2, 
        title: "Horario de Servicio", 
        description: "Horario de servicio: 7:30am a 17:00hrs.", 
        backgroundClass: "background2" 
      },
      { 
        id: 3, 
        title: "Registro para Uso de Juegos", 
        description: "Para hacer uso de los juegos, es necesario llevar a cabo tu registro personalmente presentando tu credencial vigente.", 
        backgroundClass: "background3" 
      },
      { 
        id: 4, 
        title: "Prioridad en Solicitudes de Juegos", 
        description: "En caso de que ocurra un empalme con las solicitudes de algún juego, se da prioridad a alumnos de Preparatoria.", 
        backgroundClass: "background4" 
      },
      { 
        id: 5, 
        title: "Entrega y Recogida de Juegos", 
        description: "En caso de preguntar sobre la entrega de algún juego, se le entregará a aquel que esté al pendiente y cerca del módulo.", 
        backgroundClass: "background5" 
      },
      { 
        id: 6, 
        title: "Uso y Disponibilidad del Equipo", 
        description: "El uso del equipo es regulado por el responsable del área a través del sistema de registro; revisa la disponibilidad.", 
        backgroundClass: "background7"
      },
      { 
        id: 7, 
        title: "Limitaciones de Juego Semanal", 
        description: "Podrás jugar 3 veces a la semana durante 50 minutos cada día, sin embargo, no puedes jugar más de una ocasión el mismo día. 1 vez por día aplica en toda el área, no por juego.", 
        backgroundClass: "background8"
      },
      { 
        id: 8, 
        title: "Verificación y Sanciones de Tiempo de Juego", 
        description: "Recuerda verificar tu tiempo de juego; ya que si excedes el mismo puede generar alguna sanción, por favor entrega a tiempo el equipo.", 
        backgroundClass: "background9"
      },
      { 
        id: 9, 
        title: "Uso de Juegos de Mesa",
        description: "Para usar los juegos de mesa (Jenga, Ajedrez, Turista mundial, etc.), el estudiante debe registrarse y dejar su credencial la cual le será devuelta al entregar el juego.", 
        backgroundClass: "background10"
      },
      { 
        id: 10,
        title: "Registro de Grupo para Juego", 
        description: "En caso de jugar en grupo, deberá registrarse cada uno de los integrantes.", 
        backgroundClass: "background11"
      },
      { 
        id: 11, 
        title: "Consecuencias por Jugar sin Registro", 
        description: "Si alguien es sorprendido jugando sin registro se recogerá el juego a todo el grupo, se tomaran los nombres de todos, incluyendo aquel que no se registró como un llamado de atención, en caso de que alguno reincida en el mismo u otro juego, quedará sancionado por 15 días, no podrá  jugar; de continuar con la conducta, se restringirá el acceso por el tiempo que consideren los responsables del área.", 
        backgroundClass: "background12"
      },
      { 
        id: 12, 
        title: "Integración y Tiempo de Juego", 
        description: "Si te integras a un juego, entras con el tiempo del primer registro, de modo que tendrás de juego lo que le falte a ese primer registro. Tú decides si agotas tu tiempo o esperas a jugar tu tiempo completo.", 
        backgroundClass: "background13"
      },
      { 
        id: 13, 
        title: "Entrega de Juegos Solicitados", 
        description: "El estudiante que solicite algún juego debe entregarlo (él mismo) en el lugar de donde lo recibió, en buen estado y completo, el estudiante caerá en sanción si envía el equipo o juego prestado con una persona ajena o lo deja abandonado.", 
        backgroundClass: "background14"
      },
      { 
        id: 14, 
        title: "Revisión y Recepción de Equipos", 
        description: "El estudiante o los estudiantes tienen la obligación de revisar los aparatos y/o equipo que se le entrega y confirmar antes de retirarse que lo recibe en buenas condiciones, de no ser así se le realiza un cambio de materiales, si no hace o hacen esta revisión asumen que si el equipo y/o aparato es entregado en condiciones no óptimas, el estudiante(s) deberá pagar la reposición (parcial o completa, según sea el caso).", 
        backgroundClass: "background15"
      },
      { 
        id: 15, 
        title: "Reporte de Averías en Equipos", 
        description: "Si el equipo/juego presenta alguna avería durante su uso, favor de reportarlo al área. NO INTENTES ARREGLARLO.", 
        backgroundClass: "background16"
      },
      { 
        id: 16, 
        title: "Daños y Reposición de Material", 
        description: "Si al momento de la entrega el juego o material prestado se entrega dañado el o los estudiantes involucrados deberán pagar la reposición parcial o completa del material dañado. Como control se tomarán los datos del o de los estudiantes para sondear la reparación del daño.", 
        backgroundClass: "background17"
      },
      { 
        id: 17, 
        title: "Política de Tiempo de Juego", 
        description: "El tiempo de juego no es acumulable, deberás terminarlo en un solo registro, si te retiras antes de que terminen los 50 minutos no se te repondrá el tiempo restante, por lo cual te recomendamos elegir bien el horario en el que podrás disfrutar de tus 50 minutos completos.", 
        backgroundClass: "background1"
      },
      { 
        id: 18, 
        title: "Limpieza después de Consumo", 
        description: "En caso de consumir alimentos y/o ingerir bebidas en el área de video juegos deberás dejar el espacio limpio.", 
        backgroundClass: "background6"
      },
      { 
        id: 19, 
        title: "Restricción de Salida con Equipos", 
        description: "Evita salir de CyberPrepa con el equipo de juego (tacos de billar, pelotas de futbolito, ping pong, controles, etc). Quien sea sorprendido, será sancionado.", 
        backgroundClass: "background7"
      },
      { 
        id: 20, 
        title: "Prohibición de Apuestas", 
        description: "No se permite apostar, se tomarán las acciones correspondientes a quien se sorprenda infringiendo esta regla.", 
        backgroundClass: "background8"
      },
      { 
        id: 21,
        title: "Gestión de Espacio y Mochilas", 
        description: "Coloca tu mochila en espacios asignados (lockers, gavetas) que no bloqueen el paso, de lo contrario  serán enviadas a locatec.", 
        backgroundClass: "background9"
      },
      { 
        id: 22,
        title: "Uso de Controles de Videojuegos",
        description: "No se prestan controles de videojuegos (nintendo, xbox, play 5), estos son para uso de las consolas y deben estar disponibles en caso de que alguien más se una al video-juego.", 
        backgroundClass: "background10"
      },
      { 
        id: 23,
        title: "Conducta y Lenguaje Adecuado", 
        description: "Aquel estudiante que se le sorprenda diciendo palabras ofensivas, altisonantes y/o groserías, tendrá que someterse a las indicaciones correctivas que los responsables convengan, que va desde una llamada de atención hasta una canalización a Conducta Estudiantil.", 
        backgroundClass: "background11"
      },
      { 
        id: 24,
        title: "Consumo en Áreas de Juego", 
        description: "No se puede consumir alimentos, ni bebidas en el área de mesas de juegos (billar, ping, pong, hockey, futbolitos), si alguna mesa sufre algún daño deberás asumir la reparación.", 
        backgroundClass: "background12"
      },
      { 
        id: 25,
        title: "Responsabilidad Post-Horario", 
        description: "El horario de servicio termina a las 17:00hrs de utilizar el área después del cierre, es responsabilidad del o los estudiantes asumir la reparación de cualquier daño ocasionado en el juego sin supervisión de cyber prepa.", 
        backgroundClass: "background13"
      },
      { 
        id: 26,
        title: "Gestión de Credenciales Olvidadas", 
        description: "Si olvidas tu credencial, tendrás ese día para recogerla, de lo contrario será entregada a Seguridad y deberás ir a locatec por ella. La entrega es solo a la o al estudiante titular.", 
        backgroundClass: "background14"
      },
  ];

  const filteredRegulations = regulations.filter((regulation) => 
    regulation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    regulation.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="container">
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
    <header className="navigation-header">
    <div className="header-row">
        <div className="header-spacer"></div>
        <div className="search-container">
        <label className="search-label" htmlFor="fixed-header-drawer-exp">
            Buscar en el reglamento
        </label>
        <input
            className="search-input"
            type="text"
            id="fixed-header-drawer-exp"
            value={searchQuery}
            onChange={handleSearchChange}
        />
        </div>
    </div>
    </header>
      <div className="mdl-layout__drawer navigation">
        <span className="mdl-layout-title navigation-title">Reglas</span>
        <nav className="left-grid">
            {regulations.map((regulation) => (
            <a key={regulation.id} className="navigation-link" href={`#regulation-${regulation.id}`}>{regulation.id}. {regulation.title}</a>
          ))}
        </nav>
      </div>
      <main className="mdl-layout__content">
        <div className="page-content">
          <div className="mdl-grid">
            {filteredRegulations.map((regulation) => (
              <div key={regulation.id} className={`mdl-cell mdl-card mdl-shadow--2dp ${regulation.backgroundClass} background`}>
                <div className="mdl-card__title">
                  <h3 className="mdl-card__title-text mdl-color-text--white card-title">{regulation.title}</h3>
                </div>
                <div className="mdl-card__supporting-text mdl-color-text--white">
                  {regulation.description}
                </div>
              </div>
            ))}
            <div key={27} className={`mdl-cell mdl-cell--12-col mdl-card mdl-shadow--2dp background1 background`}>
                <div className="mdl-card__title">
                  <h3 className="mdl-card__title-text mdl-color-text--white card-title">Atentamente: Cyber Prepa CCM<br></br><br></br>Cualquier duda y/o aclaración, favor de acudir con los responsables del área del área.</h3>
                </div>
              </div>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
};

export default Reglamento;
