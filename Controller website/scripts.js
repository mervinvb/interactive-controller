const ws = new WebSocket("ws://tkp-voorstelling.herokuapp.com/");
//const ws = new WebSocket("ws://192.168.178.12:8008");
var allowed = false
document.getElementById("buttons").style.display = "none";

ws.addEventListener("open", () => {
  console.log("I am connected to the server.");
  document.getElementById('question').textContent = "Voer wachtwoord in!";
});

ws.addEventListener("close", () => {
  console.log("Oh no I timed out!");
  document.getElementById('question').textContent = "Verbinding verbroken! (Herlaad de pagina)";
});

ws.addEventListener("message", message => {
  console.log('received', message.data);

  var parsed_message = JSON.parse(message.data)

  if (parsed_message.message == "Confirmed") {
    allowed = true
    document.getElementById('question').textContent = "Wachtwoord OK!";
    document.getElementById("password_field").style.display = "none";
    document.getElementById("buttons").style.display = "initial";
  }

  if (parsed_message.message == "no.") {
    document.getElementById('question').textContent = "Fout wachtwoord, probeer opnieuw!";
  }

})

function stuur() {
  var to_send = {}
  to_send ["type"] = "auth"
  to_send ["message"] = "controller"
  to_send ["password"] = document.getElementById('text_field').value
  ws.send(JSON.stringify(to_send));
}

function button1() {
  ws.send(JSON.stringify(
    {
      "type" : "command",
      "message" : "forwards"
    }
  ));
}

function button2() {
  ws.send(JSON.stringify(
    {
      "type" : "command",
      "message" : "backwards"
    }
  ));
}

function button3() {
  ws.send(JSON.stringify(
    {
      "type" : "rig",
      "option" : 1,
      "amount" : 1
    }
  ));
}

function button4() {
  ws.send(JSON.stringify(
    {
      "type" : "rig",
      "option" : 2,
      "amount" : 1
    }
  ));
}

function button5() {
  ws.send(JSON.stringify(
    {
      "type" : "rig",
      "option" : 1,
      "amount" : -1
    }
  ));
}

function button6() {
  ws.send(JSON.stringify(
    {
      "type" : "rig",
      "option" : 2,
      "amount" : -1
    }
  ));
}