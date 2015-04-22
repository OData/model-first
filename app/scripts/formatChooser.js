$(function(){
    $("input[name=targetFormat]:radio").change(function (){
      console.log($(this).val());
      window.MorphoEditor.setTargetFormat($(this).val());
    });
});
