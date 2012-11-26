


$.extend(RSS,{targetDiv:"#noticias",noResultsDiv:"#no-results", paginador:".listado, .paginador"});

$.extend(RSS,{
		template:$("#rss-template"),
		format:function(item){
		        /**
		         * Copia en la plantilla los valores del item
		         */ 
				var entry=this.template.clone();
				$(entry).find("a.link").attr("href",item.link);
				$(entry).find(".title").html(item.title);
				if (SHOW_DESCRIPTION) $(entry).find(".description").html(item.description);
				$(entry).find(".pubDate").html(RSS.dateFormat(item.pubDate));
				$(entry).find(".domain").html(item.domain);
				$(entry).find(".category").html(item.categoria);
				$(entry).find(".label").html(item.label);
				if (item.imagen){
						$(entry).find(".imagen").attr("src",item.imagen);
						$(entry).find(".imagen").show();
				}else{
						$(entry).find(".imagen").hide();
				}
				return entry;
		},
    	done:function(){
							HTML.applyStylesheet($("#rss-css-hack").text());
							$.each(LINKS,function(selector,href){
							 	$(selector).attr("href",href);
							});	
					 		$("#filtrar-button").click(function(e){ RSS.refresh();e.preventDefault(); return false;});
					 		$(".caixa-formulari").show();
					 		$("#filtrar-button").removeAttr("disabled");
					 		$(".missatge-feedback-positiu").css("padding-bottom","1.5em");
					 		$("#content").show();
					 		RSS.refresh();
					 		RSS.hideError=true;
					 		if (SKIP_AJAX_LOADER) {$("#loading").hide();}else{		RSS.ajaxLoading.hide();}
		},	
        // Identifica e inicializa los elementos del filtro
       campos:{
						portal:{selector:"#portal-desaprovat",target:new HTML.HTMLSelect("#portal-desaprovat")},
						otros:{selector:"#otros-desaprovat",target:new HTML.HTMLSelect("#otros-desaprovat")},
						desde:{selector:"#desde-desaprovat",target:$("#desde-desaprovat")},
						hasta:{selector:"#hasta-desaprovat",target:$("#hasta-desaprovat")},
						query:{selector:"#query-desaprovat",target:$("#query-desaprovat")}
		},
                    
                    // Capas de error y de notificacion
		layers:{
						error:$(".missatge-error"),
						success:$(".missatge-feedback-positiu")
		}
		
        
});
