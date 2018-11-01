updateLoadingStatus("Techedit.helper");
function updateSidebarTheme(editor, light) {

	var themeColor = getComputedStyle(editor.renderer.scroller).backgroundColor;

	//convert to int array [r, g, b]
	themeColor = themeColor.replace(/[^\d,]/g, '').split(',');

	var textColor;
	var r = themeColor[0];
	var g = themeColor[1];
	var b = themeColor[2];

	if ((!light && light != null) || getBrightness(r, g, b) < 123) {

		textColor = "#ced4da";
		gutterColor = "#6c757d";
		$('.selectpicker').selectpicker("setStyle", "btn-light", "remove");
		$('.selectpicker').selectpicker("setStyle", "btn-secondary", "add");
	} else {
		textColor = "#000000";
		gutterColor = "#EEEEEE";
		chatColor = "#d9d9d9";
		$('.selectpicker').selectpicker("setStyle", "btn-secondary", "remove");
		$('.selectpicker').selectpicker("setStyle", "btn-light", "add");

	}
	var backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";

	$(".bg-editor").css("background-color", backgroundColor);
	$(".bg-editor").css("color", textColor);
	$(".color-editor").css("color", textColor);

	$("#sidebar").css("background-color", backgroundColor);
	$("#sidebar").css("color", textColor);
	$(".gutter").css("background-color", gutterColor);
	$("#chat-messages").css("background-color", "rgba(" + r + ", " + g + ", " + b + ", 0.9)");



}

