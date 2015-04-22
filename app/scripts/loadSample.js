'use strict';

$(function (){
  var samplesPrefix   = 'samples/',
      $sampleList     = $('#sampleList'),
      $sampleLoad     = $('#sampleLoad');
  
  function loadSample(){
    $.get(samplesPrefix + $sampleList.find(':selected').text(), function(data){
      window.MorphoEditor.loadSource(data);
    });
  }

  $.each(window.MorphoEditor.getSamples(), function(key, value) {   
       $sampleList.append($('<option></option>').text(value)); 
  });
  
  loadSample();
  $sampleLoad.click(loadSample);
});
