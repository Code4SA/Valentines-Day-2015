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
                gender_plural : (youGender == 'man') ? 'men' : 'women',
                age : (youGender == 'man') ? manAge : womanAge,
                wedding : (youGender == 'man') ? 'groom' : 'bride'
            },
            them : {
                gender : (youGender == "man") ? 'woman' : 'man',
                gender_plural : (youGender == 'man') ? 'women' : 'men',
                age : (youGender == 'man') ? womanAge : manAge,
                wedding : (youGender == 'man') ? 'bride' : 'groom'
            }
        }
        var you = genderData.you;
        var them = genderData.them;

        var ageRanges = [], firstBound = 18, lastBound = 104, rangeWidth = 5;
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

        var getRangeLabel = function(val) {
            for (idx in ageRanges) {
                if (val < ageRanges[idx])
                    return ageRanges[idx] - rangeWidth + ' - ' + (ageRanges[idx] - 1);
            }
            throw 'Value: ' + val + ' does not fit within range';
        }

        var total = 0, minAge = Infinity, maxAge = -Infinity;
        var numAge = 0;
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

                if (them.age == them.weddingAge)
                    numAge += count;
            }
        }
        var themRange = getRangeIndex(them.age);
        var numInRange = marriageAges[themRange];
        var perc = numInRange / total;
        var mean = 1 / 3;
        var ratio = perc / mean;
        var range = getRangeLabel(them.age);

        var facts = $.c4saFastFacts;
        var textFacts = '<p><strong>Fast facts:</strong> ' + facts[Math.round(Math.random() * (facts.length - 1))] + '</p>';
        var textAges = String.format('Did you know that in that year, a {0} your age married a {1} year-old {4} and another married a {2} year-old {4}', you.gender, minAge, maxAge, you.gender, them.gender);
        var textContext = String.format('Of the {0} {1} year-old {2} who married in 2014, {3} of them married in the {4} range.', total.toLocaleString(), you.age, you.gender_plural, numInRange.toLocaleString(), range);

        if (isNaN(perc)) perc = 0;

        var ratingsText = {
            0 : 'There were no couples of your ages who married in 2014. Even if this isn\'t illegal you might want to re-consider your choices.',
            1 : textContext + ' ' + 'Your relationship might work if you are a special couple but it is very unusual.' +  ' ' + textAges,
            2 : 'Not a very common pairing but not rare.' + ' ' + textContext + ' ' + 'Not the best odds, but you’re in with a fighting chance. ',
            3 : String.format('Great match!: Definitely long-term potential.', you.age, you.gender_plural, them.gender_plural) + ' ' + textContext + ' ' + textAges,
        }

        if (ratio > 1.1)
            rating = 3
        else if (ratio > 0.6)
            rating = 2;
        else if (ratio > 0)
            rating = 1;
        else
            rating = 0;

        var text = ratingsText[rating] + ' ' + textFacts;

		$.c4saHandleAges.updateScore(rating + 1, text);
	},

	updateScore: function(score, text) {
		$.c4saHandleAges.scoreLoading(false);
		$('#jsScoreCardImg').attr('src', $.c4saHandleAges.imageUrl + score + $.c4saHandleAges.imageExtension);
		$('#jsScoreCardText').html(text);
	}

};
