//
//  Libraries
//
import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
//  Pages
//
import HandEntry from './HandEntry'
import BiddingEntry from './BiddingEntry'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
import MyInput from '../../components/controls/MyInput'
import MySelect from '../../components/controls/MySelect'
import { useMyForm, MyForm } from '../../components/useMyForm'
//
//  Components
//
import Popup from '../../components/Popup'
//
//  Form Initial Values
//
const initialFValues = {
  qid: 0,
  qowner: 'None',
  qkey: '',
  qdetail: '',
  qcorrect: '',
  qbad1: '',
  qbad2: '',
  qbad3: '',
  qgroup1: 'None',
  qgroup2: 'None',
  qgroup3: 'None',
  qrefs1: 'None',
  qrefs2: 'None'
}
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'QuestionEntry'

//=====================================================================================
export default function QuestionEntry(props) {
  const { addOrEdit, recordForEdit } = props

  //...................................................................................
  //
  // Validate the fields
  //
  const validate = (fieldValues = values) => {
    if (debugFunStart) console.log('validate')
    if (debugLog) console.log(fieldValues)
    //
    //  Load previous errors
    //
    let errorsUpd = { ...errors }
    //
    //  Validate current field
    //
    if ('qowner' in fieldValues)
      errorsUpd.qowner = fieldValues.qowner === 'None' ? 'This field cannot be None' : ''

    if ('qkey' in fieldValues) errorsUpd.qkey = fieldValues.qkey ? '' : 'This field is required.'

    if ('qdetail' in fieldValues)
      errorsUpd.qdetail = fieldValues.qdetail ? '' : 'This field is required.'

    if ('qcorrect' in fieldValues)
      errorsUpd.qcorrect = fieldValues.qcorrect ? '' : 'This field is required.'

    if ('qbad1' in fieldValues) errorsUpd.qbad1 = fieldValues.qbad1 ? '' : 'This field is required.'

    if ('qgroup1' in fieldValues)
      errorsUpd.qgroup1 = fieldValues.qgroup1 === 'None' ? 'This field cannot be None' : ''
    //
    //  Set the errors
    //
    setErrors({
      ...errorsUpd
    })
    //
    //  Check if every element within the errorsUpd object is blank, then return true (valid), but only on submit when the fieldValues=values
    //
    if (fieldValues === values) {
      return Object.values(errorsUpd).every(x => x === '')
    }
  }
  //...................................................................................
  //
  //  UseMyForm
  //
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = useMyForm(
    initialFValues,
    true,
    validate
  )
  //...................................................................................
  //.  Submit form
  //...................................................................................
  const handleSubmit = e => {
    if (debugFunStart) console.log('handleSubmit')
    e.preventDefault()
    //
    //  Validate & Update
    //
    if (validate()) {
      if (debugLog) console.log('values ', values)
      const { qrefs1, qrefs2, ...UpdateValues } = { ...values }
      if (debugLog) console.log('UpdateValues ', UpdateValues)
      //
      //  Refs are array elements, so need brackets
      //
      const qrefs = `{ ${values.qrefs1}, ${values.qrefs2} }`
      if (debugLog) console.log('qrefs ', qrefs)
      UpdateValues.qrefs = qrefs
      //
      //  Update database
      //
      if (debugLog) console.log('UpdateValues ', UpdateValues)
      addOrEdit(UpdateValues, resetForm)
    }
  }
  //...................................................................................
  //.  Copy Row
  //...................................................................................
  const handleCopy = e => {
    if (debugFunStart) console.log('handleCopy')
    e.preventDefault()
    //
    //  Reset the form in Add mode
    //
    let valuesUpd = { ...values }
    valuesUpd.qid = 0
    setValues({
      ...valuesUpd
    })
  }
  //...................................................................................
  //.  Main Line
  //...................................................................................

  if (debugFunStart) console.log(debugModule)
  //
  //  State
  //
  const [openPopupHand, setOpenPopupHand] = useState(false)
  const [openPopupBidding, setOpenPopupBidding] = useState(false)
  //
  //  Define the Store
  //
  const OptionsOwner = JSON.parse(sessionStorage.getItem('Data_Options_Owner'))
  const OptionsGroup1 = JSON.parse(sessionStorage.getItem('Data_Options_Group1'))
  const OptionsGroup2 = JSON.parse(sessionStorage.getItem('Data_Options_Group2'))
  const OptionsGroup3 = JSON.parse(sessionStorage.getItem('Data_Options_Group3'))
  const OptionsReflinks = JSON.parse(sessionStorage.getItem('Data_Options_Reflinks'))
  //
  //  On change of record, set State
  //
  useEffect(() => {
    if (debugLog) console.log('useEffect')
    if (debugLog) console.log('recordForEdit ', recordForEdit)
    let updrecordForEdit = recordForEdit
    //
    //  Refs are an array which must be split into qrefs1 & qrefs2
    //
    if (recordForEdit) {
      let qrefs1 = 'None'
      let qrefs2 = 'None'
      if (recordForEdit.qrefs[0]) qrefs1 = recordForEdit.qrefs[0]
      if (recordForEdit.qrefs[1]) qrefs2 = recordForEdit.qrefs[1]
      updrecordForEdit.qrefs1 = qrefs1
      updrecordForEdit.qrefs2 = qrefs2
      if (debugLog) console.log('updrecordForEdit ', updrecordForEdit)
      //
      //  Update form values
      //
      if (debugLog) console.log('setValues ', updrecordForEdit)
      setValues({
        ...updrecordForEdit
      })
    }
    // eslint-disable-next-line
  }, [recordForEdit])
  if (debugLog) console.log('recordForEdit ', recordForEdit)
  //
  //  Disable entry of Owner/Key on update, allow for Entry
  //
  let actionUpdate = false
  if (values && values.qid !== 0) actionUpdate = true
  if (debugLog) console.log('values ', values)
  if (debugLog) console.log('actionUpdate input ', actionUpdate)
  //
  //  Button Text
  //
  let submitButtonText
  actionUpdate ? (submitButtonText = 'Update') : (submitButtonText = 'Add')
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <MyForm onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={4}>
            <MySelect
              key={OptionsOwner.id}
              name='qowner'
              label='Owner'
              value={values.qowner}
              onChange={handleInputChange}
              error={errors.qowner}
              disabled={actionUpdate}
              options={OptionsOwner}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={4}>
            <MyInput
              name='qkey'
              label='Key'
              value={values.qkey}
              onChange={handleInputChange}
              error={errors.qkey}
              disabled={actionUpdate}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          {actionUpdate ? (
            <Grid item xs={2}>
              <MyInput name='qid' label='ID' value={values.qid} disabled={true} />
            </Grid>
          ) : null}
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='qdetail'
              label='Question'
              value={values.qdetail}
              onChange={handleInputChange}
              error={errors.qdetail}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='qcorrect'
              label='Correct Answer'
              value={values.qcorrect}
              onChange={handleInputChange}
              error={errors.qcorrect}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='qbad1'
              label='Bad Answer 1'
              value={values.qbad1}
              onChange={handleInputChange}
              error={errors.qbad1}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='qbad2'
              label='Bad Answer 2'
              value={values.qbad2}
              onChange={handleInputChange}
              error={errors.qbad2}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='qbad3'
              label='Bad Answer 3'
              value={values.qbad3}
              onChange={handleInputChange}
              error={errors.qbad3}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <MySelect
              key={OptionsReflinks.id}
              name='qrefs1'
              label='Reference 1'
              value={values.qrefs1}
              onChange={handleInputChange}
              error={errors.qrefs1}
              options={OptionsReflinks}
            />
          </Grid>
          <Grid item xs={6}>
            <MySelect
              key={OptionsReflinks.id}
              name='qrefs2'
              label='Reference 2'
              value={values.qrefs2}
              onChange={handleInputChange}
              error={errors.qrefs2}
              options={OptionsReflinks}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={4}>
            <MySelect
              key={OptionsGroup1.id}
              name='qgroup1'
              label='Group 1'
              value={values.qgroup1}
              onChange={handleInputChange}
              error={errors.qgroup1}
              options={OptionsGroup1}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={4}>
            <MySelect
              key={OptionsGroup2.id}
              name='qgroup2'
              label='Group 2'
              value={values.qgroup2}
              onChange={handleInputChange}
              error={errors.qgroup2}
              options={OptionsGroup2}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={4}>
            <MySelect
              key={OptionsGroup3.id}
              name='qgroup3'
              label='Group 3'
              value={values.qgroup3}
              onChange={handleInputChange}
              error={errors.qgroup3}
              options={OptionsGroup3}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={2}>
            <MyButton type='submit' text={submitButtonText} />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          {actionUpdate ? (
            <Grid item xs={2}>
              <MyButton text='Copy' onClick={handleCopy} />
            </Grid>
          ) : null}
          {/*------------------------------------------------------------------------------ */}
          {actionUpdate ? (
            <Grid item xs={2}>
              <MyButton
                text='Hands'
                onClick={() => {
                  setOpenPopupHand(true)
                }}
              />
            </Grid>
          ) : null}
          {/*------------------------------------------------------------------------------ */}
          {actionUpdate ? (
            <Grid item xs={2}>
              <MyButton
                text='Bidding'
                onClick={() => {
                  setOpenPopupBidding(true)
                }}
              />
            </Grid>
          ) : null}
          {/*------------------------------------------------------------------------------ */}
        </Grid>
      </MyForm>
      {/*------------------------------------------------------------------------------ */}
      <Popup title='Hands Form' openPopup={openPopupHand} setOpenPopup={setOpenPopupHand}>
        <HandEntry hid={values.qid} />
      </Popup>
      {/*------------------------------------------------------------------------------ */}
      <Popup title='Bidding Form' openPopup={openPopupBidding} setOpenPopup={setOpenPopupBidding}>
        <BiddingEntry bid={values.qid} />
      </Popup>
      {/*------------------------------------------------------------------------------ */}
    </>
  )
}
