(function() {
    "use strict";

    var imageUtils = require('./utils/imageUtils.js');
    var linearProcessing = require('./processing/linearProcessing.js');

    window.onload = function() {
	drawImage();
    };
    
    function drawImage() {
	var image = new Image();
	image.src="images/DogBeach.jpg";
	image.onload = loadAndProcessImage;

	function loadAndProcessImage() {
	    var canvas = document.getElementById("canvas");
	    var context = canvas.getContext("2d");

	    context.drawImage(image, 0, 0);

	    var processedImage = processImage(context, canvas.width, canvas.height);
	    context.putImageData(processedImage, 0, 0);
	}
    }

    function processImage(context, width, height)
    {
	var inputImage  = context.getImageData(0,
					       0,
					       width,
					       height);
	
//	return processImage_SobelFilter(context, inputImage.data, width, height);
	return linearProcessing.blur(context, inputImage.data, width, height);
    }
    
    function getHistogram(imageData, width, height)
    {
	var histogram = [];

	var i, x, y;
	for (i=0; i<256; i++) {
	    histogram[i] = 0;
	}

	var pixelLuminance;
	for (y=0; y<height; y++) {
	    for (x=0; x<width; x++) {
		pixelLuminance = Math.floor(imageUtils.getLuminanceOfPixel(imageUtils.getPixel(imageData, x, y, width, height)));
		histogram[pixelLuminance]++;
	    }
	}
	return histogram;
    }

    function getNormalizedHistogram(imageData, width, height)
    {
	var histogram = getHistogram(imageData, width, heigth);
	var pixelNumber = width * height;

	for (var i=0; i<256; i++) {
	    histogram[i] /= pixelNumber;
	}
	return histogram;
    }

})();






