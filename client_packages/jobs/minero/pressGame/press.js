document.addEventListener("DOMContentLoaded", function () {
  var progressBar = document.querySelectorAll(".progress-bar");
  const time = 1500;

  function calculateTime(time, dataCount) {
      return time / dataCount;
  }

  progressBar.forEach(function (i) {
      let count = 0;
      let label = i.children[0];
      let line = i.children[1];

      let dataCount = label.getAttribute("data-count");
      let lineCount = line.children[0];

      let value = line.style.width.substr(0, line.style.width.length - 2) / 100;
      let runTime = calculateTime(time, dataCount);

      let animationLineCount;

      function increaseBar() {
          if (count < dataCount) {
              count++;
              label.innerHTML = count + "%";
              lineCount.style.width = count * value + "px";
              updateBarStyle();
          }
      }

      function decreaseBar() {
          if (count > 0) {
              count--;
              label.innerHTML = count + "%";
              lineCount.style.width = count * value + "px";
              updateBarStyle();
          }
      }

      function updateBarStyle() {          
          if (count <= 30) {
              lineCount.style.boxShadow = "0px 0px 20px 3px #ff0000";
              lineCount.style.background = "#ff0000";
          } else if (count > 30 && count <= 60) {
              lineCount.style.boxShadow = "0px 0px 20px 3px #FF9900";
              lineCount.style.background = "#FF9900";
          } else if (count > 60 && count <= 99) {
              lineCount.style.boxShadow = "0px 0px 20px 3px aqua";
              lineCount.style.background = "aqua";
          } else {
              lineCount.style.boxShadow = "0px 0px 20px 3px #00FF00";
              lineCount.style.background = "#00FF00";
          }
          if(count == 100){
            mp.events.call('pressfinalizados');             
          }
      }

      window.addEventListener("keydown", (e) => {
          if (e.code == "Space" || e.key === " ") {
              // Aumentar barra
              clearInterval(animationLineCount);
              animationLineCount = setInterval(increaseBar, runTime);
          }
      });

      window.addEventListener("keyup", (e) => {
          if (e.code == "Space" || e.key === " ") {
              // Disminuir barra
              clearInterval(animationLineCount);
              animationLineCount = setInterval(decreaseBar, runTime);
          }
      });
  });
});
