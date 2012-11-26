    

if (!$.fn.source)
	$.fn.source=function(){return this.get(0).outerHTML;};

$.fn.match=function(matcher){
		var value=($(this).val||$(this).text)()
		var reg;
		if (typeof(matcher)=="string"){
				return new RegExp(matcher,"g").match(value);
		}else if (typeof(matcher)=="function"){		
				return matcher(value);	
		}
		return false;
}


Array.remove=function(arr,item){
	arr=(arr)||[];
    var pos=$.inArray(item,arr);
    if (pos<0) return arr;
    return arr.slice(0,pos).concat(arr.slice(pos+1,arr.length));
}

if (!Date.now) {
  Date.now = function now() {
    return +(new Date());
  };
}

	if (!$.parseXML){
		$.parseXML=function( data ) {
			var xml, tmp;
			if ( !data || typeof data !== "string" ) {
				return null;
			}
			try {
				if ( window.DOMParser ) { // Standard
					tmp = new DOMParser();
					xml = tmp.parseFromString( data , "text/xml" );
				} else { // IE
					xml = new ActiveXObject( "Microsoft.XMLDOM" );
					xml.async = "false";
					xml.loadXML( data );
				}
			} catch( e ) {
				xml = undefined;
			}
			if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
				throw new Error("Error parsing XML");
			}
			return $(xml);
		};
	}	

	
	
 function CreateMSXMLDocumentObject () {
            if (typeof (ActiveXObject) != "undefined") {
                var progIDs = [
                                "Msxml2.DOMDocument.6.0", 
                                "Msxml2.DOMDocument.5.0", 
                                "Msxml2.DOMDocument.4.0", 
                                "Msxml2.DOMDocument.3.0", 
                                "MSXML2.DOMDocument", 
                                "MSXML.DOMDocument"
                              ];
                for (var i = 0; i < progIDs.length; i++) {
                    try { 
                        return new ActiveXObject(progIDs[i]); 
                    } catch(e) {};
                }
            }
            return null;
        }

