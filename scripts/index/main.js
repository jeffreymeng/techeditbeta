

let keyListenerModule = (function($, Mousetrap) {
	let keyListenerModule = {}
	keyListenerModule.init = function () {
		keyListenerModule.metakeypressed = false;
		keyListenerModule.pasted = false;
		keyListenerModule.initListeners();
	}
	keyListenerModule.initListeners = function () {
		Mousetrap.bind(["command", "ctrl"], function () {
			$("#paste").removeClass("invisible");
			$("#paste").focus();
			keyListenerModule.metaKeyPressed = true;


		}, "keydown");
		Mousetrap.bind(["command", "ctrl"], function () {
			$("#paste").val("").blur().addClass("invisible");
			keyListenerModule.metaKeyPressed = false;


		}, "keyup");

		Mousetrap.bind(['command', 'ctrl', "v"], function () {

			if (keyListenerModule.metaKeyPressed) {
				var value = $("#paste").val();
				if (value != "") {
					console.log(value);
					$("#paste").blur().addClass("invisible");
					localStorage.setItem("techedit-paste-to-create-data", btoa(value));
					keyListenerModule.metaKeyPressed = false;
					keyListenerModule.pasted = true;
					window.location.href = "/new.html";
				}
			}


		}, "keyup");
		Mousetrap.bind("n", function () {

			window.location.href = "/new.html";

		});
	}
	return keyListenerModule;

})(jQuery, Mousetrap);


keyListenerModule.init();