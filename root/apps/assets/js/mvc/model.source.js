/** {%=name%}-model.js # */
(function(iCat){
	// Class
	{%=name%}.Model = iCat.Model.extend({
		propTest: '公用属性',
		fnTest: function(){
			alert('公用方法');
		}
	});

	// setting
	{%=name%}.setting = {
		// your settings...
	};
})(ICAT);