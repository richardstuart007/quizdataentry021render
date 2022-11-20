//
//  Libraries
//
import { useState, useEffect } from 'react'
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone'
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Box } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterListIcon from '@mui/icons-material/FilterList'
//
//  Pages
//
import UsersEntry from './UsersEntry'
//
//  Controls
//
import MyActionButton from '../../components/controls/MyActionButton'
import MyButton from '../../components/controls/MyButton'
import MyInput from '../../components/controls/MyInput'
import MySelect from '../../components/controls/MySelect'
//
//  Components
//
import Notification from '../../components/Notification'
import ConfirmDialog from '../../components/ConfirmDialog'
import Popup from '../../components/Popup'
import PageHeader from '../../components/PageHeader'
import useMyTable from '../../components/useMyTable'
//
//  Services
//
import MyQueryPromise from '../../services/MyQueryPromise'
import rowUpdate from '../../services/rowUpdate'
import rowDelete from '../../services/rowDelete'
import rowSelect from '../../services/rowSelect'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(1)
  },
  searchInput: {
    minWidth: '300px',
    width: '30%'
  },
  searchInputTypeBox: {
    minWidth: '150px',
    width: '10%',
    margin: `0 0 0 ${theme.spacing(2)}`
  },
  myButton: {
    margin: `0 0 0 ${theme.spacing(4)}`
  },
  newButton: {
    position: 'absolute',
    right: '10px'
  }
}))
//
//  Table
//
const { SQL_ROWS } = require('../../services/constants.js')
//
//  Table Heading
//
const headCells = [
  { id: 'u_email', label: 'Email' },
  { id: 'u_name', label: 'Name' },
  { id: 'u_fedid', label: 'Bridge ID' },
  { id: 'u_fedcountry', label: 'Country' },
  { id: 'u_dftmaxquestions', label: 'Max Questions' },
  { id: 'u_dftowner', label: 'Dft Owner' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'u_email', title: 'Email' },
  { id: 'u_name', title: 'Name' },
  { id: 'u_fedid', title: 'Bridge ID' }
]
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'UsersList'
//=====================================================================================
export default function UsersList() {
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  const getRowAllData = () => {
    if (debugFunStart) console.log('getRowAllData')
    //
    //  Process promise
    //
    const sqlRows = `FETCH FIRST ${SQL_ROWS} ROWS ONLY`
    const props = {
      sqlTable: 'users',
      sqlOrderBy: ' order by u_email',
      sqlRows: sqlRows
    }
    var myPromiseGet = MyQueryPromise(rowSelect(props))
    //
    //  Resolve Status
    //
    myPromiseGet.then(function (data) {
      if (debugLog) console.log('myPromiseGet data ', data)
      //
      //  Update Table
      //
      setRecords(data)
      //
      //  Filter
      //
      handleSearch()
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
  //.............................................................................
  //.  DELETE
  //.............................................................................
  const deleteRowData = email => {
    if (debugFunStart) console.log('deleteRowData')
    //
    //  Delete users and related files
    //
    deleteUsers(email)
    deleteUserspwd(email)
    deleteUsershistory(email)
    //
    //  Refresh
    //
    getRowAllData()
  }
  //.............................................................................
  //.  DELETE - User
  //.............................................................................
  const deleteUsers = email => {
    if (debugFunStart) console.log('deleteUsers')
    //
    //  Populate Props
    //
    const props = {
      sqlTable: 'users',
      sqlWhere: `u_email = '${email}'`
    }
    var myPromiseDelete = MyQueryPromise(rowDelete(props))
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (data) {
      if (debugLog) console.log('myPromiseDelete data ', data)
      return
    })
    return myPromiseDelete
  }
  //.............................................................................
  //.  DELETE - Userpwd
  //.............................................................................
  const deleteUserspwd = email => {
    if (debugFunStart) console.log('deleteUsers')
    //
    //  Populate Props
    //
    const props = {
      sqlTable: 'userspwd',
      sqlWhere: `upemail = '${email}'`
    }
    var myPromiseDelete = MyQueryPromise(rowDelete(props))
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (data) {
      if (debugLog) console.log('myPromiseDelete data ', data)
      return
    })
    return myPromiseDelete
  }
  //.............................................................................
  //.  DELETE - Userpwd
  //.............................................................................
  const deleteUsershistory = email => {
    if (debugFunStart) console.log('deleteUsers')
    //
    //  Populate Props
    //
    const props = {
      sqlTable: 'userspwd',
      sqlWhere: `r_email = '${email}'`
    }
    var myPromiseDelete = MyQueryPromise(rowDelete(props))
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (data) {
      if (debugLog) console.log('myPromiseDelete data ', data)
      return
    })
    return myPromiseDelete
  }
  //.............................................................................
  //.  UPDATE
  //.............................................................................
  const updateRowData = data => {
    if (debugFunStart) console.log('updateRowData')
    //
    //  Data Received
    //
    if (debugLog) console.log('updateRowData Row ', data)
    //
    //  Populate Props
    //
    const props = {
      sqlTable: 'users',
      sqlWhere: `u_email = '${data.u_email}'`,
      sqlRow: data
    }
    if (debugLog) console.log('sqlWhere', props.sqlWhere)
    if (debugLog) console.log('sqlRow', props.sqlRow)
    //
    //  Process promise
    //
    var myPromiseUpdate = MyQueryPromise(rowUpdate(props))
    //
    //  Resolve Status
    //
    myPromiseUpdate.then(function (data) {
      if (debugLog) console.log('myPromiseUpdate data ', data)
      //
      //  No data
      //
      if (!data) {
        console.log('No Data returned')
        throw Error
      } else {
        //
        //  Get u_email
        //
        const rtn_u_email = data[0].u_email
        if (debugLog) console.log(`Row (${rtn_u_email}) UPDATED in Database`)
      }
      //
      //  Update State - refetch data
      //
      getRowAllData()
      //
      //  Return
      //

      return
    })
    //
    //  Return Promise
    //

    return myPromiseUpdate
  }
  //.............................................................................
  //
  //  Styles
  //
  const classes = useStyles()
  //
  //  State
  //
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [records, setRecords] = useState([])
  const [filterFn, setFilterFn] = useState({
    fn: items => {
      return items
    }
  })
  const [openPopup, setOpenPopup] = useState(false)
  const [searchType, setSearchType] = useState('u_email')
  const [searchValue, setSearchValue] = useState('')
  //
  //  Notification
  //
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    severity: 'info'
  })
  //
  //  Confirm Delete dialog box
  //
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: ''
  })
  //.............................................................................
  //
  //  Search/Filter
  //
  const handleSearch = () => {
    if (debugFunStart) console.log('handleSearch')
    setFilterFn({
      fn: items => {
        //
        //  Nothing to search, return rows
        //
        if (searchValue === '') {
          return items
        }
        //
        //  Filter
        //
        let itemsFilter = items
        switch (searchType) {
          case 'u_email':
            itemsFilter = items.filter(x =>
              x.u_email.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'u_name':
            itemsFilter = items.filter(x =>
              x.u_name.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'u_fedid':
            itemsFilter = items.filter(x =>
              x.u_fedid.toLowerCase().includes(searchValue.toLowerCase())
            )
            break

          default:
        }
        if (debugLog) console.log('itemsFilter ', itemsFilter)

        return itemsFilter
      }
    })
  }
  //.............................................................................
  //
  //  Update Database
  //
  const addOrEdit = (row, resetForm) => {
    if (debugFunStart) console.log('addOrEdit')
    updateRowData(row)

    setNotify({
      isOpen: true,
      message: 'Submitted Successfully',
      severity: 'success'
    })
  }
  //.............................................................................
  //
  //  Data Entry Popup
  //
  const openInPopup = row => {
    if (debugFunStart) console.log('openInPopup')
    setRecordForEdit(row)
    setOpenPopup(true)
  }
  //.............................................................................
  //
  //  Delete Row
  //
  const onDelete = u_email => {
    if (debugFunStart) console.log('onDelete')
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    deleteRowData(u_email)
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      severity: 'error'
    })
  }

  //...................................................................................
  //.  Main Line
  //...................................................................................

  if (debugFunStart) console.log(debugModule)
  //
  //  Initial Data Load
  //
  useEffect(() => {
    getRowAllData()
    // eslint-disable-next-line
  }, [])
  //.............................................................................
  //
  //  Populate the Table
  //
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useMyTable(
    records,
    headCells,
    filterFn
  )
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <PageHeader
        title='Users'
        subTitle='Data Entry and Maintenance'
        icon={<PeopleOutlineTwoToneIcon fontSize='large' />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <MyInput
            label='Search'
            name='Search'
            value={searchValue}
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            onChange={e => setSearchValue(e.target.value)}
          />

          <Box className={classes.searchInputTypeBox}>
            <MySelect
              fullWidth={true}
              name='SearchType'
              label='Column Heading'
              value={searchType}
              onChange={e => setSearchType(e.target.value)}
              options={searchTypeOptions}
            />
          </Box>

          <MyButton
            text='Filter'
            variant='outlined'
            startIcon={<FilterListIcon />}
            onClick={handleSearch}
            className={classes.myButton}
          />
          <MyButton
            text='Refresh'
            variant='outlined'
            startIcon={<RefreshIcon />}
            onClick={getRowAllData}
            className={classes.myButton}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.u_email}>
                <TableCell>{row.u_email}</TableCell>
                <TableCell>{row.u_name}</TableCell>
                <TableCell>{row.u_fedid}</TableCell>
                <TableCell>{row.u_fedcountry}</TableCell>
                <TableCell>{row.u_dftmaxquestions}</TableCell>
                <TableCell>{row.u_dftowner}</TableCell>
                <TableCell>
                  <MyActionButton
                    startIcon={<EditOutlinedIcon fontSize='small' />}
                    color='primary'
                    onClick={() => {
                      openInPopup(row)
                    }}
                  ></MyActionButton>
                  <MyActionButton
                    startIcon={<CloseIcon fontSize='small' />}
                    color='secondary'
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Are you sure to delete this record?',
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(row.u_email)
                        }
                      })
                    }}
                  ></MyActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup title='Users Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <UsersEntry recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  )
}
