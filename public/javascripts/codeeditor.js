(function($){

	var editorHeight = $(window).height();

	var modeMappings = {
		javascript: 'text/javascript',
		csharp: 'text/x-csharp'
	};

	function mapMode(languageName){
		if(modeMappings[languageName]){
			return modeMappings[languageName];
		}
		
		return 'text/javascript';
	}
	
	function initCodeEditor(editorName, languageName, height){
		var inputarea = $('#' + editorName)[0];
		
		var editor = CodeMirror.fromTextArea(inputarea, {
			mode:  mapMode(languageName),
			lineNumbers: true
		});

		editor.setSize("100%", height);

		return editor;
	}

	function refreshCodeEditor(){
		var active = $('#genCodeTabs > .active > a');
		var genTabContent = $(active.data('target'));
		var cmContainer = genTabContent.find('.CodeMirror')[0];
		if(cmContainer && cmContainer.CodeMirror){
			cmContainer.CodeMirror.refresh();
		}
	}

	function removeLinebreak(str){
		var result = '';
		for(var i = 0; i < str.length; i++){
			if(str[i] !== '\n'){
				result += str[i];
			}
		}

		return result;
	}

	$(document).ready(function(){
		var iEditor = initCodeEditor('inputarea', 'javascript', editorHeight * 0.92);
		var oEditor_csharp = initCodeEditor('outputarea_csharp', 'csharp', editorHeight * 0.85);
		initCodeEditor('outputarea_others', 'others', editorHeight * 0.85);
		
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
		            url: "http://localhost:9002/sample?code=csharp",
		            contentType: "application/json",
		            data: reqData,
		            success: function (result) {
		                oEditor_csharp.setValue(result);
		            }
		        });
    		}, 500);

		});
	});
})(jQuery);