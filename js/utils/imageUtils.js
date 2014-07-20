(function() {
    "use strict";

    function getPixel(inputData, x, y, width, height)
    {
	var i = (y*width + x)*4;
	return [inputData[i],
		inputData[i+1],
		inputData[i+2],
		inputData[i+3]];
    }
    module.exports.getPixel = getPixel;



    function setPixel(value, outputData, x, y, width, height)
    {
	var i = (y*width + x)*4;

	outputData[i] = value[0];
	outputData[i+1] = value[1];
	outputData[i+2] = value[2];
	outputData[i+3] = value[3];	
    }
    module.exports.setPixel = setPixel;

    

    function getLuminanceOfPixel(pixelValue)
    {
	// CIE luminance of RGB
	return pixelValue[0]*0.2126 +
	    pixelValue[1]*0.7152 +
	    pixelValue[2]*0.0722;
    }
    module.exports.getLuminanceOfPixel = getLuminanceOfPixel;

    

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
    module.exports.fillImage = fillImage;

})();
