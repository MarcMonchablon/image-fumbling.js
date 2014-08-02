(function() {
    "use strict";

    function getLuminanceOfPixel(pixelValue)
    {
	// CIE luminance of RGB
	return pixelValue[0]*0.2126 +
	    pixelValue[1]*0.7152 +
	    pixelValue[2]*0.0722;
    }
    module.exports.getLuminanceOfPixel = getLuminanceOfPixel;

})();
