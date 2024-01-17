import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Router';
import { AppContextProvider } from './store/appContext/appContext';


function App() {
  return (
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  )
}

export default App
