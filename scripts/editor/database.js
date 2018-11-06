"use strict";
let databaseModule = (function() {
	let databaseModule = {};
	databaseModule.init = function() {
		var config = {
			apiKey: "AIzaSyABAa5dEDjLd46i01STVlapvKrFFMinTqo",
			authDomain: "techedit-io.firebaseapp.com",
			databaseURL: "https://techedit-io.firebaseio.com",
			projectId: "techedit-io",
			storageBucket: "techedit-io.appspot.com",
			messagingSenderId: "84859966897"
		};
		databaseModule.firebase = firebase.initializeApp(config);

	}
	databaseModule.onChatMessageSent(callback, limit) {
		if (!limit) {
			limit = 50;
		}
		if (limit < 0) {
			databaseModule.firebase.ref("/f/" + fileId + "/chat/").on("child_added", callback);

		} else {
			databaseModule.firebase.ref("/f/" + fileId + "/chat/").limitToLast(limit).on("child_added", callback);
		}
	}

	return databaseModule;
})();