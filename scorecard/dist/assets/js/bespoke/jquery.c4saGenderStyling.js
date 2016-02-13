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
		var $parentPanel = $this.closest('.panel');
		var $partnerPanel = $parentPanel.siblings('.panel-gender');
		var $partnerToggle;
		if ($this.attr('value') === 'man') {
			$parentPanel.removeClass('panel-woman').addClass('panel-man');
			$partnerPanel.removeClass('panel-man').addClass('panel-woman');
			$partnerToggle = $('.jsGenderToggle[value=woman]', $partnerPanel);
			$partnerToggle.prop('checked', true);
			$.c4saForms.setBinaryToggle($partnerToggle);

		} else {
			$parentPanel.removeClass('panel-man').addClass('panel-woman');
			$partnerPanel.removeClass('panel-woman').addClass('panel-man');
			$partnerToggle = $('.jsGenderToggle[value=man]', $partnerPanel);
			$partnerToggle.prop('checked', true);
			$.c4saForms.setBinaryToggle($partnerToggle);
		}
		$.c4saHandleAges.getAges();
	}

};
