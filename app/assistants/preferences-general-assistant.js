function PreferencesGeneralAssistant()
{
	// setup default preferences in the prefCookie.js model
	this.cookie = new preferenceCookie();
	this.prefs = this.cookie.get();
	
	// for secret group
	this.secretString = '';
	this.secretAnswer = 'iknowwhatimdoing';
	
	this.interfaceWrapper =		false;
	
	this.pageList = [
		{label: 'General',			command: 'general'},
		{label: 'Messages',			command: 'messages'},
		{label: 'Notifications',	command: 'notifications'}
	];
	this.currentPage = 'general';
	
	// setup menu
	this.menuModel =
	{
		visible: true,
		items:
		[
			{
				label: "Help",
				command: 'do-help'
			}
		]
	}
	
}

PreferencesGeneralAssistant.prototype.setup = function()
{
	try
	{
		// setup menu
		this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
		
		// set this scene's default transition
		this.controller.setDefaultTransition(Mojo.Transition.zoomFade);
		
		// setup page selector
		this.pageSelectorElement =	this.controller.get('pageSelector');
		this.pageNameElement =		this.controller.get('pageName');
		this.pageTapHandler =		this.pageTap.bindAsEventListener(this);
		this.pageSwitcher =			this.pageSwitch.bindAsEventListener(this);
		this.controller.listen(this.pageSelectorElement, Mojo.Event.tap, this.pageTapHandler);
		
		this.pageNameElement.update(this.currentPage);
		
		// setup handlers for preferences
		this.toggleChangeHandler = this.toggleChanged.bindAsEventListener(this);
		this.sliderChangeHandler = this.sliderChanged.bindAsEventListener(this);
		this.listChangedHandler  = this.listChanged.bindAsEventListener(this);
		
		this.lagMeterChangedHandler = this.lagMeterChanged.bindAsEventListener(this);
		this.autoPingIntervalChangedHandler = this.autoPingIntervalChanged.bindAsEventListener(this);
		this.pifaceChangedHandler = this.pifaceChanged.bindAsEventListener(this);		
		
		
		// Global Group
		this.controller.setupWidget
		(
			'theme',
			{
				label: 'Theme',
				choices:
				[
					{label:'Palm Default',	value:'palm-default'},
					{label:'Palm Dark',		value:'palm-dark'}
				],
				modelProperty: 'theme'
			},
			this.prefs
		);
		this.controller.setupWidget
		(
			'blockScreenTimeout',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'blockScreenTimeout'
			},
			{
				value : this.prefs.blockScreenTimeout,
	 			disabled: false
			}
		);
		this.controller.setupWidget
		(
			'dimScreen',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'dimScreen'
			},
			{
				value : this.prefs.blockScreenTimeout,
	 			disabled: false
			}
		);
		
		this.controller.listen('theme',	Mojo.Event.propertyChange, this.themeChanged.bindAsEventListener(this));
		this.controller.listen('blockScreenTimeout', Mojo.Event.propertyChange, this.toggleChangeHandler);
		this.controller.listen('dimScreen',	Mojo.Event.propertyChange, this.toggleChangeHandler);
		
		
		// Server Status Group
		this.controller.setupWidget
		(
			'statusPop',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'statusPop'
			},
			{
				value : this.prefs.statusPop,
	 			disabled: false
			}
		);
		
		this.controller.listen('statusPop',	Mojo.Event.propertyChange, this.toggleChangeHandler);
		
		
		// Connection details group
		this.controller.setupWidget
		(
			'connectionTimeout',
			{
				label: 'Connection Timeout',
				choices:
				[
					{label:'None',	value:0},
					{label:'5s',	value:5},
					{label:'10s',	value:10},
					{label:'15s',	value:15},
					{label:'20s',	value:20},
					{label:'25s',	value:25},
					{label:'30s',	value:30},
					{label:'35s',	value:35},
					{label:'40s',	value:40},
					{label:'45s',	value:45},
					{label:'50s',	value:50},
					{label:'55s',	value:55},
					{label:'60s',	value:60}
				],
				modelProperty: 'connectionTimeout'
			},
			this.prefs
		);
		this.controller.listen('connectionTimeout',	Mojo.Event.propertyChange, this.listChangedHandler);
		
		this.controller.setupWidget
		(
			'lagMeter',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'lagMeter'
			},
			{
				value : this.prefs.lagMeter,
	 			disabled: false
			}
		);
		this.controller.setupWidget
		(
			'autoPingInterval',
			{
				label: 'Auto-Ping Interval',
				choices:
				[
					{label:'1s',	value:1},
					{label:'5s',	value:5},
					{label:'10s',	value:15},
					{label:'15s',	value:15},
					{label:'20s',	value:20},
					{label:'25s',	value:25},
					{label:'30s',	value:30}
				],
				modelProperty: 'autoPingInterval'
			},
			this.prefs
		);
		this.controller.listen('autoPingInterval',	Mojo.Event.propertyChange, this.autoPingIntervalChangedHandler);
		
		this.controller.listen('lagMeter',	Mojo.Event.propertyChange, this.lagMeterChangedHandler);
		
		this.interfaceWrapper =		this.controller.get('interfaceWrapper');
		this.pifaceChanged();
		this.controller.setupWidget
		(
			'piface',
			{
				label: 'Preferred Interface',
				choices:
				[
					{label:'None', value:''},
					{label:'Wan (ppp0)', value:'ppp0'},
					{label:'Wifi (eth0)', value:'eth0'}
				],
				modelProperty: 'piface'
			},
			this.prefs
		);
		this.controller.listen('piface',		Mojo.Event.propertyChange, this.pifaceChangedHandler);
		this.controller.setupWidget
		(
			'aiface',
			{
	  			trueLabel:  'Yes',
	  			trueValue:	true,
	 			falseLabel: 'No',
	 			falseValue: false,
	  			fieldName:  'aiface'
			},
			{
				value : this.prefs.aiface,
	 			disabled: false
			}
		);
		this.controller.listen('aiface',		Mojo.Event.propertyChange, this.toggleChangeHandler);
		
		
		
		// hide groups
		this.controller.get('secretPreferences').style.display = 'none';
		if (!prefs.get().lagMeter)
			this.controller.get('autoPing').style.display = 'none';
		
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'preferences#setup');
	}

}

