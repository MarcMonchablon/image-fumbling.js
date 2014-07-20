(function () {
    "use strict";

    var imageUtils = require('../utils/imageUtils.js');

    
    function linearFilter(filter, context, inputData, width, height)
    {
	function getLocalConvolutionValue(x, y, filter, inputData, filterPadding, width, height)
	{
	    var pixelValue = 0;
	    var indexInFilter = 0;
	    
	    var x_filter, y_filter, localPixelValue;
	    for (y_filter=-filterPadding; y_filter<=filterPadding; y_filter++) {
		for (x_filter=-filterPadding; x_filter<=filterPadding; x_filter++) {
		    localPixelValue = imageUtils.getPixel(inputData, x+x_filter, y+y_filter, width, height);
		    pixelValue += filter[indexInFilter++] *
			imageUtils.getLuminanceOfPixel(localPixelValue);
		}
	    }
	    return pixelValue;
	}

	var outputImage = context.createImageData(width, height);
	var outputData = outputImage.data;

	var filterSize = Math.sqrt(filter.length);
	var filterPadding = Math.floor(filterSize / 2);

	imageUtils.fillImage([0, 0, 0, 255], outputData, width, height);
	
	var y, x, grayPixelValue; 
	for (y=filterPadding; y<height-filterPadding; y++) {
	    for (x=filterPadding; x<width-filterPadding; x++) {
		grayPixelValue = getLocalConvolutionValue(x, y, filter, inputData, filterPadding, width, height);
		imageUtils.setPixel([grayPixelValue, grayPixelValue, grayPixelValue, 255],
			outputData, x, y, width, height);
	    }
	}
	
	return outputImage;
    }
    module.exports.linearFilter = linearFilter;



    function blur(context, inputData, width, height)
    {
	var filter = [1/9, 1/9, 1/9,
		      1/9, 1/9, 1/9,
		      1/9, 1/9, 1/9];

	return linearFilter(filter, context, inputData, width, height);
    }
    module.exports.blur = blur;


    
    function sobel(context, inputData, width, height)
    {
	var outputImage = context.createImageData(width, height);
	var outputData = outputImage.data;

	imageUtils.fillImage([0, 0, 0, 255], outputData, width, height);

	for (var y=1; y<height-1; y++) {
	    for (var x=1; x<width-1; x++) {
		var verticalSobel = verticalGradientOfPixel(inputData, x, y, width, height);
		var horizontalSobel = horizontalGradientOfPixel(inputData, x, y, width, height);
		var sobelValueOfPixel = euclidianDistance(verticalSobel, horizontalSobel);

		imageUtils.setPixel([sobelValueOfPixel, sobelValueOfPixel, sobelValueOfPixel, 255],
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
	    var value = (+1)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData, x-1, y-1, width, height));
	    value    += (+2)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData,  x , y-1, width, height));
	    value    += (+1)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData, x+1, y-1, width, height));
	    value    += (-1)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData, x-1, y+1, width, height));	    
	    value    += (-2)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData,  x , y+1, width, height));
	    value    += (-1)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData, x+1, y+1, width, height));	    
	    
	    return value;
	}

	function horizontalGradientOfPixel(inputData, x, y, width, height)
	{
	    var value = (+1)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData, x-1, y-1, width, height));
	    value    += (+2)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData, x-1,  y , width, height));
	    value    += (+1)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData, x-1, y+1, width, height));
	    value    += (-1)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData, x+1, y-1, width, height));	    
	    value    += (-2)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData, x+1,  y , width, height));
	    value    += (-1)*imageUtils.getLuminanceOfPixel(imageUtils.getPixel(inputData, x+1, y+1, width, height));	    
	    
	    return value;
	}

	
	return outputImage;
    }
    module.exports.sobel = sobel;
    


    function negative(context, inputData, width, height)
    {
	var outputImage = context.createImageData(width, height);	
	var outputData = outputImage.data;

	for (var y=0; y<height; y++)
	{
	    for (var x=0; x<width; x++)
	    {
		var i = (y*width + x)*4;

		outputData[i] = 255 - inputData[i];
		outputData[i+1] = 255 - inputData[i+1];
		outputData[i+2] = 255 - inputData[i+2];
		outputData[i+3] = inputData[i+3];		
	    }
	}
	return outputImage;
    }
    module.exports.negative = negative;

})(); 
