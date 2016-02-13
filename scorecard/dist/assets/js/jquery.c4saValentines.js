$.c4saValentines = {
	init: function () {
		$.c4saForms.init();
		$.c4saAgeSlider.init();
	}
};

$(document).ready(function () {
	$.c4saValentines.init();
	$('html').addClass('js-ready');
	$('.jsGenderToggle').on('change', function(){
		var $this = $(this);
		if ($this.attr('value') === 'man') {
			$this.closest('.panel').removeClass('panel-woman').addClass('panel-man');
		} else {
			$this.closest('.panel').removeClass('panel-man').addClass('panel-woman');
		}
	});
});