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

if (!Array.preAllocate) {
    Array.preAllocate = function(size, val) {
        var arr = [];
        val = val || 0;
        for (i = 0; i < size; i++)
            arr.push(val);
        return arr;
    }
}

$.c4saHandleAges = {

	dataLoaded: false,
	dataUrl: 'assets/data/data.json',
	json: undefined,
	imageUrl: 'assets/img/content/scorecard-',
	imageExtension: '.png',
	manAge: undefined,
	womanAge: undefined,
    youGender: undefined,

	getAges: function() {
		var youGender = $('input[name=you-gender]:checked').val();
        $.c4saHandleAges.youGender = youGender;
		if (youGender === 'man') {
			$.c4saHandleAges.manAge = $('#jsYouAge').val();
			$.c4saHandleAges.womanAge = $('#jsPartnerAge').val();
		} else {
			$.c4saHandleAges.womanAge = $('#jsYouAge').val();
			$.c4saHandleAges.manAge = $('#jsPartnerAge').val();
		}
		$.c4saHandleAges.scoreLoading(true);
		if ($.c4saHandleAges.dataLoaded) {
			$.c4saHandleAges.getAgesScore($.c4saHandleAges.youGender, $.c4saHandleAges.manAge, $.c4saHandleAges.womanAge, $.c4saHandleAges.json);
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
				'dataType': 'json',
				'success': function (data) {
					$.c4saHandleAges.json = data;
				}
			}).done(function() {
				$.c4saHandleAges.dataLoaded = true;
				$.c4saHandleAges.getAgesScore($.c4saHandleAges.youGender, $.c4saHandleAges.manAge, $.c4saHandleAges.womanAge, $.c4saHandleAges.json);
			});
		})();
	},

	getAgesScore: function(youGender, manAge, womanAge, data) {
        youGender = youGender || 'man';
        var genderData = {
            you : {
                gender : youGender,
                age : (youGender == 'man') ? manAge : womanAge,
                wedding : (youGender == 'man') ? 'groom' : 'bride'
            },
            them : {
                gender : (youGender == "man") ? 'woman' : 'man',
                age : (youGender == 'man') ? womanAge : manAge,
                wedding : (youGender == 'man') ? 'bride' : 'groom'
            }
        }
        var you = genderData.you;
        var them = genderData.them;

        var ageRanges = [], firstBound = 18, lastBound = 100, rangeWidth = 5;
        for (i = firstBound; i <= lastBound; i += rangeWidth)
            ageRanges.push(i);

        var marriageAges = Array.preAllocate(ageRanges.length, 0);
        var getRangeIndex = function(val) {
            for (idx in ageRanges) {
                if (val < ageRanges[idx])
                    return idx;
            }
            throw 'Value: ' + val + ' does not fit within range';
        }

        var total = 0, minAge = Infinity, maxAge = -Infinity;
        for (el in data) {
            var m = data[el];
            var count = parseInt(m['count']);
            you.weddingAge = parseInt(m[you.wedding]);
            them.weddingAge = parseInt(m[them.wedding]);
            if (you.weddingAge == you.age) {
                minAge = them.weddingAge < minAge ? them.weddingAge : minAge;
                maxAge = them.weddingAge > maxAge ? them.weddingAge : maxAge;
                total += count;
                idx = getRangeIndex(them.weddingAge);
                marriageAges[idx] += count;
            }
        }
        var ratings = [0, 0.20, 0.3, 0.40];
        var themRange = getRangeIndex(them.age);
        var numInRange = marriageAges[themRange];
        var perc = numInRange / total;
        var textAges = String.format('Did you know that in that year, a {0} year-old {3} married a {1} year-old {4}, another {0} year-old {3} married a {2} year-old {4}', you.age, minAge, maxAge, you.gender, them.gender) 
        if (isNaN(perc)) perc = 0;

        var ratingsText = {
            0 : 'There were no couples of your ages who married in 2014. Even if this isn\'t illegal you might want to re-consider your choices.',
            1 : String.format('Only {0} couples of your ages married in 2014. It might work if you are a special couple but it is very unusual.', numInRange) + ' ' + textAges,
            2 : String.format('Long Shot: Only {0} couples of your ages married in 2014. Not the best odds, but you’re in with a fighting chance. ', numInRange) + ' ' + textAges,
            3 : 'Safe bet!: Definite long-term potential.' + ' ' + textAges,
            4 : 'Superb!: This match has the strongest love connection.' + ' ' + textAges
        }

        var rating = 3;
        for (idx in ratings) {
            if (perc <= ratings[idx]) {
                rating = parseInt(idx);
                break;
            }
        }
        var text = ratingsText[rating];
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
