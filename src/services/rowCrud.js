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
const functionName = 'rowCrud'
const { URL_TABLES } = require('./constants.js')
//..............................................................................
//.  Initialisation
//.............................................................................
//
// Debug Settings
//
const debugLog = debugSettings()
//--------------------------------------------------------------------
//-  Main Line
//--------------------------------------------------------------------
export default async function rowCrud(props) {
  if (debugLog) console.log('Start rowCrud')
  //
  //  Deconstruct
  //
  const {
    sqlCaller,
    axiosMethod = 'post',
    sqlAction = 'SELECT',
    sqlTable,
    sqlString,
    sqlWhere,
    sqlRow,
    sqlKeyName,
    sqlOrderBy,
    sqlOrderByRaw
  } = props
  if (debugLog) console.log('props: ', props)
  let sqlClient = `${functionName}/${sqlCaller}`
  //
  //  Validate the parameters
  //
  const valid = validateProps()
  let errMessage = ''
  if (!valid) {
    console.log(
      `sqlClient(${sqlClient}) Action(${sqlAction}) Table(${sqlTable}) Error(${errMessage})`
    )
    return []
  }
  //
  // Fetch the data
  //
  const rtnRows = sqlDatabase()
  return rtnRows
  //--------------------------------------------------------------------
  //  Validate the parameters
  //--------------------------------------------------------------------
  function validateProps() {
    //
    // Check values sent
    //
    if (!sqlAction) {
      errMessage = `SqlAction parameter not passed`
      return false
    }
    //
    //  Validate sqlAction type
    //
    if (
      sqlAction !== 'DELETE' &&
      sqlAction !== 'EXIST' &&
      sqlAction !== 'SELECTSQL' &&
      sqlAction !== 'SELECT' &&
      sqlAction !== 'INSERT' &&
      sqlAction !== 'UPDATE' &&
      sqlAction !== 'UPSERT'
    ) {
      errMessage = `SqlAction ${sqlAction}: SqlAction not valid`
      return false
    }
    //
    //  SELECTSQL needs sqlString
    //
    if (sqlAction === 'SELECTSQL' && !sqlString) {
      errMessage = `SqlAction ${sqlAction}: sqlString not passed`
      return false
    }
    //
    //  not SELECTSQL needs table
    //
    if (sqlAction !== 'SELECTSQL' && !sqlTable) {
      errMessage = `SqlAction ${sqlAction}: sqlTable not passed`
      return false
    }
    //
    //  Valid
    //
    return true
  }
  //--------------------------------------------------------------------
  //  Database SQL
  //--------------------------------------------------------------------
  async function sqlDatabase() {
    try {
      //
      //  Body
      //
      const body = {
        sqlClient: sqlClient,
        sqlTable: sqlTable,
        sqlAction: sqlAction,
        sqlString: sqlString,
        sqlWhere: sqlWhere,
        sqlRow: sqlRow,
        sqlKeyName: sqlKeyName,
        sqlOrderBy: sqlOrderBy,
        sqlOrderByRaw: sqlOrderByRaw
      }
      //
      //  URL
      //
      const App_Settings_URL = JSON.parse(sessionStorage.getItem('App_Settings_URL'))
      const URL = App_Settings_URL + URL_TABLES
      //
      //  SQL database
      //
      const rtnObj = await apiAxios(axiosMethod, URL, body)
      //
      //  Data received
      //
      let rtnValue = false
      if (rtnObj?.rtnValue) rtnValue = rtnObj.rtnValue
      if (rtnValue) {
        const rtnRows = rtnObj.rtnRows
        return rtnRows
      }
      //
      //  No data
      //
      console.log(
        `No data received: sqlClient(${sqlClient}) Action(${sqlAction}) Table(${sqlTable}) `
      )
      return []
      //
      // Errors
      //
    } catch (err) {
      console.log(err)
      return []
    }
  }
}
