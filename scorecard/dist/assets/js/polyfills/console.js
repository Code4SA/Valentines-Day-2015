// prevent console errors in browsers that are, like, "what the flip is a console"?
if (typeof console === "undefined") {
	console = {};
	console.log = function () {};
	console.dir = function () {};
	console.error = function () {};
}
var dd = function () {
	console.log.apply(console, arguments);
};
