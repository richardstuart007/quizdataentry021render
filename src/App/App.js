//
// Libraries
//
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { useState } from 'react'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
//  Pages
//
import Control from '../pages/Control'
//
//  Common Components
//
import Layout from '../components/Layout/Layout'
//
//  Global Themes used by the Theme Provider
//
const theme = createTheme({
  palette: {
    primary: {
      main: '#333996',
      light: '#3c44b126'
    },
    secondary: {
      main: '#f83245',
      light: '#f8324526'
    },
    background: {
      default: '#f4f5fd'
    }
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: 'translateZ(0)'
      }
    }
  },
  props: {
    MuiIconButton: {
      disableRipple: true
    }
  }
})
//
//  Client
//
const { REMOTE_CLIENT } = require('../services/constants.js')
const { LOC_REMOTE_REMOTE_CLIENT } = require('../services/constants.js')
const { LOC_LOC_LOC_CLIENT } = require('../services/constants.js')
const { LOC_LOC_REMOTE_CLIENT } = require('../services/constants.js')
//
//  Server
//
const { REMOTE_SERVER } = require('../services/constants.js')
const { LOC_LOC_REMOTE_SERVER } = require('../services/constants.js')
const { LOC_LOC_LOC_SERVER } = require('../services/constants.js')
//
//  Database
//
const { REMOTE_DATABASE } = require('../services/constants.js')
const { LOC_LOC_LOC_DATABASE } = require('../services/constants.js')
//
//  URL
//
const { REMOTE_SERVERURL } = require('../services/constants.js')
const { LOC_LOC_REMOTE_SERVERURL } = require('../services/constants.js')
const { LOC_LOC_LOC_SERVERURL } = require('../services/constants.js')
//
// Debug Settings
//
const debugLog = debugSettings()
//
// Global
//
let g_firstTimeFlag = true
//----------------------------------------------------------------------------
//- Main Line
//----------------------------------------------------------------------------
export default function App() {
  if (debugLog) console.log(`Start APP`)
  const [currentPage, setCurrentPage] = useState('QuestionList')

  //.............................................................................
  //.  Handle Page Change
  //.............................................................................
  const handlePage = nextPage => {
    //
    //  If no change of Page, return
    //
    if (nextPage === currentPage) return
    //
    //  Change of Page
    //
    const CurrentPage = currentPage
    if (debugLog) console.log(`Current Page ${CurrentPage} ==> New Page ${nextPage}`)
    //
    //  Update Previous Page
    //
    sessionStorage.setItem('Nav_Page_Previous', JSON.stringify(CurrentPage))
    if (debugLog)
      console.log(
        `UPDATED PREVIOUS_Page ${JSON.parse(sessionStorage.getItem('Nav_Page_Previous'))}`
      )
    //
    //  Update NEW Page
    //
    sessionStorage.setItem('Nav_Page_Current', JSON.stringify(nextPage))
    if (debugLog)
      console.log(`UPDATED CURRENT_PAGE ${JSON.parse(sessionStorage.getItem('Nav_Page_Current'))}`)
    //
    //  Update State
    //
    setCurrentPage(nextPage)
  }
  //.............................................................................
  //  First Time Setup
  //.............................................................................
  const firstTime = () => {
    if (debugLog) console.log(`First Time APP Reset`)
    //------------------------------------------------------
    //  Set Defaults for REMOTE setup
    //------------------------------------------------------
    let port = '9002'
    let w_Client = REMOTE_CLIENT
    let w_Database = REMOTE_DATABASE
    let w_Server = REMOTE_SERVER
    let w_URL = REMOTE_SERVERURL
    //------------------------------------------------------
    //  Override LOCAL if Windows port (from package.json)
    //------------------------------------------------------
    const windowport = window.location.port
    if (windowport) {
      port = windowport
      //------------------------------------------------------
      //  9002 - Local Client --> Remote Server --> Remote Database
      //------------------------------------------------------
      if (port === '9002') {
        w_Client = LOC_REMOTE_REMOTE_CLIENT
        w_Server = REMOTE_SERVER
        w_Database = REMOTE_DATABASE
        w_URL = REMOTE_SERVERURL
      }
      //------------------------------------------------------
      //  9012 - Local Client --> Local Server --> Remote Database
      //------------------------------------------------------
      if (port === '9012') {
        w_Client = LOC_LOC_REMOTE_CLIENT
        w_Server = LOC_LOC_REMOTE_SERVER
        w_Database = REMOTE_DATABASE
        w_URL = LOC_LOC_REMOTE_SERVERURL
      }
      //------------------------------------------------------
      //  8002 - Local Client --> Local Server --> Local Database
      //------------------------------------------------------
      if (port === '8002') {
        w_Client = LOC_LOC_LOC_CLIENT
        w_Server = LOC_LOC_LOC_SERVER
        w_Database = LOC_LOC_LOC_DATABASE
        w_URL = LOC_LOC_LOC_SERVERURL
      }
    }
    //
    //  Store Client, Server, Database, URL
    //
    sessionStorage.setItem('App_Settings_Client', JSON.stringify(w_Client))
    sessionStorage.setItem('App_Settings_Server', JSON.stringify(w_Server))
    sessionStorage.setItem('App_Settings_Database', JSON.stringify(w_Database))
    sessionStorage.setItem('App_Settings_URL', JSON.stringify(w_URL))
    if (debugLog)
      console.log(
        `QuizClient-PORT(${port}) CLIENT(${w_Client}) SERVER(${w_Server}) DATABASE(${w_Database}) URL(${w_URL})`
      )
    //
    //  Session Storage
    //
    sessionStorage.setItem('Nav_Page_Previous', JSON.stringify(''))
  }
  //.............................................................................
  //
  //  First Time Setup
  //
  if (g_firstTimeFlag) {
    g_firstTimeFlag = false
    firstTime()
  }
  //.............................................................................
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Layout handlePage={handlePage}>
          <Control />
        </Layout>
        <CssBaseline />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
