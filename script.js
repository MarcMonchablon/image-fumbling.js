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

//	return processImage_SobelFilter(context, inputImage.data, width, height);
	return processImage_BlurImage(context, inputImage.data, width, height);
    }

    function getPixel(inputData, x, y, width, height)
    {
	var i = (y*width + x)*4;
	return [inputData[i],
		inputData[i+1],
		inputData[i+2],
		inputData[i+3]];
    }

    function setPixel(value, outputData, x, y, width, height)
    {
	var i = (y*width + x)*4;

	outputData[i] = value[0];
	outputData[i+1] = value[1];
	outputData[i+2] = value[2];
	outputData[i+3] = value[3];	
    }

    function getLuminanceOfPixel(pixelValue)
    {
	// CIE luminance of RGB
	return pixelValue[0]*0.2126 +
	    pixelValue[1]*0.7152 +
	    pixelValue[2]*0.0722;
    }

    function fillImage(color, outputData, width, height)
    {
	for (var y=0; y<height; y++) {
	    for (var x=0; x<width; x++) {
		setPixel(color,
			 outputData,
			 x,
			 y,
			 width,
			 height);
	    }
	}
    }

    function processImage_BlurImage(context, inputData, width, height)
    {
	var linearFilter = [1/9, 1/9, 1/9,
			    1/9, 1/9, 1/9,
			    1/9, 1/9, 1/9];

	return processImage_LinearFilter(linearFilter, context, inputData, width, height);
    }
    
    function processImage_LinearFilter(linearFilter, context, inputData, width, height)
    {
	function getLocalConvolutionValue(x, y, linearFilter, inputData, filterPadding, width, height)
	{
	    var pixelValue = 0;
	    var indexInFilter = 0;
	    
	    var x_filter, y_filter, localPixelValue;
	    for (y_filter=-filterPadding; y_filter<=filterPadding; y_filter++) {
		for (x_filter=-filterPadding; x_filter<=filterPadding; x_filter++) {
		    localPixelValue = getPixel(inputData, x+x_filter, y+y_filter, width, height);
		    pixelValue += linearFilter[indexInFilter++] *
			getLuminanceOfPixel(localPixelValue);
		}
	    }
	    return pixelValue;
	}

	var outputImage = context.createImageData(width, height);
	var outputData = outputImage.data;

	var filterSize = Math.sqrt(linearFilter.length);
	var filterPadding = Math.floor(filterSize / 2);

	fillImage([0, 0, 0, 255], outputData, width, height);
	
	var y, x, grayPixelValue; 
	for (y=filterPadding; y<height-filterPadding; y++) {
	    for (x=filterPadding; x<width-filterPadding; x++) {
		grayPixelValue = getLocalConvolutionValue(x, y, linearFilter, inputData, filterPadding, width, height);
		setPixel([grayPixelValue, grayPixelValue, grayPixelValue, 255],
			outputData, x, y, width, height);
	    }
	}
	
	return outputImage;
    }
    
    function processImage_SobelFilter(context, inputData, width, height)
    {
	var outputImage = context.createImageData(width, height);
	var outputData = outputImage.data;

	fillImage([0, 0, 0, 255], outputData, width, height);

	for (var y=1; y<height-1; y++) {
	    for (var x=1; x<width-1; x++) {
		var verticalSobel = verticalGradientOfPixel(inputData, x, y, width, height);
		var horizontalSobel = horizontalGradientOfPixel(inputData, x, y, width, height);
		var sobelValueOfPixel = euclidianDistance(verticalSobel, horizontalSobel);

		setPixel([sobelValueOfPixel, sobelValueOfPixel, sobelValueOfPixel, 255],
			 outputData,
			 x,
			 y,
			 width,
			 height);
	    }
	}
	
	function euclidianDistance(v1, v2)
	{
	    return Math.sqrt(v1*v1 + v2*v2);
	}
	
	function verticalGradientOfPixel(inputData, x, y, width, height)
	{
	    var value = (+1)*getLuminanceOfPixel(getPixel(inputData, x-1, y-1, width, height));
	    value    += (+2)*getLuminanceOfPixel(getPixel(inputData,  x , y-1, width, height));
	    value    += (+1)*getLuminanceOfPixel(getPixel(inputData, x+1, y-1, width, height));
	    value    += (-1)*getLuminanceOfPixel(getPixel(inputData, x-1, y+1, width, height));	    
	    value    += (-2)*getLuminanceOfPixel(getPixel(inputData,  x , y+1, width, height));
	    value    += (-1)*getLuminanceOfPixel(getPixel(inputData, x+1, y+1, width, height));	    
	    
	    return value;
	}

	function horizontalGradientOfPixel(inputData, x, y, width, height)
	{
	    var value = (+1)*getLuminanceOfPixel(getPixel(inputData, x-1, y-1, width, height));
	    value    += (+2)*getLuminanceOfPixel(getPixel(inputData, x-1,  y , width, height));
	    value    += (+1)*getLuminanceOfPixel(getPixel(inputData, x-1, y+1, width, height));
	    value    += (-1)*getLuminanceOfPixel(getPixel(inputData, x+1, y-1, width, height));	    
	    value    += (-2)*getLuminanceOfPixel(getPixel(inputData, x+1,  y , width, height));
	    value    += (-1)*getLuminanceOfPixel(getPixel(inputData, x+1, y+1, width, height));	    
	    
	    return value;
	}

	
	return outputImage;
    }

    function processImage_Negative(context, inputData, width, height)
    {
	var outputImage = context.createImageData(width, height);	
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






