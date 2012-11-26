
(function(){
		var margin;
		function showSource(path){
	  	    var code = $("<pre/>");

	  	    margin = $("#loading").css("margin-top");

	  	    var grammar = (/[.](xml|rss|atom)$/.test(path)) ? "html" : "javascript";
	  	    $.ajax({url:path,dataType:"text",success: function(source) {
                //var source=xhr.responseText;  
	  	        Rainbow.color(source, grammar, function(formatted) {


	  	            code.html(formatted);
	  	            $("#loading").html(code);
	  	            $("#loading").show();
	  	            $("#loading").css("margin", "auto");
	  	            $("#loading").css("margin-top", "10%");
	  	            // $("#loading").css("overflow","auto");
	  	            code.css("width", "98%");
	  	            code.css("height", "100%");
	  	            code.css("overflow", "auto");

	  	            code.css("text-align", "left");

	  	            $("#content").hide();
	  	            code.click(function(e) {
   	  	                e.preventDefault();
	  	                return false;

	  	            });
	  	         });
	  	         $("body").bind("click",hideSource);
	  	    }});
	  	    
	 }
	 
	 function hideSource(){
	  	                $("#loading").hide();
	  	                $("#loading").css("margin-top", margin);
	  	                $("#content").show();
	  	                $("body").unbind("click",hideSource);
	 };
	 
	 $("b").each(function(){
	  			var  source=$(this);
	  			source.css("cursor","pointer");
	  			source.css("color","blue");
	  			source.click(function(e){showSource(source.text())});
	 });
})();	 
	 function xss(){ alert($("p.doc-message").text())}