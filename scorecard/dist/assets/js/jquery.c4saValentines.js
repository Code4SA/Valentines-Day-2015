$.c4saFED = {
	init: function () {
		//reusable modules and bespoke scripts initiated here
		$.c4saScheduleView.init(); //default selectors set to strict viewer (ie conflict = exact same start time)
		$.c4saScheduleView.init('.ncop-meeting', '#jsScheduleViewerRealistic', false); //apply to probable viewer (ie conflict = start times that coincide within 30 minutes or less)
	}
};

if (!window.operamini) { //exclude opera mini from client-side js stuff because of the idiosyncratic way it deals with JS interactions.
	$(document).ready(function () {
		$.c4saFED.init();
		$('html').addClass('js-ready'); // for better progressive enhancement of CSS assumptions (any JS errors, or lack of JS support, would prevent this from happening, meaning the CSS can behave accordingly).
	});
}