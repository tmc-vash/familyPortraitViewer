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


  const createTimeline = () => {
    const timeLineElement = document.getElementById('timeline');
    imageNames.forEach((imageName, i) => {
        let height = 100;
        if( i>1 ) {
          const lastImageSeconds = parseInt(imageNames[i - 1].slice(11));
          const currentImageSeconds = parseInt(imageName.slice(11));
          height = Math.min(100, Math.abs(currentImageSeconds - lastImageSeconds) /10)
        }

        const outerDiv = document.createElement('div');
        outerDiv.className = 'timeline__element';
        outerDiv.id = 'timeline__element_' + i;
        outerDiv.onclick = () => currentImageIndex = i;
        outerDiv.style.width = (timeLineElement.offsetWidth / imageNames.length)  + 'px';

        const div = document.createElement('div');
        div.style.height = height + '%';
        div.className = 'timeline__element-bar';
        outerDiv.appendChild(div);
        timeLineElement.appendChild(outerDiv);
    })
  };

  publicAPIs.play = () => {
    playerIntervalId = setInterval(() => {
      addImageToCanvas(document.getElementById('imageCanvas'), imageNames[currentImageIndex]);

      $('.timeline__element').css("background-color", "#333333");
      //document.getElementById('timeline__element_' + currentImageIndex).style.background = '#333333';
      currentImageIndex ++;
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
    createTimeline();
  };


  //
  // Return the Public APIs
  //

  return publicAPIs;

})();
