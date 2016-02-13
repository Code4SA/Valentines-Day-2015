$.c4saHelpers = {

	setCustomValue: function (defaultValue, customValue) {
		return customValue !== undefined ? customValue : defaultValue;
	},

	applyToEach: function (element, elementScope, callback) {
		$.each($(element, elementScope), callback);
	}

};
