<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="format-detection" content="telephone=no" />
<meta name="format-detection" content="email=no" />

{%
	if(noMerged){
%}<link rel="stylesheet" href="<?php echo "$webroot/$sysRef/reset/phonecore$source.css$timestamp";?>" />
<script type="text/javascript" src="<?php echo "$webroot/$sysRef/icat/1.1.6/icat$source.js$timestamp";?>"
	data-main="<?php echo "{%=prefix%}$appRef/assets/js/main";?>"></script>{%
	} else {
%}<script type="text/javascript" src="<?php echo "$webroot/$sysRef/icat/1.1.6/icat$source.js$timestamp";?>"
	data-main="<?php echo "{%=prefix%}$appRef/assets/js/main";?>" data-cssfile="<?php echo "../css/{%=name%}.css";?>"></script>{%
	}
%}