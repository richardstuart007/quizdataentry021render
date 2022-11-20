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
const debugModule = 'OptionsGroup2'

//===================================================================================
const OptionsGroup2 = () => {
  //...................................................................................
  //.  Load Options
  //...................................................................................
  const LoadOptions = data => {
    if (debugFunStart) console.log('LoadOptions ')
    if (debugLog) console.log('Data ', data)
    //
    //  Options
    //
    let Options = [
      {
        id: 'None',
        title: 'None'
      }
    ]

    data.forEach(item => {
      const itemObj = {
        id: item.g2id,
        title: item.g2title
      }
      Options.push(itemObj)
    })
    //
    //  Store
    //
    sessionStorage.setItem('Data_Options_Group2', JSON.stringify(Options))
    if (debugLog) console.log('Data_Options_Group2 ', Options)
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
      sqlTable: 'group2'
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
export default OptionsGroup2
