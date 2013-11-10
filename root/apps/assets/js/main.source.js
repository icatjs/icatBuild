/*
 * Applaction: {%=name%}
 * Author: {%=author_name%}
 * Date: {%=grunt.template.today("yyyy-mm-dd HH:MM:ss")%}.
 */

(function(iCat){
	//定义应用
	iCat.app('{%=name%}', function(){
		return {
			version: '{%=(subapp? subapp+"-" : "") + version%}',
			init: function(){
				// your code...
			}
		};
	});

	//初始化
	{%=name%}.init();
})(ICAT);