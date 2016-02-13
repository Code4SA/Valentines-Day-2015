if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

$.c4saHandleAges = {

	dataLoaded: false,
	dataUrl: 'assets/data/data.json',
	json: undefined,
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
		if ($.c4saHandleAges.dataLoaded) {
			$.c4saHandleAges.getAgesScore($.c4saHandleAges.manAge, $.c4saHandleAges.womanAge, $.c4saHandleAges.json);
		} else {
			$.c4saHandleAges.loadData();
		}
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
					$.c4saHandleAges.json = data;
				}
			}).done(function() {
				$.c4saHandleAges.dataLoaded = true;
				$.c4saHandleAges.getAgesScore($.c4saHandleAges.manAge, $.c4saHandleAges.womanAge, $.c4saHandleAges.json);
			});
		})();
	},

	getAgesScore: function(manAge, womanAge, data) {
        var age_ranges = [];
        for (i = 18; i <= 100; i+=5) {
            age_ranges.push(i);
        }

        var getRangeIndex = function(val) {
            for (idx in age_ranges) {
                if (val < age_ranges[idx])
                    return idx;
            }
            throw "Value: " + val + " does not fit within range";
        }
        var marriage_ages = [];
        for (el in age_ranges) marriage_ages.push(0);

        var total = 0;
        var min_age = Infinity;
        var max_age = -Infinity;
        for (el in data) {
            var m = data[el];
            var groom = parseInt(m["groom"]);
            var bride = parseInt(m["bride"]);
            var count = parseInt(m["count"]);
            if (groom == manAge) {
                min_age = bride < min_age ? bride : min_age;
                max_age = bride > max_age ? bride : max_age;
                total += count;
                idx = getRangeIndex(bride);
                marriage_ages[idx] += count;
            }
        }
        var ratings = [0, 0.25, 0.5, 0.75];
        var woman_range = getRangeIndex(womanAge);
        var num_in_range = marriage_ages[woman_range];
        var perc = num_in_range / total;
        var text_ages = String.format("Did you know that a {0} year-old man married a {1} year-old woman, another {0} year-old man married a {2} year-old woman", manAge, min_age, max_age) 
        if (isNaN(perc)) perc = 0;

        var ratings_text = {
            0 : "There were no couples of your ages who married in 2014. Even if this isn't illegal you might want to re-consider your choices.",
            1 : String.format("Only {0} couples of your ages married in 2014. It might work if you are a special couple but it is very unusual.", num_in_range) + " " + text_ages,
            2 : String.format("Long Shot: Only {0} couples of your ages married in 2014. Not the best odds, but you’re in with a fighting chance. ", num_in_range) + " " + text_ages,
            3 : "Safe bet!: Definite long-term potential." + " " + text_ages,
            4 : "Superb!: This match has the strongest love connection." + " " + text_ages
        }

        var rating = 3;
        console.log(perc);
        for (idx in ratings) {
            if (perc <= ratings[idx]) {
                rating = parseInt(idx);
                break;
            }
        }
        var text = ratings_text[rating];
        rating -= 1;
        if (rating < 0) rating = 0;

		$.c4saHandleAges.updateScore(rating + 1, text);
	},

	updateScore: function(score, text) {
		$.c4saHandleAges.scoreLoading(false);
		$('#jsScoreCardImg').attr('src', $.c4saHandleAges.imageUrl + score + $.c4saHandleAges.imageExtension);
		$('#jsScoreCardText').text(text);
	}

};
