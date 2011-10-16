String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
}

// replace tokens in a string with values
replaceTokens = function(string) {
	string = string.replace("%WIRCVER%", Mojo.Controller.appInfo.version + '-' + githash);
	string = string.replace("%WEBOSVER%", Mojo.Environment.DeviceInfo.platformVersion);
	string = string.replace("%CARRIER%", Mojo.Environment.DeviceInfo.carrierName);
	string = string.replace("%MODEL%", Mojo.Environment.DeviceInfo.modelNameAscii);
	string = string.replace("%DATETIME%", Mojo.Format.formatDate(new Date(), {time: 'full', date: 'full'}));
	string = string.replace("%REALNAME%", prefs.get().realname);
	return string;
}

// formats a timestamp to a readable date
formatDate = function(date){
    var dateObj = new Date(date * 1000);
    var toReturn = '';
    var pm = false;
    
    toReturn += (dateObj.getMonth() + 1) + '/' + dateObj.getDate() + '/' + String(dateObj.getFullYear()).substring(2) + ' ';
    
    if (dateObj.getHours() > 12) 
        pm = true;
    
    if (!pm) {
        if (dateObj.getHours() < 1) 
            toReturn += '12';
        if (dateObj.getHours() > 0) 
            toReturn += dateObj.getHours();
        toReturn += ':';
        if (dateObj.getMinutes() < 10) 
            toReturn += '0'
        toReturn += dateObj.getMinutes() + ' AM';
    }
    else {
        toReturn += (dateObj.getHours() - 12) + ':';
        if (dateObj.getMinutes() < 10) 
            toReturn += '0'
        toReturn += dateObj.getMinutes() + ' PM';
    }
    
    return toReturn;
}

// strips html tags and fixes "double space" problem in the string
formatForHtml = function(string){
    string = string.escapeHTML();
    string = string.replace(/[\s]{2}/g, " &nbsp;");
    return string;
}

