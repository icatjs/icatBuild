/** {%=appName%}-Controller.js # */
(function(iCat){
	// Class
	{%=appName%}.Controller = iCat.Controller.extend({
		config: {
			View: {%=appName%}.View,
			Model: {%=appName%}.Model
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