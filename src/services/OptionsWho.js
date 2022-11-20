//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
//  Services
//
import MyQueryPromise from './MyQueryPromise'
import rowSelect from './rowSelect'
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'OptionsWho'

//===================================================================================
const OptionsWho = () => {
  //...................................................................................
  //.  Load Options
  //...................................................................................
  const LoadOptions = data => {
    if (debugFunStart) console.log('LoadOptions ')
    if (debugLog) console.log('Data ', data)
    //
    //  Options
    //
    let Options = []
    data.forEach(item => {
      const itemObj = {
        id: item.wwho,
        title: item.wtitle
      }
      Options.push(itemObj)
    })
    //
    //  Store
    //
    sessionStorage.setItem('Data_Options_Who', JSON.stringify(Options))
    if (debugLog) console.log('Data_Options_Who ', Options)
  }
  //.............................................................................
  //.  GET Data
  //.............................................................................
  const getRowAll = () => {
    if (debugFunStart) console.log('getRowAll')
    //
    //  Process promise
    //
    const props = {
      sqlTable: 'who'
    }

    var myPromiseGet = MyQueryPromise(rowSelect(props))
    //
    //  Resolve Status
    //
    myPromiseGet.then(function (data) {
      if (debugFunStart) console.log('myPromiseGet')
      if (debugLog) console.log('myPromiseGet Final fulfilled')
      if (debugLog) console.log('data ', data)
      //
      //  Load Options from Data
      //
      if (data[0]) {
        LoadOptions(data)
      }
      //
      //  Return
      //

      return
    })
    //
    //  Return Promise
    //

    return myPromiseGet
  }
  //...................................................................................
  //.  Main Line
  //...................................................................................

  if (debugFunStart) console.log(debugModule)
  //
  //  SQL server
  //
  getRowAll()
}
export default OptionsWho
