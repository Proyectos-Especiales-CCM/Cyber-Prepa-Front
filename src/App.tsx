import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Router';
import { AppContextProvider } from './store/appContext/appContext';
import { GamesContextProvider } from './store/gamesContext/gamesContext';


function App() {
  return (
    <AppContextProvider>
      <GamesContextProvider>
        <RouterProvider router={router} />
      </GamesContextProvider>
    </AppContextProvider>
  )
}

export default App

