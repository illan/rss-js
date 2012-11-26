	var COUNT_ITEMS=8;
	var MAX_ITEMS_PAGINA=5; // entradas por pagina
	var MAX_TITLE_COUNT=160; // Caracteres en el titulo
	var TITLE_TRUNCATE=false;
	var FILTER_XSS=true; //eliminamos html del texto del rss (En IE esta activado)
	var SKIP_AJAX_LOADER= false; // no muesta la capa de progreso en carga ajax
	
	var HIGHLIGHT_MATCHES=function(){ if (false) $("strong",$("#noticias")).css("color","red");}
	var HIDE_PAGINACION_SOBRE=true;
	var DEBUG=true;
	var SHOW_DESCRIPTION=DEBUG;
  	// Manejador de error global
   	
   	var ERROR_CARGANDO_CONFIGURACION=function(){ 		alert("Error al cargar la configuracion")   	};
   	
   	
    	
	var Empty = (function(){});
	
    // Parametros por defecto
	
    var RSSParameters={language:"es",feeds:[],"filtres": { "others": { "ALL":"Todos" }},status:"error",message:"Internal Error"};
    
	var	PageLoader={}	
	var	Paginador={};

   	var RSS={feeds:[],sources:[],hideError:false,decorators:{},messages:{},maxTitleCount:MAX_TITLE_COUNT,Setup:{jsonpCallback:CALLBACK_JSONP}};
       
       
       
   /**
   	 *  Manejador para la carja XSS por JSONP
   	 * 
   	 */
   	var CALLBACK_JSONP="RSS.jsonp";
//   	window[CALLBACK_JSONP]=
    RSS.jsonp=function(){
		(JSONP.callback()||Empty).apply(this,arguments)
	}
	JSONP={
			queue:[],
			attach:function(trigger){this.queue.push(trigger)},
			callback:function(){
				return (this.queue.shift());
			}
	}
  
   		/**
        * 
        * Formato o filtrado a los campos antes de mostrarlos 
        * 
        */
   	
	if (TITLE_TRUNCATE)
			RSS.decorators["title"]={
					decorate:
						function(text){
							return (text||"").substring(0,RSS.maxTitleCount)+((RSS.maxTitleCount<(text||"").length)?"(...)":"");
						}
					};
   	
       

	if (!Date.now) {
  		Date.now = function now() {
    		return +(new Date());
  		};
	}
	
	RSS.dateFormat=function(d){
        // formato dd-MM-YYYY
		if (!d) return  RSS.DEFAULT_DATE;
		try{
			d=(typeof(d)=="string")?new Date(d)
							:(d instanceof Date)?d:new Date(Date.now());
			return [d.getDate()>=10?d.getDate():"0"+d.getDate(),d.getMonth()>=10?d.getMonth():"0"+d.getMonth(),d.getFullYear()].join("-");
		}catch(ex){
			return "";
		}
 			
	}
	RSS.toDate=function (fecha){
	/**
	 * Sustitucion del formato dd-MM-YYY al formato MM-dd-YYY
	 **/	
		try{
			var reg=fecha.match(RSS.REGEXP_FORMATO_FECHA);
			return new Date([reg[2],reg[1],reg[3]].join("-"))
		}catch(ex){
			return new Date(Date.now());
		}
	}

	
	RSS.REGEXP_FORMATO_FECHA=(true)?/^([0-9]{2})[-]([0-9]{2})[-]([0-9]{4})$/:/^(([0-9]{2})[-]){2}([0-9]{4})$/;
	RSS.DEFAULT_DATE=RSS.dateFormat(new Date(Date.now()));
	
	
	

    /**
     * Oculta el form hasta terminar la carga    */
	RSS.ajaxLoading=(function(){
		var loading={}
		return {
				attach:function(parent){
						var target=(parent||loading.layer);
						if (!loading.img){
							//loading.img=$('<img src="img/grafico-cargador-automatico.gif"/>');
							loading.img=$('<div class="carregant"><p>Cargando datos...</p><div>');
						}else{
							loading.img.detach();	
						}
						$(target).append(loading.img);
						loading.layer=target;
						return target;

				},
				show:function(parent){
					if (SKIP_AJAX_LOADER) return 
					this.target=$(parent||loading.layer||this.attach("#loading"));
					this.target.show();
				},
				hide:function(){
					if (SKIP_AJAX_LOADER) return 
					if (this.target)
						this.target.hide();
				}};
	})();
	
	
	Debug={
		ENABLE_TRACE:false,
		trace:function(){	
			if (!this.ENABLE_TRACE) return;
			console.log((new Error()).stack)
			debugger;
		}		
	};	
	
	