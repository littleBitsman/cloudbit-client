// OPTIONS \\
// You may modify this.
const SERVER_URL = 'wss://your.server.here.com' // Change this to the link to the server. 
//                                                 Make sure it starts with 'wss://' 
const SERVER_PORT = 3000 // Change this to the port on the server

// DO NOT MODIFY ANYTHING BELOW THIS LINE \\
const ws = require('ws')
const readline = require('readline')
const crypto = require('crypto')

