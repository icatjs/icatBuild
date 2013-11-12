/** {%=appName%}-model.js # */
(function(iCat){
	// Class
	{%=appName%}.Model = iCat.Model.extend({
		propTest: '公用属性',
		fnTest: function(){
			alert('公用方法');
		}
	});

	// setting
	{%=appName%}.setting = {
		// your settings...
	};
})(ICAT);