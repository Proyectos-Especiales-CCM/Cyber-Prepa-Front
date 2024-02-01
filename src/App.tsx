import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Router';
import { AppContextProvider } from './store/appContext/appContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// const darkTheme = createTheme({
  
//   palette: {
//     mode: 'dark',
//   },
// });


function App() {
  return (
    // <ThemeProvider theme={darkTheme}>
      // <CssBaseline />
      <AppContextProvider>
        <RouterProvider router={router} />
      </AppContextProvider>
    // </ThemeProvider>
  )
}

export default App

