var Core = {
	verify : function(str) {
		var firstLetter = str[0].toUpperCase();
		if (firstLetter.toLowerCase() != firstLetter && str.indexOf('\n') < 0) {
			return true;
		}
		else {
			return false;
		}	
	},
	
	read : function(str) {
		var result = new Object();
		result.valid = this.verify(str);
		if (result.valid)
		{
			result.value = 'ComplexType<' + str + '>;';
		}
		else
		{
			result.value = "Input is not valid!";
		}
		return result;
	}
};