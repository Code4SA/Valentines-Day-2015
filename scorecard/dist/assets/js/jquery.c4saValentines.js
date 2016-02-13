$.c4saValentines = {
	init: function () {
		$.c4saForms.init();
	}
};

$(document).ready(function () {
	$.c4saValentines.init();
	$('html').addClass('js-ready');
});