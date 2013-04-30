var allAnimalData = {
	"BABOON":
	{
		"top_padding": 1,
		"bottom_padding": 1,
		"top_from": 31,
		"top_to": 80,
		"bottom_from": 27,
		"bottom_to": 103,
		"height": 100,
		"width": 135,
		"cake_score":1000,
	},
	"BEAVER":
	{
		"top_padding": 2,
		"bottom_padding": 2,
		"top_from": 14,
		"top_to": 45,
		"bottom_from": 13,
		"bottom_to": 46,
		"height": 55,
		"width": 65,
		"cake_score":3000,
	},
	"ELEPHANT":
	{
		"top_padding": 3,
		"bottom_padding": 3,
		"bottom_from": 87,
		"bottom_to": 205,
		"top_from": 53,
		"top_to": 224,
		"height": 160,
		"width": 250,
		"cake_score":300,
	},
	"FLAMINGO":
	{
		"top_padding": 3,
		"bottom_padding": 3,
		"top_from": 16,
		"top_to": 53,
		"bottom_from": 15,
		"bottom_to": 50,
		"height": 185,
		"width": 70,
		"cake_score":2000,
	},
	"GIRAFFE":
	{
		"top_padding": 5,
		"bottom_padding": 2,
		"top_from": 23,
		"top_to": 94,
		"bottom_from": 45,
		"bottom_to": 78,
		"height": 300,
		"width": 110,
		"cake_score":800,
	},
	"HIPPO":
	{
		"top_padding": 1,
		"bottom_padding": 2,
		"top_from": 97,
		"top_to": 235,
		"bottom_from": 115,
		"bottom_to": 224,
		"height": 120,
		"width": 270,
		"cake_score":600,
	},
	"LION":
	{
		"top_padding": 1,
		"bottom_padding": 1,
		"top_from": 28,
		"top_to": 80,
		"bottom_from": 20,
		"bottom_to": 88,
		"height": 155,
		"width": 125,
		"cake_score":800,
	},
	"SEAL":
	{
		"top_padding": 1,
		"bottom_padding": 1,
		"top_from": 18,
		"top_to": 50,
		"bottom_from": 4,
		"bottom_to": 105,
		"height": 110,
		"width": 110,
		"cake_score":1500,
	},
	"ZEBRA":
	{
		"top_padding": 6,
		"bottom_padding": 2,
		"top_from": 20,
		"top_to": 87,
		"bottom_from": 28,
		"bottom_to": 85,
		"height": 165,
		"width": 110,
		"cake_score":1000,
	},
	"HEDGEHOG":
	{
		"top_padding": 0,
		"bottom_padding": 0,
		"top_from": 0,
		"top_to": 105,
		"bottom_from": 0,
		"bottom_to": 105,
		"height": 100,
		"width": 105,
		"cake_score":500,
	},
}


function AnimalDB() {
}

AnimalDB.prototype.getAnimalData = function() {
	return allAnimalData;
}