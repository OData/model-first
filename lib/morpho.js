(function(){
  function Model()
  {
  }

  Model.prototype.toCsdl = function()
  {
    return '<ComplexType Name="'+this.data+'" />';
  };

  this.Morpho = {
    loadFromYaml : function(str){
      var s = new Model();
      s.data  = str;
      return s;
    }
  };
})();