function hideLoadingText() {
	$("#loader").addClass("hidden");
	$("#split-wrapper").removeClass("hidden");
}
function showLoadingText() {
	$("#loader").removeClass("hidden");
	$("#split-wrapper").addClass("hidden");
}
function onLanguageChange() {
	var oldMode = editor.getSession().getMode().$id.substring("ace/mode/".length);
	editor.getSession().setMode("ace/mode/" + $("#lang-select").val());
	firebase.database().ref("/f/" + fileId + "/data/language/").set($("#lang-select").val());
	firebase.database().ref("/f/" + fileId + "/chat/").push({
		text:"Changed the language from " + oldMode + " to " + $("#lang-select").val(),
		actionMsg:true,
		timestamp:new Date().getTime(),
		author:userId,
		displayName:userDisplayName
	});l

}
function addUserToUserlist(username, color) {
	var html = `<li class="userlist-li userlist-addedbyjs"><div class="userlist-wrapper">` +
		`<div class="userlist-color-indicator" style="background-color:${color};"></div> ` +
		`<div class="userlist-username">${username}</div></div></li>` //+
		/*`<br class="userlist-linebreak userlist-addedbyjs"><br class="userlist-linebreak userlist-addedbyjs">`*/;
	var lighthtml = `<li class="userlist-light-li userlist-addedbyjs">${username}</li>`;

	$("#userlist").append(html);
	$("#userlist-light").append(lighthtml);
	return html;
}
function resetUserlist() {
	$(".userlist-addedbyjs").remove();
}
function onUserlistResize() {
	var fullHiddenBefore = $("#userlist-full").hasClass("hidden");
	if ($("#userlist-box").width() < 325) {
		if (!fullHiddenBefore) {
			$("#userlist-light-currentuser-input").val($("#userlist-currentuser-input").val());
		}
		$("#userlist-full").addClass("hidden");
		$("#userlist-light-box").removeClass("hidden");
	} else {
		if (fullHiddenBefore) {
			$("#userlist-currentuser-input").val($("#userlist-light-currentuser-input").val());
		}
		$("#userlist-full").removeClass("hidden");
		$("#userlist-light-box").addClass("hidden");
	}
}
function setConfirmBoxVisible(visible) {
	if (visible) {
		var html =
			`<div class="input-group-append" id="userlist-currentuser-input-confirmbox">` +
			`<button class="btn btn-success" type="button" id="userlist-currentuser-input-confirm">submit</button>` +
			`</div>`;

		// if the confirm box doesn't already exist
		if ($("#userlist-currentuser-input-confirmbox").length == 0) {
			$("#userlist-currentuser-inputgroup").append(html);
		}

	} else {
		//detach removes the element but keeps click handlers
		$("#userlist-currentuser-input-confirmbox").detach();
	}
}
function setUserData(user, path, value) {//path should be relative to /users/$UID/
	if (user != null) {
		firebase.database().ref("/users/" + user.uid + "/data/" + (path.replaceAll(".", "/") || "")).set(value);

	} else {

		var data = Cookies.get("techedit-anonymous-user-data");
		if (data == undefined) {
			data = {}
		} else {
			data = JSON.parse(data);
		}

		if (path == null || path == "") {
			data = value;
		} else {
			setObjectValueByString(path, data, value);
		}
		Cookies.set("techedit-anonymous-user-data", data, {expires:1});

	}
}
function setDisplayName(userId, userDisplayName, oldDisplayName) {//path should be relative to /users/$UID/


	firebase.database().ref("/f/" +fileId + "/users/" + userId + "/displayName/").set(userDisplayName);
	if (oldDisplayName !== false) {
		firebase.database().ref("/f/" + fileId + "/chat/").push({
			text: "Changed username from " + oldDisplayName + " to " + userDisplayName,
			actionMsg: true,
			timestamp: new Date().getTime(),
			author: userId,
			displayName: userDisplayName
		});
	}
}
function stripUsername(username) {

	return username.substring(0, 64).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

}
function reverseStripUsername(username) {

	return username.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

}
function stripText(text) {

	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

}
function reverseText(text) {

	return text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

}
function stripId(id) {
	return id.replace(new RegExp("[\\[\\]\\\\\\/\\$#\\.]", 'g'), "");
}
function safeStripUsername(username) {
	//this can be used to strip a username that should already be stripped
	//if the username has all quotes then it each quote could potentially end up being 6 characters.
	return username.substring(0, 64 * 6).replace(/</g, '&lt;').replace(/"/g, '&quot;');
}


function updateLoadingStatus(module) {
	if (!this.loadList) this.loadList = [];
	if (module) {
		$("#loader-module").html(module);
		this.loadList.push(module);
	}

	return this.loadList;
}

var editor;
var path = window.location.pathname.substring(1).split("/");
if (path[0] == "f") {
	fileId = path[1];
} else if (path[0].substring(0,4) == "edit") {//for localhost
	fileId = getQuery("id");
}

// check if document exists
// strip id will remove characters that cause firebase to throw an error, and also slashes.
// if the id is valid strip id will not change the id, if the id is invalid then no file can
// possible exist with that id and firebase will return null, so we shoe 404 as expected.
firebase.database().ref("/f/" + stripId(fileId) + "/createdOn/").once("value").then(function(snapshot) {
	if (snapshot.val() != null) {
		load();
	} else {
		//show 404
		$("#loader").addClass("hidden");
		$("#notfounderror-wrapper").removeClass("hidden");
	}
});

function load() {
	$("#notfounderror-wrapper").addClass("hidden");
	showLoadingText();
	updateLoadingStatus("Techedit.user");
	$("#editor").html("");
	let editorExists = editor != null && editor.destroy;
	if (editorExists) {
		editor.destroy();
	}
	editor = ace.edit("editor");
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			updateLoadingStatus("Techedit.user.profile");
			firebase.database().get("/users/" + user.uid + "/data/").once("value").then(function (snapshot) {
				var userdata = snapshot.val();
				userdata.uid = user.uid;
				main(user, userdata);
			});
		} else {
			updateLoadingStatus("Techedit.localuser.profile");
			//user is null
			var cookie = Cookies.get("techedit-anonymous-user-data");
			if (cookie) {
				cookie = JSON.parse(cookie);
			}
			var anonData = cookie;
			var tempuid = firebase.database().ref("/f/" + fileId + "/users/").push().key;
			var defaultData = {
				uid: tempuid,
				displayName: tempuid,
				color: colorFromUserId(tempuid),
				editor: {}
			};
			var anonData = merge(defaultData, anonData);
			setUserData(user, null, anonData);

			main(user, anonData);

		}
	});
}

