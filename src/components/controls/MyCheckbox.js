//
//  Libraries
//
import { FormControl, FormControlLabel, Checkbox } from '@mui/material'
//=====================================================================================
export default function MyCheckbox(props) {
  const { name, label, value, onChange, ...other } = props
  //
  //  Convert the parameters to name, value parameters needed for onChange function
  //
  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value
    }
  })

  return (
    <FormControl>
      <FormControlLabel
        control={
          <Checkbox
            name={name}
            color='primary'
            checked={value}
            {...other}
            onChange={e => onChange(convertToDefEventPara(name, e.target.checked))}
          />
        }
        label={label}
      />
    </FormControl>
  )
}
