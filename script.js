(function() {
    "use strict";

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
	var outputImage = context.createImageData(width, height);
	var inputData = inputImage.data;
	var outputData = outputImage.data;

	for (var y=0; y<height; y++)
	{
	    for (var x=0; x<width; x++)
	    {
		var i = (y*width + x)*4;

		// Take the negatives (and keep alpha's unchanged)
		outputData[i] = 255 - inputData[i];
		outputData[i+1] = 255 - inputData[i+1];
		outputData[i+2] = 255 - inputData[i+2];
		outputData[i+3] = inputData[i+3];		
	    }
	}
	return outputImage;
    }
    
})();