// parses urls to html links, not using Mojo.Format.runTextIndexer because it tries to parse email addresses and other crap stupidly
formatLinks = function(string){
													  // \/ changed this from a \w to a \S fixes the - thing
    return string.replace(/((https?\:\/\/)|(www\.))(\S+)(\S{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ig, function(url){
        var full_url = url;
        if (!full_url.match('^https?:\/\/')) {
            full_url = 'http://' + full_url;
        }
        return '<a href="' + full_url + '" target="_blank">' + url + '</a>';
    });
}

// trim function
trim = function(str){
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
}

// formats seconds into a readable string
formatSeconds = function(seconds, longFormat){
    var toReturn = '';
    
    var days = Math.floor(seconds / 86400);
    seconds -= (days * 86400);
    
    var hours = Math.floor(seconds / 3600);
    seconds -= (hours * 3600);
    
    var mins = Math.floor(seconds / 60);
    seconds -= (mins * 60);
    
    if (longFormat) {
        if (days == 1) 
            toReturn += days + ' day ';
        if (days > 1) 
            toReturn += days + ' days ';
        if (hours == 1) 
            toReturn += hours + ' hour ';
        if (hours > 1) 
            toReturn += hours + ' hours ';
        if (mins == 1) 
            toReturn += mins + ' min ';
        if (mins > 1) 
            toReturn += mins + ' mins ';
        if (seconds == 1) 
            toReturn += seconds + ' sec ';
        if (seconds > 1) 
            toReturn += seconds + ' secs ';
    }
    else {
        if (days > 0) 
            toReturn += days + 'd ';
        if (hours > 0) 
            toReturn += hours + 'h ';
        if (mins > 0) 
            toReturn += mins + 'm ';
        if (seconds > 0) 
            toReturn += seconds + 's ';
    }
    
    if (toReturn == '') {
        toReturn = 'never';
    }
    
    return toReturn;
}
formatMilliSeconds = function(milliseconds){
    var toReturn = '';
    
	var seconds = Math.floor(milliseconds / 1000);
	milliseconds = "" + (milliseconds - (seconds * 1000));
	while(milliseconds.length < 3) { milliseconds = '0' + milliseconds; }
	var m = 2;
	while(milliseconds.charAt(m) == "0") {
		milliseconds = milliseconds.substr(0, m);
		m--;
	}
	
    var hours = Math.floor(seconds / 3600);
    seconds -= (hours * 3600);
    
    var mins = Math.floor(seconds / 60);
    seconds -= (mins * 60);
    
    if (hours > 0) 
        toReturn += hours + 'h ';
    if (mins > 0) 
        toReturn += mins + 'm ';
    if (milliseconds > 0) 
        toReturn += seconds + '.' + milliseconds + 's ';
    else if (seconds > 0) 
        toReturn += seconds + 's ';
    
    if (toReturn == '') {
        toReturn = 'instant';
    }
    
    return toReturn;
}

colorize = function (message) {
	var pageBack  = 'white';
	var pageFront = 'black';
	var length    = message.length;
	var newText   = '';
	var bold      = false;
	var color     = false;
	var reverse   = false;
	var underline = false;
	var foreColor = '';
	var backColor = '';
	
	if (message.indexOf(String.fromCharCode(2))  == -1 &&
		message.indexOf(String.fromCharCode(3))  == -1 &&
		message.indexOf(String.fromCharCode(15)) == -1 &&
		message.indexOf(String.fromCharCode(22)) == -1 &&
		message.indexOf(String.fromCharCode(31)) == -1)
	{
		return message;
	}
	
	for (var i = 0 ; i < length ; i++) {
		switch (message.charAt(i)) {
			case String.fromCharCode(2):
				if (bold) {
					newText += '</b>';
					bold     = false;
				} else {
					newText += '<b>';
					bold    = true;
				}
				break;
			case String.fromCharCode(3):
				if (color)	{
					newText += '</span>';
					color = false;
				}
				foreColor = '';
				backColor = '';
				if ((parseInt(message.charAt(i+1)) >= 0) && (parseInt(message.charAt(i+1)) <= 9)) {
					color = true;
					if ((parseInt(message.charAt(++i+1)) >= 0) && (parseInt(message.charAt(i+1)) <= 9)) {
						foreColor = getColor(parseInt(message.charAt(i)) * 10 + parseInt(message.charAt(++i)));
					} else {
						foreColor = getColor(parseInt(message.charAt(i)));
					}
					if ((message.charAt(i+1) == ',') && (parseInt(message.charAt(++i+1)) >= 0) && (parseInt(message.charAt(i+1)) <= 9)) {
						if ((parseInt(message.charAt(++i+1)) >= 0) && (parseInt(message.charAt(i+1)) <= 9)) {
							backColor = getColor(parseInt(message.charAt(i)) * 10 + parseInt(message.charAt(++i)));
						} else {
							backColor = getColor(parseInt(message.charAt(i)));
						}
					}
				}
				if (foreColor) {
					newText += '<span style="color:'+foreColor;
					if (backColor) {
						newText += ';background-color:'+backColor;
					}
					newText += '">';
				}
				break;
			case String.fromCharCode(15):
				if (bold) {
					newText += '</b>';
					bold     = false;
				}
				if (color) {
					newText += '</span>';
					color    = false;
				}
				if (reverse) {
					newText += '</span>';
					reverse  = false;
				}
				if (underline) {
					newText  += '</u>';
					underline = false;
				}
				break;
			case String.fromCharCode(22):
				if (reverse) {
					newText += '</span>';
					reverse  = false;
				} else {
					newText += '<span style="color:'+pageBack+';background-color:'+pageFront+'">';
					reverse  = true;
				}
			case String.fromCharCode(31):
				if (underline) {
					newText  += '</u>';
					underline = false;
				} else {
					newText  += '<u>';
					underline = true;
				}
			default:
				newText += message.charAt(i);
				break;
		}

	}
	if (bold)      newText += '</b>';
	if (color)     newText += '</span>';
	if (reverse)   newText += '</span>'
	if (underline) newText += '</u>';
	return newText;
}

getColor = function(numeric)
{
	var num = parseInt(numeric);
	switch (num)
	{
		case 0:  return 'white';
		case 1:  return 'black';
		case 2:  return 'navy';
		case 3:  return 'green';
		case 4:  return 'red';
		case 5:  return 'maroon';
		case 6:  return 'purple';
		case 7:  return 'olive';
		case 8:  return 'yellow';
		case 9:  return 'lime';
		case 10: return 'teal';
		case 11: return 'aqua';
		case 12: return 'blue';
		case 13: return 'fuchsia';
		case 14: return 'gray';
		default: return 'silver';
	}
}

isLightTheme = function()
{
	if (prefs.get().theme == 'palm-default' || prefs.get().theme == 'palm-default flat flat-default')
		return true;
	else
		return false;
}
isDarkTheme = function() { return !isLightTheme(); }

// set the body class for the current theme and device size
setTheme = function(doc, theme)
{
	var deviceTheme = '';
	if (Mojo.Environment.DeviceInfo.modelNameAscii == 'Pixi' ||
		Mojo.Environment.DeviceInfo.modelNameAscii == 'Veer')
		deviceTheme = ' small-device';
	if (Mojo.Environment.DeviceInfo.modelNameAscii == 'Pre3')
		deviceTheme = ' pre3';
	if (Mojo.Environment.DeviceInfo.modelNameAscii == 'TouchPad')
		deviceTheme = ' no-gesture';
	
	if (theme)
		doc.body.className = theme + deviceTheme;
	else
		doc.body.className = prefs.get().theme + deviceTheme;
	
	var headCSS = getCSSRule(doc, 'body.flat div.palm-header, body.flat div.palm-page-header.multi-line');
	if (headCSS)
	{
		if (prefs.get().colorFlatHeader == 'random')
			headCSS.style.backgroundColor = ircNick.getRandomColor3((prefs.get().theme == 'palm-dark' ? false : true));
		else
			headCSS.style.backgroundColor = prefs.get().colorFlatHeader;
	}
	
}

// this function comes from http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript
// modified to accept a document variable
getCSSRule = function(doc, ruleName, deleteFlag)
{
	ruleName = ruleName.toLowerCase();
	if (doc.styleSheets)
	{
		for (var i = 0; i < doc.styleSheets.length; i++)
		{
			var styleSheet = doc.styleSheets[i];
			var ii = 0;
			var cssRule = false;
			do
			{
				if (styleSheet.cssRules)
					cssRule = styleSheet.cssRules[ii];
				else
					cssRule = styleSheet.rules[ii]; 
				if (cssRule)
				{
					if (cssRule.selectorText &&
						cssRule.selectorText.toLowerCase() == ruleName)
					{
						if (deleteFlag == 'delete')
						{
							if (styleSheet.cssRules)
								styleSheet.deleteRule(ii);
							else
								styleSheet.removeRule(ii);
							return true;
						}
						else
						{
							return cssRule;
						}
					}
				}
				ii++;
			} while (cssRule)
		}
	}
	return false;
}
	
var listColorChoices = [
	{label:'', value:''},
	{label:'aliceblue', value:'aliceblue'},
	{label:'antiquewhite', value:'antiquewhite'},
	{label:'aqua', value:'aqua'},
	{label:'aquamarine', value:'aquamarine'},
	{label:'azure', value:'azure'},
	{label:'beige', value:'beige'},
	{label:'bisque', value:'bisque'},
	{label:'black', value:'black'},
	{label:'blanchedalmond', value:'blanchedalmond'},
	{label:'blue', value:'blue'},
	{label:'blueviolet', value:'blueviolet'},
	{label:'brown', value:'brown'},
	{label:'burlywood', value:'burlywood'},
	{label:'cadetblue', value:'cadetblue'},
	{label:'chartreuse', value:'chartreuse'},
	{label:'chocolate', value:'chocolate'},
	{label:'coral', value:'coral'},
	{label:'cornflowerblue', value:'cornflowerblue'},
	{label:'cornsilk', value:'cornsilk'},
	{label:'crimson', value:'crimson'},
	{label:'cyan', value:'cyan'},
	{label:'darkblue', value:'darkblue'},
	{label:'darkcyan', value:'darkcyan'},
	{label:'darkgoldenrod', value:'darkgoldenrod'},
	{label:'darkgray', value:'darkgray'},
	{label:'darkgreen', value:'darkgreen'},
	{label:'darkkhaki', value:'darkkhaki'},
	{label:'darkmagenta', value:'darkmagenta'},
	{label:'darkolivegreen', value:'darkolivegreen'},
	{label:'darkorange', value:'darkorange'},
	{label:'darkorchid', value:'darkorchid'},
	{label:'darkred', value:'darkred'},
	{label:'darksalmon', value:'darksalmon'},
	{label:'darkseagreen', value:'darkseagreen'},
	{label:'darkslateblue', value:'darkslateblue'},
	{label:'darkslategray', value:'darkslategray'},
	{label:'darkturquoise', value:'darkturquoise'},
	{label:'darkviolet', value:'darkviolet'},
	{label:'deeppink', value:'deeppink'},
	{label:'deepskyblue', value:'deepskyblue'},
	{label:'dimgray', value:'dimgray'},
	{label:'dodgerblue', value:'dodgerblue'},
	{label:'firebrick', value:'firebrick'},
	{label:'floralwhite', value:'floralwhite'},
	{label:'forestgreen', value:'forestgreen'},
	{label:'fuchsia', value:'fuchsia'},
	{label:'gainsboro', value:'gainsboro'},
	{label:'ghostwhite', value:'ghostwhite'},
	{label:'gold', value:'gold'},
	{label:'goldenrod', value:'goldenrod'},
	{label:'gray', value:'gray'},
	{label:'green', value:'green'},
	{label:'greenyellow', value:'greenyellow'},
	{label:'honeydew', value:'honeydew'},
	{label:'hotpink', value:'hotpink'},
	{label:'indianred', value:'indianred'},
	{label:'indigo', value:'indigo'},
	{label:'ivory', value:'ivory'},
	{label:'khaki', value:'khaki'},
	{label:'lavender', value:'lavender'},
	{label:'lavenderblush', value:'lavenderblush'},
	{label:'lawngreen', value:'lawngreen'},
	{label:'lemonchiffon', value:'lemonchiffon'},
	{label:'lightblue', value:'lightblue'},
	{label:'lightcoral', value:'lightcoral'},
	{label:'lightcyan', value:'lightcyan'},
	{label:'lightgoldenrodyellow', value:'lightgoldenrodyellow'},
	{label:'lightgreen', value:'lightgreen'},
	{label:'lightpink', value:'lightpink'},
	{label:'lightsalmon', value:'lightsalmon'},
	{label:'lightseagreen', value:'lightseagreen'},
	{label:'lightskyblue', value:'lightskyblue'},
	{label:'lightslategray', value:'lightslategray'},
	{label:'lightsteelblue', value:'lightsteelblue'},
	{label:'lightyellow', value:'lightyellow'},
	{label:'lime', value:'lime'},
	{label:'limegreen', value:'limegreen'},
	{label:'linen', value:'linen'},
	{label:'magenta', value:'magenta'},
	{label:'maroon', value:'maroon'},
	{label:'mediumaquamarine', value:'mediumaquamarine'},
	{label:'mediumblue', value:'mediumblue'},
	{label:'mediumorchid', value:'mediumorchid'},
	{label:'mediumpurple', value:'mediumpurple'},
	{label:'mediumseagreen', value:'mediumseagreen'},
	{label:'mediumslateblue', value:'mediumslateblue'},
	{label:'mediumspringgreen', value:'mediumspringgreen'},
	{label:'mediumturquoise', value:'mediumturquoise'},
	{label:'mediumvioletred', value:'mediumvioletred'},
	{label:'midnightblue', value:'midnightblue'},
	{label:'mintcream', value:'mintcream'},
	{label:'mistyrose', value:'mistyrose'},
	{label:'moccasin', value:'moccasin'},
	{label:'navajowhite', value:'navajowhite'},
	{label:'navy', value:'navy'},
	{label:'oldlace', value:'oldlace'},
	{label:'olive', value:'olive'},
	{label:'olivedrab', value:'olivedrab'},
	{label:'orange', value:'orange'},
	{label:'orangered', value:'orangered'},
	{label:'orchid', value:'orchid'},
	{label:'palegoldenrod', value:'palegoldenrod'},
	{label:'palegreen', value:'palegreen'},
	{label:'paleturquoise', value:'paleturquoise'},
	{label:'palevioletred', value:'palevioletred'},
	{label:'papayawhip', value:'papayawhip'},
	{label:'peachpuff', value:'peachpuff'},
	{label:'peru', value:'peru'},
	{label:'pink', value:'pink'},
	{label:'plum', value:'plum'},
	{label:'powderblue', value:'powderblue'},
	{label:'purple', value:'purple'},
	{label:'red', value:'red'},
	{label:'rosybrown', value:'rosybrown'},
	{label:'royalblue', value:'royalblue'},
	{label:'saddlebrown', value:'saddlebrown'},
	{label:'salmon', value:'salmon'},
	{label:'sandybrown', value:'sandybrown'},
	{label:'seagreen', value:'seagreen'},
	{label:'seashell', value:'seashell'},
	{label:'sienna', value:'sienna'},
	{label:'silver', value:'silver'},
	{label:'skyblue', value:'skyblue'},
	{label:'slateblue', value:'slateblue'},
	{label:'slategray', value:'slategray'},
	{label:'snow', value:'snow'},
	{label:'springgreen', value:'springgreen'},
	{label:'steelblue', value:'steelblue'},
	{label:'tan', value:'tan'},
	{label:'teal', value:'teal'},
	{label:'thistle', value:'thistle'},
	{label:'tomato', value:'tomato'},
	{label:'turquoise', value:'turquoise'},
	{label:'violet', value:'violet'},
	{label:'wheat', value:'wheat'},
	{label:'white', value:'white'},
	{label:'whitesmoke', value:'whitesmoke'},
	{label:'yellow', value:'yellow'},
	{label:'yellowgreen', value:'yellowgreen'}
];
