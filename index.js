// OPTIONS \\
// You may modify 
// const SERVER_URL = 'your.server.here.com' // Change this to the link to the server.
const SERVER_URL = 'localhost'
const SERVER_PORT = 3000 // Change this to the port on the server
const verbose = true // Whether you want to see basic logs. Generally, this is a good idea to have on (true).

// DO NOT MODIFY ANYTHING BELOW THIS LINE \\
const ws = require('ws')
const readline = require('node:readline')
const crypto = require('node:crypto')
const { exit } = require('node:process')

function logMessage(...message) {
    if (verbose) {
        console.log(`[INFO] ${message.join('\n')}`)
    }
}
function logWarning(...message) {
    console.log(`[WARN] ${message.join('\n')}`)
}
function logError(...message) {
    console.log(`[ERROR] ${message.join('\n')}`)
}

const rl = new readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const DEVICE_ID = crypto.randomUUID()

const url = new URL(`wss://${SERVER_URL.replace('wss://', '')}:${SERVER_PORT}?device_id=${DEVICE_ID}`)
const socket = new ws.WebSocket(url, {
    rejectUnauthorized: false
})

socket.on('open', () => {
    logMessage('Connection established with server.')
})

socket.on('message', (message) => {
    if (message == 'heartbeat_response')
        return;
    try {
        console.log(message.toString('utf-8'));
        const data = JSON.parse(message.toString('utf-8'));
        if (data.type === 'Hello') {
            setInterval(() => {
                socket.send('heartbeat')
            }, data.heartbeat_interval * Math.random())
        }
        if (data.type === 'output') {
            const value = data.value;
            console.log(`Value: ${value}`);
            rl.write(value);
        }
    }
    catch (e) {
        console.log(message.toString('utf-8'));
    }
})

socket.on('close', (code) => {
    logMessage(`Socket closed with exit code ${code}.`)
    exit(1)
})

rl.on('line', (line) => {
    const value = parseInt(line);
    if (!isNaN(value)) {
        socket.send(JSON.stringify({ type: 'input', value: value }));
        currentInputValue = value
    }
})

