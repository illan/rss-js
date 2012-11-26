
var HTML={
		_DEFAULTS_:{html:true,parentesis:true,slash:true,reg:true},
		ESCAPE:function(c){ return "\\"+c;},
		excluded:function (options){
				options=$.extend({},HTML._DEFAULTS_,options||{});
				var ex={"\\\\":HTML.ESCAPE("\\"),"\n":HTML.ESCAPE("n"),"\t":HTML.ESCAPE("t")}
				if (options.html)	$.extend(ex,{"<":"&lt;",">":"&gt;","&":"&amp;"});
				if (options.reg)	$.extend(ex,{"[(]":HTML.ESCAPE("("),"[)]":HTML.ESCAPE(")")});
				if (options.slash)	$.extend(ex,{"\\.":"[.]","[/]":HTML.ESCAPE("/")});
				return ex;
			
		},
		encode:function (text,options){
			var subst=HTML.excluded(options);
			text=text||"";
			for (var regexp in subst){
				text=text.replace(new RegExp(regexp,"g"),subst[regexp]);
			}
			return text;
		}	
}	
HTML.wrap=function(tag,content){return (tag)?$("<"+tag+"/>").text(content).get(0).outerHTML:"";}
HTML.highlight=function(text,pattern){ return (""+text).replace(new RegExp(HTML.slashEncode(pattern),"g"),this.wrap("strong",pattern));}


HTML.HTMLSelect=function(select){
	if (typeof(select)=="string") select=$(select);
	var options;
		if(select.prop) {
  				options = select.prop('options');
		}else {
  				options = select.attr('options');
		}

	this.removeAll=function(){
		$('option', select).remove();	
	};
	var ids={};
	this.add=function(text,val) {
		if (ids[text]) return;
		var option=new Option(text, val);
		ids[text]=option;
		if ($.inArray(option,options)==-1)
			options.add(option);
	}
	this.addAll=function(newOptions){
		var self=this;
			$.each(newOptions, function(val, text) {
    				self.add(text,val)
			});
	};
	this.val=function(selectedOption){
		if (selectedOption){
			select.val(selectedOption);
		}
			return select.val(); 	
	}	
	this.element=function(s){
		if (s) {select=s}
		return select;
	}

}
HTML.dataUrl=function(content,mimeType){
	mimeType = mimeType || "application/rss+xml"
	var url=["data:",mimeType,",",encodeURIComponent(content)].join("");
	return url
}

HTML.applyStylesheet=function(stylesheet){ 
	var rules=stylesheet.split("\n");
		$.each(rules,function(index,source){
			source=$.trim(source);
			if (source=="") return;
			var className=$.trim(source).split("{")[0];
			var prop=source.split("{")[1].split("}")[0].split(";");
			var css={};
			$.each(prop,function(){
				var attr=this.split(":");
				if (typeof(attr[1])!="undefined") 
					css[$.trim(attr[0])]=$.trim(attr[1]);
				
			});
			$($.trim(className)).css(css);
		});
}	


HTML.slashEncode=function(html){
	var xml=(html?String(html):"");
	var subst;
	while(xml!=(subst=HTML.encode(xml)))xml=subst;
	
	return xml;
}
HTML.htmlize=function(text){return (text+"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&slash;/g,"/")}



HTML.importXML=function (xml){

    var HEADER=/[<][?]([^?])+[?][>]/g;
	var source=$.trim(String(xml).replace(HEADER,""));
	if ($.browser.msie){
		 var dom =CreateMSXMLDocumentObject ();
    		dom.async = false;
       		dom.loadXML(source);
			return $(dom.documentElement);
	}
		try{
					return $.parseXML(source);	
		}catch(ex){
					var x=$("<xml/>");
						x.html(source);
						return x.source();	
		}				
				
}	
