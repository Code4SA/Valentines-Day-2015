$.c4saHandleAges = {

	getAges: function() {
		var youGender = $('input[name=you-gender]:checked').val();
		var manAge, womanAge;
		if (youGender === 'man') {
			manAge = $('#jsYouAge').val();
			womanAge = $('#jsPartnerAge').val();
		} else {
			womanAge = $('#jsYouAge').val();
			manAge = $('#jsPartnerAge').val();
		}
		$.c4saHandleAges.getAgesScore(manAge, womanAge);
	},

	getAgesScore: function(manAge, womanAge) {
		// all yours...
		console.log("Man's age: " + manAge);
		console.log("Woman's age: " + womanAge);
	}

};
