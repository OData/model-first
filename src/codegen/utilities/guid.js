//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

exports.NewGuid = function(){
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

function s4(){
	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
      	.substring(1);
}