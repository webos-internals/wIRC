function ircDcc(params)
{
	this.STATUS_WAITING	=	1;
	this.STATUS_CONNECT	=	2;
	this.STATUS_ACTIVE	=	3;
	this.STATUS_ABORTED	=	4;
	this.STATUS_FAILED	=	5;
	
	this.id =			params.dcc_id;
	this.nick =			params.nick;
	this.params =		params;
	this.server =		params.server;
	this.address =		params.address;
	this.filename =		params.filename;
	this.size =			params.size;
	this.path =			'/media/internal/wirc/downloads/';
	
	this.startTime = 	false;
	
	this.status = 		false;
	this.fstatus = 		0;
	
	this.picker =		false;
	
	this.bitsIn =		0;
	this.bitsOut =		0;
	
	this.messages =		[];
	this.percent =		0;
	
	this.requestBannerName =	'dcc-' + this.server.id + '-' + this.id;
	this.requestDashName =		'dccdash-' + this.server.id + '-' + this.id;
	
	this.chatBannerName =		'dccchatbanner-' + this.server.id + '-' + this.id;
	this.chatDashName =			'dccchatdash-' + this.server.id + '-' + this.id;
	this.chatDashController =	false;
	this.chatDashAssistant =	false;
	this.chatStageName =		'dccchat-' + this.server.id + '-' + this.id;
	this.chatStageController =	false;
	this.chatAssistant =		false;
	
	this.sendBannerName =		'dccsendbanner-' + this.server.id + '-' + this.id;
	this.sendDashName =			'dccsenddash-' + this.server.id + '-' + this.id;
	this.sendDashController =	false;
	this.sendDashAssistant =	false;
}

ircDcc.prototype.isChat = function()
{
	return (this.filename && this.size ? false : true);
}
ircDcc.prototype.isFile = function()
{
	return (this.filename && this.size ? true : false);
}

ircDcc.prototype.openRequest = function()
{
	try
	{
		
		if (this.isFile()) {
			var msgText = this.nick.name + ' wants to send: ' + this.filename;
			var icon = 'icon-dcc-send.png';
		}
		else {
			var msgText = this.nick.name + ' wants to chat';
			var icon = 'icon-dcc-chat.png';
		}
		
		Mojo.Controller.appController.showBanner
		(
			{
				icon: icon,
				messageText: msgText,
				soundClass: (prefs.get().dashboardInviteSound?"alerts":"")
			},
			{
				type: 'dcc',
				server: this.server.id,
				id: this.id
			},
			this.requestBannerName
		);
					
		var tmpController = Mojo.Controller.appController.getStageController(this.requestDashName);
	    if (tmpController) 
		{
			// do nothing on second invite if dash already exists?
		}
		else
		{
			Mojo.Controller.appController.createStageWithCallback({name: this.requestDashName, lightweight: true}, this.openRequestCallback.bind(this), "dashboard");
		}
		
	}
	catch (e)
	{
		Mojo.Log.logException(e, "ircDcc#openRequest");
	}
}
ircDcc.prototype.openRequestCallback = function(controller)
{
	controller.pushScene('dcc-request-dashboard', this);
}
ircDcc.prototype.closeRequest = function()
{
	try
	{
		Mojo.Controller.appController.removeBanner(this.requestBannerName);
		Mojo.Controller.appController.closeStage(this.requestDashName);
	}
	catch (e)
	{
		Mojo.Log.logException(e, "ircDcc#closeRequest");
	}
}

ircDcc.prototype.accept = function()
{
	this.startTime = new Date();
	if (this.isFile())
	{
		alert('Got here 1');
		this.picker = new filePicker({
			type: 'folder',
			pop: true,
			folder: this.path,
			onSelect: this.acceptSend.bind(this)
		});
	}
	else
	{
		alert('Got here 2');
		plugin.dcc_accept(servers.getServerArrayKey(this.server.id), this.id, "", 0);
	}
}
ircDcc.prototype.acceptSend = function(value)
{
	if (value)
	{
		this.path = value;
		plugin.dcc_accept(servers.getServerArrayKey(this.server.id), this.id, this.path + this.filename, this.size);
		this.server.openDccList();
	}
	else
	{
		this.decline();
	}
	this.filePicker = false;
}

ircDcc.prototype.decline = function()
{
	plugin.dcc_decline(servers.getServerArrayKey(this.server.id), this.id);
	plugin.dcc_destroy(servers.getServerArrayKey(this.server.id), this.id);
}

