/**
 * ...
 * @author Danny Marcowitz
 *		   Dor Hanin
 *         @Double Duck
 */
 
 /*
 ///////////////////////////////////////////////////////////// Comments //////////////////////////////////////////////////
 
 1. {"duration": 0} in "floatables" means no movement.
 2. {"to": null} in floatRanges means to infinity.
 
 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 */

var allBgData = {
	"bgdata": {
		"skyColors": [
			// Daylight
			{"to": 700, "colorCode": "#b9e9fa"},
			// Night
			{"to": 1000, "colorCode": "#3087bd"},
			{"to": 1700, "colorCode": "#3087bd"},
			// Space
			{"to": 2000, "colorCode": "#05091c"},
		],
		"floatables": [
			// Clouds
			{"id": 1, "file": "cloud_1.png", "startX": 10, "endX": 10, "duration": 0},
			{"id": 2, "file": "cloud_2.png", "startX": 80, "endX": 80, "duration": 0},
			{"id": 3, "file": "cloud_3.png", "startX": 40, "endX": 40, "duration": 0},
			// Moving Clouds
			{"id": 4, "file": "cloud_1.png", "startX": -10, "endX": 120, "duration": 5000},
			{"id": 5, "file": "cloud_2.png", "startX": 120, "endX": -10, "duration": 4500},
			{"id": 6, "file": "cloud_3.png", "startX": -10, "endX": 120, "duration": 6000},
			// Daylight stuff
			//{"id": 7, "file": "ducks_light.png", "startX": -10, "endX": 120, "duration": 3000},
			{"id": 7, "file": "plane.png", "startX": 120, "endX": -50, "duration": 3500},
			// Space stuff
			{"id": 8, "file": "alien.png", "startX": -10, "endX": 120, "duration": 5000},
			{"id": 9, "file": "astroid.png", "startX": -10, "endX": 120, "duration": 1000},
			{"id": 10, "file": "hippostronaut.png", "startX": 120, "endX": -10, "duration": 300},
			{"id": 11, "file": "planet_1.png", "startX": 0, "endX": 0, "duration": 0},
			{"id": 12, "file": "planet_2.png", "startX": 100, "endX": 100, "duration": 0},
			{"id": 13, "file": "sat_1.png", "startX": -10, "endX": 120, "duration": 3000},
			{"id": 14, "file": "sat_2.png", "startX": 120, "endX": -10, "duration": 3000},
			// Hazes
			{"id": 15, "file": "haze_1.png", "startX": 5, "endX": 5, "duration": 0},
			{"id": 16, "file": "haze_2.png", "startX": 50, "endX": 50, "duration": 0},
			{"id": 17, "file": "haze_3.png", "startX": 105, "endX": 105, "duration": 0},
			// Nebulas
			{"id": 18, "file": "nebula_1.png", "startX": 50, "endX": 50, "duration": 0},
			{"id": 19, "file": "nebula_2.png", "startX": 50, "endX": 50, "duration": 0},
			// Night Stuff
			//{"id": 21, "file": "ducks_dark.png", "startX": -10, "endX": 120, "duration": 3000},
			{"id": 20, "file": "moon.png", "startX": 20, "endX": 20, "duration": 0, "type":"moon"},
			// Stars
			{"id": 21, "file": "stars.png", "startX": 50, "endX": 50, "duration": 0},
		],
		"floatRanges": [
			{
				// Daylight
				"from": 500,
				"to": 900,
				"maxOnScreen": 2,
				"images": [1, 2, 3, 4, 5, 6, 7],
			},
			{
				// Night
				"from": 1000,
				"to": 1900,
				"maxOnScreen": 3,
				"images": [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 20, 21],
			},
			{
				// Space
				"from": 2000,
				"to": null,
				"maxOnScreen": 5,
				"images": [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
			},
		]
	}
}

function BGDataDB() {
}

BGDataDB.prototype.getBgData = function() {
	return allBgData.bgdata;
}