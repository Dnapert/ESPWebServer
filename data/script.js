var gateway = `ws://${window.location.hostname}/ws`;
var websocket;
window.addEventListener("load", onload);
var mode ="off";


function onload(event) {
  initWebSocket();
}

function getValues() {
  websocket.send("getValues");
}

function initWebSocket() {
  console.log("Trying to open a WebSocket connection…");
  websocket = new WebSocket(gateway);
  websocket.onopen = onOpen;
  websocket.onclose = onClose;
  websocket.onmessage = onMessage;
}

function onOpen(event) {
  console.log("Connection opened");
  getValues();
}

function onClose(event) {
  console.log("Connection closed");
  setTimeout(initWebSocket, 2000);
}
function updateMode(input){ 
  
  console.log(input);
  websocket.send("mode" + input);
  switch (input) {
    case "off":
      document.getElementById("heat").style =
        "background-color: darkgreys(83, 207, 223)";
      document.getElementById("cool").style =
        "background-color: darkgreys(83, 207, 223)";
      break;
    case "heat":
      document.getElementById("heat").style =
        "background-color:#034078; color:white";
      document.getElementById("cool").style =
        "background-color: darkgreys(83, 207, 223)";
      break;
    case "cool":
      document.getElementById("cool").style =
        "background-color:#034078; color:white";
      document.getElementById("heat").style =
        "background-color: darkgreys(83, 207, 223)";

    default:
    // do something else
  }
}
function updateSlider(element) {
  var sliderNumber = element.id.charAt(element.id.length - 1);
  var sliderValue = document.getElementById(element.id).value;
  document.getElementById("sliderValue" + sliderNumber).innerHTML = sliderValue;
  websocket.send(sliderNumber + "s" + sliderValue.toString());
}

function onMessage(event) {
  console.log(event.data);
  var myObj = JSON.parse(event.data);
  if(mode !== myObj.mode){
  mode = myObj.mode;
  updateMode(mode)
}
  
  var keys = Object.keys(myObj);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    document.getElementById(key).innerHTML = myObj[key];
    if(i<5){
    document.getElementById("slider" + (i + 1).toString()).value = myObj[key];
    }
  }
}
