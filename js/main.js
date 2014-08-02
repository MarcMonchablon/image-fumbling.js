(function() {
    "use strict";

    var $ = require('jquery');    
    var ndarray = require('ndarray');
    var ops = require('ndarray-ops');
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
	    

	    var red = nd_originalImage.pick(null, null, 0);
	    var green = nd_originalImage.pick(null, null, 1);
	    var blue = nd_originalImage.pick(null, null, 2);

	    var nd_modifiedImage = zeros([nd_originalImage._shape1,
					  nd_originalImage._shape0]);

	    //   CIE luminance of RGB
	    //  Red * 0.2126
	    // Green * 0.7152
	    //Blue  * 0.0722

	    ops.add(nd_modifiedImage,
		    ops.mulseq(red, 1),
		    ops.mulseq(green, 1));
	    ops.add(nd_modifiedImage,
		    nd_modifiedImage,
		   ops.mulseq(blue, 1));


	    imageRotate(nd_modifiedImage,
			nd_originalImage,
			Math.PI / 2.0);

	    var canvas = render(null, nd_modifiedImage);
	    
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






