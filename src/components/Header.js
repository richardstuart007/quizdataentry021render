//
//  Libraries
//
import { Typography, AppBar, Toolbar, Avatar, Grid } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'green'
  },
  title: {
    marginLeft: theme.spacing(2)
  },
  avatar: {
    marginLeft: theme.spacing(2)
  }
}))
//
// Debug Settings
//
const debugLog = debugSettings()
//=====================================================================================
export default function Header() {
  if (debugLog) console.log('Start Header')

  const classes = useStyles()

  return (
    <AppBar position='static' className={classes.root}>
      <Toolbar>
        <Grid container alignItems='center'>
          <Grid item>
            <Avatar className={classes.avatar} src='./cards.svg' />
          </Grid>
          <Grid item>
            <Typography className={classes.title}> MAINTENANCE</Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}
