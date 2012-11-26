	/**
	 * traduccion de la ruta donde cargar los datos de usuario: devuelve la ruta de la aplicacion */
	var PATH=(function(){
				var p=window.location.pathname;
				return p.substring(0,p.lastIndexOf("/")+1).replace(/^\/st/,"/ap").replace("/visor-rss","");
				})();
	
	var JSON_CONFIG_URL=PATH+"RSSConfigure.do";
	// Configuracion de contingencia
	var JSON_CONFIG_URL_FALLBACK="offline/feeds.js";
	
	if (DEBUG)JSON_CONFIG_URL=JSON_CONFIG_URL_FALLBACK;
	
	var RSS_BACKEND=PATH+"RSSProxy.do"; 
	
	// Carga ajax de los rsss (path o url) 
	
    var PROXY_FETCH=function(feed){ 
    		if (feed.path) return RSS_BACKEND+"?url="+feed.path;
    		return feed.url||"#";
    }
    
    // Substitucion de los enlaces en la pagina
    
    var LINKS={
    	"a.gestion":PATH+"rss/gestioSubscripcionsUsuari.do",
    	"a.call-center":"#",
    	"a.reiniciar":"#",
    	"a.canal":PATH+"rss/gestioSubscripcionsUsuari.do",
    	"a.enlace-gestionar":PATH+"rss/gestioSubscripcionsUsuari.do"
    }

    // Enlaces para cargar la localizacion de camops
    
   	var TF7_L10N=function(lang){return "literales/l10n-"+(lang||"es")+".js";}
   	var RSS_L10N=function(lang){return "literales/rss-i18n-"+(lang||"es")+".js";}
	var IMG_PATH = "img/";
    var SCRIPTS_IMPORT=["js/html.js","config/layout.js","js/filtro.js","js/paginacion.js","js/visor.js"];
    
	
    /**
     * Sobrecarga la conf de TF7
     */
	RSS.patchTF7=function(){
	
					TF7.conf.jsPath =  "js/";
					TF7.conf.cssPath = "css/";
					TF7.conf.imgPath = "img/";
	};
    
    
 