//if (!console) console={log:Empty,dir:Empty,error:Empty}

	
		
	
	
		
	
	RSS.translate=function(list){		
		$.each(list,function(selector,message){
			var text=message;
			for (var variable in RSSParameters){
				var value=RSSParameters[variable];
			 	text=text.replace("${"+variable+"}",value)
			}
			$(selector).html(text)
		});
	}

	RSS.errorMessages=function(hide){
		$.each(RSS.layers,function(label,value){
			if (RSSParameters.status!=label){ value.hide();}
			else{ 
				if (hide){
					$(value).hide()
				}else{
					$(value).html(RSSParameters["message"])
				}
			}
			
		});
	}
	
	    
	RSS.appyI18n=function(json){
        TF7.setPaths = function() {}
		RSS.translate(RSS.messages);
	};
    
	
	
	RSS.Setup={
			loadStep:0,
            jsonpCallback:CALLBACK_JSONP,
			triggers:{setup:[],before:[],after:[],load:[]},
			next:function(){
				var step=this.triggers[this.phase][this.loadStep++];
				if (!step) {this.start();}else{
					console.log("Exec "+step.type);
					this.exec[step.type||"eval"].call(this,step);
				}
			},
			ajax:function(options){ 
				var self=this;
				$.ajax($.extend({success:function(data){try{(options.trigger||Empty)(data); }catch(ex){}},
                                error:options.error||function(xhr){console.log(xhr)},
                                complete:function(){self.next();}},options));
			},
            
			getXSS:function(url,success,error){
                    var self=this;
                    if ($.browser.msie) return $.getScript(url,function(){success();self.next()});
					var s=document.createElement("script")
					s.src=url;
                    s.type = "text/javascript";
                    s.onload=function(){
                    		if (success)success.apply(this,arguments);
                    		self.next();
                    };
   					if (error) s.onerror=function(){error.apply(this,arguments)};
   					document.body.appendChild(s);
			},
			exec:{
					"text":function(step){
                            (function(step,self){
								
	                            	self.ajax( {url:step.url(),
	                            				dataType:"text",trigger:step.trigger});
								})(step,this);	
																
					},
					"eval":function(step){
								 (typeof(step)=="function"?step:step.trigger||Empty)();
								 this.next();
								},
					"script":function(step){
                                    
									this.getXSS(step.url(),step.trigger,step.error);
								},
					"json":function(step){ 
								(function(step,self){
								
	                            	self.ajax( {url:step.url(),
	                            				dataType:"json",trigger:step.trigger,
	                            				error:function(xhr){
	                            				// Si el formato no es estricto da error
                                                    console.log("parse error, json fallback");
	                            					try{(step.trigger||Empty)(eval("("+xhr.responseText+")")); }catch(ex){}
	                            				}});
								})(step,this);	
							},
					"jsonp":function(step){
								var callback=step.callback||this.jsonpCallback;
                                JSONP.attach(step.trigger);
								this.ajax(
									  {url:step.url(),trigger:step.trigger,
									   dataType:"jsonp",
									   jsonpCallback:callback,jsonp:"callback",cache:false,success:step.trigger,error:step.error});
	
							}
			},
			attach:function(loader,phase){
				var _phase=phase||loader.phase||this.sequence[0];
				if (!this.triggers[_phase]){
					// Si no existe la fase, la añdimos en la secuencia
						this.triggers[_phase]=[];
                        if ($.inArray(_phase,this.sequence)==-1)
					    	this.sequence.push(_phase)
				}		
				this.triggers[_phase].push(loader);
			},
			begin:function(phase){
				this.phase=phase;
				this.loadStep=0;
    			if (!this.triggers[phase]){
					// Si no existe la fase, seguimos la secuencia
						this.start();
				}else{
    			        this.next()    			    
				}	
			},
			start:function(){
				var phase=this.sequence.shift();
				if (!phase) return;
				console.log("Execute "+phase);
				this.begin(phase);
			},
			phase:null,
			sequence:["config","tf7","i18n","setup","load","done"]

	};
	
	RSS.loadFeed=function(feed){
		RSS.Setup.attach(
	         {url:function(){ return PROXY_FETCH(feed)},
	          type:"text",	  
			  trigger:function(xml){
							console.log("Load Feed:"+feed.domain);
										if ($.trim(feed.portal)!="")
										RSS.addCategory({domain:feed.portal,source:feed.portal});
										try{
											RSS.parse(xml,feed);
										}catch(ex){
											console.log(ex);	
										}

		        	  					
		          		}
	         },"load");
	};
	RSS.fetchAllFeeds=function(listOfFeeds){
		 $.each(listOfFeeds,function(){	RSS.loadFeed(this);	   });
	};
				
		
    RSS.loadSequence=function(){
			console.log("jquery setup done...");
			RSS.Setup.attach({url:function(){ return JSON_CONFIG_URL; },
				type:"jsonp",
				trigger:function(json){
                    console.log("Load config "+JSON_CONFIG_URL)
                    console.log(json)

					$.extend(RSSParameters,json);
				},
				error:function(xhr){
                    console.log("Failure loading config "+JSON_CONFIG_URL);
                    console.log("Failure"+xhr.responseText);
					RSS.Setup.attach({url:function(){ return JSON_CONFIG_URL_FALLBACK; },
								type:"jsonp",
								trigger:function(json){
                                    console.log("Load config "+JSON_CONFIG_URL_FALLBACK)
                                    console.log(json)
                                    $.extend(RSSParameters,json);
                                    }
            					},"config");
				}},"config");
                
            $.each(SCRIPTS_IMPORT,function(index,src){    
               (function(source){ 
            		RSS.Setup.attach({url:function(){ return source; },
        				type:"script",
        				trigger:function(){
                            console.log("loaded:"+source);
        				},
                        error:function(){
            			    RSS.ERROR_CARGANDO_CONFIGURACION();    
        				}},"config");     
               })(src);        
            });            
            RSS.Setup.attach(
		        {type:"eval",
				trigger:function(){
                    RSS.Filtro.setupFilter();            

		 		}},"config");

			RSS.Setup.attach({url:function(){ return TF7_L10N(RSSParameters.language); },
				type:"script",
				trigger:function(){
					RSS.patchTF7();
				}},"tf7");
			RSS.Setup.attach({url:function(){ return RSS_L10N(RSSParameters.language); },
				type:"script",
				trigger:function(){
					RSS.appyI18n();
				    
				}},"i18n");

		RSS.Setup.attach(
		        {type:"eval",
				trigger:function(){
		        	RSS.fetchAllFeeds(RSSParameters.feeds);
		 		}},"load");
		RSS.Setup.attach(
		        {type:"eval",
				trigger:function(){
					RSS.done();
		        }},"done");	

		RSS.ajaxLoading.show()

    };

/***
 * Interceptamos la carga de jquery
 *
 */
(function(){
		var _initList=$.readyList;


		$.readyList=[function(context){
							var _context=context||document;
							var _resumeLoad=function(){
								$.each(_initList,function(){
									try{
										(this).apply(_context,[_context]);
									}catch(ex){
										console.log(ex);
                                        console.log(ex.stack);
                                        console.log(this);
                                        
									}
								});
							};
                            RSS.loadSequence();
							RSS.Setup.attach({type:"eval",trigger:function(){_resumeLoad()}},"setup");
							RSS.Setup.start();
					}];
})();
	
