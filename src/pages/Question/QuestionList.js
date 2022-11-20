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
import QuestionEntry from './QuestionEntry'
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
import rowUpsert from '../../services/rowUpsert'
import rowUpdate from '../../services/rowUpdate'
import rowDelete from '../../services/rowDelete'
import rowSelect from '../../services/rowSelect'
//
//  Options
//
import OptionsOwner from '../../services/OptionsOwner'
import OptionsGroup1 from '../../services/OptionsGroup1'
import OptionsGroup2 from '../../services/OptionsGroup2'
import OptionsGroup3 from '../../services/OptionsGroup3'
import OptionsRefLinks from '../../services/OptionsRefLinks'
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
//  Questions Table
//
const { SQL_ROWS } = require('../../services/constants.js')
//
//  Table Heading
//
const headCells = [
  { id: 'qid', label: 'ID' },
  { id: 'qowner', label: 'Owner' },
  { id: 'qkey', label: 'Key' },
  { id: 'qdetail', label: 'Question' },
  { id: 'qgroup1', label: 'Group 1' },
  { id: 'qgroup2', label: 'Group 2' },
  { id: 'qgroup3', label: 'Group 3' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'qid', title: 'ID' },
  { id: 'qowner', title: 'Owner' },
  { id: 'qkey', title: 'Key' },
  { id: 'qdetail', title: 'Question' },
  { id: 'qgroup1', title: 'Group 1' },
  { id: 'qgroup2', title: 'Group 2' },
  { id: 'qgroup3', title: 'Group 3' }
]
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'QuestionList'

//=====================================================================================
export default function QuestionList() {
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
      sqlTable: 'questions',
      sqlOrderBy: ' order by qid',
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
  const deleteRowData = qid => {
    if (debugFunStart) console.log('deleteRowData')
    //
    //  Populate Props
    //
    const props = {
      sqlTable: 'questions',
      sqlWhere: `qid = ${qid}`
    }
    var myPromiseDelete = MyQueryPromise(rowDelete(props))
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (data) {
      if (debugLog) console.log('myPromiseDelete data ', data)
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
    //  Strip out qid as it will be populated by Insert
    //
    let { qid, ...rowData } = data
    if (debugLog) console.log('Upsert Database rowData ', rowData)
    //
    //  Build Props
    //
    const props = {
      sqlTable: 'questions',
      sqlKeyName: ['qowner', 'qkey'],
      sqlRow: rowData
    }
    //
    //  Process promise
    //
    if (debugLog) console.log('rowUpsert')
    var myPromiseInsert = MyQueryPromise(rowUpsert(props))
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
        const rtn_qid = data[0].qid
        if (debugLog) console.log(`Row (${rtn_qid}) UPSERTED in Database`)
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
    //  Populate Props
    //
    const props = {
      sqlTable: 'questions',
      sqlWhere: `qid = ${data.qid}`,
      sqlRow: data,
      sqlID: 'qid'
    }
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
        //  Get QID
        //
        const rtn_qid = data[0].qid
        if (debugLog) console.log(`Row (${rtn_qid}) UPDATED in Database`)
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
  const [searchType, setSearchType] = useState('qdetail')
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
          case 'qid':
            itemsFilter = items.filter(x => x.qid === parseInt(searchValue))
            break
          case 'qowner':
            itemsFilter = items.filter(x =>
              x.qowner.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'qkey':
            itemsFilter = items.filter(x =>
              x.qkey.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'qdetail':
            itemsFilter = items.filter(x =>
              x.qdetail.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'qgroup1':
            itemsFilter = items.filter(x =>
              x.qgroup1.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'qgroup2':
            itemsFilter = items.filter(x =>
              x.qgroup2.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'qgroup3':
            itemsFilter = items.filter(x =>
              x.qgroup3.toLowerCase().includes(searchValue.toLowerCase())
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
    row.qid === 0 ? insertRowData(row) : updateRowData(row)

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
  const onDelete = qid => {
    if (debugFunStart) console.log('onDelete')
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    deleteRowData(qid)
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
    OptionsOwner()
    OptionsGroup1()
    OptionsGroup2()
    OptionsGroup3()
    OptionsRefLinks()
    OptionsWho()
    //
    //  Load form list
    //
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
        title='Questions'
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
            className={classes.newButton}
            onClick={() => {
              setOpenPopup(true)
              setRecordForEdit(null)
            }}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.qid}>
                <TableCell>{row.qid}</TableCell>
                <TableCell>{row.qowner}</TableCell>
                <TableCell>{row.qkey}</TableCell>
                <TableCell>{row.qdetail}</TableCell>
                <TableCell>{row.qgroup1}</TableCell>
                <TableCell>{row.qgroup2}</TableCell>
                <TableCell>{row.qgroup3}</TableCell>
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
                          onDelete(row.qid)
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
      <Popup title='Question Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <QuestionEntry recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  )
}
