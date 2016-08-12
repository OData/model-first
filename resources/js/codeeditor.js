//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

(function($){

	// Gets the height of the code mirror editor.
	var editorHeight = $(window).height();

	// Language mode mappings.
	var modeMappings = {
		javascript: 'text/javascript',
		csharp: 'text/x-csharp'
	};

	/*
	** Map to the mode from language name.
	** @params:
	**     languageName: The language name.
	** @returns:
	**     Returns the mode mapping from language name.
	*/
	function mapMode(languageName){
		if(modeMappings[languageName]){
			return modeMappings[languageName];
		}
		
		return 'text/javascript';
	}
	
	/*
	** Initialize the code editor.
	** @params: 
	**     editorName: The name of code editor.
	**     languageName: The language name which will be formatted.
	**     height: The height of code editor.
	*/
	function initCodeEditor(editorName, languageName, height){
		var inputarea = $('#' + editorName)[0];
		
		var editor = CodeMirror.fromTextArea(inputarea, {
			mode:  mapMode(languageName),
			lineNumbers: true
		});

		// Set the size (width, height) of code editor.
		editor.setSize("100%", height);

		return editor;
	}

	/*
	** Remove the line break (\n).
	** @params:
	**     targetString: The target string.
	*/
	function removeLinebreak(targetString){
		var result = '';
		for(var i = 0; i < targetString.length; i++){
			if(targetString[i] !== '\n'){
				result += targetString[i];
			}
		}

		return result;
	}

	/*
	** Get the last segment from path string.
	** params: 
	**     path: A path string.
	*/
	function getLastSegment(path){
		if(path.charAt(path.length - 1) == '/'){
			path = path.slice(0, -1);
		}

		var arr = path.split('/');

		return arr[arr.length - 1];
	}

	/*
	** Remove the specified string from the end of target string.
	** @params:
	**     targetString: The target string.
	**     removedString: The string will be removed from the target string.
	** @returns:
	**     Returns the processed string.
	*/
	function trimEnd(targetString, removedString){
		var tag = true;
		if(targetString && targetString.length > 0 && targetString.length >= removedString.length){
			var delta = targetString.length - removedString.length;
			for(var i = removedString.length - 1; i >= 0; i--){
				if(removedString[i] !== targetString[i + delta]){
					tag = false;
					break;
				}
			}

			if(tag){
				return targetString.substring(0, delta);
			}
		}

		return targetString;
		
	}

	$(document).ready(function(){
		var lastSegment = trimEnd(getLastSegment(window.location.href), '#');
		if(lastSegment === 'gen-client'){
			var iEditor = initCodeEditor('inputarea', 'javascript', editorHeight * 0.92);
			var oEditor_csharp = initCodeEditor('outputarea_csharp', 'csharp', editorHeight * 0.85);
			initCodeEditor('outputarea_others', 'others', editorHeight * 0.85);

			// Methods.
			function refreshCodeEditor(){
				// Location for the active label '<a />'.
				var active = $('#genCodeTabs > .active > a');

				// Using active.data('target') gets the value of the attribute data-target.
				// Then use the value of attribute data-target to get the element <div /> which contains the code editor.
				var genTabContent = $(active.data('target'));

				var cmContainer = genTabContent.find('.CodeMirror')[0];
				if(cmContainer && cmContainer.CodeMirror){
					cmContainer.CodeMirror.refresh();
				}
			}

			// Events.
			$('#genCodeTabs > li > a[data-toggle="tab"]').on('shown.bs.tab', function(e){
				if($(e.target).is(':visible')){
					refreshCodeEditor();
				}
			});

			var timer = null;
			iEditor.on('change', function(){
			    window.clearTimeout(timer);
	    		timer = window.setTimeout(function(){
					var reqData = removeLinebreak(iEditor.getValue());
	    			$.ajax({
			            type: "POST",
			            url: window.location.protocol + '//' + window.location.host + "/sample?code=csharp",
			            contentType: "application/json",
			            data: reqData,
			            success: function (result) {
			                oEditor_csharp.setValue(result);
			            }
			        });
	    		}, 500);
			});
		}
		else if(lastSegment === 'gen-server'){
			var iSvrEditor = initCodeEditor('inputareaSvr', 'javascript', editorHeight * 0.92);
			var oSvrEditor = initCodeEditor('outputareaSvr', 'csharp', editorHeight * 0.85);

			var files = [];
			$('a').click(function(){
				var reqUrl = '';
				if($(this).attr('name') === 'todo'){
					reqUrl = window.location.protocol + '//' + window.location.host + "/svrSample?name=todo";
				}
				else if($(this).attr('name') === 'trippin'){
					reqUrl = window.location.protocol + '//' + window.location.host + "/svrSample?name=trippin";
				}

				if(reqUrl !== ''){
					$.ajax({
			            type: "GET",
			            url: reqUrl,
			            contentType: "application/json",
			            success: function (result) {
			            	iSvrEditor.setValue(result.metadata);
			                $('#filesSelector').empty();
			                if(result.files && result.files.length > 0){
			                	files = [];
			                	oSvrEditor.setValue(result.files[0].content);
			                	for(var i = 0; i < result.files.length; i++){
			                		files.push(result.files[i]);
				                	var option = '<option value="' + i + '">' + result.files[i].fileName + '</option>';
				                	$('#filesSelector').append(option);
				                }
			                }
			                
			                reqUrl = '';
			            }
			        });
				}
			});

			$('#filesSelector').change(function(){
				if(files[$(this).val()]){
					oSvrEditor.setValue(files[$(this).val()].content);
				}
			});

			iSvrEditor.on('change', function(){
	    		window.setTimeout(function(){
					var reqData = removeLinebreak(iSvrEditor.getValue());
	    			$.ajax({
			            type: "POST",
			            url: window.location.protocol + '//' + window.location.host + "/svrSample?code=csharp",
			            contentType: "application/json",
			            data: reqData,
			            success: function (result) {
			                $('#filesSelector').empty();
			                if(result && result.length > 0){
			                	files = [];
			                	oSvrEditor.setValue(result[0].content);
			                	for(var i = 0; i < result.length; i++){
			                		files.push(result[i]);
				                	var option = '<option value="' + i + '">' + result[i].fileName + '</option>';
				                	$('#filesSelector').append(option);
				                }
			                }
			            }
			        });
	    		}, 500);
			});

			$('#downloadBtn').click(function(){
				var reqData = removeLinebreak(iSvrEditor.getValue());
				$.ajax({
		            type: "POST",
		            url: window.location.protocol + '//' + window.location.host + "/server/codegen?name=csharp",
		            contentType: "application/json",
		            data: reqData,
		            success: function (result) {
		                window.location.href = result.link;
		            }
		        });
			});
		}
	});
})(jQuery);