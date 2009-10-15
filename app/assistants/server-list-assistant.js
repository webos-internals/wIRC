function ServerListAssistant()
{
	this.serverListModel =
	{
		items: []
	};
	this.cmdMenuModel =
	{
		label: $L('Menu'),
		items: []
	};
	
	servers.setListAssistant(this);
}

ServerListAssistant.prototype.setup = function()
{
	try 
	{
		this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, { visible: false });
		
		this.serverList = this.controller.get('serverList');
		this.controller.get('version').innerHTML = "- v" + Mojo.Controller.appInfo.version;
		
		this.updateList(true);
		this.controller.setupWidget('serverList', 
		{
			itemTemplate: "server-list/server-row",
			swipeToDelete: true,
			reorderable: false
		}, this.serverListModel);
		Mojo.Event.listen(this.serverList, Mojo.Event.listTap, this.listTapHandler.bindAsEventListener(this));
		Mojo.Event.listen(this.serverList, Mojo.Event.listDelete, this.listDeleteHandler.bindAsEventListener(this));
		
		this.updateCommandMenu(true);
		this.controller.setupWidget(Mojo.Menu.commandMenu, { menuClass: 'no-fade' }, this.cmdMenuModel);
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'server-list#setup');
	}
}


ServerListAssistant.prototype.activate = function(event)
{
	if (this.alreadyActivated)
	{
		this.updateList();
	}
	this.alreadyActivated = true;
}
ServerListAssistant.prototype.updateList = function(skipUpdate)
{
	try 
	{
		this.serverListModel.items = [];
		this.serverListModel.items = servers.getListObjects();
		
		//alert('Update:' + this.serverListModel.items.length + '-' + skipUpdate);
		
		if (!skipUpdate) 
		{
			this.serverList.mojo.noticeUpdatedItems(0, this.serverListModel.items);
			this.serverList.mojo.setLength(this.serverListModel.items.length);
		}
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'server-list#updateList');
	}
}
ServerListAssistant.prototype.listTapHandler = function(event)
{
	if (event.originalEvent.target.className.include('prefs'))
	{
		this.controller.stageController.pushScene('server-info', event.item.id);
	}
	else if (event.originalEvent.target.className.include('status'))
	{
		if (event.item.connected) 
		{
			servers.servers[event.item.key].disconnect();
		}
		else
		{
			servers.servers[event.item.key].connect();
		}
	}
	else
	{
		servers.servers[event.item.key].popStatus();
	}
}
ServerListAssistant.prototype.listDeleteHandler = function(event)
{
	servers.deleteServer(event.item.id);
}

ServerListAssistant.prototype.updateCommandMenu = function(skipUpdate)
{
	try 
	{
		this.cmdMenuModel.items = [];
		this.cmdMenuModel.items.push({});
		this.cmdMenuModel.items.push({label: $L('New'), icon: 'new', command: 'new-server'});
		
		if (!skipUpdate)
		{
			this.controller.modelChanged(this.cmdMenuModel);
			this.controller.setMenuVisible(Mojo.Menu.commandMenu, true);
		}
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'server-list#updateList');
	}
}

ServerListAssistant.prototype.handleCommand = function(event)
{
	if (event.type == Mojo.Event.command)
	{
		switch (event.command)
		{
			case 'new-server':
				this.controller.stageController.pushScene('server-info');
				break;
		}
	}
}

ServerListAssistant.prototype.deactivate = function(event) {}
ServerListAssistant.prototype.cleanup = function(event) {}
