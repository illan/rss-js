



RSS.addCategory=function(cat){
		RSS.Filtro.filtres.portal.target.add(cat.source,cat.domain);
}
RSS.addDomain=function(cat){
		RSS.Filtro.filtres.otros.target.add(cat.source,cat.domain);
}
RSS.labelFeed=function(domain,portal){
	return RSSParameters.filtres.others[domain]||portal;

}

RSS.parse=function(xml,feed) {
	
	
	var xmlDoc=HTML.importXML(xml);
	var canal=$(xmlDoc);
	return this.parseFeed(canal,feed);
}
RSS.parseFeed=function(canal,feed) {
	
 	var portal={ title: canal.find("title").text(),
    			 link: canal.find("link").text(),
    			 description: canal.find("description").text(),
    			 pubDate: canal.find("pubDate").text(),
    			 entradas:[],
    			 categorias:[]
    };      
    this.feeds.push(portal);
    
    try{
	    canal.find("pubDate").each(function(){
	    	var pubDate=$(this).text();
	    	RSS.Filtro.initDesde(pubDate);
	    });	
    }catch(ex){
    	
    }
    canal.find("item").each(function() {
            var item = { title: null,link: null,description: null,pubDate: RSS.DEFAULT_DATE,author: null,enclosure:[],category:[],source:[],node:$(this)};
        	var field;
        	for(var name in item){
        		if((field=$(this).find(name)).length)
					if (name=="enclosure"){
        				field.each(function(){
        					item[name].push({src:$(this).attr("url"),type:$(this).attr("type")})
        					item["imagen"]=$(this).attr("url");
        				});	
        			}else if (name=="category"){
        				field.each(function(){
        					item[name].push({domain:$(this).attr("domain"),category:$(this).text()})
        					item["domain"]=feed.domain;
        					item["categoria"]=$(this).text();
        					item["label"]=RSS.labelFeed(feed.domain,feed.portal);
        					
        					//RSS.addDomain({domain:$(this).attr("domain"),source:$(this).text()});
        				});
        			}else if (name=="source"){
        				field.each(function(){
        					item[name].push({url:$(this).attr("url"),source:$(this).text()})
        					
        					//item["tipo"]=$(this).text();
        				});
        			}else if (name=="title"){
        				item[name]=field.text()
					}else if (name=="description"){
						item[name]=HTML.htmlize((FILTER_XSS)?field.text():field.html());
        			}else{
        				item[name]=field.text()||field.get(0).nextSibling.nodeValue;
        			}	
        	}	
        	portal.entradas.push(item);
    });
    return portal;
};



RSS.updatePager=function(count){
			Paginador.has(count);
			Paginador.start(0);
}

RSS.refresh=function(){
	this.showResults(this.Filtro.aplicar());
}
RSS.showResults=function(rset){
	if (rset.length){
		RSS.render(rset);
		$(RSS.noResultsDiv).hide()
		$(RSS.targetDiv).show()
		$(RSS.paginador).show()
		
	}else{
		$(RSS.noResultsDiv).show()
		$(RSS.targetDiv).hide();
		$(RSS.paginador).hide()
	
	}
	RSS.updatePager(rset.length)	
	RSS.errorMessages(RSS.hideError)
	

}

RSS.render=function(rset){
	var view=$(this.targetDiv);	
	view.empty();
	
	$.each(rset,function(i,item){
		var item=rset[i];
		var article=RSS.format(RSS.decorate(item.match));
		article.show();
		view.append(article);
	})	
	HIGHLIGHT_MATCHES()
}
	


RSS.decorate=function(entry){
	var _item={};
	$.each(entry,function(name,value){
		_item[name]=	RSS.decorators[name]?RSS.decorators[name].decorate(entry[name]):entry[name];
	});
	return _item;
}



