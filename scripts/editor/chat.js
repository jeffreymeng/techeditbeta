var chatModule = (function(domHelper, database) {
	let chatModule = {};

	chatModule.init = function() {

	}
	/**
	 * Returns whether the chat messages div is scrolled to the bottom.
	 * @param{number} [buffer=0]: The amount in pixels the user can be scrolled away from the bottom for it to still be counted as scrolled all the way down.
	 * @returns {boolean} A boolean representing whether the user is scrolled to the bottom (or within the buffer).
	 */
	chatModule.scrolledToBottom = function(buffer) {
		// [buffer]: an optional positive integer specified so that the user must only scroll within buffer of the bottom
		// for it to be counted. Default = 0;

		if (buffer < 0) {
			logger.warn("chatModule.scrolledToBottom() treats negative buffers as 0!");
			buffer = 0;
		}
		buffer = buffer || 0;

		return ($('#chat-messages')[0].scrollHeight - $('#chat-messages').scrollTop() - buffer <= $('#chat-messages').outerHeight());

	}
	chatModule.scrollTo = function(pixels) {
		if (!pixels || pixels < 0) {
			//scroll to bottom
			$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
			return;
		}
		$('#chat-messages').scrollTop(pixels);
	}
	/**
	 * The listener that displays the chat messages initially and each time a new message is sent.
	 * @param{number} [limit=50] The number of past messages to load at initialization. Any non-positive value will load all messages.
	 */
	chatModule.initDisplayMessages = function() {
		databaseModule.onChatMessageSent(function(snapshot) {
			var message = snapshot.val();

			if (!($("#chat-loading").hasClass("hidden"))) {
				$("#chat-loading").addClass("hidden");
			}


			if (message.actionMsg != undefined && message.actionMsg) {
				$("#chat-messages").append("<p><i><b>" + (message.displayName || ("user " + message.author)) + "</b>: " + message.text + "</i></p>");
			} else {
				$("#chat-messages").append("<p><b>" + (message.displayName || ("user " + message.author)) + "</b>: " + message.text + "</p>");
			}

			if (chatModule.scrolledToBottom()) {
				chatModule.scrollTo(-1);
			}
		}, 50);

	}


	return chatModule;

})(domHelper, firebase.database())



$("#chat-input").keyup(function(e) {
	if(e.which === 13 && !e.shiftKey) {

		$("#chat-button").click();

	}
});
$("#chat-button").click(function() {
	//TODO: allow markdown, account for xss
	//TODO: Lazy load
	var message = stripText($("#chat-input").val());
	var messageStripped = message.replaceAll(" ", "");

	$("#chat-input").val("");
	firebase.database().ref("/f/" + fileId + "/chat/").push({
		text:message,
		timestamp:new Date().getTime(),
		author:userdata.uid,
		displayName:userDisplayName,
		actionMsg:false
	});
});