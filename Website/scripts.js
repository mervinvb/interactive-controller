const ws = new WebSocket("ws://localhost:8008/");

ws.addEventListener("open", () => {
    console.log("I have connected");
});

ws.addEventListener("close", () => {
  console.log("Oh no I timed out!");
  document.getElementById('question').textContent = "Verbinding verbroken! (Herlaad de pagina)";
});

ws.addEventListener("message", message => {
    console.log('received', message.data);
    document.getElementById('question').textContent = message.data;
})

function sendYes() {
  ws.send("Yes");
  }

function sendNo() {
  ws.send("No");
  }
