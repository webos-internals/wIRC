function DccListAssistant(server)
{
	this.server = server;
	
	if (this.server)
		this.server.setDccListAssistant(this);
	else
		servers.setDccListAssistant(this);
	
	this.refreshTimer = false;
	
	this.listModel =
	{
		items: []
	};

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
}

DccListAssistant.prototype.setup = function() 
{
	// set theme
	this.controller.document.body.className = prefs.get().theme;
	
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
    this.documentElement =			this.controller.stageController.document;
	this.headerElement =			this.controller.get('header');
	this.listElement =				this.controller.get('dccList');
	this.listTapHandler =			this.listTapHandler.bindAsEventListener(this);
    this.visibleWindowHandler =		this.visibleWindow.bindAsEventListener(this);
    this.invisibleWindowHandler =	this.invisibleWindow.bindAsEventListener(this);
	
    Mojo.Event.listen(this.documentElement, Mojo.Event.stageActivate, this.visibleWindowHandler);
    Mojo.Event.listen(this.documentElement, Mojo.Event.stageDeactivate, this.invisibleWindowHandler);
	
	if (this.server) this.headerElement.update((this.server.alias?this.server.alias:this.server.address) + ': DCC List');
	else			 this.headerElement.update('Direct Client-to-Client Connections');
	
    this.updateList(true);
	this.listAttributes =
	{
		itemTemplate: "dcc-list/dcc-row",
		swipeToDelete: false,
		reorderable: false,
		dividerTemplate: "dcc-list/sender-divider",
		dividerFunction: this.getSenderDivider.bind(this)
	};
	if (!this.server)
	{
		this.listAttributes.dividerTemplate = "dcc-list/server-divider";
		this.listAttributes.dividerFunction = this.getDivider.bind(this);
	}
	this.controller.setupWidget
	(
		'dccList',
		this.listAttributes,
		this.listModel
	);
	
	Mojo.Event.listen(this.listElement, Mojo.Event.listTap, this.listTapHandler);
	
	this.refreshTimer = setTimeout(this.refreshList.bind(this), 100);
}

DccListAssistant.prototype.getSenderDivider = function(item) {  
    if (item.sender) return item.sender;
	else return '';
}

DccListAssistant.prototype.refreshList = function()
{
	if (this.controller.stageController.isActiveAndHasScenes())
		this.updateList();
	this.refreshTimer = setTimeout(this.refreshList.bind(this), 100);
}

DccListAssistant.prototype.updateList = function(skipUpdate)
{
	try
	{
		this.listModel.items = [];
		
		if (this.server)
			this.listModel.items = this.server.getDccListObjects();
		else
			this.listModel.items = servers.getDccListObjects();
		
		if (this.listModel.items.length > 0)
		{
			//this.noDccElement.hide();
		}
		else
		{
			//this.noDccElement.show();
		}
		
		if (!skipUpdate) 
		{
			this.listElement.mojo.noticeUpdatedItems(0, this.listModel.items);
			this.listElement.mojo.setLength(this.listModel.items.length);
		}
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'dcc-list#updateList');
	}
}
DccListAssistant.prototype.getDivider = function(item)
{
	if (item.server) return item.server;
	else return '';
}

DccListAssistant.prototype.listTapHandler = function(event)
{
	
}

DccListAssistant.prototype.visibleWindow = function(event){
    if (!this.isVisible) {
        this.isVisible = true;
    }
	this.updateList();
}
DccListAssistant.prototype.invisibleWindow = function(event){
    this.isVisible = false;
}

DccListAssistant.prototype.activate = function(event)
{
    if (this.alreadyActivated) {
        this.updateList();
    }
    this.alreadyActivated = true;
}

DccListAssistant.prototype.handleCommand = function(event)
{
	if (event.type == Mojo.Event.command)
	{
		switch (event.command)
		{
			case 'do-help':
				this.controller.stageController.pushScene('help');
				break;
				
			case 'do-prefs':
				this.controller.stageController.pushScene('preferences-general');
				break;
		}
	}
}
DccListAssistant.prototype.cleanup = function(event) 
{
	Mojo.Event.stopListening(this.listNoRegionElement, Mojo.Event.listDelete, this.listTapHandler);
	Mojo.Event.stopListening(this.listElement, Mojo.Event.listDelete, this.listTapHandler);
}

