const ws = new WebSocket("ws://tkp-voorstelling.herokuapp.com/");
//const ws = new WebSocket("ws://192.168.178.12:8008");

document.getElementById("button1_div").style.display = "none";
document.getElementById("button2_div").style.display = "none";
document.getElementById("button3_div").style.display = "none";
document.getElementById("button4_div").style.display = "none";
document.getElementById("button5_div").style.display = "none";
document.getElementById("button6_div").style.display = "none";
document.getElementById("imgbox").style.display = "none";

ws.addEventListener("open", () => {
  console.log("I am connected to the server.");
  ws.send(JSON.stringify(
    {
      "type" : "auth",
      "message" : "client"
    }
  ));
  document.body.style.backgroundColor = "#dbe2ef";
  document.getElementById('question').textContent = "Je bent verbonden!";
});

ws.addEventListener("close", () => {
  console.log("Oh no I timed out!");
  document.body.style.backgroundColor = "red";

  document.getElementById("imgbox").style.display = "none";
  document.getElementById("question").style.display = "initial";
  document.getElementById("button1_div").style.display = "none";
  document.getElementById("button2_div").style.display = "none";
  document.getElementById("button3_div").style.display = "none";
  document.getElementById("button4_div").style.display = "none";
  document.getElementById("button5_div").style.display = "none";
  document.getElementById("button6_div").style.display = "none";
  
  document.getElementById('question').textContent = "Verbinding mislukt! (Herlaad de pagina)";
});

ws.addEventListener("message", message => {
  console.log('received', message.data);

  var parsed_message = JSON.parse(message.data)

  switch (parsed_message.type){

    case "ping":
      break;

    case "question":
      document.getElementById("question").style.display = "initial";
      document.getElementById("imgbox").style.display = "none";
      document.getElementById('question').textContent = parsed_message.question;

      show_buttons(parsed_message.button_amount) 
      change_buttons(parsed_message.button1_text, parsed_message.button2_text, parsed_message.button3_text, parsed_message.button4_text, parsed_message.button5_text, parsed_message.button6_text)

      break;

    case "image":
      show_buttons(0) 
      document.getElementById("question").style.display = "none";
      document.getElementById("image").src = parsed_message.message
      document.getElementById("imgbox").style.display = "initial";

    case "soundboard":
      break;
  }

})

function change_buttons(text1, text2, text3, text4, text5, text6){
  document.getElementById("button1").textContent = text1;
  document.getElementById("button2").textContent = text2;
  document.getElementById("button3").textContent = text3;
  document.getElementById("button4").textContent = text4;
  document.getElementById("button5").textContent = text5;
  document.getElementById("button6").textContent = text6;
}

function show_buttons(button_amount) {
  switch (button_amount) {
    case 0:
      document.getElementById("button1_div").style.display = "none";
      document.getElementById("button2_div").style.display = "none";
      document.getElementById("button3_div").style.display = "none";
      document.getElementById("button4_div").style.display = "none";
      document.getElementById("button5_div").style.display = "none";
      document.getElementById("button6_div").style.display = "none";
      break;
    case 1:
      document.getElementById("button1_div").style.display = "initial";
      document.getElementById("button2_div").style.display = "none";
      document.getElementById("button3_div").style.display = "none";
      document.getElementById("button4_div").style.display = "none";
      document.getElementById("button5_div").style.display = "none";
      document.getElementById("button6_div").style.display = "none";
      break;
    case 2:
      document.getElementById("button1_div").style.display = "initial";
      document.getElementById("button2_div").style.display = "initial";
      document.getElementById("button3_div").style.display = "none";
      document.getElementById("button4_div").style.display = "none";
      document.getElementById("button5_div").style.display = "none";
      document.getElementById("button6_div").style.display = "none";
      break;
    case 3:
      document.getElementById("button1_div").style.display = "initial";
      document.getElementById("button2_div").style.display = "initial";
      document.getElementById("button3_div").style.display = "initial";
      document.getElementById("button4_div").style.display = "none";
      document.getElementById("button5_div").style.display = "none";
      document.getElementById("button6_div").style.display = "none";
      break;
    case 4:
      document.getElementById("button1_div").style.display = "initial";
      document.getElementById("button2_div").style.display = "initial";
      document.getElementById("button3_div").style.display = "initial";
      document.getElementById("button4_div").style.display = "initial";
      document.getElementById("button5_div").style.display = "none";
      document.getElementById("button6_div").style.display = "none";
      break;
    case 5:
      document.getElementById("button1_div").style.display = "initial";
      document.getElementById("button2_div").style.display = "initial";
      document.getElementById("button3_div").style.display = "initial";
      document.getElementById("button4_div").style.display = "initial";
      document.getElementById("button5_div").style.display = "initial";
      document.getElementById("button6_div").style.display = "none";
      break;
    case 6:
      document.getElementById("button1_div").style.display = "initial";
      document.getElementById("button2_div").style.display = "initial";
      document.getElementById("button3_div").style.display = "initial";
      document.getElementById("button4_div").style.display = "initial";
      document.getElementById("button5_div").style.display = "initial";
      document.getElementById("button6_div").style.display = "initial";
     


  }
}


function button1() {
  ws.send(JSON.stringify(
    {
      "type" : "response",
      "message" : 1
    }
  ));
}

function button2() {
  ws.send(JSON.stringify(
    {
      "type" : "response",
      "message" : 2
    }
  ));
}

function button3() {
  ws.send(JSON.stringify(
    {
      "type" : "response",
      "message" : 3
    }
  ));
}

function button4() {
  ws.send(JSON.stringify(
    {
      "type" : "response",
      "message" : 4
    }
  ));
}

function button5() {
  ws.send(JSON.stringify(
    {
      "type" : "response",
      "message" : 5
    }
  ));
}

function button6() {
  ws.send(JSON.stringify(
    {
      "type" : "response",
      "message" : 6
    }
  ));
}