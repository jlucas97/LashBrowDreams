import { CssBaseline, ThemeProvider } from '@mui/material'
import './App.css'
import { appTheme } from './themes/theme.js'
import { Layout } from './components/Layout/Layout'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme /> 
      <Layout> 
        <Outlet />
      </Layout>
    </ThemeProvider>
  )
}

export default App
