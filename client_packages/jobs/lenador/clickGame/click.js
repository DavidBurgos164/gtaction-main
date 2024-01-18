$(document).ready(function() {
var gradBackg;
var gradFill;
var gameBar;
var gameSweetspot;
var gameThumb;
var thumbDir = 1;
var thumbSpeed = 5;
var timeout = false;
var timeouttime = 1000;
var hasinit = false;
var paused = false;
var stages = {cur: 1, max: 3};
var tries = {cur: 1, max: 5};
var stageText;
var difficulty = 1.4;

$(function(){
  gameArea.canvas.addEventListener("mousedown", function(){
    gameThumb.x > gameSweetspot.x && gameThumb.x < gameSweetspot.x + gameSweetspot.width - gameThumb.width ? zoneClick(true) : zoneClick(false);
  });
  
  window.addEventListener("message", function(data){
    if (data.startMiniGame){
      var tog = data.toggle;

      tog ? $("#crackCanvas").show() : $("#crackCanvas").hide();
      tog ? startGame() : stopGame();
    }
  });
  
  $(".reset").click(function(){ // TODO remove
    resetGame();
  });
});

function startGame(){
  if (!hasinit){
    gameArea.start();
    gradBackg = new gradComponent(420, 38, "transparent", "transparent", gameArea.canvas.width / 2 - 210, gameArea.canvas.height - 113, 180);
    gradFill = new component(410, 28, "transparent", gradBackg.x + 5, gradBackg.y + 5);
    gameBar = new component(400, 8, "#E57A44", gameArea.canvas.width / 2 - 200, gameArea.canvas.height - 100);
    gameSweetspot = new component(60, gameBar.height, "#FFFFFF", gameBar.x + gameBar.width / 2 - 20, gameBar.y);
    gameThumb = new component(9, 25, "#FFFFFF", gameBar.x + gameBar.width / 2, gameBar.y - gameBar.height);
    stageText = new textComponent(15, "Arial", "#000000", gameArea.canvas.width / 2, gameArea.canvas.height - 20);
  }
  else{
    paused = false;
  }
}

function resetGame(){
  stages.cur = 1;
  stages.max = 3;
  tries.cur = 1;
  tries.max = 5;
  randomizeSweetspot();
}

function stopGame(){
  paused = true;
}

var gameArea = {
  canvas: document.getElementById("crackCanvas"),
  start: function(){
    this.canvas.id = "miniGameCanvas";
    this.canvas.width = window.innerWidth - 50;
    this.canvas.height = window.innerHeight - 50;
    this.context = this.canvas.getContext("2d");
    //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 10);
  },
  clear: function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function component(width, height, color, x, y){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function(){
    ctx = gameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function gradComponent(width, height, colf, colt, x, y, angle){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.colorfrom = colf;
  this.colorto = colt;
  this.angle = angle;
  this.update = function(){
    ctx = gameArea.context;
    var ang = angle / 180 * Math.PI;
    var x2 = this.x + Math.cos(ang) * this.width;
    var y2 = this.y + Math.sin(ang) * this.width;
    var grad = ctx.createLinearGradient(this.x, this.y, x2, y2);
    grad.addColorStop(0, this.colorfrom);
    grad.addColorStop(1, this.colorto);
    ctx.fillStyle = grad;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function textComponent(fontsize, font, color, x, y, text){
  this.fontsize = fontsize;
  this.font = font;
  this.x = x;
  this.y = y;
  this.text = text;
  this.update = function(){
    ctx = gameArea.context;
    ctx.font = fontsize + "px " + font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(this.text || "", x, y);
  }
}

function updateGameArea(){
  if (!paused){
    gameArea.clear();

    var barextents = {left: gameBar.x - gameThumb.width / 2, right: gameBar.x + gameBar.width - gameThumb.width / 2};

    if (!timeout){
      thumbDir == 1 && gameThumb.x < barextents.right ? gameThumb.x += thumbSpeed : thumbDir = 0;
      thumbDir == 0 && gameThumb.x > barextents.left ? gameThumb.x -= thumbSpeed : thumbDir = 1;
    }

    stageText.text = ``;//Fase: ${stages.cur} de ${stages.max}
    gameSweetspot.width = Math.floor(120 / difficulty);

    gradBackg.update();
    gradFill.update();
    gameBar.update();
    gameSweetspot.update();
    gameThumb.update();
    stageText.update();
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function randomizeSweetspot(){
  var sswidth = Math.floor(120 / difficulty);
  
  gameSweetspot.x = getRandomArbitrary(gameBar.x + sswidth / 2, gameBar.x + gameBar.width - sswidth);
}

function zoneClick(success){
    console.log(success);
  if (success){
    gradBackg.colorfrom = "#0af235";
    timeout = true;
    
    setTimeout(function(){
      gradBackg.colorfrom = "transparent";
      timeout = false;
      increaseStage();
    }, timeouttime);
  }
  else{
    tries.cur += 1;
    
    if (tries.cur > tries.max){
      resetGame();
      paused = true;
    }
    else{
      gradBackg.colorfrom = "#de1e09";
      timeout = true;

      setTimeout(function(){
        gradBackg.colorfrom = "transparent";
        timeout = false;
        resetGame();
      }, timeouttime);
    }
  }
}

function increaseStage(){
  stages.cur += 1;
  
  if (stages.cur > stages.max){
    //ACABO EL GAME
    mp.events.call("clickfinalizados");
    resetGame();
    paused = true;
  }
  
  randomizeSweetspot();
}



startGame(); // TODO remove
});