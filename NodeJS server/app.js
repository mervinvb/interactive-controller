const WebSocket = require("ws")
var connected_users = []

//Heroku stuff
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8008;
}

//Starts the webserver
const wss = new WebSocket.Server({ port: port})

var count1 = 0
var count2 = 0
var count3 = 0
var count4 = 0
var count5 = 0
var count6 = 0

var count1_rigged = 0
var count2_rigged = 0
var count3_rigged = 0
var count4_rigged = 0
var count5_rigged = 0
var count6_rigged = 0

var current_question = ''
var index = ''
var beating = false

wss.on("connection", ws => {
  beating = true
  heartbeat()

  //Does stuff when receiving message
  ws.on('message', message => {
    console.log("Receiving from "+ws.id+": "+message)

    //Parses message into JSON object
    var parsed_message = JSON.parse(message)

      console.log(parsed_message)

      switch (parsed_message.type) {
        
        case 'auth':

          console.log("Authenticating user")

          switch (parsed_message.message) {
            case 'client':
              //Sets ID for the connected user
              ws.id = getUniqueID()

              //Adds ID to list of connected users
              connected_users.push(ws.id)

              //Sets state for later use
              ws.state = "Undefined"

              console.log("New client connected with ID ",ws.id)

              ws.send(current_question)

              break;
              
            case 'host':
              index = connected_users.indexOf(ws.id);
              if (index > -1) {
                connected_users.splice(index, 1);
              }
              ws.id = 'host'
              console.log("The host is connected.")
              break;

            case 'controller':
              if (parsed_message.password == "tkp") {

                index = connected_users.indexOf(ws.id);
                if (index > -1) {
                  connected_users.splice(index, 1);
                }
                ws.id = 'controller'

                ws.send(JSON.stringify(
                {
                  "message" : "Confirmed"
                }
                ));

                console.log("The controller is connected.")
                }
              
              else {
                ws.send(JSON.stringify(
                  {
                    "message" : "no."
                  }
                  ));
              }  

              break;
            }

            break;

        case 'question':
          current_question = message
          wss.broadcast(message, 'clients')
          wss.reset_count()
          checkvotes()
          break;
        
        case 'command':
          if (ws.id == "controller") {
            wss.broadcast(message, 'host')
          }
          break;
        
        case 'image':
          current_question = message
          wss.broadcast(message, 'clients')
          break;
        
        case 'response':
          ws.state = parsed_message.message
          console.log("Received vote!")
          checkvotes()
          break;

        case 'rig':

          switch (parsed_message.option) {
            case 1:
              count1_rigged += parsed_message.amount
              break;
            case 2:
              count2_rigged += parsed_message.amount
              break;
            case 3:
              count3_rigged += parsed_message.amount
              break;
            case 4:
              count4_rigged += parsed_message.amount
              break;
            case 5:
              count5_rigged += parsed_message.amount
              break;
            case 6:
              count6_rigged += parsed_message.amount
              break;
          }

          checkvotes()

          break;
              
      }
  })

  ws.on('close', (code, reason) => {
    const index = connected_users.indexOf(ws.id);
    if (index > -1) {
      connected_users.splice(index, 1);
    }
    reason = (reason != "" ? 'reason: '+reason : 'unknown reason')
    console.log(`user ${ws.id} disconnected for ${reason} with code: ${code}`)
  })

})

function checkvotes() {
  console.log("Checking votes!")
  count1 = 0
  count2 = 0
  count3 = 0
  count4 = 0
  count5 = 0
  count6 = 0

  //Loops over all users, and checks their state.
  wss.clients.forEach(function each(client) {
      switch (client.state){
        case 1:
          count1 += 1
          break;
        case 2:
          count2 += 1
          break;
        case 3:
          count3 += 1
          break;
        case 4:
          count4 += 1
          break;
        case 5:
          count5 += 1
          break;
        case 6:
          count6 += 1
          break;
      }
   })

  var to_send = {}
  to_send ["type"] = "count"
  to_send ["count1"] = count1 + count1_rigged
  to_send ["count2"] = count2 + count2_rigged
  to_send ["count3"] = count3 + count3_rigged
  to_send ["count4"] = count4 + count4_rigged
  to_send ["count5"] = count5 + count5_rigged
  to_send ["count6"] = count6 + count6_rigged
  
  wss.broadcast(JSON.stringify(to_send),'host');
  
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

wss.random_sound = function random_sound() {
  //Sends sound button to one client
  const randomElement = connected_users[Math.floor(Math.random() * connected_users.length)];
  wss.clients.forEach(function each(client) {
    if (client.id == randomElement){
      client.send("Show_sound_button")
    }
  })
}

wss.reset_count = function reset_count() {

  count1_rigged = 0
  count2_rigged = 0
  count3_rigged = 0
  count4_rigged = 0
  count5_rigged = 0
  count6_rigged = 0

  wss.clients.forEach(function each(client) {
    if (!(client.id == 'host')){
      client.state = "Undefined"
    }
  })
}

function getUniqueID () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }
  return s4() + s4() + '-' + s4()
}

function heartbeat() {
    if (!(beating)) {
      return;
    }

    if (wss.clients.size == 0){
      console.log("Nobody connected, stopping heartbeat.")
      beating = false
    }

    else{
      console.log("People are connected, sending ping.")
      beating = true

      wss.broadcast(JSON.stringify(
        {
          "type" : "ping",
        }
      ), 'all'
      );

    }

    setTimeout(heartbeat, 15000)
}

heartbeat()