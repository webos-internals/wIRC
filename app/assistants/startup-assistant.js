function StartupAssistant(changelog)
{
	this.justChangelog = changelog;
	
    // on first start, this message is displayed, along with the current version message from below
    this.firstMessage = $L("Internet Relay Chat (IRC) is a form of real-time Internet text messaging (chat) or synchronous conferencing. It is mainly designed for group communication in discussion forums, called channels, but also allows one-to-one communication via private message.");
	
    this.secondMessage = $L("<b>Hey, You've installed an update!</b><br>Check out what's changed:");
	
    // on new version start
    this.newMessages =
	[
		{
		version: '0.4.7',
			log:
			[
				'Fixes for Pre3 Screen size'
			]
		},
		{
		version: '0.4.6',
			log:
			[
				'Prefered interface works again',
				'Possibly fix a double connection / connected but cant type bug'
			]
		},
		{
		version: '0.4.5',
			log:
			[
				'Fixed nick highlight bug',
				'Formatted to work at TouchPad resolution including back buttons where necessary'
			]
		},
		{
		version: '0.4.4',
			log:
			[
				'Moved connection retries to javascript',
				'Fix plugin ready on start'
			]
		},
		{
		version: '0.4.3',
			log:
			[
				'Fix possible race condition in plugin'
			]
		},
		{
			version: '0.4.2',
			log:
			[
				'A couple of bugfixes and theme tweaks'
			]
		},
		{
			version: '0.4.0',
			log:
			[
				'New Flat Theme',
				'Added popup list of common server commands to the server list when connected',
				'Positioning updates for Pixi/Veer resolution',
				'New colored notification tray icon',
				'Added amsg command',
				'Added ame command',
				'Added partall command',
				'Added invite command',
				'Added trace command',
				'Added who command',
				'Added whowas command',
				'Fixed away option in appmenu',
				'Fixed kick option in user list',
				'Fixed GUI lockups in 2.x caused by channel list and nick list',
				'Alias parsing fix, thanks dwc'
			]
		},
		{
			version: '0.3.13',
			log:
			[
				'Fix command history, thanks dwc',
				'Fix ctcp SOURCE response, thanks dwc',
				'ping response now displays the time it took to respond'
			]
		},
		{
			version: '0.3.10',
			log:
			[
				'Fix Plugin',
				'Added Font Style preference'
			]
		},
		{
			version: '0.3.9',
			log:
			[
				'Only use encryption if plugin say SSL is available',
			]
		},
		{
			version: '0.3.8',
			log:
			[
				'Added help toggle/overlay to preferences and server setup',
				'Added a list of available commands to help scene',
				'Channel cards stack together during auto-join on 2.x (Thanks to halfhalo)',
				'Fixed color codes in received messages on 2.x',
				'Fixed bug with mentions and alert word highlighting',
				'Fixed previous/next key commands in server-status'
			]
		},
		{
			version: '0.3.7',
			log:
			[
				'Fixed dash(-) breaking links in the chat bug',
				'Fixed setting away status from server-status bug',
				'Fixed auto-connect after launch not connecting bug'
			]
		},
		{
			version: '0.3.6',
			log:
			[
				'Another attempt to fix the "wIRC stays open after closing" bug!'
			]
		},
		{
			version: '0.3.5',
			log:
			[
				'Hackish fix for the "wIRC stays open after closing" bug'
			]
		},
		{
			version: '0.3.4',
			log:
			[
				'Added some keyboard shortcuts to server status scene (gesture+j for join, gesture+l for channel list)',
				'Fixed "false" quit bug',
				'Fixed ACTION messages in query chat scene',
				'Some style updates to the DCC list scene'
			]
		},
		{
			version: '0.3.3',
			log:
			[
				'Added TLS Support',
				'Added "network" field for bip',
				'Fixed another bug in message copy code',
				'Updated bug report url in help scene to go to redmine',
				'Added changelog to help scene'
			]
		},
		{
			version: '0.3.2',
			log:
			[
				'Fixed bug in message copy code',
				'Fixed how channel/user mode messages are displayed',
				'Fixed fstab bug',
				'Beta SSL support'
			]
		},
		{
			version: '0.3.1',
			log:
			[
				'Added multi-line copy',
				'Fixed bug in marker line color usage',
				'Fixed bug in query-chat title',
				'Fixed bug in "next nick" code that caused crashes',
				'Fixed bug in opening of channel stages'
			]
		},
		{
			version: '0.3.0',
			log:
			[
				'No more service, Now a hybrid app (plugin/mojo), and all the changes that went along with that',
				'Tossing the main stage will now kill the entire app, including all child stages, and any connections to servers',
				'Added option to stop the screen from dimming',
				'Better random colors, they now are changed based on theme',
				'DCC Chat and Send support',
				'Correctly parses color in messages',
				'Added option to turn off join/part/quit/mode event messages',
				'Changing the theme resets message color options to be visible on the current theme',
				'Favorite channels support',
				'More palm-dark theme updates',
				'Added this scene right here',
				'Added theme based color prefs',
				'Added custom aliases for commands',
				'Gesture+Q and Gesture+A cycle though command history',
				'/ctcp requests',
				'Custom ctcp replies',
				'Added events preference pages',
				'/ping works when autoping is off',
				'Auto-prepend # to channel names if they\'re forgotten on /join',
				'Fixed bug stoping you from joining channels that didn\'t start with #',
				'Relaunch bugfix',
				'Added contextual menu when you tap a message',
				'Added yell and connect launch commands for very webosy cross-app integration',
				'Changed how notice events and /msg commands are displayed',
				'/ns aliased to /msg NickServ',
				'/authserv aliased to /msg AuthServ',
				'Fixed /topic command bug',
				'Now handles numeric 404 event',
				'Changes to app-menus on most scenes',
				'Fixed bug in timestamps',
				'Added format options for timestamps',
				'Added standard help scene',
				'Removed old about scene',
				'Turning off autoping actually turns off autoping',
				'Added option to set autoping interval',
				'Split messages longer than 255 char',
				'/part messages now work',
				'Now rejoins channels with open cards on a reconnect',
			]
		},
		{
			version: '0.2.4',
			log:
			[
				'Merged Service and GUI to one package'
			]
		},
		{
			version: '0.1.0',
			log:
			[
				'Timestamp with Display Options',
				'Lag Meter with Options',
				'Clear Backlog Option',
				'Numerous new event handlers (particularly kick/join)',
				'Added /notice Support',
				'Alert word improvements',
				'Split Preferences Scene',
				'Better disconnect/reconnect handling',
				'Numerous UI improvements (Updated css, new and updated icons, etc)',
				'Better network indicators',
				'Saves the realServer (for instances where irc.xyzserver.com connects you to other.xyzserver.com)',
				'QuakeNet and DALnet added to pre-defined servers.',
				'Minor rewrite',
				'Fixed away/back in channel chat',
				'Theme changes affect all open wIRC cards',
				'Fixed Missing topic change notice when in a channel',
				'Fixed "Connected!" issue',
				'Max retries now functions properly',
				'Fixed occassional app close bug',
				'Better error handling',
				'Fixed broken notices',
				'Fixed disconnecting',
				'Removed manual /ping support'
			]
		},
		{
			version: '0.0.4',
			log:
			[
				'/whois Support',
				'/list Support',
				'/raw and /queue Support',
				'Fixed multiple-spaces in a row problem',
				'Random colors toggle',
				'Split highlight Foreground/Background',
				'Dynamic resizing fixed-width message style (drag your finger across the screen)',
				'Lots of changes to server-info scene',
				'Fixed sending keys with /join commands',
				'Added connect button to not-connected server-status scene',
				'Nicklist dropdown in server info from identity scene',
				'Added Preconfigured Servers scene, and some initial networks',
				'Made identity scene the first scene on initial run',
				'Options about how to handle channel invites',
				'Channel invite dashboard notification to accept or decline',
				'New, Awesome nick list',
				'Added away/back menu option',
				'Changed when channel stages are popped',
				'Removed Mojo.Format.runTextIndexer',
				'Fixed channel header tap topic bug'
			]
		},
		{
			version: '0.0.3',
			log:
			[
				'Initial Public Beta Release'
			]
		}
	];
	
	// random continue button message
	this.randomContinue = 
	[
		{weight: 30, text: $L("Ok, I've read this. Let's continue ...")},
		{weight:  5, text: $L("Yeah, Yeah, Whatever ...")}
	];
	
    // setup menu
    this.menuModel =
	{
	    visible: true,
	    items:
	    [
			Mojo.Menu.editItem,
			{
				label: "Preferences",
				command: 'do-prefs'
			},
			{
				label: "Help",
				command: 'do-help'
			}
	     ]
	};
	
    // setup command menu
    this.cmdMenuModel =
	{
	    visible: false, 
	    items:
	    [
		    {},
		    {
				label: this.getRandomContinueMessage(),
				command: 'do-continue'
		    },
		    {}
	     ]
	};
};

