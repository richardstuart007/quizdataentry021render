//
//  Libraries
//
import { useState, useEffect } from 'react'
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone'
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Box } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterListIcon from '@mui/icons-material/FilterList'
//
//  Pages
//
import WhoEntry from './WhoEntry'
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

import rowCrud from '../../services/rowCrud'
//
//  Options
//
import OptionsWho from '../../services/OptionsWho'
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
//  Whos Table
//
const { SQL_ROWS } = require('../../services/constants.js')
const sqlTable = 'who'
//
//  Table Heading
//
const headCells = [
  { id: 'wwho', label: 'Who' },
  { id: 'wtitle', label: 'Title' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'wwho', title: 'Who' },
  { id: 'wtitle', title: 'Title' }
]
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'WhoList'
//=====================================================================================
export default function WhoList() {
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  const getRowAllData = () => {
    if (debugFunStart) console.log('getRowAllData')
    //
    //  Process promise
    //
    let sqlString = `* from ${sqlTable} order by wwho FETCH FIRST ${SQL_ROWS} ROWS ONLY`
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'SELECTSQL',
      sqlString: sqlString
    }
    const myPromiseGet = rowCrud(rowCrudparams)
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
  const deleteRowData = wwho => {
    if (debugFunStart) console.log('deleteRowData')
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'delete',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'DELETE',
      sqlWhere: `wwho = '${wwho}'`
    }
    const myPromiseDelete = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (data) {
      if (debugLog) console.log('myPromiseDelete data ', data)
      //
      //  Update State - refetch data
      //
      getRowAllData()
      OptionsWho()
      //
      //  Return
      //

      return
    })
    //
    //  Return Promise
    //

    return myPromiseDelete
  }
  //.............................................................................
  //.  INSERT
  //.............................................................................
  const insertRowData = data => {
    if (debugFunStart) console.log('insertRowData')
    //
    //  Data Received
    //
    if (debugLog) console.log('insertRowData data ', data)
    //
    //  Strip out wwho as it will be populated by Insert
    //
    let { ...rowData } = data
    if (debugLog) console.log('Upsert Database rowData ', rowData)
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'UPSERT',
      sqlKeyName: ['wwho'],
      sqlRow: rowData
    }
    const myPromiseInsert = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseInsert.then(function (data) {
      if (debugLog) console.log('myPromiseInsert data ', data)
      //
      //  No data returned
      //
      if (!data) {
        console.log('No Data returned')
        throw Error
      } else {
        //
        //  Get ID
        //
        const rtn_wwho = data[0].wwho
        if (debugLog) console.log(`Row (${rtn_wwho}) UPSERTED in Database`)
        //
        //  Update record for edit with returned data
        //
        setRecordForEdit(data[0])
        if (debugLog) console.log(`recordForEdit `, recordForEdit)
      }
      //
      //  Update State - refetch data
      //
      getRowAllData()
      OptionsWho()
      //
      //  Return
      //

      return
    })
    //
    //  Return Promise
    //

    return myPromiseInsert
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
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'UPDATE',
      sqlWhere: `wwho = '${data.wwho}'`,
      sqlRow: data
    }
    const myPromiseUpdate = rowCrud(rowCrudparams)
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
        //  Get wwho
        //
        const rtn_wwho = data[0].wwho
        if (debugLog) console.log(`Row (${rtn_wwho}) UPDATED in Database`)
      }
      //
      //  Update State - refetch data
      //
      getRowAllData()
      OptionsWho()
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
  const [searchType, setSearchType] = useState('wwho')
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
          case 'wwho':
            itemsFilter = items.filter(x => x.wwho === parseInt(searchValue))
            break
          case 'wtitle':
            itemsFilter = items.filter(x =>
              x.wtitle.toLowerCase().includes(searchValue.toLowerCase())
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
    recordForEdit === null ? insertRowData(row) : updateRowData(row)

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
  const onDelete = wwho => {
    if (debugFunStart) console.log('onDelete')
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    deleteRowData(wwho)
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
        title='Whos'
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

          <MyButton
            text='Add New'
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenPopup(true)
              setRecordForEdit(null)
            }}
            className={classes.newButton}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.wwho}>
                <TableCell>{row.wwho}</TableCell>
                <TableCell>{row.wtitle}</TableCell>

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
                          onDelete(row.wwho)
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
      <Popup title='Who Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <WhoEntry recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  )
}
