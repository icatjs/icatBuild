/** {%=name%}-view.js # */
(function(iCat){
	// templates
	{%=name%}.template = {
		// your templates...
	};

	// Class
	{%=name%}.View = iCat.View.extend({
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