ircDcc.prototype.handleEvent = function(status, length, data)
{
	var l = parseInt(length);
	this.bitsIn += l;
	
	//alert('status: '+status+', length: '+length+', data: '+data);
	
	if (this.isChat())
	{
		if (l == 0 && data == '(null)') {
			if (this.status > 0) {
				this.newMessage('type2', false, 'DCC CHAT to ' + this.nick.name + ' lost (' + status + ')');
				this.status = 0;
			} else {
				this.status = this.STATUS_ACTIVE;
				this.openChatStage();
				this.newMessage('type2', false, 'DCC CHAT connection established to ' + this.nick.name + ' [' + this.ip + ':' + this.port + ']', true);
			}
		}
		else {
			this.updateChatStats();
			if (length > 0) 
				this.newMessage('privmsg', this.nick, data);
		}
	}
	else {
		if (parseInt(data))
			this.percent = this.bitsIn/this.size*100;
		else {
			if (parseInt(status))
				this.fstatus = 2;
			else
				this.fstatus = 1;;
		}		
	}

}

ircDcc.prototype.newCommand = function(message)
{
	if (this.server.isConnected())
	{
		
		cmdHistoryIndex = 0;
		cmdHistory.push(message);
		if (cmdHistory.length>prefs.get().cmdHistoryMax)
			cmdHistory.pop();
		
		var cmdRegExp = new RegExp(/^\/([^\s]*)[\s]*(.*)$/);
		var match = cmdRegExp.exec(message);
		if (match)
		{
			var cmd = match[1];
			var val = match[2];
			
			switch(cmd.toLowerCase())
			{
				default:
					// forward unknown to the server object
					this.server.newCommand(message);
					break;
			}
		}
		else
		{
			// normal message
			this.msg(message);
		}
	}
	else
	{
		// not connected
		this.newMessage('type3', false, $L('Not Connected.'));
		if (this.chatAssistant && this.chatAssistant.controller) 
		{
			this.chatAssistant.controller.showAlertDialog(
			{
			    title:				this.server.alias,
				allowHTMLMessage:	true,
			    message:			$L('Not Connected.'),
			    choices:			[{label:$L('Ok'), value:''}],
				onChoose:			function(value){}
		    });
		}
	}
}

ircDcc.prototype.msg = function(message)
{
	var sid = servers.getServerArrayKey(this.server.id);
	var n = Math.ceil(message.length / 255);
	var i = 0;
	var msg = '';
	//alert('Message length: ' + message.length + ', n: ' + n);
	for (;i<n;i++) {
		if (i < (n - 1)) {
			msg = message.substring(i * 255, (i + 1) * 255)
		}
		else {
			msg = message.substring(i * 255);
		}
		this.bitsOut += msg.length;
		plugin.dcc_msg(sid, this.id, msg);
		this.newMessage('privmsg', this.server.nick, msg);
		this.updateChatStats();
	}
}

ircDcc.prototype.newMessage = function(type, nick, message, skipUpdate)
{
	var obj =
	{
		type:		type,
		nick:		nick,
		message:	message,
		me:			this.server.nick.name
	};
	var newMsg = new ircMessage(obj);
	this.messages.push(newMsg);
	if (!skipUpdate)
		this.updateChatList();
}
ircDcc.prototype.getMessages = function(start)
{
	var returnArray = [];
	if (!start) start = 0;
	
	if (this.messages.length > 0 && start < this.messages.length)
	{
		for (var m = start; m < this.messages.length; m++)
		{
			returnArray.push(this.messages[m].getListObject());
		}
	}
	
	return returnArray;
}
ircDcc.prototype.getLastMessage = function()
{
	return this.messages[this.messages.length-1];
}

ircDcc.prototype.clearMessages = function()
{
	this.messages = [];
}

ircDcc.prototype.openChatDash = function()
{
	try
	{
		var lastMessage = this.getLastMessage().getNotificationObject();
		if (lastMessage.nick !== this.server.nick.name) // if its not from us, do dash junk
		{
			Mojo.Controller.appController.showBanner
			(
				{
					icon: 'icon-dcc-chat.png',
					messageText: lastMessage.nick + ': ' + lastMessage.message,
					soundClass: (prefs.get().dashboardQuerySound?"alerts":"")
				},
				{
					type: 'dccchat',
					server: this.server.id,
					dcc: this.dcc
				},
				this.chatBannerName
			);
			
			this.chatDashController = Mojo.Controller.appController.getStageController(this.chatDashName);
		    if (this.chatDashController) 
			{
				this.chatDashController.delegateToSceneAssistant("updateMessage", lastMessage.nick, lastMessage.message);
			}
			else
			{
				Mojo.Controller.appController.createStageWithCallback({name: this.chatDashName, lightweight: true}, this.openChatDashCallback.bind(this), "dashboard");
			}
		}
	}
	catch (e)
	{
		Mojo.Log.logException(e, "ircDcc#openDash");
	}
}
ircDcc.prototype.openChatDashCallback = function(controller)
{
	controller.pushScene('dcc-chat-dashboard', this);
}
ircDcc.prototype.closeChatDash = function()
{
	Mojo.Controller.appController.removeBanner(this.chatBannerName);
	Mojo.Controller.appController.closeStage(this.chatDashName);
}

