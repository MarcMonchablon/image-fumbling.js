(function() {
    "use strict";

    var $ = require('jquery');    
    var ndarray = require('ndarray');
    var ops = require('ndarray-ops');
    var render = require('ndarray-canvas');
    var read = require('get-pixels');
    var zeros = require('zeros');
    var imageUtils = require('./utils/imageUtils.js');
    var seamCarving = require('./seamCarving/seamCarving.js');
    
    window.onload = function() {
	var pathDog = "images/DogBeach.jpg";
	var pathWave = "images/WaveHokusai.jpg";
	
	read(pathWave, function(err, nd_originalImage) {
	    if (err) {
		console.log("Bad image path");
		return;
	    }
	    onSuccessfullImageLoading(nd_originalImage);
	});
    };

    function onSuccessfullImageLoading(originalImage)
    {	
	var grayImage = convertToGrayImage(originalImage);
	var processedImage = seamCarving(grayImage);
	drawImage(processedImage);
    }

    function processImage(image)
    {
	var filter = require('ndarray-pack')([[0, 1, 0],
					      [1, -4, 1],
					      [0, 1, 0]]);

	var processedImage = require('ndarray-convolve')(image, filter);

	return processedImage;
    }

    function convertToGrayImage(originalImage) {
	var grayImage_unrotated = require('luminance')(originalImage);
	var grayImage = zeros([originalImage._shape1, originalImage._shape0]);
	require('image-rotate')(grayImage, grayImage_unrotated, Math.PI / 2.0);

	return grayImage;
    }


    function drawImage(ndarray_image)
    {
	var canvas = render(null, ndarray_image);
	var canvasWrapper = $('.canvasWrapper');
	canvasWrapper.empty();
	canvasWrapper.append(canvas); 
    }


})();






