module.exports = function() {
	function alterPersonality(splitPersonality, value) {
		var index = negativelyAffectedType % 4;
		splitPersonality[index] = (parseInt(splitPersonality[index]) - value).toString();
		return splitPersonality.join('.');
	}

	return {
		updatePersonality: function(currentPersonality, negativelyAffectedType, answer) {
			var splitPersonality = currentPersonality.split('.');
			switch(answer) {
				case 0:
					return alterPersonality(splitPersonality, 20);
				case 1:
					return alterPersonality(splitPersonality, 10);
				case 2:
					return alterPersonality(splitPersonality, 0);
				case 3:
					return alterPersonality(splitPersonality, -10);
				case 4:
					return alterPersonality(splitPersonality, -20);
			};
		},
		formatPersonality: function(currentPersonality) {
			var splitPersonality = currentPersonality.split('.');
			return {
					type1: {
						label: parseInt(splitPersonality[0])<0?'I':'E',
						percentage: parseInt(splitPersonality[0])
					},
					type2: {
						label: parseInt(splitPersonality[1])<0?'N':'S',
						percentage: parseInt(splitPersonality[1])
					},
					type3: {
						label: parseInt(splitPersonality[2])<0?'T':'F',
						percentage: parseInt(splitPersonality[2])
					},
					type4: {
						label: parseInt(splitPersonality[3])<0?'P':'J',
						percentage: parseInt(splitPersonality[3])
					}
			};
		};
	};
}