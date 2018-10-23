//http://stackoverflow.com/a/901144/5511561
function getQuery(name) {
	var  url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//http://stackoverflow.com/a/17606289/5511561s
String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};


$("#nav-file-id-btn").click(function() {
	var id = $("#nav-file-id").val().replaceAll(" ");
	if (id != "") {
		window.location.href = "/f/" + id;
	}
});