PreferencesGeneralAssistant.prototype.toggleChanged = function(event)
{
	this.prefs[event.target.id] = event.value;
	this.cookie.put(this.prefs);
}
PreferencesGeneralAssistant.prototype.sliderChanged = function(event)
{
	this.cookie.put(this.prefs);
}
PreferencesGeneralAssistant.prototype.listChanged = function(event)
{
	this.cookie.put(this.prefs);
}

PreferencesGeneralAssistant.prototype.themeChanged = function(event)
{
	// set the theme right away with the body class
	this.controller.document.body.className = event.value;
	this.listChanged();
	this.cookie.put(this.prefs);
	
	// set theme on all other open stages
	Mojo.Controller.getAppController().assistant.updateTheme(event.value);
}

PreferencesGeneralAssistant.prototype.autoPingIntervalChanged = function(event)
{
	this.cookie.put(this.prefs);
	
	if (event) 
	{
		this.toggleChanged(event);
		var tmp = prefs.get(true);
	}
	if (this.prefs['lagMeter'])
	{
		if (servers.servers.length > 0)
		{
			for (var s = 0; s < servers.servers.length; s++)
			{
				if (servers.servers[s].isConnected())
				{
					clearTimeout(servers.servers[s].autoPing);
					servers.servers[s].autoPing = false;
					servers.servers[s].doAutoPing(servers.getServerArrayKey(servers.servers[s].id), this.prefs['autoPingInterval']*1000);
				}
			}
		}
	}
	
}

