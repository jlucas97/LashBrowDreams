import { CssBaseline, ThemeProvider } from '@mui/material'
import './App.css'
import { appTheme } from './themes/theme.js'
import { Layout } from './components/Layout/Layout'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme /> 
      <Layout> 
        <Outlet />
        <ToastContainer />
      </Layout>
    </ThemeProvider>
  )
}

export default App
