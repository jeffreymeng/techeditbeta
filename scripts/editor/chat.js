firebase.database().ref("/f/" + fileId + "/chat/").limitToLast(50).on("child_added", function(snapshot) {
	var message = snapshot.val();
	if (!($("#chat-loading").hasClass("hidden"))) {
		$("#chat-loading").addClass("hidden");
	}

	// if user is scrolled within 10px of the bottom.
	var scroll = ($('#chat-messages')[0].scrollHeight - $('#chat-messages').scrollTop() - 10 <= $('#chat-messages').outerHeight());

	if (message.actionMsg != undefined && message.actionMsg) {
		$("#chat-messages").append("<p><i><b>" + (message.displayName || ("user " + message.author)) + "</b>: " + message.text + "</i></p>");
	} else {
		$("#chat-messages").append("<p><b>" + (message.displayName || ("user " + message.author)) + "</b>: " + message.text + "</p>");
	}

	if (scroll) {
		$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
	}


});
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