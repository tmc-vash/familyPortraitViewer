/*!
 * Revealing Module Pattern Boilerplate
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
let app = (function () {

  'use strict';

  //
  // Variables
  //

  var publicAPIs = {};

  let playerIntervalId;
  let currentImageIndex = 0;

  const canvas = document.getElementById('timeline');
  const rect = canvas.parentNode.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  const ctx = canvas.getContext('2d');
  const canvasHeight = canvas.offsetHeight;
  const canvasWidth = canvas.offsetWidth;
  const barWidth = canvasWidth/ (imageNames.length);
  console.log('barWidth ', barWidth)
  console.log('canvasWidth ', canvasWidth)
  //
  // Methods
  //

  /**
   * A private method
   */
  const addImageToCanvas =  (canvasElement, imagePath) => {
    if (canvasElement.getContext) {

      let ctx = canvasElement.getContext('2d');

      //Loading of the home test image - img1
      let img1 = new Image();

      //drawing of the test image - img1
      img1.onload =  () => {
        //draw background image
        ctx.drawImage(img1, 0, 0);
        //draw a box over the top
        //ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
        //ctx.fillRect(0, 0, 500, 500);
      };
      img1.src = imageFolderName +  '/' + imagePath;
    }
  };


  const drawTimeline = (mousePos = -50) => {
    ctx.clearRect(0,0,canvasWidth, canvasHeight)
    ctx.fillStyle = "#000";
    imageNames.forEach((imageName, i) => {

      if (i > 1) {
        const lastImageSeconds = parseInt(imageNames[i - 1].slice(11));
        const currentImageSeconds = parseInt(imageName.slice(11));
        const height = Math.min(canvasHeight, Math.abs(currentImageSeconds - lastImageSeconds) / 10);
        ctx.fillRect(barWidth*i, canvasHeight - height, barWidth,  height);
      }
    })

    ctx.fillStyle = "#dae1eb";
    ctx.fillRect(currentImageIndex * barWidth, 0, barWidth, canvasHeight);

    ctx.fillStyle = "#018504";
    ctx.fillRect(mousePos, 0, 5, canvasHeight);
  };

  const drawTime = (imageName) => {

    let timeMs = imageName.split(".")[0].split("-")[3];
    let h = Math.floor(timeMs  /3600);
    let m = Math.floor((timeMs -(h*3600))/60) ;
    if (m<10) m = "0" + m;
    let s = timeMs%60;
    if(s<10) s = "0" + s;

    document.getElementById("timecode").innerHTML = h + ":" + m + ":"+s;
  };

  publicAPIs.play = () => {
    playerIntervalId = setInterval(() => {
      addImageToCanvas(document.getElementById('imageCanvas'), imageNames[currentImageIndex]);

      //document.getElementById('timeline__element_' + currentImageIndex).style.background = '#333333';
      currentImageIndex ++;
      drawTimeline();
      drawTime(imageNames[currentImageIndex]);
      document.getElementById('timeline__element_' + currentImageIndex).style.background = '#666';

      if(imageNames.length === currentImageIndex + 1) {
        clearInterval(playerIntervalId);
      }
    }, 500)

    document.getElementById('button__pause').style.display = 'block';
    document.getElementById('button__play').style.display = 'none';
  };

  publicAPIs.pause = () => {
    clearInterval(playerIntervalId);
    document.getElementById('button__pause').style.display = 'none';
    document.getElementById('button__play').style.display = 'block';
  };

  /**
   * Another public method
   */
  publicAPIs.init = function () {
    drawTimeline();

    $(canvas).on('mousemove',  (evt)=> {
      const mousePosInElement = evt.pageX - $(canvas).offset().left;
      console.log('mouseMove', mousePosInElement)
      drawTimeline(mousePosInElement);
    })

  };


  //
  // Return the Public APIs
  //

  return publicAPIs;

})();
