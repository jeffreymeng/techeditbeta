
//helper for adjustBrightness() below.
function getBrightness(r, g, b) {
	return (r * 299 + g * 587 + b * 114) / 1000;
}


//will make a given hex color (e.g. #ff33ff) brighter by a certain percent.
//amt should be a decimal between -1 and 1. If amt is negative then the returned color
//will be darker.
function adjustBrightness(color, amt) {

	var usePound = false;

	if (color[0] == "#") {
		color = color.slice(1);
		usePound = true;
	}

	var R = parseInt(color.substring(0,2),16);
	var G = parseInt(color.substring(2,4),16);
	var B = parseInt(color.substring(4,6),16);

	// to make the colour less bright than the input
	// change the following three "+" symbols to "-"
	R = R + amt;
	G = G + amt;
	B = B + amt;

	if (R > 255) R = 255;
	else if (R < 0) R = 0;

	if (G > 255) G = 255;
	else if (G < 0) G = 0;

	if (B > 255) B = 255;
	else if (B < 0) B = 0;

	var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
	var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
	var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

	return (usePound?"#":"") + RR + GG + BB;

}

// for object o, return element at key s, where s can be deep
// e.x. in normal js: myObj.something.one, but if "something.one" is a
// dynamic string, getObjectValueByString(myObj, "something.one")
//https://stackoverflow.com/a/6491621/5511561
function getObjectValueByString(o, s) {
	s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
	s = s.replace(/^\./, '');           // strip a leading dot
	var a = s.split('.');
	for (var i = 0, n = a.length; i < n; ++i) {
		var k = a[i];
		if (k in o) {
			o = o[k];
		} else {
			return;
		}
	}
	return o;
}


//https://pastebin.com/jDp5sKT9
function setObjectValueByString(path, obj, value) {
	var parts = path.split('.');
	return parts.reduce(function(prev, curr, ix) {
		return (ix + 1 == parts.length)
			? prev[curr] = value
			: prev[curr] = prev[curr] || {};
	}, obj);
}


//for debugging within console, deletes all js accessible cookies at this path.
function deleteAllCookies() {
	var cookies = document.cookie.split(";");

	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
	Cookies.remove("cookieconsent_status");
	Cookies.remove("techedit-anonymous-user-data");
}
function merge(defualt,newObject){
	var merged = {};
	for (var attrname in defualt) { merged[attrname] = defualt[attrname]; }
	for (var attrname in newObject) { merged[attrname] = newObject[attrname]; }
	return merged;
}

//from firepad.js: https://github.com/FirebaseExtended/firepad/blob/master/lib/firepad.js
//MIT License
function colorFromUserId (userId) {
	var a = 1;
	for (var i = 0; i < userId.length; i++) {
		a = 17 * (a+userId.charCodeAt(i)) % 360;
	}
	var hue = a/360;

	return hsl2hex(hue, 1, 0.75);
}
function hsl2hex (h, s, l) {
	if (s === 0) { return rgb2hex(l, l, l); }
	var var2 = l < 0.5 ? l * (1+s) : (l+s) - (s*l);
	var var1 = 2 * l - var2;
	var hue2rgb = function (hue) {
		if (hue < 0) { hue += 1; }
		if (hue > 1) { hue -= 1; }
		if (6*hue < 1) { return var1 + (var2-var1)*6*hue; }
		if (2*hue < 1) { return var2; }
		if (3*hue < 2) { return var1 + (var2-var1)*6*(2/3 - hue); }
		return var1;
	};
	return rgb2hex(hue2rgb(h+1/3), hue2rgb(h), hue2rgb(h-1/3));
}
function rgb2hex (r, g, b) {
	function digits (n) {
		var m = Math.round(255*n).toString(16);
		return m.length === 1 ? '0'+m : m;
	}
	return '#' + digits(r) + digits(g) + digits(b);
}
(function($) {
	$.fn.hasScrollBar = function() {
		return this.get(0).scrollHeight > this.height();
	}
})(jQuery);