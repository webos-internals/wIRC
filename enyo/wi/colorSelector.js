enyo.kind({
	name: 'wi.ColorSelector',
	kind: 'Item',
	layoutKind: 'HFlexLayout',
	align: 'center',
	
	published: {
		caption: '',
		value: {}
	},
	
	components: [
		
		{name: 'popup', kind: 'wi.ColorSelector.Popup', onColorSelect: 'colorSelected'},
		
		{flex: 1, components: [
			{name: 'display', style: 'width: 80px; height: 30px; background-color: #000; border-radius: 5px;', onclick: 'openPopup'},
		]},
		{name: 'caption'},
	],
	
	create: function () {
	    this.inherited(arguments);
		this.$.caption.setContent(this.caption);
		this.updateDisplay();
	},
	
	setValue: function(value) {
		this.value = value;
		this.updateDisplay();
	},
	getValue: function() {
		return this.value;
	},
	
	updateDisplay: function() {
		this.$.display.applyStyle('background-color', this.value);
	},
	
	openPopup: function() {
		this.$.popup.openAtCenter();
	},
	
	colorSelected: function(inSender, inColor) {
		this.$.display.applyStyle('background-color', inColor);
		this.value = inColor;
	},
	
});

enyo.kind({
	name: 'wi.ColorSelector.Popup',
	kind: 'Popup',
	scrim: false,
	
	popupBorderWidth: 24, // so says the css for the popup
	previewWidth: 55, // the width+marginright of the preview element
	
	events: {
		onColorSelect: ''
	},
	
	components: [
		{kind: 'VFlexBox', style: 'height: 200px; width: 40px; float: left; margin-right: 15px;', components: [
			{name: 'original', style: 'border-top-left-radius: 5px; border-top-right-radius: 5px;', flex: 1},
			{name: 'preview', style: 'border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;', flex: 1},
			{name: 'manualButton', kind: 'Button', style: 'margin: 15px 0 0 0;', content: '#', toggling: true, onclick: 'toggleManual'}
		]},
		{
			name: 'canvas',
			kind: enyo.Control,
			nodeTag: 'canvas',
			domAttributes: {
				width: '340px',
				height: '200px',
			},
			style: 'border-radius: 5px; margin-bottom: -5px;',
			onclick: 'canvasClick',
		},
		{name: 'manual', style: 'position: absolute; width: 340px; bottom: -8px; right: 0; background: #ccc; border-top-left-radius: 10px; border-top-right-radius: 10px;', components: [
			{kind: 'RowGroup', caption: 'Manual Color Entry', style: 'margin: 15 0 0 0;', components: [
				{name: 'manualInput', kind: 'Input', hint: 'Any Valid CSS3 Color Unit...',
					onfocus: 'showKeyboard', onblur: 'hideKeyboard', // this keyboard crap is because wirc is in manual mode
					autocorrect: false, autoCapitalize: 'lowercase', autoWordComplete: false, selectAllOnFocus: true,
					changeOnInput: true, onkeydown: 'keyDown', onkeyup: 'keyUp'},
			]},
		]},
	],
	
	
	doOpen: function() {
		this.$.canvas.hasNode();
		this.ctx = this.$.canvas.node.getContext('2d');
		
		this.img = new Image();
		this.img.src = 'enyo/images/colors.png';
		this.img.onload = enyo.bind(this, 'drawImage');
		
		this.$.original.applyStyle('background-color', this.owner.value);
		this.$.preview.applyStyle('background-color', this.owner.value);
		this.$.manualInput.setValue(this.owner.value);
		this.$.manualButton.setDepressed(false);
		this.hideManual();
	},
	doClose: function() {
	},
	
	drawImage: function() {
		this.ctx.drawImage(this.img, 0, 0);
	},
	
	canvasClick: function(inSender, inEvent) {
		if (!this.manualShowing) {
			var c = this.rgbToHex(this.canvasGetColorFromPosition(this.canvasCursorClickPosition(inEvent)));
			this.doColorSelect(c);
			this.close();
		}
		else {
			this.hideManual();
		}
	},
	canvasCursorClickPosition: function(inEvent) {
		var x, y;
		x = inEvent.offsetX;
		y = inEvent.offsetY;
		return {x: x, y: y};
	},
	canvasGetColorFromPosition: function(pos) {
		var data = this.ctx.getImageData(pos.x, pos.y, 1, 1).data;
		return {r: data[0], g: data[1], b: data[2], a: data[3]};
	},
	
	dragGetCanvasPosition: function(inSender, inEvent) {
		var x, y;
		x = inEvent.pageX - (parseInt(this.node.style.left, 10) + this.popupBorderWidth + this.previewWidth);
		y = inEvent.pageY - (parseInt(this.node.style.top, 10) + this.popupBorderWidth);
		return {x: x, y: y};
	},
	dragstartHandler: function(inSender, inEvent) {
	},
	dragHandler: function(inSender, inEvent) {
		if (!this.manualShowing) {
			var c = this.canvasGetColorFromPosition(this.dragGetCanvasPosition(inSender, inEvent));
			this.$.preview.applyStyle('background-color', 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')');
		}
	},
	dragfinishHandler: function(inSender, inEvent) {
		if (!this.manualShowing) {
			var c = this.rgbToHex(this.canvasGetColorFromPosition(this.dragGetCanvasPosition(inSender, inEvent)));
			this.doColorSelect(c);
		}
	},
	
	toggleManual: function(inSender, inEvent) {
		if (this.manualShowing) this.hideManual();
		else this.showManual()
	},
	hideManual: function() {
		this.manualShowing = false;
		this.$.manual.hide();
		this.$.manualButton.setDepressed(false);
	},
	showManual: function() {
		this.manualShowing = true;
		this.$.manual.show();
		this.$.manualInput.forceFocus();
	},
	
	keyDown: function(inSender, inEvent) {
		var text = this.$.manualInput.getValue();
		if (inEvent.keyCode === 13) {
			inEvent.preventDefault();
			if (text) {
				this.doColorSelect(text);
				this.close();
			}
		}
	},
	keyUp: function(inSender, inEvent) {
		var text = this.$.manualInput.getValue();
		if (this.isValidColorString(text))
			this.$.manualInput.$.input.applyStyle('color', '#000');
		else 
			this.$.manualInput.$.input.applyStyle('color', '#666');
	},
	
	isValidColorString: function(string) {
		if (colorWords.indexOf(string) > -1) return true;
		if (string.match(/#([0-9A-Fa-f]{3,6})/)) return true;
		if (string.match(/rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\)/)) return true;
		if (string.match(/rgba\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*([0-9]+(?:\.[0-9]+)?|\.[0-9]+)\s*\)/)) return true;
		if (string.match(/rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)/)) return true;
		if (string.match(/rgba\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*([0-9]+(?:\.[0-9]+)?|\.[0-9]+)\s*\)/)) return true;
		if (string.match(/hsl\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9]|360)\b\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)/)) return true;
		if (string.match(/hsla\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9]|360)\b\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*([0-9]+(?:\.[0-9]+)?|\.[0-9]+)\s*\)/)) return true;
		return false;
	},
	
	rgbToHex: function(t) {
		return '#' + this.toHex(t.r) + this.toHex(t.g) + this.toHex(t.b);
	},
	toHex: function(n) {
		 n = parseInt(n,10);
		 if (isNaN(n)) return "00";
		 n = Math.max(0, Math.min(n,255));
		 return "0123456789ABCDEF".charAt((n-n%16)/16)
		      + "0123456789ABCDEF".charAt(n%16);
	},
	
	showKeyboard: function() {
		enyo.keyboard.show(0);
	},
	hideKeyboard: function() {
		enyo.keyboard.hide();
	},
	
});

