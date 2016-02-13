$.c4saForms = {

	elementScope: 'body',

	init: function () {
		this.enhancedRadioInit();
	},

	enhancedRadioInit: function (element, elementScope) {
		$.c4saHelpers.applyToEach(
			$.c4saHelpers.setCustomValue('input[type="radio"]', element),
			$.c4saHelpers.setCustomValue($.c4saForms.elementScope, elementScope),
			$.c4saForms.enhancedRadio
		);
	},

	enhancedRadio: function (i, radio) {
		var $radio = $(radio);
		var $eRadio = $('<span class="enhanced-radio">' + $radio[0].outerHTML + '</span>');
		$radio.after($eRadio);
		$radio.remove();
		var $radioN = $eRadio.find('input');
		if ($radioN.is(':checked')) {
			$eRadio.addClass('selected');
		}
		$radioN.on('change', function (e) {
			var $eRadio = $(e.currentTarget).parent().siblings('.enhanced-radio');
			return $.c4saForms.enhancedRadioChange($eRadio);
		});
	},

	enhancedRadioChange: function ($eRadio) {
		$eRadio.toggleClass('selected');
		$.c4saForms.resetEnhancedRadioInit();
		return true;
	},

	resetEnhancedRadioInit: function (element, elementScope) {
		$.c4saHelpers.applyToEach(
			$.c4saHelpers.setCustomValue('input[type="radio"]', element),
			$.c4saHelpers.setCustomValue($.c4saForms.elementScope, elementScope),
			$.c4saForms.resetEnhancedRadio
		);
	},

	resetEnhancedRadio: function (i, radio) {
		var $radio = $(radio);
		if ($radio.is(':checked')) {
			$radio.closest('.enhanced-radio').addClass('selected');
		} else {
			$radio.closest('.enhanced-radio').removeClass('selected');
		}
	}

};