PreferencesGeneralAssistant.prototype.lagMeterChanged = function(event)
{
	if (event) 
	{
		this.toggleChanged(event);
		var tmp = prefs.get(true);
	}
	if (this.prefs['lagMeter'])
	{
		this.controller.get('autoPing').style.display = '';
		if (servers.servers.length > 0)
		{
			for (var s = 0; s < servers.servers.length; s++)
			{
				if (servers.servers[s].isConnected())
				{
					servers.servers[s].doAutoPing(servers.getServerArrayKey(servers.servers[s].id), this.prefs['autoPingInterval']*1000);
				}
			}
		}
	}
	else
	{
		this.controller.get('autoPing').style.display = 'none';
		if (servers.servers.length > 0)
		{
			for (var s = 0; s < servers.servers.length; s++)
			{
				if (servers.servers[s].isConnected())
				{
					clearTimeout(servers.servers[s].autoPing);
					servers.servers[s].autoPing = false;
				}
			}
		}
	}	
}
PreferencesGeneralAssistant.prototype.pifaceChanged = function(event)
{
	if (event) 
	{
		this.listChanged(event);
	}
	if (this.prefs['piface']=='')
	{
		this.interfaceWrapper.className = 'palm-row last';
		this.controller.get('fallbackInfo').style.display = 'none';
	}
	else
	{
		this.interfaceWrapper.className = 'palm-row';
		this.controller.get('fallbackInfo').style.display = '';
	}
}

PreferencesGeneralAssistant.prototype.sliderGetPrefValue = function(min, max, slider)
{
	return Math.round(min + (slider * (max - min)));
}
PreferencesGeneralAssistant.prototype.sliderGetSlideValue = function(min, max, pref)
{
	return ((pref - min) / (max - min));
}


PreferencesGeneralAssistant.prototype.pageSwitch = function(page)
{
	if (page === null || page == "" || page == undefined || page == this.currentPage) return;
	this.controller.stageController.swapScene({name: 'preferences-'+page, transition: Mojo.Transition.crossFade});
}
PreferencesGeneralAssistant.prototype.pageTap = function(event)
{
	this.controller.popupSubmenu(
	{
		onChoose: this.pageSwitcher,
		popupClass: 'group-popup',
		toggleCmd: this.currentPage,
		placeNear: event.target,
		items: this.pageList
	});
}

PreferencesGeneralAssistant.prototype.handleCommand = function(event)
{
	if (event.type == Mojo.Event.command)
	{
		switch (event.command)
		{
			case 'do-help':
				this.controller.stageController.pushScene('help');
				break;
		}
	}
}

PreferencesGeneralAssistant.prototype.keyPress = function(event)
{
	this.secretString += String.fromCharCode(event.originalEvent.charCode);
	
	if (event.originalEvent.charCode == 8)
	{
		this.secretString = '';
	}
	
	if (this.secretString.length == this.secretAnswer.length)
	{
		if (this.secretString === this.secretAnswer)
		{
			//this.controller.get('secretPreferences').style.display = '';
			//this.controller.getSceneScroller().mojo.revealElement(this.controller.get('secretPreferences'));
			this.secretString = '';
		}
	}
	else if (this.secretString.length > this.secretAnswer.length)
	{
		this.secretString = '';
	}
}

PreferencesGeneralAssistant.prototype.activate = function(event)
{
	if (!this.hasBennActivated)
	{
		this.pageSwitcher(this.currentPage);
	}
	this.hasBennActivated = true;
}

PreferencesGeneralAssistant.prototype.deactivate = function(event)
{
	// reload global storage of preferences when we get rid of this stage
	var tmp = prefs.get(true);
}

PreferencesGeneralAssistant.prototype.cleanup = function(event)
{
	this.controller.stopListening(this.pageSelectorElement, Mojo.Event.tap,			   this.pageTapHandler);
	
	this.controller.stopListening('theme',					Mojo.Event.propertyChange, this.themeChanged.bindAsEventListener(this));
	
	this.controller.stopListening('statusPop',				Mojo.Event.propertyChange, this.toggleChangeHandler);
	
	this.controller.stopListening('piface',					Mojo.Event.propertyChange, this.pifaceChangedHandler);
	this.controller.stopListening('aiface',					Mojo.Event.propertyChange, this.listChangedHandler);
	
}
