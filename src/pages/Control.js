//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
//  Sub Components
//
import QuestionList from './Question/QuestionList'
import OwnerList from './Owner/OwnerList'
import WhoList from './Who/WhoList'
import UsersList from './Users/UsersList'
import ReflinksList from './Reflinks/ReflinksList'
import Group1List from './Group1/Group1List'
import Group2List from './Group2/Group2List'
import Group3List from './Group3/Group3List'
//
// Debug Settings
//
const debugLog = debugSettings()
//
//  Global
//
let g_Page
//===================================================================================
function Control() {
  if (debugLog) console.log('Start Control')
  //.............................................................................
  //  Main Line
  //.............................................................................
  //
  //  Store
  //
  g_Page = JSON.parse(sessionStorage.getItem('Nav_Page_Current'))
  //
  //  Present the selected component
  //
  switch (g_Page) {
    case 'QuestionList':
      return <QuestionList />
    case 'OwnerList':
      return <OwnerList />
    case 'ReflinksList':
      return <ReflinksList />
    case 'WhoList':
      return <WhoList />
    case 'UsersList':
      return <UsersList />
    case 'Group1List':
      return <Group1List />
    case 'Group2List':
      return <Group2List />
    case 'Group3List':
      return <Group3List />
    default:
      return <QuestionList />
  }
}

export default Control
