$.c4saValentines = {
	init: function () {
		$.c4saForms.init();
		$.c4saAgeSlider.init();
	}
};

$(document).ready(function () {
	$.c4saValentines.init();
	$('html').addClass('js-ready');

	//gender styling
	var $genderToggles = $('.jsGenderToggle');
	function toggleGenderStyling($this) {
		if ($this.attr('value') === 'man') {
			$this.closest('.panel').removeClass('panel-woman').addClass('panel-man');
		} else {
			$this.closest('.panel').removeClass('panel-man').addClass('panel-woman');
		}
	}
	$genderToggles.each(function(i, elem){
		var $this = $(elem);
		if ($this.is(':checked')) {
			toggleGenderStyling($this);
		}
	});
	$genderToggles.on('change', function(){
		var $this = $(this);
		toggleGenderStyling($this);
	});
});