(function() {
    "use strict";

    

    module.exports = function main(originalImage)
    {
	var image = originalImage;

	var energyMap = computeEnergyMap(image);
	return energyMap;
    };
    
    function computeEnergyMap(image)
    {
	var zeros = require('zeros');
	var pack = require('ndarray-pack');
	var convolve = require('ndarray-convolve');
	var cwise = require('cwise');
	
	var gradientXFilter = pack([[-1, 0, +1],
				    [-2, 0, +2],
				    [-1, 0, +1]]);

	var gradientYFilter = pack([[+1, +2, +1],
				    [ 0,  0,  0],
				    [-1, -2, -1]]);	

	var gradientXImage = convolve(image, gradientXFilter);
	var gradientYImage = convolve(image, gradientYFilter);

	var computeEuclidianNorm = cwise({
	    args: ["array", "array", "array"],
	    body: function(out, im1, im2) {
		out = Math.sqrt(im1 * im1 + im2 * im2);
	    }
	});

	var energyMap = zeros([image._shape0, image._shape1]);
	computeEuclidianNorm(energyMap, gradientXImage, gradientYImage);

	return energyMap;
    }

    
})();
