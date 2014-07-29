(function() {
    "use strict";

    var $ = require('jquery');    
    var ndarray = require('ndarray');
    var render = require('ndarray-canvas');
    var read = require('get-pixels');
    var zeros = require('zeros');
    var imageRotate = require("image-rotate");
    var imageUtils = require('./utils/imageUtils.js');
    var linearProcessing = require('./processing/linearProcessing.js');

    window.onload = function() {
	var path = "images/DogBeach.jpg";
	var nd_originalImage;

	read(path, function(err, nd_originalImage) {
	    if (err) {
		console.log("Bad image path");
		return;
	    }
	    
	    console.log("got pixels", nd_originalImage.shape.slice());	    

	    var nd_modifiedImage = zeros([nd_originalImage._shape1,
					  nd_originalImage._shape0,
					  nd_originalImage._shape2]);

	    imageRotate(nd_modifiedImage.pick(null, null, 0),
			nd_originalImage.pick(null, null, 0),
			Math.PI / 2.0);

	    imageRotate(nd_modifiedImage.pick(null, null, 1),
			nd_originalImage.pick(null, null, 1),
			Math.PI / 2.0);

	    imageRotate(nd_modifiedImage.pick(null, null, 2),
			nd_originalImage.pick(null, null, 2),
			Math.PI / 2.0);

	    var canvas = render(null,
				nd_modifiedImage.pick(null, null, 0),
				nd_modifiedImage.pick(null, null, 1),
				nd_modifiedImage.pick(null, null, 2));
	    
	    var canvasWrapper = $('.canvasWrapper');
	    canvasWrapper.empty();
	    canvasWrapper.append(canvas);
	});

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






