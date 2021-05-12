const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 8008})

var yes_count = 0
var no_count = 0
var current_question = "Je bent verbonden!"

wss.on("connection", ws => {
  ws.id = getUniqueID()
  ws.state = "Undefined"
  ws.send(current_question)
  console.log("User connected: ", ws.id)

  ws.on('message', message => {
    console.log("Receiving from "+ws.id+": "+message)

    if (message == "I am host"){
      ws.id = 'host'
      console.log("The host connected!")
    }

    else if (message == "Yes") {
      ws.state = "Yes"
      console.log("Set client's state to YES")
    }


    else if (message == "No") {
      ws.state = "No"
      console.log("Set client's state to NO")
    }

    //Starts the vote count
    else if (message == "Count") {
      checkvotes()
    }

    //Sends string to all clients except the host, when no other command is triggered.
    else if (ws.id == 'host'){
      if (!(message == "Count")){
        current_question = message
        wss.broadcast(message, 'clients')
      }
    }

  })

  ws.on('close', (code, reason) => {
    reason = (reason != "" ? 'reason: '+reason : 'unknown reason')
    console.log(`user ${ws.id} disconnected for ${reason} with code: ${code}`)
  })

})

function checkvotes() {
  console.log("Checking votes!")
  yes_count = 0
  no_count = 0

  //Loops over all users, and checks if their state is yes or no.
  wss.clients.forEach(function each(client) {
      if (!(client.id == 'host')){
        if (client.state == 'Yes'){
          yes_count += 1
        }
        if (client.state == 'No'){
          no_count += 1
        }
      }
   })

  wss.broadcast(`Count:,${yes_count},${no_count}`, 'host')
}


wss.broadcast = function broadcast(msg, audience) {
    console.log(msg)

    //Sends messages only to the host
    if (audience == 'host'){
      wss.clients.forEach(function each(client) {
        if (client.id == 'host'){
          console.log("Sending to host:", msg)
          client.send(msg)
        }
     })
    }

    //Sends messages to all connected users that aren't the host
    if (audience == 'clients'){
      console.log("Sending to clients:", msg)
      wss.clients.forEach(function each(client) {
        if (!(client.id == 'host')){
          client.send(msg)
        }
     })
    }

    //Sends messages to every connected user
    if (audience == 'all'){
      console.log("Sending to all:", msg)
      wss.clients.forEach(function each(client) {
        client.send(msg)
     })
    }
 }

function getUniqueID () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }
  return s4() + s4() + '-' + s4()
}