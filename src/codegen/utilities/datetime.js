//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

function DateTime(){
	var now = new Date();
	this.current = {
		y: now.getFullYear(),
		M: now.getMonth() + 1,
		w: now.getDay(),
		d: now.getDate(),
		h: now.getHours(),
		m: now.getMinutes(),
		s: now.getSeconds(),
		mS: now.getMilliseconds()
	};
}

DateTime.prototype.getCurrent = function(format){
	var curr = this.current;

	return format.replace(/(y+|M+|d+|h+|m+|s+)/g, function(match){
		var temp = '';
		temp = (match.length > 1 ? '0' : '') + eval('curr.' + match.slice(-1)).toString();
		return temp.slice(-(match.length > 2 ? match.length : 2));
	});
};

DateTime.prototype.getMSec = function(){
	var temp = this.current.mS.toString();
	while(temp.length < 3){
		temp = '0' + temp;
	}

	return temp.length > 3 ? temp.slice(-3) : temp;
};

DateTime.prototype.getDayOfWeek = function(){
	var temp = '';
	switch(this.current.w){
		case 0:
			temp = 'Sun';
			break;
		case 1:
			temp = 'Mon';
			break;
		case 2:
			temp = 'Tue';
			break;
		case 3:
			temp = 'Wen';
			break;
		case 4:
			temp = 'Thu';
			break;
		case 5:
			temp = 'Fri';
			break;
		case 6:
			temp = 'Sat';
			break;
	}

	return temp;
};

module.exports = DateTime;