var theme;
var userDisplayName;
var userId;
function main(user, userdata) {
	userId = userdata.uid;

	init(user, userdata);


	//define listeners
	updateLoadingStatus("Techedit.editor.theme.update");
	editor.renderer.on("themeLoaded", function() {
		updateSidebarTheme(editor);
	});

	updateLoadingStatus("Techedit.userlist");
	firebase.database().ref("/f/" + fileId + "/users/").on("value", function(snapshot) {
		resetUserlist();
		var users = snapshot.val();
		//https://stackoverflow.com/a/684692/5511561 (slightly adapted)
		for (var key in users) {
			if (users.hasOwnProperty(key)) {
				if (key !== userdata.uid) {
					console.log(users[key].color)
					if (users[key].color == undefined) {
						//user has been deleted
						firebase.database().ref("/f/" + fileId + "/users/" + key).set(null);
						continue;
					}
					addUserToUserlist(safeStripUsername(users[key].displayName || key), users[key].color);
					// add the initial displayname to firebase
					setDisplayName(userdata.uid, userDisplayName, false);
				} else {

					$("#userlist-currentuser-input").val(reverseStripUsername(userDisplayName));
					$("#userlist-light-currentuser-input").val(reverseStripUsername(userDisplayName));
					$("#userlist-currentuser-color-indicator").css("background-color", userdata.color);
				}
			}
		}


	});

	updateLoadingStatus("Techedit.editor.language.change");
	firebase.database().ref("/f/" + fileId + "/data/language/").on("value", function(snapshot) {
		$("#lang-select").off("change", onLanguageChange);
		var lang = snapshot.val();
		if (lang == null) {
			lang = "text";
			firebase.database().ref("/f/" + fileId + "/data/language/").set("text");
		}
		$("#lang-select").val(lang);
		$("#lang-select").selectpicker("refresh");
		editor.getSession().setMode("ace/mode/" + lang);
		$("#lang-select").on("change", onLanguageChange);
	});


	updateLoadingStatus("Techedit.theme.select");
	$("#theme-select").change(function() {
		editor.setTheme("ace/theme/" + $("#theme-select").val());
		setUserData(user, "editor.theme", $("#theme-select").val());
		updateSidebarTheme(editor);

	});

	updateLoadingStatus("Techedit.user.username.change");
	$("#userlist-currentuser-inputgroup").on("click", "#userlist-currentuser-input-confirm", function() {
		var oldName = userDisplayName;
		var username = $("#userlist-currentuser-input").val();
		setConfirmBoxVisible(false);
		userDisplayName = stripUsername(username);
		setUserData(user, "displayName", userDisplayName);
		setDisplayName(userdata.uid, userDisplayName, oldName);
		$("#userlist-light-currentuser-input").val(reverseStripUsername(userDisplayName));
	});

	$("#userlist-light-currentuser-input-confirm").click(function() {
		var oldName = userDisplayName;
		var username = $("#userlist-light-currentuser-input").val();

		$("#userlist-light-currentuser-input-confirm").attr("disabled", "disabled");
		userDisplayName = stripUsername(username);
		setUserData(user, "displayName", userDisplayName);
		setDisplayName(userdata.uid, userDisplayName, oldName);
		$("#userlist-light-currentuser-input").val(reverseStripUsername(userDisplayName));

	});
	$("#userlist-currentuser-input").on("input", function() {

		if (userDisplayName !== $(this).val()) {
			setConfirmBoxVisible(true);
		} else {
			setConfirmBoxVisible(false);
		}
	});

	$("#userlist-light-currentuser-input").on("input", function() {
		if (userDisplayName !== $(this).val()) {
			$("#userlist-light-currentuser-input-confirm").attr("disabled", false);
		} else {
			$("#userlist-light-currentuser-input-confirm").attr("disabled", "disabled");
		}

	});

	$("#userlist-currentuser-input").keypress(function(e) {
		if(e.which === 13) {

			$("#userlist-currentuser-input-confirm").click();
		}

	});
	$("#userlist-light-currentuser-input").keypress(function(e) {
		if(e.which === 13) {

			$("#userlist-light-currentuser-input-confirm").click();
		}

	});
	updateLoadingStatus("Techedit.theme.filter.change");
	$("#theme-select-popular-filter").change(function() {
		if ($(this).is(':checked')) {
			$(".theme-light-other, .theme-dark-other").addClass("hidden");
		} else {
			$(".theme-light-other, .theme-dark-other").removeClass("hidden");
		}
		$(".selectpicker").selectpicker("refresh");
		updateSidebarTheme(editor);
	});

	updateLoadingStatus("Techedit.editor.printmargin.change");
	$("#print-margin-checkbox").change(function() {
		if ($(this).is(":checked")) {
			editor.setShowPrintMargin(true);
			setUserData(user, "editor.printMargin", $("#print-margin-length").val() || 80);
			$("#print-margin-collapse").collapse("show");
		} else {
			editor.setShowPrintMargin(false);
			setUserData(user, "editor.printMargin", -1);
			$("#print-margin-collapse").collapse("hide");
		}
	});
	$("#print-margin-length").on("input", function() {
		var column = $("#print-margin-length").val();
		if (column < 1) {
			$("#print-margin-length").val(1);
			return;
		}
		editor.setShowPrintMargin(true);
		editor.setPrintMarginColumn(column);
		setUserData(user, "editor.printMargin", column);

	});
	updateLoadingStatus("Techedit.editor.keymap.change");
	$("#keymap-select").change(function() {
		var keymap = $("#keymap-select").val();
		editor.setKeyboardHandler("ace/keyboard/" + keymap);
		setUserData(user, "editor.keymap", keymap);
	});
	updateLoadingStatus("Techedit.user.deleteData.change");
	$("#delete-user-data").click(function() {
		$("#settings-tab-user-confirm-actionspan").text("delete all data, then reload the page.");
		$("#settings-tab-user-main").addClass("hidden");
		$("#settings-tab-user-confirm").removeClass("hidden");
		$("#delete-user-data-confirm").off();
		$("#delete-user-data-confirm").text("I Understand, Reload This Page and Delete All My Data");
		$("#delete-user-data-confirm").click(function() {
			deleteAllCookies();
			window.location.reload();

		});
	});
	$("#delete-user-data-cancel").click(function() {
		$("#settings-tab-user-confirm").addClass("hidden");
		$("#settings-tab-user-main").removeClass("hidden");
	});
	$("#settings-modal").on("hidden.bs.modal", function() {
		$("#settings-tab-user-confirm").addClass("hidden");
		$("#settings-tab-user-main").removeClass("hidden");
		window.location.href = "#";
	});
	$("#settings-modal").on("shown.bs.modal", function() {
		window.location.href = "#settings-main";
	});
	$("#settings-modal a[data-toggle='tab']").on('shown.bs.tab', function (e) {
		console.log(e.target);
		window.location.href = "#settings-" + e.target;
	});
	$("#import-user-data-btn").click(function() {
		$("#settings-tab-user-confirm-actionspan").text("delete all data and replace " +
			"it with the data from the file, then reload the page. If you select the wrong file or the file is corrupted, " +
			"your settings will be set to the default settings!");
		$("#settings-tab-user-confirm").removeClass("hidden");
		$("#settings-tab-user-main").addClass("hidden");
		$("#delete-user-data-confirm").off();
		$("#delete-user-data-confirm").text("I Understand, Reload This Page and Update All My Data");
		$("#delete-user-data-confirm").click(function() {
			var file = $("#import-user-data-filepicker")[0].files[0];
			var reader = new FileReader();
			console.log(file);
			reader.onload = function(e) {
				var text = e.target.result;
				console.log(text);
				console.log(JSON.parse(text))
			};
			var text = reader.readAsText(file);

			//window.location.reload();

		});
	});

	updateLoadingStatus("Techedit.user.data")

	//https://stackoverflow.com/a/30800715
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(Cookies.get("techedit-anonymous-user-data"));
	$("#export-user-data").attr("href", dataStr);
	$("#export-user-data").attr("download", "techedit-localUserData" + userdata.uid + ".json");

	$('#import-user-data-filepicker').on('change',function(){
		//get the file name
		var fileName = $(this).val();
		fileName = fileName.substring(fileName.lastIndexOf("\\") + 1)
		//replace the "Choose a file" label
		$(this).next('.custom-file-label').css("white-space: nowrap;overflow:hidden;");
		$(this).next('.custom-file-label').html(fileName);
	});

	updateLoadingStatus("Techedit.ui");

}
function init(user, userdata) {
	updateLoadingStatus("Techedit.js.init");
	if (userdata.editor) {
		//if userdata.editor.theme is undefined it will be caught at the if statement
		theme = userdata.editor.theme;
	}
	if (theme == undefined) {
		theme = "monokai";
		setUserData(user, "editor.theme", theme);
	}

	userDisplayName = userdata.displayName;
	setConfirmBoxVisible(false);
	$("#userlist-light-currentuser-input-confirm").attr("disabled", "disabled");

	updateLoadingStatus("Techedit.editor.theme");
	editor.setTheme("ace/theme/" + theme);
	$("#theme-select").selectpicker("val", theme);
	updateLoadingStatus("Techedit.editor.language");
	//editor.getSession().setMode("ace/mode/text");

	updateLoadingStatus("Techedit.editor.printMargin");

	if (userdata.editor.printMargin > 0) {
		editor.setShowPrintMargin(true);
		editor.setPrintMarginColumn(parseInt(userdata.editor.printMargin, 10));

		$("#print-margin-length").val(userdata.editor.printMargin);
		$("#print-margin-checkbox").attr("checked", "checked");
		$("#print-margin-collapse").collapse("show");
	} else {
		editor.setShowPrintMargin(false);
	}


	updateLoadingStatus("Techedit.editor.keymap");
	if (userdata.editor.keymap != null && userdata.editor.keymap !== "default") {
		$("#keymap-select").selectpicker("val", userdata.editor.keymap);
		editor.setKeyboardHandler("ace/keyboard/" + userdata.editor.keymap);
	}



	updateLoadingStatus("Techedit.splitview");

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		$(".selectpicker").selectpicker("mobile");
		$(".selectpicker").attr("data-mobile", "true");

		var split = Split(["#editor-box", "#sidebar"],
			{
				onDragEnd:function() {
					editor.resize();

				},
				onDrag:onUserlistResize,
				minSize:[0,0],
				gutterSize:30,
				sizes: [100, 0],
			});

	} else {
		var split = Split(["#editor-box", "#sidebar"],
			{
				onDragEnd:function() {
					editor.resize();

				},
				onDrag:onUserlistResize,
				minSize:[0,0],
				sizes: [73, 27],
			});
	}


	//check for sidebar resize
	$(window).resize(onUserlistResize);




	// Get Firebase Database reference.

	updateLoadingStatus("Techedit.file.data");
	var firepadRef = firebase.database().ref("/f/" + fileId);

	firebase.database().ref("/f/" + fileId + "/data/").once("value").then(function(snapshot) {
		var data = snapshot.val();
		if (!data) {
			data = {};
		}
		if (!data.language) {
			data.language = "text";
			firebase.database().ref("/f/" + fileId + "/data/language/").set(data.language);
		}
		$("#lang-select").off("change", onLanguageChange);
		$("#lang-select").val(data.language);
		$("#lang-select").selectpicker("refresh");
		$("#lang-select").on("change", onLanguageChange);
		updateLoadingStatus("Techedit.sync.engine");
		var initialText = null;
		if (data.initialization != undefined) {
			initialText = atob(data.initialization.text);
			firebase.database().ref("/f/" + fileId + "/data/initialization/").set(null);
		}
		var firepad = Firepad.fromACE(firepadRef, editor, {
			userId:userdata.uid,
			color:userdata.color,
			defaultText:initialText
		});

		firepad.on("ready", function() {
			updateLoadingStatus("Techedit.final");
			hideLoadingText();

			onUserlistResize();

			// We need this because when the document is loading, the chat-messages div is not visible and
			// therefore it's scrollHeight will be 0 and it will not scroll.
			// After the page is loaded, the div is scrolled on each new message in the firebase
			// .on function.
			$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);

		});

	});
}