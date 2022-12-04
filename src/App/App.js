//
// Libraries
//
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
//
//  Options
//
import createOptions from '../utilities/createOptions'
import OptionsGroup1Owner from '../services/options/OptionsGroup1Owner'
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
//------------------------------------------------------------------------
//  Remote - Production
//------------------------------------------------------------------------
//
//  Remote Client --> Remote Server 1 --> Remote Database 1
//
const { REM_CLIENT1 } = require('../services/constants.js')
const { REM_SERVER1 } = require('../services/constants.js')
const { REM_DATABASE1 } = require('../services/constants.js')
const { REM_SERVERURL1 } = require('../services/constants.js')
//
//  Remote Client --> Remote Server 2 --> Remote Database 2
//
const { REM_CLIENT2 } = require('../services/constants.js')
const { REM_SERVER2 } = require('../services/constants.js')
const { REM_DATABASE2 } = require('../services/constants.js')
const { REM_SERVERURL2 } = require('../services/constants.js')
//------------------------------------------------------------------------
//  Local
//------------------------------------------------------------------------
//
//  Local Client --> Local Server --> Local Database 6
//
const { LOC_LOC_LOC_CLIENT6 } = require('../services/constants.js')
const { LOC_LOC_LOC_SERVER6 } = require('../services/constants.js')
const { LOC_LOC_LOC_DATABASE6 } = require('../services/constants.js')
const { LOC_LOC_LOC_SERVERURL6 } = require('../services/constants.js')
//
//  Local Client --> Local Server --> Local Database 7
//
const { LOC_LOC_LOC_CLIENT7 } = require('../services/constants.js')
const { LOC_LOC_LOC_SERVER7 } = require('../services/constants.js')
const { LOC_LOC_LOC_DATABASE7 } = require('../services/constants.js')
const { LOC_LOC_LOC_SERVERURL7 } = require('../services/constants.js')
//
//  Local Client --> Local Server 1 --> Remote Database 1
//
const { LOC_LOC_REM_CLIENT1 } = require('../services/constants.js')
const { LOC_LOC_REM_SERVER1 } = require('../services/constants.js')
const { LOC_LOC_REM_SERVERURL1 } = require('../services/constants.js')
//
//  Local Client --> Local Server 2 --> Remote Database 2
//
const { LOC_LOC_REM_CLIENT2 } = require('../services/constants.js')
const { LOC_LOC_REM_SERVER2 } = require('../services/constants.js')
const { LOC_LOC_REM_SERVERURL2 } = require('../services/constants.js')
//
// Debug Settings
//
const debugLog = debugSettings()
//
// Global
//
let g_firstTimeFlag = true
//
//  Set Defaults for REMOTE setup
//
let w_port = '12011'
let w_Client = REM_CLIENT1
let w_Database = REM_DATABASE1
let w_Server = REM_SERVER1
let w_URL = REM_SERVERURL1
//----------------------------------------------------------------------------
//- Main Line
//----------------------------------------------------------------------------
export default function App() {
  if (debugLog) console.log(`Start APP`)
  const [currentPage, setCurrentPage] = useState('QuestionList')
  //
  //  Screen Width
  //
  const ScreenMedium = useMediaQuery(theme.breakpoints.up('sm'))
  const ScreenSmall = !ScreenMedium
  sessionStorage.setItem('App_Settings_ScreenSmall', ScreenSmall)
  //
  //  First Time Setup
  //
  if (g_firstTimeFlag) {
    g_firstTimeFlag = false
    firstTime()
  }
  //.............................................................................
  //  First Time Setup
  //.............................................................................
  function firstTime() {
    if (debugLog) console.log(`First Time APP Reset`)
    //
    //  Override LOCAL if Windows port (from package.json)
    //
    const windowport = window.location.port
    if (windowport) {
      w_port = windowport
      localport(w_port)
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
        `QuizClient-PORT(${w_port}) CLIENT(${w_Client}) SERVER(${w_Server}) DATABASE(${w_Database}) URL(${w_URL})`
      )
    //
    //  Session Storage
    //
    sessionStorage.setItem('Nav_Page_Previous', JSON.stringify(''))

    //
    //  Initial Data Load
    //
    sessionStorage.setItem('Data_Options_ALL_Received', false)
    const Promise_Owner = createOptions({
      cop_sqlTable: 'owner',
      cop_id: 'oowner',
      cop_title: 'otitle',
      cop_store: 'Data_Options_Owner',
      cop_received: 'Data_Options_Owner_Received'
    })
    const Promise_Group1Owner = OptionsGroup1Owner()
    const Promise_Group1 = createOptions({
      cop_sqlTable: 'group1',
      cop_id: 'g1id',
      cop_title: 'g1title',
      cop_store: 'Data_Options_Group1',
      cop_received: 'Data_Options_Group1_Received'
    })
    const Promise_Group2 = createOptions({
      cop_sqlTable: 'group2',
      cop_id: 'g2id',
      cop_title: 'g2title',
      cop_store: 'Data_Options_Group2',
      cop_received: 'Data_Options_Group2_Received'
    })
    const Promise_Group3 = createOptions({
      cop_sqlTable: 'group3',
      cop_id: 'g3id',
      cop_title: 'g3title',
      cop_store: 'Data_Options_Group3',
      cop_received: 'Data_Options_Group3_Received'
    })
    const Promise_Reflinks = createOptions({
      cop_sqlTable: 'reflinks',
      cop_id: 'rref',
      cop_title: 'rdesc',
      cop_store: 'Data_Options_Reflinks',
      cop_received: 'Data_Options_Reflinks_Received'
    })
    const Promise_Who = createOptions({
      cop_sqlTable: 'who',
      cop_id: 'wwho',
      cop_title: 'wtitle',
      cop_store: 'Data_Options_Who',
      cop_received: 'Data_Options_Who_Received'
    })
    //
    //   Wait for all promises
    //
    Promise.all([
      Promise_Owner,
      Promise_Group1Owner,
      Promise_Group1,
      Promise_Group2,
      Promise_Group3,
      Promise_Reflinks,
      Promise_Who
    ]).then(values => {
      if (debugLog) console.log(`Promise values ALL`, values)
      sessionStorage.setItem('Data_Options_ALL_Received', true)
    })
  }
  //.............................................................................
  //.  Local Port Overridden - Update Constants
  //.............................................................................
  function localport(w_port) {
    switch (w_port) {
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 1 --> Remote Database 1
      //------------------------------------------------------
      case '12011':
        w_Client = REM_CLIENT1
        w_Server = REM_SERVER1
        w_Database = REM_DATABASE1
        w_URL = REM_SERVERURL1
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '12022':
        w_Client = REM_CLIENT2
        w_Server = REM_SERVER2
        w_Database = REM_DATABASE2
        w_URL = REM_SERVERURL2
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 1 --> Remote Database 1
      //------------------------------------------------------
      case '12101':
        w_Client = LOC_LOC_REM_CLIENT1
        w_Server = LOC_LOC_REM_SERVER1
        w_Database = REM_DATABASE1
        w_URL = LOC_LOC_REM_SERVERURL1
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '12202':
        w_Client = LOC_LOC_REM_CLIENT2
        w_Server = LOC_LOC_REM_SERVER2
        w_Database = REM_DATABASE2
        w_URL = LOC_LOC_REM_SERVERURL2
        break
      //------------------------------------------------------
      //  Local Client --> Local Server --> Local Database 6
      //------------------------------------------------------
      case '12606':
        w_Client = LOC_LOC_LOC_CLIENT6
        w_Server = LOC_LOC_LOC_SERVER6
        w_Database = LOC_LOC_LOC_DATABASE6
        w_URL = LOC_LOC_LOC_SERVERURL6
        break
      //------------------------------------------------------
      //  Local Client --> Local Server --> Local Database 7
      //------------------------------------------------------
      case '12707':
        w_Client = LOC_LOC_LOC_CLIENT7
        w_Server = LOC_LOC_LOC_SERVER7
        w_Database = LOC_LOC_LOC_DATABASE7
        w_URL = LOC_LOC_LOC_SERVERURL7
        break
      //------------------------------------------------------
      //  Error
      //------------------------------------------------------
      default:
        w_Client = 'Error'
        w_Database = 'Error'
        w_Server = 'Error'
        w_URL = 'Error'
        break
    }
  }
  //.............................................................................
  //.  Handle Page Change
  //.............................................................................
  function handlePage(nextPage) {
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