StartupAssistant.prototype.setup = function()
{
	// set theme
	setTheme(this.controller.document);
	
    // get elements
    this.titleContainer = this.controller.get('title');
    this.dataContainer =  this.controller.get('data');
	
	// Add back button functionality for the TouchPad
	this.backElement = this.controller.get('back');
	this.backTapHandler = this.backTap.bindAsEventListener(this);
	this.controller.listen(this.backElement, Mojo.Event.tap, this.backTapHandler);
	
    // set title
	if (this.justChangelog)
	{
		this.titleContainer.innerHTML = $L('Changelog');
	}
	else
	{
		this.backElement.hide();
	    if (vers.isFirst) 
		{
		    this.titleContainer.innerHTML = $L("Welcome To wIRC");
		}
	    else if (vers.isNew) 
		{
		    this.titleContainer.innerHTML = $L("wIRC Updated");
		}
	}
	
	
    // build data
    var html = '';
	if (!this.justChangelog)
	{
		if (vers.isFirst)
		{
			html += '<div class="text">' + this.firstMessage + '</div>';
		}
	    else if (vers.isNew)
		{
			html += '<div class="text">' + this.secondMessage + '</div>';
		}
    }
	for (var m = 0; m < this.newMessages.length; m++) 
	{
	    html += Mojo.View.render({object: {title: 'v' + this.newMessages[m].version}, template: 'startup/changeLog'});
	    html += '<ul>';
	    for (var l = 0; l < this.newMessages[m].log.length; l++)
		{
			html += '<li>' + this.newMessages[m].log[l] + '</li>';
	    }
	    html += '</ul>';
	}
	
    // set data
    this.dataContainer.innerHTML = html;
	
	
    // setup menu
    this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
	if (!this.justChangelog)
	{
	    // set command menu
	    this.controller.setupWidget(Mojo.Menu.commandMenu, { menuClass: 'no-fade' }, this.cmdMenuModel);
	}
	
    // set this scene's default transition
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade);
};

