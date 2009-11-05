function ircMessage(params)
{
	ircMessage.num++;
	
	this.num =			ircMessage.num;
	this.type =			params.type;
	this.me =			params.me;
	this.nick =			false;
	this.nickDisplay =	'';
	this.message =		'';
	
	this.channel =		false;
	
	this.rowClass =		'';
	this.rowStyle =		'';
	this.nickStyle =	'';
	
	
	switch(this.type)
	{
		case 'channel-message':
			this.nick =			params.nick;
			this.nickDisplay =	this.nick.name;
			this.nickStyle =	'color: ' + this.nick.colorHex + ';',
			this.message =		params.message;
			this.me =			params.me;
			if (this.message.toLowerCase().include(this.me.toLowerCase()) && this.nick.name.toLowerCase() != this.me.toLowerCase()) 
			{
				if (params.channel)
				{
					this.channel = params.channel;
				}
				this.highlightMessage();
			}
			break;
			
		case 'channel-action':
			this.rowClass =		'action-message';
			this.nick =			params.nick;
			this.nickDisplay =	'-*-';
			this.message =		this.nick.name + ' ' + params.message;
			if (this.message.toLowerCase().include(this.me.toLowerCase()) && this.nick.name.toLowerCase() != this.me.toLowerCase()) 
			{
				if (params.channel)
				{
					this.channel = params.channel;
				}
				this.highlightMessage();
			}
			break;
			
		case 'me-action':
			this.rowClass =		'action-message';
			this.nick =			params.nick;
			this.nickDisplay =	'-*-';
			this.message =		this.nick.name + ' ' + params.message;
			break;			
			
		case 'channel-event':
			this.rowClass =		'event-message';
			this.nickDisplay =	'**';
			this.message =		params.message;
			break;
			
		case 'join-event':
			this.rowClass =		'event-message';
			this.nickDisplay =	'-->';
			this.message =		params.message;
			break;
			
		case 'part-event':
			this.rowClass =		'event-message';
			this.nickDisplay =	'<--';
			this.message =		params.message;
			break;						
			
		case 'action':
			this.rowClass =		'status-message';
			this.nickDisplay =	'-*-';
			this.message =		params.message;
			break;
			
		case 'notice':
			this.rowClass =		'status-message';
			this.nickDisplay =	'[' + params.message[0] + ']';
			this.message =		params.message[1];
			break;
			
		case 'channel-notice':
			this.rowClass =		'status-message';
			this.nickDisplay =	'[' + params.nick.name + ']';
			this.message =		params.message;
			break;
			
		case 'status':
			this.rowClass =		'status-message';
			this.nickDisplay =	'***';
			this.message =		params.message;
			break;
			
		case 'debug':
			this.rowClass =		'debug-message';
			this.nickDisplay =	'---';
			this.message =		params.message;
			break;
	}
	
}

ircMessage.prototype.highlightMessage = function()
{
	if (this.channel)
	{
		if (!this.channel.chatAssistant.isVisible)
		{
			this.channel.openDash(this.getNotificationObject());
		}
		this.channel = false;
	}
	
	var style = '';
	
	if (prefs.get().highlightStyle == 'color' || prefs.get().highlightStyle == 'boldcolor') 
	{
		if (prefs.get().highlightColorOf == 'foreground') style += 'color: ' + prefs.get().highlightColor + ';';
		if (prefs.get().highlightColorOf == 'background') style += 'background-color: ' + prefs.get().highlightColor + ';';
	}
	if (prefs.get().highlightStyle == 'bold' || prefs.get().highlightStyle == 'boldcolor') 
	{
		style += 'font-weight: bold;';
	}
	
	switch (prefs.get().highlightPart)
	{
		case 'all':
			this.rowStyle += style;
			// foreground color doesn't work through children, sigh, so we have to set them manually...
			if ((prefs.get().highlightStyle == 'color' ||
				prefs.get().highlightStyle == 'boldcolor') &&
				prefs.get().highlightColorOf == 'foreground')
			{
				this.nickStyle += style;
				this.messageStyle += style;
			}
			break;
		case 'nick':
			this.nickStyle += style;
			break;
		case 'message':
			this.messageStyle += style;
			break;
		case 'word':
			this.message = this.message.replace(new RegExp('(' + this.me + ')', 'gi'), '<span style="' + style + '">$1</span>');
			break;
	}
}
ircMessage.prototype.parseLinks = function(message)
{
  	return message.replace
	(
		/((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ig,
		function(url)
		{
		    var full_url = url;
		    if (!full_url.match('^https?:\/\/')) {
		        full_url = 'http://' + full_url;
		    }
		    return '<a href="' + full_url + '" target="_blank">' + url + '</a>';
		}
	);
}

ircMessage.prototype.getNotificationObject = function()
{
	var obj =
	{
		nick:			this.nickDisplay,
		message:		this.message
	};
	
	return obj;
}
ircMessage.prototype.getListObject = function()
{
	var obj =
	{
		nick:			this.nickDisplay,
		message:		this.parseLinks(this.message),
		rowClass:		this.rowClass,
		rowStyle:		this.rowStyle,
		nickStyle:		this.nickStyle,
		messageStyle:	this.messageStyle
	};
	
	return obj;
}

ircMessage.num = 0;
