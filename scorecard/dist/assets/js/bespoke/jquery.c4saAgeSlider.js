$.c4saAgeSlider = {

	elementScope: 'body',
	sliderClass: '.range-slider',
	interestRate: $('#jsMonthsCalcIn').data("interest-rate"),

	init: function (element, elementScope) {
		$.c4saHelpers.applyToEach(
			$.c4saHelpers.setCustomValue($.c4saAgeSlider.sliderClass, element),
			$.c4saHelpers.setCustomValue($.c4saAgeSlider.elementScope, elementScope),
			$.c4saAgeSlider.rangeSlider
		);
	},

	rangeSlider: function(i, elem) {
		//uses rangeslider polyfill - polyfils/jquery.rangeslider.min.js
		$(elem).rangeslider(
			{
				// Feature detection the default is true.
				// Set this to false if you want to use
				// the polyfill also in Browsers which support
				// the native <input type="range"> element.
				polyfill: false,
				// Default CSS classes
				rangeClass: 'rangeslider',
				disabledClass: 'rangeslider--disabled',
				horizontalClass: 'rangeslider--horizontal',
				verticalClass: 'rangeslider--vertical',
				fillClass: 'rangeslider__fill',
				handleClass: 'rangeslider__handle',
				onInit: function() {
					$.c4saAgeSlider.agePairingCalc($(this));
				},
				onSlide: function(position, value) {
					$.c4saAgeSlider.agePairingCalc($(this));
				},
				onSlideEnd: function(position, value) {
					$.c4saAgeSlider.agePairingCalc($(this));
				}
			}
		);
	},

	agePairingCalc: function($this) {
		
	}

};
