$.c4saGenderStyling = {

	init: function () {
		var $genderToggles = $('.jsGenderToggle');
		$genderToggles.each(function(i, elem){
			var $this = $(elem);
			if ($this.is(':checked')) {
				$.c4saGenderStyling.toggleGenderStyling($this);
			}
		});
		$genderToggles.on('change', function(){
			var $this = $(this);
			$.c4saGenderStyling.toggleGenderStyling($this);
		});
	},

	toggleGenderStyling: function($this) {
		if ($this.attr('value') === 'man') {
			$this.closest('.panel').removeClass('panel-woman').addClass('panel-man');
		} else {
			$this.closest('.panel').removeClass('panel-man').addClass('panel-woman');
		}
	}

};
