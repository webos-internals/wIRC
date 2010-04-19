function prefCookie()
{
	this.cookie = false;
	this.prefs = false;
	this.load();
}

prefCookie.prototype.get = function(reload)
{
	try 
	{
		if (!this.prefs || reload) 
		{
			// setup our default preferences
			this.prefs = 
			{
				// Global Group
				theme:				'palm-default',
				
				// Global Group
				piface:				'',
				aiface:				false,
				
				// Identity Scene
				realname:			'',
				nicknames:			[],
				
				// Server Status Group
				statusPop:			false,
				
				// Input Group
				tabSuffix:			':',
				autoCap:			false,
				autoReplace:		true,
				
				// Messages Group
				messagesStyle:		'lefta',
				messageSplit:		'25',
				fontSize:			'15',
				timeStamp:			0,
				senderColoring:		true,
				
				// Highlight Group
				highlightStyle:		'color',
				highlightPart:		'all',
				alertWords:			'',
				
				// Dashboard/Banner Group
				dashboardChannel:		true,
				dashboardChannelSound:	true,
				dashboardQuerySound:	true,
				inviteAction:			'prompt',
				dashboardInviteSound:	true,
				
				// Color scheme
				colorNotice:		'orangered',
				colorAction:		'firebrick',
				colorStatus:		'mediumpurple',
				colorText:			'black',
				colorMarker:		'red',
				colorHighlightFG:	'black',
				colorHighlightBG:	'lightpink',
				colorOwnNick:		'black',
				colorOtherNicks:	'green',
			};
			
			var cookieData = this.cookie.get();
			if (cookieData) 
			{
				for (i in cookieData) 
				{
					this.prefs[i] = cookieData[i];
				}
			}
			else 
			{
				this.put(this.prefs);
			}
		}
		
		return this.prefs;
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'prefCookie#get');
	}
}

prefCookie.prototype.put = function(obj, value)
{
	try
	{
		this.load();
		if (value)
		{
			this.prefs[obj] = value;
			this.cookie.put(this.prefs);
		}
		else
		{
			this.cookie.put(obj);
		}
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'prefCookie#put');
	}
}

prefCookie.prototype.load = function()
{
	try
	{
		if (!this.cookie) 
		{
			this.cookie = new Mojo.Model.Cookie('preferences');
		}
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'prefCookie#load');
	}
}