ircDcc.prototype.openChatStage = function()
{
	try
	{
		this.chatStageController = Mojo.Controller.appController.getStageController(this.chatStageName);
	
        if (this.chatStageController) 
		{
			if (this.chatStageController.activeScene().sceneName == 'dcc-chat') 
			{
				this.chatStageController.activate();
			}
			else
			{
				this.chatStageController.popScenesTo('dcc-chat');
				this.chatStageController.activate();
			}
		}
		else
		{
			Mojo.Controller.appController.createStageWithCallback({name: this.chatStageName, lightweight: true}, this.openChatStageCallback.bind(this));
		}
	}
	catch (e)
	{
		Mojo.Log.logException(e, "ircDcc#openStage");
	}
}
ircDcc.prototype.openChatStageCallback = function(controller)
{
	controller.pushScene('dcc-chat', this);
}
ircDcc.prototype.closeChatStage = function()
{
	if (this.chatAssistant && this.chatAssistant.controller)
	{
		this.chatAssistant.controller.window.close();
	}
}

ircDcc.prototype.setChatDashAssistant = function(assistant)
{
	this.chatDashAssistant = assistant;
}
ircDcc.prototype.setChatAssistant = function(assistant)
{
	this.chatAssistant = assistant;
}

ircDcc.prototype.updateChatList = function()
{
	if (this.chatAssistant && this.chatAssistant.controller)
	{
		this.chatAssistant.updateList();
		if (!this.chatAssistant.isVisible)
		{
			this.openChatDash();
		}
	}
	else // if there is no window to update, push/update banner/dash
	{
		this.openChatDash();
	}
}

ircDcc.prototype.openSendDash = function()
{
	try
	{
		/*Mojo.Controller.appController.showBanner
		(
			{
				icon: 'icon-dcc-send.png',
				messageText: 'Downloading ' + this.filename + '...',
				soundClass: ''
			},
			{
				type: 'dccsend',
				server: this.server.id,
				dcc: this.dcc
			},
			this.sendBannerName
		);*/
		
		this.sendDashController = Mojo.Controller.appController.getStageController(this.sendDashName);
	    if (this.sendDashController)
		{
			this.sendDashController.delegateToSceneAssistant("updateData", this.percent, this.filename, this.size);
		}
		else
		{
			Mojo.Controller.appController.createStageWithCallback({name: this.sendDashName, lightweight: true}, this.openSendDashCallback.bind(this), "dashboard");
		}
	}
	catch (e)
	{
		Mojo.Log.logException(e, "ircDcc#openDash");
	}
}
ircDcc.prototype.openSendDashCallback = function(controller)
{
	controller.pushScene('dcc-send-dashboard', this);
}
ircDcc.prototype.closeSendDash = function()
{
	Mojo.Controller.appController.removeBanner(this.sendBannerName);
	Mojo.Controller.appController.closeStage(this.sendDashName);
}

ircDcc.prototype.setSendDashAssistant = function(assistant)
{
	this.sendDashAssistant = assistant;
}

ircDcc.prototype.updateSendData = function()
{
	if (this.server.dccListAssistant && this.server.dccListAssistant.controller)
	{
		this.server.dccListAssistant.updateList();
	}
	else if (servers.dccListAssistant && servers.dccListAssistant.controller)
	{
		servers.dccListAssistant.updateList();
	}
}

ircDcc.prototype.updateChatStats = function()
{
	if (this.chatAssistant && this.chatAssistant.controller)
	{
		this.chatAssistant.updateStats(this.bitsIn, this.bitsOut);
	}
}


ircDcc.prototype.getListObject = function()
{
	var obj =
	{
		key:		this.server.getDccArrayKey(this.id),
		id:			this.id,
		server:		(this.server.alias?this.server.alias:this.server.address),
		type:		'',
		bitsIn:		this.bitsIn,
		bitsOut:	this.bitsOut,
		size:		this.size,
		filename:	'',
		fstatus:	'',
		sender:		this.nick.name,
		percent:	(this.percent ? this.percent : 0),
		rowClass:	'',
		text1:		'',
		text2:		'',
	};
	
	if (this.isChat())
	{
		var date = 'Start time: ' + Mojo.Format.formatDate(this.startTime, 'short');
		alert(date);
		obj.type = 'chat';
		obj.text1 = date;
		obj.text2 = this.bitsIn + ' : ' + this.bitsOut;
	}
	else
	{
		obj.type = 'send';
		obj.text1 = this.filename;
		obj.text2 = this.bitsIn + ' / ' + this.size;
		switch (this.fstatus) {
			case 0: obj.fstatus = 'active'; break;
			case 1: obj.fstatus = 'complete'; break;
			case 2: obj.fstatus = 'fail'; break;
		}
	}
	
	return obj;
}