enyo.kind({
	name: 'wi.ListSelector',
	kind: enyo.ListSelector,
	
	popupAlign: 'left',
	/*chrome: [
		{name: 'arrow', className: 'enyo-listselector-arrow', style: 'margin-right: 10px;'},
		{kind: 'HFlexBox', flex: 1, components: [
			{name: 'itemContainer'},
			{name: 'client'}
		]},
		{name: 'label'},
	],*/
	
	create: function(inProps) {
		this.inherited(arguments);
		
		// for some reason, pushing my own chrome errors somewhere, so ill just fix their chrome after the fact
		this.$.label.removeClass('enyo-listselector-label enyo-label');
		this.applyStyle('position', 'relative');
		this.$.itemContainer.applyStyle('margin-left', '22px');
		this.$.arrow.applyStyle('position', 'absolute');
		this.$.arrow.applyStyle('left', '0');
	}
	
});
