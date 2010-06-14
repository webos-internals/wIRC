function DccChatDashboardAssistant(dcc)
{
	this.dcc = dcc;
	
	this.dashboardElement =			false;
	this.newNumberBubbleElement =	false;
	this.newNumberElement =			false;
	this.dashboardTitleElement =	false;
	this.dashboardTextElement =		false;
	this.iconActionElement =		false;
	this.textActionElement =		false;
	
	this.messageCount =				0;
	
	this.dcc.setChatDashAssistant(this);
}

DccChatDashboardAssistant.prototype.setup = function()
{
	this.dashboardElement =			this.controller.get('dashboard');
	this.newNumberBubbleElement =	this.controller.get('newNumberBubble');
	this.newNumberElement =			this.controller.get('newNumber');
	this.dashboardTitleElement =	this.controller.get('dashboardTitle');
	this.dashboardTextElement =		this.controller.get('dashboardText');
	this.iconActionElement =		this.controller.get('iconAction');
	this.textActionElement =		this.controller.get('textAction');
	
	this.dashTapHandler =	this.dashTapped.bindAsEventListener(this);
	
	// hide new bubble
	this.newNumberBubbleElement.style.display = 'none';
	
	// put last mesage into fields
	var lastMessage = this.dcc.getLastMessage().getNotificationObject();
	this.updateMessage(lastMessage.nick, lastMessage.message);
	
	// to whole thing for tap
	Mojo.Event.listen(this.dashboardElement, Mojo.Event.tap, this.dashTapHandler);
}

DccChatDashboardAssistant.prototype.updateMessage = function(nick, message)
{
	this.messageCount++;
	if (this.messageCount > 1)
	{
		this.newNumberBubbleElement.style.display = '';
		this.newNumberElement.innerHTML = this.messageCount;
	}
	this.dashboardTitleElement.innerHTML = nick;
	this.dashboardTextElement.innerHTML = message;
}

DccChatDashboardAssistant.prototype.dashTapped = function(event)
{
	this.dcc.openStage();
	this.dcc.closeDash();
}

DccChatDashboardAssistant.prototype.cleanup = function(event)
{
	Mojo.Event.stopListening(this.dashboardElement, Mojo.Event.tap, this.dashTapHandler);
}