var colorWords = [
	'aliceblue',
	'antiquewhite',
	'aqua',
	'aquamarine',
	'azure',
	'beige',
	'bisque',
	'black',
	'blanchedalmond',
	'blue',
	'blueviolet',
	'brown',
	'burlywood',
	'cadetblue',
	'chartreuse',
	'chocolate',
	'coral',
	'cornflowerblue',
	'cornsilk',
	'crimson',
	'cyan',
	'darkblue',
	'darkcyan',
	'darkgoldenrod',
	'darkgray',
	'darkgreen',
	'darkkhaki',
	'darkmagenta',
	'darkolivegreen',
	'darkorange',
	'darkorchid',
	'darkred',
	'darksalmon',
	'darkseagreen',
	'darkslateblue',
	'darkslategray',
	'darkturquoise',
	'darkviolet',
	'deeppink',
	'deepskyblue',
	'dimgray',
	'dodgerblue',
	'firebrick',
	'floralwhite',
	'forestgreen',
	'fuchsia',
	'gainsboro',
	'ghostwhite',
	'gold',
	'goldenrod',
	'gray',
	'green',
	'greenyellow',
	'honeydew',
	'hotpink',
	'indianred',
	'indigo',
	'ivory',
	'khaki',
	'lavender',
	'lavenderblush',
	'lawngreen',
	'lemonchiffon',
	'lightblue',
	'lightcoral',
	'lightcyan',
	'lightgoldenrodyellow',
	'lightgreen',
	'lightpink',
	'lightsalmon',
	'lightseagreen',
	'lightskyblue',
	'lightslategray',
	'lightsteelblue',
	'lightyellow',
	'lime',
	'limegreen',
	'linen',
	'magenta',
	'maroon',
	'mediumaquamarine',
	'mediumblue',
	'mediumorchid',
	'mediumpurple',
	'mediumseagreen',
	'mediumslateblue',
	'mediumspringgreen',
	'mediumturquoise',
	'mediumvioletred',
	'midnightblue',
	'mintcream',
	'mistyrose',
	'moccasin',
	'navajowhite',
	'navy',
	'oldlace',
	'olive',
	'olivedrab',
	'orange',
	'orangered',
	'orchid',
	'palegoldenrod',
	'palegreen',
	'paleturquoise',
	'palevioletred',
	'papayawhip',
	'peachpuff',
	'peru',
	'pink',
	'plum',
	'powderblue',
	'purple',
	'red',
	'rosybrown',
	'royalblue',
	'saddlebrown',
	'salmon',
	'sandybrown',
	'seagreen',
	'seashell',
	'sienna',
	'silver',
	'skyblue',
	'slateblue',
	'slategray',
	'snow',
	'springgreen',
	'steelblue',
	'tan',
	'teal',
	'thistle',
	'tomato',
	'turquoise',
	'violet',
	'wheat',
	'white',
	'whitesmoke',
	'yellow',
	'yellowgreen'
];
