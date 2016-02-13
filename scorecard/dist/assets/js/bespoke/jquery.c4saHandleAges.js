$.c4saHandleAges = {

	dataUrl: 'assets/data/data.json',
	imageUrl: 'assets/img/content/scorecard-',
	imageExtension: '.png',
	manAge: undefined,
	womanAge: undefined,

	getAges: function() {
		var youGender = $('input[name=you-gender]:checked').val();
		if (youGender === 'man') {
			$.c4saHandleAges.manAge = $('#jsYouAge').val();
			$.c4saHandleAges.womanAge = $('#jsPartnerAge').val();
		} else {
			$.c4saHandleAges.womanAge = $('#jsYouAge').val();
			$.c4saHandleAges.manAge = $('#jsPartnerAge').val();
		}
		$.c4saHandleAges.scoreLoading(true);
		$.c4saHandleAges.loadData();
	},

	scoreLoading: function(loading) {
		if (loading) {
			$.c4saLoading.replacer($('#jsScoreCard'), 'dark large');
		} else {
			$.c4saLoading.reverter($('#jsScoreCard'));
		}
	},

	loadData: function() {
		var json = (function () {
			var json = null;
			$.ajax({
				'async': true,
				'cache': true,
				'url': $.c4saHandleAges.dataUrl,
				'dataType': "json",
				'success': function (data) {
					json = data;
				}
			}).done(function() {
				$.c4saHandleAges.getAgesScore($.c4saHandleAges.manAge, $.c4saHandleAges.womanAge, json);
			});
		})();
	},

	getAgesScore: function(manAge, womanAge, data) {
		// all yours...
		console.log("Man's age: " + manAge);
		console.log("Woman's age: " + womanAge);
		console.log("Data: " + data);

		//example of updating score area
		$.c4saHandleAges.updateScore(4, 'Some text');
	},

	updateScore: function(score, text) {
		$.c4saHandleAges.scoreLoading(false);
		$('#jsScoreCardImg').attr('src', $.c4saHandleAges.imageUrl + score + $.c4saHandleAges.imageExtension);
		$('#jsScoreCardText').text(text);
	}

};
