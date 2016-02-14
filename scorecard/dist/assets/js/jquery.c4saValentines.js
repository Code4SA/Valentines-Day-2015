$.c4saValentines = {
	init: function () {
		$.c4saForms.init();
		$.c4saAgeSlider.init();
		$.c4saGenderStyling.init();
	}
};

$(document).ready(function () {
	$.c4saValentines.init();
	$('html').addClass('js-ready');
});
