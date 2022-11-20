export default function debugSettings(debug = false) {
  //
  //  Log1 Override ?
  //
  const { DEBUdebugLog_OVERRIDE } = require('./debugConstants.js')
  const { DEBUdebugLog } = require('./debugConstants.js')
  if (DEBUdebugLog_OVERRIDE) return DEBUdebugLog
  //
  // No Override - return incomming parameter (or default of false)
  //
  return debug
}
