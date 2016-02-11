if (document.location.hostname == "localhost") {
    var baseurl = "";
} else {
    var baseurl = "http://code4sa.org/Valentines-Day-2016/times/";
}

document.write('<script type="text/javascript" src="' + baseurl + 'assets/pym.js"></script>')
document.write(" <script>var pymParent = new pym.Parent('slopeEmbed', '" + baseurl + "index.html', {});</script>")
