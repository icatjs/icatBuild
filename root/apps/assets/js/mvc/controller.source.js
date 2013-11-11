/** {%=name%}-Controller.js # */
(function(iCat){

	// Class
	{%=name%}.Controller = iCat.Controller.extend({
		config: {
			View: {%=name%}.View,
			Model: {%=name%}.Model
		},

		routes: {
			'home': 'homeInit'
		},

		homeInit: function(){
			var c = this;
			c.init({
				// 初始化配置
			});
		}
	});
})(ICAT);