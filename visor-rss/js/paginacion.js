		
	
	$(document).ready(function(){
		if (!$.fn.unwrap)
			$.extend($.fn,{unwrap : function() {
		  		this.parent(':not(body)')
		    		.each(function(){
		      			$(this).replaceWith( this.childNodes );
		    		});
		
		  		return this;
			}});
		
		// Correccion en la paginacion..
		
		var CORRECCION=function(size){
			return (size%MAX_ITEMS_PAGINA)==0?0:1;
		};
		
		$.extend(PageLoader,{
			getter:function(page){
				page=parseInt(page)||0
					var start=page*MAX_ITEMS_PAGINA;
					var end=parseInt(start+MAX_ITEMS_PAGINA) -1;
					$(RSS.targetDiv).children().show();
					$(RSS.targetDiv).children().filter(":lt("+start+")").hide()
					$(RSS.targetDiv).children().filter(":gt("+end+")").hide()
			},
			size:function(){return COUNT_PAGINAS;}
		});
	
		Paginador=new (function(pageLoader){
			
			var paginador=this.paginador=$(".paginador");
			var inicio=this.inicio=$(".paginador").find(".inici");
			var anterior=this.anterior=$(".paginador").find(".anterior");
			var siguiente=this.siguiente=$(".paginador").find(".seguent");
			
				siguiente.parent().before($('<li class="sobre">(<span class="pagina"></span>/<span class="total"></span>)</li>'))
				paginador.css("margin","0.9em 0 0.9em 0");
			
			var posicion=0;
			var cache=(function(){	
				return {get:function(page){
						pageLoader.getter(page);
						Paginador.update()
			  		},
			  		size:function(){
			  			return pageLoader.size()
			  		}};
			})();	
;
			var layers={
					current:$(".paginador").find(".pagina"),
					paginas:$(".paginador").find(".total"),
					sobre:$("li.sobre",$(".paginador")),
					desde:$(".pager-desde"),
					actual:$(".pager-actual"),
					total:$(".pager-total")
			};
			
			var disabled={};
			function wrap(e){
				if (!e.attr("href")) return;
				var id=e.text();
				if (!disabled[id]){
					disabled[id]=$("<span/>");
					disabled[id].addClass(e.attr("class"));
					disabled[id].text(e.text());
						
				}	
				e.removeAttr("href")
				//e.wrap("<span>").addClass(e.attr("class"));
				e.after(disabled[id]);
				disabled[id].show();
				e.hide();
				
			};
			
			
			function unwrap(e){
				if (e.attr("href")=="#") return;
				e.attr("href","#");
				var id=e.text();
				if (disabled[id])
					disabled[id].hide()
					e.show();
				//e.unwrap();
				
			};
			
			this.update=function(){
				layers.current.text(String(posicion+1));
				layers.paginas.text(String(cache.size()))
				if (HIDE_PAGINACION_SOBRE){
					layers.sobre.hide();
					
				}
				layers.desde.text(String(Math.floor(posicion*MAX_ITEMS_PAGINA) + 1));
				layers.actual.text(String(Math.floor(total>=((posicion+1)*MAX_ITEMS_PAGINA)?(posicion+1)*MAX_ITEMS_PAGINA:total)));
				layers.total.text(String(total));
			
			};
						
			
			this.next=function(callback){
					if (posicion>=(cache.size()-2)){
						wrap(this.siguiente);
					}
					if (posicion==0){  
						unwrap(this.anterior);
						unwrap(this.inicio);
						if (cache.size()<=2){
							wrap(this.siguiente);
						}else{
							unwrap(this.siguiente);
						}
					}
				
					if (posicion<cache.size()-1)
					   return (callback||cache.get)(++posicion)||posicion;
					return false
					
						
			};
			
			this.prev=function(callback){
					if (posicion==1){
						wrap(this.anterior);
						wrap(this.inicio);
					}
					if (posicion>=(cache.size()-1)){
						if(cache.size()>1){
							unwrap(this.siguiente);
						}else{
							wrap(this.siguiente);
						}
					}	
					if (posicion>0)
					   return (callback||cache.get)(--posicion)||posicion;
					return false
						
			};
			this.start=function(page){
				posicion=page;
				wrap(anterior);
				wrap(inicio);
				if (cache.size()>1){unwrap(siguiente)}else{wrap(siguiente)};
				cache.get(posicion);
	
			}
			var pages=0;
			var total=0;
			this.has=function(count){cache.size=function(){pages=parseInt(count/MAX_ITEMS_PAGINA)+CORRECCION(count); total=count;return pages||1}}
			this.go=function(pos){posicion=(pos<cache.size()?pos:cache.size())-1; if (posicion<=0){ this.inicio.click();}else{posicion=posicion-1;self.next();}}
			var self=this;
			this.inicio.click(function(e){
				self.start(0)
				e.preventDefault(); 
				return false;
			});
			this.anterior.click(function(e){
				self.prev();
				e.preventDefault();
				return false;
			});
			this.siguiente.click(function(e){
				if (!$(this).attr("href")) return;
				self.next();
				e.preventDefault();
				return false;				 
			});
			
			
		})(PageLoader);
	
	});	
