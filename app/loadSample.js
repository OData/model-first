var samples = ['sample.yaml', 'sample2.yaml'];

$(loadSampleInit);

function loadSampleInit()
{
  var samplesPrefix = 'samples/';
  var $sampleList = $('#sampleList');

  $.each(samples, function(key, value) {   
       $sampleList.append($('<option></option>').text(value)); 
  });

  function loadSample(){
    var item = $sampleList.find(':selected').text();
    $.get(samplesPrefix + item, function(data){
      sourceEditor.setValue(data);
      convert(); 
    });
  }
  
  loadSample();
  $sampleList.change(loadSample);
}