StartupAssistant.prototype.getRandomContinueMessage = function()
{
	// loop to get total weight value
	var weight = 0;
	for (var r = 0; r < this.randomContinue.length; r++)
	{
		weight += this.randomContinue[r].weight;
	}
	
	// random weighted value
	var rand = Math.floor(Math.random() * weight);
	
	// loop through to find the random title
	for (var r = 0; r < this.randomContinue.length; r++)
	{
		if (rand <= this.randomContinue[r].weight)
		{
			return this.randomContinue[r].text;
		}
		else
		{
			rand -= this.randomContinue[r].weight;
		}
	}
	
	// if no random title was found (for whatever reason, wtf?) return first and best subtitle
	return this.randomContinue[0].text;
}

StartupAssistant.prototype.backTap = function(event)
{
    if (Mojo.Environment.DeviceInfo.modelNameAscii == 'TouchPad') {
		this.controller.stageController.popScene();
    }
};

StartupAssistant.prototype.activate = function(event)
{
    // start continue button timer
    this.timer = this.controller.window.setTimeout(this.showContinue.bind(this), 5 * 1000);
};
StartupAssistant.prototype.showContinue = function()
{
    // show the command menu
    this.controller.setMenuVisible(Mojo.Menu.commandMenu, true);
};
StartupAssistant.prototype.handleCommand = function(event)
{
    if (event.type == Mojo.Event.command)
	{
	    switch (event.command)
		{
			case 'do-continue':
				if (prefs.get().realname.length==0 || prefs.get().nicknames.length==0)
					this.controller.stageController.swapScene({name: 'identity', transition: Mojo.Transition.crossFade}, true, true);
				else
					this.controller.stageController.swapScene({name: 'server-list', transition: Mojo.Transition.crossFade});
			
				break;
				
			case 'do-prefs':
				this.controller.stageController.pushScene('preferences-general');
				break;
								
			case 'do-help':
				this.controller.stageController.pushScene('help');
				break;		
		}
	}
};

