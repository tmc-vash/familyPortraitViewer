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
  let play = false;

  const canvas = document.getElementById('timeline');
  const rect = canvas.parentNode.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  const ctx = canvas.getContext('2d');
  const canvasHeight = canvas.offsetHeight;
  const canvasWidth = canvas.offsetWidth;
  const barWidth = canvasWidth/ (imageNames.length);
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
    ctx.fillStyle = "rgba(255, 50, 50, 0.5)";

    imageNames.forEach((imageName, i) => {

      if (i > 1) {
        const lastImageSeconds = parseInt(imageNames[i - 1].slice(11));
        const currentImageSeconds = parseInt(imageName.slice(11));
        const height = Math.min(canvasHeight, Math.abs(currentImageSeconds - lastImageSeconds) / 10);
        ctx.fillRect(barWidth*i, canvasHeight - height, barWidth,  height);
      }
    });

    const maxAlphaValue = Math.max( ...imageNamesWithAlpha.map(imageNameWithAlpha => imageNameWithAlpha.alpha))
    ctx.fillStyle = "rgba(50, 255, 50, 0.5)";
    imageNamesWithAlpha.forEach((imageNameWithAlpha, i) => {
      const height = canvasHeight * imageNameWithAlpha.alpha / maxAlphaValue;
      ctx.fillRect(barWidth*i, canvasHeight - height, barWidth,  height);
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

  const gotoNextFrame = () => {
    addImageToCanvas(document.getElementById('imageCanvas'), imageNames[currentImageIndex]);

    currentImageIndex ++;
    drawTimeline();
    drawTime(imageNames[currentImageIndex]);
    console.log('gotoNextFrame')
    if(currentImageIndex < imageNames.length && play === true) {
      setTimeout(() => {
        gotoNextFrame()
      }, 500)
    }
  }

  publicAPIs.play = () => {
    play = true;
    gotoNextFrame();

    document.getElementById('button__pause').style.display = 'block';
    document.getElementById('button__play').style.display = 'none';
  };

  publicAPIs.pause = () => {
    play = false;
    document.getElementById('button__pause').style.display = 'none';
    document.getElementById('button__play').style.display = 'block';
  };

  const getPreviewDiv = () => {
    return document.getElementById('preview');
  };

  const showImagePreview = (offsetLeft, imageIndex) => {
    const previewDiv = getPreviewDiv();
    previewDiv.style.display = "block";
    previewDiv.style.left = (offsetLeft - 100) + 'px';
    previewDiv.children[0].setAttribute('src',imageFolderName +  '/'+  imageNames[Math.min(imageNames.length - 1, imageIndex)])
  };

  const hideImagePreview = () => {
    getPreviewDiv().style.display = "none";
  };

  /**
   * Another public method
   */
  publicAPIs.init = function () {
    drawTimeline();

    $(canvas).on('mousemove',  (evt)=> {
      const mousePosInElement = evt.pageX - $(canvas).offset().left;
      showImagePreview(evt.pageX, Math.round((mousePosInElement / canvasWidth) * imageNames.length))
      drawTimeline(mousePosInElement);
    });

    $(canvas).on('mouseout',  (evt)=> {
      hideImagePreview();
    });

    $(canvas).on('click',  (evt)=> {
      const mousePosInElement = evt.pageX - $(canvas).offset().left;
      currentImageIndex = Math.round((mousePosInElement / canvasWidth) * imageNames.length);
    });

  };


  //
  // Return the Public APIs
  //

  return publicAPIs;

})();
