const SEQUENCE_LENGTH = 5;
const FIELDSIZE = 3;
let simoneshechos = 0 ;
var divCountDown = document.querySelector("#count-down");
var countDown = 3;
var count = 0;
class Keypad {
  clickKey(key) {
    if (!this.lockKeys) {
      if (this.progress === 0 && this.setProgress === 0) {
        this.startTime = new Date();
      }
      if (key === this.sequence[this.setProgress]) {
        this.correctKeyClicked(key);
      } else {
        this.incorrectKeyClicked();
      }
    }
  }
  reset(sequenceLength) {
    this.sequenceLength = 4;
    this.setSequence(sequenceLength);
    this.progress = 3;
    this.showSequence(3);
    this.setProgress = 0;
  }
  
  setSequence(length) {
    this.sequence = []
    for (var i = 0; i < length; i++) {
      this.sequence.push(Math.floor(Math.random() * Math.floor(this.fieldSize * this.fieldSize)))
    }
  }
  correctKeyClicked(key) {
    var button = document.getElementById('key_'+(key));
    this.setProgress +=1;
    button.className = "keypad__key keypad__key--clicked_correct";
    var timeout = setTimeout(() => {button.className = "keypad__key"}, 300)

    if (this.setProgress > this.progress) {
      this.setProgress = 0;
      if (this.progress + 1 === this.sequenceLength) {
        this.blinkKeys(true, 0);
        simoneshechos++;
        if(simoneshechos == 2){
          mp.events.call("finsimonInterfaz");
        }
        setTimeout(() => this.reset(this.sequenceLength), 1000)
        timeout = 0;
        this.setTimerDisplay(this.startTime);
      } else {
        this.progress +=1;
        setTimeout( ()=> {this.showSequence(this.progress);}, 500);
      }
    }
  }
  incorrectKeyClicked() {
    this.blinkKeys(false, 0)
    setTimeout(() => this.reset(this.sequenceLength), 1000);
  }
  
  async showSequence(progress) {
    this.lockKeys = true;
    for(var i = 0; i < ( progress + 1); i++) {
      var highlightButton = document.getElementById("key_" + (this.sequence[i]));
      await sleep(100);
      highlightButton.className = 'keypad__key keypad__key--highlight';
      await sleep(300);
      highlightButton.className = 'keypad__key';
      if (i === progress) {
        this.lockKeys = false;
      }
    }
  }
  
  blinkKeys(correct, count = 0) {
      var keys = document.getElementsByClassName('keypad__key');
      for (var i = 0; i < keys.length; i++) {
        if (correct) {
          keys[i].className = "keypad__key keypad__key--clicked_correct";
        } else {
          keys[i].className = "keypad__key keypad__key--clicked_incorrect";
        }
      }
      setTimeout(() => {
        for (var i = 0; i < keys.length; i++) {
          keys[i].className = 'keypad__key';
        }
      }, 200);
    if (count < 2) {
      setTimeout(() => {this.blinkKeys(correct, (count+1));}, 300);
    }
  }
  
  setTimerDisplay(startTime) {
    var timer = document.getElementById('timer');
    var time = new Date();
    timer.innerHTML = (time - startTime) /1000;
  }
  
  drawButtons(fieldSize) {
    this.fieldSize = fieldSize;
    const keypadContainer = document.getElementById('keypad')
    while (keypadContainer.firstChild) {
      keypadContainer.removeChild(keypadContainer.lastChild);
    }
    var keyNumber = 0;
    for (var i = 0; i < fieldSize; i++) {
      var keypadRow = document.createElement('div');
      keypadRow.className = "keypad__row";
      for (var j = 0; j < fieldSize; j++) {
        var keypadKey = document.createElement('div');
        const keyIdString = keyNumber;
        keypadKey.className = "keypad__key";
        keypadKey.onclick = () => {keypad.clickKey(keyIdString)};
        keypadKey.id = "key_" + keyNumber;
        keypadKey.style.height = Math.floor(100 * (1/(fieldSize + 1))) + "vw";
        keypadKey.style.width = Math.floor(100 * (1/(fieldSize + 1))) + "vw";
        keyNumber +=1;
        keypadRow.append(keypadKey);
      }
      keypadContainer.append(keypadRow);
    }
  }
  
  handleSizeChange() {
    const sizeInput = document.getElementById('sizeInput');
    console.log(sizeInput.value);
    if(sizeInput.value > 1 && sizeInput.value < 6) {
      this.drawButtons(parseInt(sizeInput.value));
    }
    this.reset(this.sequenceLength);
  }
  
  handleSequenceChange() {
    const sequenceInput = document.getElementById('sequenceInput');
    this.reset(parseInt(sequenceInput.value));
  }
}
function runCountdown() {
  divCountDown.innerHTML = countDown;
  countDown--;

  if (countDown < 0) {
      clearInterval(runCount);
      count = 0;
      divCountDown.innerHTML = "";

      keypad.drawButtons(3);
      keypad.reset(6);
  }
}
runCountdown();
let runCount = setInterval(runCountdown, 1000);

const keypad = new Keypad();


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
