$(function(){
    var config  = window.morphoEditorConfig;
    for(var i=0; i<config.targetFormats.length; i++){
        console.log(config.targetFormats[i]);
        $('<input type="radio" name="targetFormat" value="' +
            config.targetFormats[i] +
            (config.targetFormats[i] === config.targetFormat ? '" checked' : '"') +
            '>' +
            config.formats[config.targetFormats[i]].displayName +
            '</input>')
          .appendTo($('#targetFormatList'));
    }

    $('input[name=targetFormat]:radio').change(function (){
      window.MorphoEditor.setTargetFormat($(this).val());
    });
});
