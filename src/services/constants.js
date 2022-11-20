//
//  Browser Port (9002) ==> Server REMOTE server
//
exports.REMOTE_CLIENT = 'REMOTE:9002'
exports.REMOTE_SERVER = 'REMOTE:Railway/9001'
exports.REMOTE_DATABASE = 'REMOTE:Railway/21'
exports.REMOTE_SERVERURL = 'https://quizserver021-production.up.railway.app'
//
//  9002 - Local Client --> Remote Server --> Remote Database
//
exports.LOC_REMOTE_REMOTE_CLIENT = 'LOCAL:9002'
//
//  9012 - Local Client --> Local Server --> Remote Database
//
exports.LOC_LOC_REMOTE_CLIENT = 'LOCAL:9012'
exports.LOC_LOC_REMOTE_SERVER = 'LOCAL:9001/21'
exports.LOC_LOC_REMOTE_SERVERURL = 'http://localhost:9001'
//
//  8002 - Local Client --> Local Server --> Local Database
//
exports.LOC_LOC_LOC_CLIENT = 'LOCAL:8002'
exports.LOC_LOC_LOC_SERVER = 'LOCAL:8001'
exports.LOC_LOC_LOC_DATABASE = 'LOCAL/21'
exports.LOC_LOC_LOC_SERVERURL = 'http://localhost:8001'
//
//  Tables
//
exports.URL_TABLES = '/QuizTables'
//
//  Other Parameters
//
exports.SQL_ROWS = 2000
exports.VALIDATE_ON_CHANGE = false
