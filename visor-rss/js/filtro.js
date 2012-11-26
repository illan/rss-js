
RSS.Filtro={maxTitleCount:MAX_TITLE_COUNT};


RSS.Filtro.initDesde = function(pubDate) {
	if ($.trim(pubDate)=="") return;
	var fecha=RSS.REGEXP_FORMATO_FECHA.test(pubDate)?pubDate:RSS.dateFormat(pubDate);
	var desde= RSS.REGEXP_FORMATO_FECHA.test(RSS.campos.desde.val())?RSS.campos.desde.val():RSS.dateFormat();
	
    if (RSS.toDate(fecha).valueOf() < RSS.toDate(desde).valueOf())
        RSS.campos.desde.val(fecha);
}

RSS.Filtro.setupFilter=function(config){
    var filtros={};
    $.each(RSS.Filtro.filtres,function(name,obj){
        filtros[name]=$.extend({},{element:function(){return this.target;}},obj,RSS.campos[name]);
    });    
    RSS.campos=RSS.Filtro.filtres=filtros;
	RSS.addCategory({domain:"ALL",source:"Todos"});
	$.each(RSSParameters.filtres.others,function(id,val){
		RSS.addDomain({domain:id,source:val});
	});
	
	filtros.portal.element().change(function(){
		if ($(this).val()!="ALL"){
			filtros.otros.val("ALL");
		}
		filtros.otros.element().attr("disabled",($(this).val()!="ALL"));
	
	});
	/**
    canal.find("channel > category").each(function() {
    	RSS.addCategory({domain:$(this).attr("domain"),source:$(this).text()});
    	
    	
    });
    RSS.Controller.desde.val(RSS.dateFormat(canal.find("channel > pubDate:first").text()));
    if (canal.find("channel > lastBuildDate:first").length)
    	RSS.Controller.hasta.val(RSS.dateFormat(canal.find("channel > lastBuildDate:first").text()))
    else	
    	
    this.parseFeed(canal);
    **/
	filtros.hasta.val(RSS.dateFormat());
}

RSS.Filtro.tree={};
RSS.Filtro.rset={};

RSS.Filtro.filtres={
    	hasta:{
				val:function(v){this.target.val(v);},	
				match:function(item,elt){
								var hasta=$.trim(elt.val());
								if (hasta=="") return true;
								var fecha=RSS.dateFormat(item.pubDate);
								return RSS.toDate(fecha).valueOf() <= RSS.toDate(hasta).valueOf();
							}},
		desde:{	
				val:function(v){this.target.val(v);},
				match:function(item,elt){
								var desde=$.trim(elt.val());
								if (desde=="") return true;
								var fecha=RSS.dateFormat(item.pubDate);
								return RSS.toDate(desde).valueOf() <= RSS.toDate(fecha).valueOf();
							}},
		query:{	
				val:function(v){this.target.val(v);},
				match:function(item,elt){
			var pattern=elt.val();
			if (pattern=="") return true;
			var match={};
			var self=this;
			if (SHOW_DESCRIPTION){
				if ((""+item.description).indexOf(pattern)!=-1) $.extend(match,{description:HTML.highlight(item.description,pattern)});
			}
			if ( item.title.indexOf(pattern)!=-1) $.extend(match,{title:HTML.highlight(item.title,pattern)});
			return (match.title || match.description)?match:false;	
		}},
		otros:{	
				val:function(v){this.target.val(v);},
                element:function(){return this.target.element()},
				match:function(item,elt){
					if (elt.val()=="ALL")return true; return elt.find("option:selected").val()==item.domain}},
		portal:{
				val:function(v){this.target.val(v);},						
                element:function(){return this.target.element()},
				match:function(item,elt){
					if (elt.val()=="ALL")return true; return item.label==elt.val();}}
		
};



RSS.Filtro.aplicar=function(){
	var rset=[];
	
	var $this=this;	
	$.each(RSS.feeds,function(){
		var feed=this;
		var fail=[];
		for (var i=0; i<feed.entradas.length;i++){
			var item=feed.entradas[i];
					item.match=$.extend({},item);
			var result;
			for (var fname in $this.filtres){
				var filtre=$this.filtres[fname];
				if (result=filtre.match(item,$(filtre.selector))){
					if (typeof(result)=="object"){
						$.extend(item.match,result)
					}
					if ($.inArray(item,rset)==-1 && $.inArray(item,fail)==-1)
						rset.push(item);
				}else{
				     rset=Array.remove(rset,item);
				     fail.push(item);
				}    
			}
		}
	});	
	return this.rset=rset;
}	

