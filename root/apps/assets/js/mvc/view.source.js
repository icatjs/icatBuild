/** {%=appName%}-view.js # */
(function(iCat){
	// templates
	{%=appName%}.template = {
		// your templates...
	};

	// Class
	{%=appName%}.View = iCat.View.extend({
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