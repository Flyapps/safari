var allLevelData = [
	{
		"id":0,
		"animals_unlocked":["BABOON","GIRAFFE", "ELEPHANT"],
		//"animals_unlocked":["BABOON", "GIRAFFE", "ELEPHANT"],
		"xp": 0,
		"base": "ELEPHANT",
		"swing_duration":2000,
		"acceleration_factor":0.97,
		"aim": {
			"durationY":500,
			"durationX":1000,
		},
		"probabilities": {
			"hedgehog":0.15,
			"bee":0.15,
			"flyingBonus":0.08,
		},
		"skill_bonus": 100,
	},
	{
		"id":1,
		"animals_unlocked":["HIPPO"],
		"xp": 5000,
		"base": "HIPPO",
		"swing_duration":2000,
		"acceleration_factor":0.96,
		"aim": {
			"durationY":500,
			"durationX":1000,
		},
		"probabilities": {
			"hedgehog":0.15,
			"bee":0.15,
			"flyingBonus":0.08,
		},
		"skill_bonus": 100,
	},	
	{
		"id":2,
		"animals_unlocked":["LION"],
		"xp": 15000,
		"base": "LION",
		"swing_duration":2000,
		"acceleration_factor":0.96,
		"aim": {
			"durationY":500,
			"durationX":1000,
		},
		"probabilities": {
			"hedgehog":0.15,
			"bee":0.15,
			"flyingBonus":0.08,
		},
		"skill_bonus": 100,
	},
	{
		"id":3,
		"animals_unlocked":["ZEBRA"],
		"xp": 40000,
		"base": "ZEBRA",
		"swing_duration":2000,
		"acceleration_factor":0.96,
		"aim": {
			"durationY":500,
			"durationX":1000,
		},
		"probabilities": {
			"hedgehog":0.15,
			"bee":0.15,
			"flyingBonus":0.08,
		},
		"skill_bonus": 100,
	},
	{
		"id":4,
		"animals_unlocked":["SEAL"],
		"xp": 70000,
		"base": "SEAL",
		"swing_duration":2000,
		"acceleration_factor":0.95,
		"aim": {
			"durationY":500,
			"durationX":1000,
		},
		"probabilities": {
			"hedgehog":0.15,
			"bee":0.15,
			"flyingBonus":0.08,
		},
		"skill_bonus": 100,
	},
	{
		"id":5,
		"animals_unlocked":["FLAMINGO"],
		"xp": 100000,
		"base": "FLAMINGO",
		"swing_duration":2000,
		"acceleration_factor":0.95,
		"aim": {
			"durationY":500,
			"durationX":1000,
		},
		"probabilities": {
			"hedgehog":0.15,
			"bee":0.15,
			"flyingBonus":0.08,
		},
		"skill_bonus": 100,
	},
	{
		"id":6,
		"animals_unlocked":["BEAVER"],
		"xp": 140000,
		"base": "BEAVER",
		"swing_duration":2000,
		"acceleration_factor":0.95,
		"aim": {
			"durationY":500,
			"durationX":1000,
		},
		"probabilities": {
			"hedgehog":0.15,
			"bee":0.15,
			"flyingBonus":0.08,
		},
		"skill_bonus": 100,
	},
]

function LevelDB() {
}

LevelDB.prototype.getLevelData= function() {
	return allLevelData;
}