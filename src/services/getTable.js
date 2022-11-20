//
//  Utilities
//
import apiAxios from './apiAxios'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
// Constants
//
const functionName = 'getTable'
const { URL_TABLES } = require('./constants.js')
//..............................................................................
//.  Initialisation
//.............................................................................
//
// Debug Settings
//
const debugLog = debugSettings()
//===================================================================================
async function getTable(props) {
  if (debugLog) console.log('Start getTable')
  if (debugLog) console.log('props ', props)

  //--------------------------------------------------------------------
  //.  fetch data
  //--------------------------------------------------------------------
  const fetchItems = async (sqlClient, sqlTable, sqlAction, sqlWhere, sqlOrderByRaw, sqlString) => {
    try {
      //
      //  Setup actions
      //
      const method = 'post'
      let body
      sqlAction === 'SELECT'
        ? (body = {
            sqlClient: sqlClient,
            sqlTable: sqlTable,
            sqlAction: sqlAction,
            sqlWhere: sqlWhere,
            sqlOrderByRaw: sqlOrderByRaw
          })
        : (body = {
            sqlClient: sqlClient,
            sqlTable: sqlTable,
            sqlAction: sqlAction,
            sqlString: sqlString
          })

      const URL = App_Settings_URL + URL_TABLES
      if (debugLog) console.log('URL ', URL)
      //
      //  SQL database
      //
      const resultData = await apiAxios(method, URL, body)
      if (debugLog) console.log('Axios Data fetched ', resultData)
      //
      // No data
      //
      if (!resultData[0]) {
        throw Error('No data received')
      }
      //
      // Return data
      //
      if (debugLog) console.log('Return Data', resultData)
      return resultData
      //
      // Errors
      //
    } catch (err) {
      console.log(err.message)
    }
  }
  //--------------------------------------------------------------------
  //-  Main Line
  //--------------------------------------------------------------------
  //
  //  Deconstruct props
  //
  const {
    sqlCaller,
    sqlTable,
    sqlAction = 'SELECT',
    sqlWhere = '',
    sqlOrderByRaw = '',
    sqlString = ''
  } = props
  if (debugLog) console.log('sqlCaller ', sqlCaller)
  if (debugLog) console.log('sqlTable ', sqlTable)
  if (debugLog) console.log('sqlAction ', sqlAction)
  if (debugLog) console.log('sqlWhere ', sqlWhere)
  if (debugLog) console.log('sqlOrderByRaw ', sqlOrderByRaw)
  let sqlClient = `${functionName}/${sqlCaller}`
  if (debugLog) console.log('sqlClient ', sqlClient)
  if (debugLog) console.log('sqlString ', sqlString)
  //
  //  Get the URL
  //
  const App_Settings_URL = JSON.parse(sessionStorage.getItem('App_Settings_URL'))
  if (debugLog) console.log('App_Settings_URL ', App_Settings_URL)
  //
  // Fetch the data
  //
  const resultData = fetchItems(sqlClient, sqlTable, sqlAction, sqlWhere, sqlOrderByRaw, sqlString)
  //
  // Return promise
  //
  if (debugLog) console.log('Return Promise', resultData)
  return resultData
}

export default getTable
