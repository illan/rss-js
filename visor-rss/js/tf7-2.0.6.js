(function(){
/*
 * jQuery 1.2.6 - New Wave Javascript
 *
 * Copyright (c) 2008 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2012/11/19 17:12:33 $
 * $Rev: 5685 $
 */

var _jQuery = window.jQuery,
	_$ = window.$;

var jQuery = window.jQuery = window.$ = function( selector, context ) {
	return new jQuery.fn.init( selector, context );
};

var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/,

	isSimple = /^.[^:#\[\.]*$/,

	undefined;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		selector = selector || document;

		if ( selector.nodeType ) {
			this[0] = selector;
			this.length = 1;
			return this;
		}
		if ( typeof selector == "string" ) {
			var match = quickExpr.exec( selector );

			if ( match && (match[1] || !context) ) {

				if ( match[1] )
					selector = jQuery.clean( [ match[1] ], context );

				else {
					var elem = document.getElementById( match[3] );

					if ( elem ){
						if ( elem.id != match[3] )
							return jQuery().find( selector );

						return jQuery( elem );
					}
					selector = [];
				}

			} else
				return jQuery( context ).find( selector );

		} else if ( jQuery.isFunction( selector ) )
			return jQuery( document )[ jQuery.fn.ready ? "ready" : "load" ]( selector );

		return this.setArray(jQuery.makeArray(selector));
	},

	jquery: "1.2.6",

	size: function() {
		return this.length;
	},

	length: 0,

	get: function( num ) {
		return num == undefined ?

			jQuery.makeArray( this ) :

			this[ num ];
	},

	pushStack: function( elems ) {
		var ret = jQuery( elems );

		ret.prevObject = this;

		return ret;
	},

	setArray: function( elems ) {
		this.length = 0;
		Array.prototype.push.apply( this, elems );

		return this;
	},

	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	index: function( elem ) {
		var ret = -1;

		return jQuery.inArray(
			elem && elem.jquery ? elem[0] : elem
		, this );
	},

	attr: function( name, value, type ) {
		var options = name;

		if ( name.constructor == String )
			if ( value === undefined )
				return this[0] && jQuery[ type || "attr" ]( this[0], name );

			else {
				options = {};
				options[ name ] = value;
			}

		return this.each(function(i){
			for ( name in options )
				jQuery.attr(
					type ?
						this.style :
						this,
					name, jQuery.prop( this, options[ name ], type, i, name )
				);
		});
	},

	css: function( key, value ) {
		if ( (key == 'width' || key == 'height') && parseFloat(value) < 0 )
			value = undefined;
		return this.attr( key, value, "curCSS" );
	},

	text: function( text ) {
		if ( typeof text != "object" && text != null )
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );

		var ret = "";

		jQuery.each( text || this, function(){
			jQuery.each( this.childNodes, function(){
				if ( this.nodeType != 8 )
					ret += this.nodeType != 1 ?
						this.nodeValue :
						jQuery.fn.text( [ this ] );
			});
		});

		return ret;
	},

	wrapAll: function( html ) {
		if ( this[0] )
			jQuery( html, this[0].ownerDocument )
				.clone()
				.insertBefore( this[0] )
				.map(function(){
					var elem = this;

					while ( elem.firstChild )
						elem = elem.firstChild;

					return elem;
				})
				.append(this);

		return this;
	},

	wrapInner: function( html ) {
		return this.each(function(){
			jQuery( this ).contents().wrapAll( html );
		});
	},

	wrap: function( html ) {
		return this.each(function(){
			jQuery( this ).wrapAll( html );
		});
	},
	unwrap : function() {
	  this.parent(':not(body)')
	    .each(function(){
	      $(this).replaceWith( this.childNodes );
	    });
	
	  return this;
	},
	append: function() {
		return this.domManip(arguments, true, false, function(elem){
			if (this.nodeType == 1)
				this.appendChild( elem );
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, true, function(elem){
			if (this.nodeType == 1)
				this.insertBefore( elem, this.firstChild );
		});
	},

	before: function() {
		return this.domManip(arguments, false, false, function(elem){
			this.parentNode.insertBefore( elem, this );
		});
	},

	after: function() {
		return this.domManip(arguments, false, true, function(elem){
			this.parentNode.insertBefore( elem, this.nextSibling );
		});
	},

	end: function() {
		return this.prevObject || jQuery( [] );
	},

	find: function( selector ) {
		var elems = jQuery.map(this, function(elem){
			return jQuery.find( selector, elem );
		});

		return this.pushStack( /[^+>] [^+>]/.test( selector ) || selector.indexOf("..") > -1 ?
			jQuery.unique( elems ) :
			elems );
	},

	clone: function( events ) {
		var ret = this.map(function(){
			if ( jQuery.browser.msie && !jQuery.isXMLDoc(this) ) {
				var clone = this.cloneNode(true),
					container = document.createElement("div");
				container.appendChild(clone);
				return jQuery.clean([container.innerHTML])[0];
			} else
				return this.cloneNode(true);
		});

		var clone = ret.find("*").andSelf().each(function(){
			if ( this[ expando ] != undefined )
				this[ expando ] = null;
		});

		if ( events === true )
			this.find("*").andSelf().each(function(i){
				if (this.nodeType == 3)
					return;
				var events = jQuery.data( this, "events" );

				for ( var type in events )
					for ( var handler in events[ type ] )
						jQuery.event.add( clone[ i ], type, events[ type ][ handler ], events[ type ][ handler ].data );
			});

		return ret;
	},

	filter: function( selector ) {
		return this.pushStack(
			jQuery.isFunction( selector ) &&
			jQuery.grep(this, function(elem, i){
				return selector.call( elem, i );
			}) ||

			jQuery.multiFilter( selector, this ) );
	},

	not: function( selector ) {
		if ( selector.constructor == String )
			if ( isSimple.test( selector ) )
				return this.pushStack( jQuery.multiFilter( selector, this, true ) );
			else
				selector = jQuery.multiFilter( selector, this );

		var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
		return this.filter(function() {
			return isArrayLike ? jQuery.inArray( this, selector ) < 0 : this != selector;
		});
	},

	add: function( selector ) {
		return this.pushStack( jQuery.unique( jQuery.merge(
			this.get(),
			typeof selector == 'string' ?
				jQuery( selector ) :
				jQuery.makeArray( selector )
		)));
	},

	is: function( selector ) {
		return !!selector && jQuery.multiFilter( selector, this ).length > 0;
	},

	hasClass: function( selector ) {
		return this.is( "." + selector );
	},

	val: function( value ) {
		if ( value == undefined ) {

			if ( this.length ) {
				var elem = this[0];

				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type == "select-one";

					if ( index < 0 )
						return null;

					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							value = jQuery.browser.msie && !option.attributes.value.specified ? option.text : option.value;

							if ( one )
								return value;

							values.push( value );
						}
					}

					return values;

				} else
					return (this[0].value || "").replace(/\r/g, "");

			}

			return undefined;
		}

		if( value.constructor == Number )
			value += '';

		return this.each(function(){
			if ( this.nodeType != 1 )
				return;

			if ( value.constructor == Array && /radio|checkbox/.test( this.type ) )
				this.checked = (jQuery.inArray(this.value, value) >= 0 ||
					jQuery.inArray(this.name, value) >= 0);

			else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(value);

				jQuery( "option", this ).each(function(){
					this.selected = (jQuery.inArray( this.value, values ) >= 0 ||
						jQuery.inArray( this.text, values ) >= 0);
				});

				if ( !values.length )
					this.selectedIndex = -1;

			} else
				this.value = value;
		});
	},

	html: function( value ) {
		return value == undefined ?
			(this[0] ?
				this[0].innerHTML :
				null) :
			this.empty().append( value );
	},

	replaceWith: function( value ) {
		return this.after( value ).remove();
	},

	eq: function( i ) {
		return this.slice( i, i + 1 );
	},

	slice: function() {
		return this.pushStack( Array.prototype.slice.apply( this, arguments ) );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function(elem, i){
			return callback.call( elem, i, elem );
		}));
	},

	andSelf: function() {
		return this.add( this.prevObject );
	},

	data: function( key, value ){
		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length )
				data = jQuery.data( this[0], key );

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function(){
				jQuery.data( this, key, value );
			});
	},

	removeData: function( key ){
		return this.each(function(){
			jQuery.removeData( this, key );
		});
	},

	domManip: function( args, table, reverse, callback ) {
		var clone = this.length > 1, elems;

		return this.each(function(){
			if ( !elems ) {
				elems = jQuery.clean( args, this.ownerDocument );

				if ( reverse )
					elems.reverse();
			}

			var obj = this;

			if ( table && jQuery.nodeName( this, "table" ) && jQuery.nodeName( elems[0], "tr" ) )
				obj = this.getElementsByTagName("tbody")[0] || this.appendChild( this.ownerDocument.createElement("tbody") );

			var scripts = jQuery( [] );

			jQuery.each(elems, function(){
				var elem = clone ?
					jQuery( this ).clone( true )[0] :
					this;

				if ( jQuery.nodeName( elem, "script" ) )
					scripts = scripts.add( elem );
				else {
					if ( elem.nodeType == 1 )
						scripts = scripts.add( jQuery( "script", elem ).remove() );

					callback.call( obj, elem );
				}
			});

			scripts.each( evalScript );
		});
	}
};

jQuery.fn.init.prototype = jQuery.fn;

function evalScript( i, elem ) {
	if ( elem.src )
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});

	else
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );

	if ( elem.parentNode )
		elem.parentNode.removeChild( elem );
}

function now(){
	return +new Date;
}

jQuery.extend = jQuery.fn.extend = function() {
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	if ( target.constructor == Boolean ) {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	}

	if ( typeof target != "object" && typeof target != "function" )
		target = {};

	if ( length == i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ )
		if ( (options = arguments[ i ]) != null )
			for ( var name in options ) {
				var src = target[ name ], copy = options[ name ];

				if ( target === copy )
					continue;

				if ( deep && copy && typeof copy == "object" && !copy.nodeType )
					target[ name ] = jQuery.extend( deep,
						src || ( copy.length != null ? [ ] : { } )
					, copy );

				else if ( copy !== undefined )
					target[ name ] = copy;

			}

	return target;
};

var expando = "jQuery" + now(), uuid = 0, windowData = {},
	exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	defaultView = document.defaultView || {};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep )
			window.jQuery = _jQuery;

		return jQuery;
	},

	isFunction: function( fn ) {
		return !!fn && typeof fn != "string" && !fn.nodeName &&
			fn.constructor != Array && /^[\s[]?function/.test( fn + "" );
	},

	isXMLDoc: function( elem ) {
		return elem.documentElement && !elem.body ||
			elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
	},

	globalEval: function( data ) {
		data = jQuery.trim( data );

		if ( data ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";
			if ( jQuery.browser.msie )
				script.text = data;
			else
				script.appendChild( document.createTextNode( data ) );

			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
	},

	cache: {},

	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		if ( !id )
			id = elem[ expando ] = ++uuid;

		if ( name && !jQuery.cache[ id ] )
			jQuery.cache[ id ] = {};

		if ( data !== undefined )
			jQuery.cache[ id ][ name ] = data;

		return name ?
			jQuery.cache[ id ][ name ] :
			id;
	},

	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		if ( name ) {
			if ( jQuery.cache[ id ] ) {
				delete jQuery.cache[ id ][ name ];

				name = "";

				for ( name in jQuery.cache[ id ] )
					break;

				if ( !name )
					jQuery.removeData( elem );
			}

		} else {
			try {
				delete elem[ expando ];
			} catch(e){
				if ( elem.removeAttribute )
					elem.removeAttribute( expando );
			}

			delete jQuery.cache[ id ];
		}
	},

	each: function( object, callback, args ) {
		var name, i = 0, length = object.length;

		if ( args ) {
			if ( length == undefined ) {
				for ( name in object )
					if ( callback.apply( object[ name ], args ) === false )
						break;
			} else
				for ( ; i < length; )
					if ( callback.apply( object[ i++ ], args ) === false )
						break;

		} else {
			if ( length == undefined ) {
				for ( name in object )
					if ( callback.call( object[ name ], name, object[ name ] ) === false )
						break;
			} else
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}
		}

		return object;
	},

	prop: function( elem, value, type, i, name ) {
		if ( jQuery.isFunction( value ) )
			value = value.call( elem, i );

		return value && value.constructor == Number && type == "curCSS" && !exclude.test( name ) ?
			value + "px" :
			value;
	},

	className: {
		add: function( elem, classNames ) {
			jQuery.each((classNames || "").split(/\s+/), function(i, className){
				if ( elem.nodeType == 1 && !jQuery.className.has( elem.className, className ) )
					elem.className += (elem.className ? " " : "") + className;
			});
		},

		remove: function( elem, classNames ) {
			if (elem.nodeType == 1)
				elem.className = classNames != undefined ?
					jQuery.grep(elem.className.split(/\s+/), function(className){
						return !jQuery.className.has( classNames, className );
					}).join(" ") :
					"";
		},

		has: function( elem, className ) {
			return jQuery.inArray( className, (elem.className || elem).toString().split(/\s+/) ) > -1;
		}
	},

	swap: function( elem, options, callback ) {
		var old = {};
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		for ( var name in options )
			elem.style[ name ] = old[ name ];
	},

	css: function( elem, name, force ) {
		if ( name == "width" || name == "height" ) {
			var val, props = { position: "absolute", visibility: "hidden", display:"block" }, which = name == "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ];

			function getWH() {
				val = name == "width" ? elem.offsetWidth : elem.offsetHeight;
				var padding = 0, border = 0;
				jQuery.each( which, function() {
					padding += parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					border += parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
				});
				val -= Math.round(padding + border);
			}

			if ( jQuery(elem).is(":visible") )
				getWH();
			else
				jQuery.swap( elem, props, getWH );

			return Math.max(0, val);
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret, style = elem.style;

		function color( elem ) {
			if ( !jQuery.browser.safari )
				return false;

			var ret = defaultView.getComputedStyle( elem, null );
			return !ret || ret.getPropertyValue("color") == "";
		}

		if ( name == "opacity" && jQuery.browser.msie ) {
			ret = jQuery.attr( style, "opacity" );

			return ret == "" ?
				"1" :
				ret;
		}
		if ( jQuery.browser.opera && name == "display" ) {
			var save = style.outline;
			style.outline = "0 solid black";
			style.outline = save;
		}

		if ( name.match( /float/i ) )
			name = styleFloat;

		if ( !force && style && style[ name ] )
			ret = style[ name ];

		else if ( defaultView.getComputedStyle ) {

			if ( name.match( /float/i ) )
				name = "float";

			name = name.replace( /([A-Z])/g, "-$1" ).toLowerCase();

			var computedStyle = defaultView.getComputedStyle( elem, null );

			if ( computedStyle && !color( elem ) )
				ret = computedStyle.getPropertyValue( name );

			else {
				var swap = [], stack = [], a = elem, i = 0;

				for ( ; a && color(a); a = a.parentNode )
					stack.unshift(a);

				for ( ; i < stack.length; i++ )
					if ( color( stack[ i ] ) ) {
						swap[ i ] = stack[ i ].style.display;
						stack[ i ].style.display = "block";
					}

				ret = name == "display" && swap[ stack.length - 1 ] != null ?
					"none" :
					( computedStyle && computedStyle.getPropertyValue( name ) ) || "";

				for ( i = 0; i < swap.length; i++ )
					if ( swap[ i ] != null )
						stack[ i ].style.display = swap[ i ];
			}

			if ( name == "opacity" && ret == "" )
				ret = "1";

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(/\-(\w)/g, function(all, letter){
				return letter.toUpperCase();
			});

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];


			if ( !/^\d+(px)?$/i.test( ret ) && /^\d/.test( ret ) ) {
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = ret || 0;
				ret = style.pixelLeft + "px";

				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	clean: function( elems, context ) {
		var ret = [];
		context = context || document;
		if (typeof context.createElement == 'undefined')
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;

		jQuery.each(elems, function(i, elem){
			if ( !elem )
				return;

			if ( elem.constructor == Number )
				elem += '';

			if ( typeof elem == "string" ) {
				elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
					return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
						all :
						front + "></" + tag + ">";
				});

				var tags = jQuery.trim( elem ).toLowerCase(), div = context.createElement("div");

				var wrap =
					!tags.indexOf("<opt") &&
					[ 1, "<select multiple='multiple'>", "</select>" ] ||

					!tags.indexOf("<leg") &&
					[ 1, "<fieldset>", "</fieldset>" ] ||

					tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
					[ 1, "<table>", "</table>" ] ||

					!tags.indexOf("<tr") &&
					[ 2, "<table><tbody>", "</tbody></table>" ] ||

					(!tags.indexOf("<td") || !tags.indexOf("<th")) &&
					[ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||

					!tags.indexOf("<col") &&
					[ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||

					jQuery.browser.msie &&
					[ 1, "div<div>", "</div>" ] ||

					[ 0, "", "" ];

				div.innerHTML = wrap[1] + elem + wrap[2];

				while ( wrap[0]-- )
					div = div.lastChild;

				if ( jQuery.browser.msie ) {

					var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ?
						div.firstChild && div.firstChild.childNodes :

						wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ?
							div.childNodes :
							[];

					for ( var j = tbody.length - 1; j >= 0 ; --j )
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length )
							tbody[ j ].parentNode.removeChild( tbody[ j ] );

					if ( /^\s/.test( elem ) )
						div.insertBefore( context.createTextNode( elem.match(/^\s*/)[0] ), div.firstChild );

				}

				elem = jQuery.makeArray( div.childNodes );
			}

			if ( elem.length === 0 && (!jQuery.nodeName( elem, "form" ) && !jQuery.nodeName( elem, "select" )) )
				return;

			if ( elem[0] == undefined || jQuery.nodeName( elem, "form" ) || elem.options )
				ret.push( elem );

			else
				ret = jQuery.merge( ret, elem );

		});

		return ret;
	},

	attr: function( elem, name, value ) {
		if (!elem || elem.nodeType == 3 || elem.nodeType == 8)
			return undefined;

		var notxml = !jQuery.isXMLDoc( elem ),
			set = value !== undefined,
			msie = jQuery.browser.msie;

		name = notxml && jQuery.props[ name ] || name;

		if ( elem.tagName ) {

			var special = /href|src|style/.test( name );

			if ( name == "selected" && jQuery.browser.safari )
				elem.parentNode.selectedIndex;

			if ( name in elem && notxml && !special ) {
				if ( set ){
					if ( name == "type" && jQuery.nodeName( elem, "input" ) && elem.parentNode )
						throw "type property can't be changed";

					elem[ name ] = value;
				}

				if( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) )
					return elem.getAttributeNode( name ).nodeValue;

				return elem[ name ];
			}

			if ( msie && notxml &&  name == "style" )
				return jQuery.attr( elem.style, "cssText", value );

			if ( set )
				elem.setAttribute( name, "" + value );

			var attr = msie && notxml && special
					? elem.getAttribute( name, 2 )
					: elem.getAttribute( name );

			return attr === null ? undefined : attr;
		}


		if ( msie && name == "opacity" ) {
			if ( set ) {
				elem.zoom = 1;

				elem.filter = (elem.filter || "").replace( /alpha\([^)]*\)/, "" ) +
					(parseInt( value ) + '' == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
			}

			return elem.filter && elem.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( elem.filter.match(/opacity=([^)]*)/)[1] ) / 100) + '':
				"";
		}

		name = name.replace(/-([a-z])/ig, function(all, letter){
			return letter.toUpperCase();
		});

		if ( set )
			elem[ name ] = value;

		return elem[ name ];
	},

	trim: function( text ) {
		return (text || "").replace( /^\s+|\s+$/g, "" );
	},

	makeArray: function( array ) {
		var ret = [];

		if( array != null ){
			var i = array.length;
			if( i == null || array.split || array.setInterval || array.call )
				ret[0] = array;
			else
				while( i )
					ret[--i] = array[i];
		}

		return ret;
	},

	inArray: function( elem, array ) {
		for ( var i = 0, length = array.length; i < length; i++ )
			if ( array[ i ] === elem )
				return i;

		return -1;
	},

	merge: function( first, second ) {
		var i = 0, elem, pos = first.length;
		if ( jQuery.browser.msie ) {
			while ( elem = second[ i++ ] )
				if ( elem.nodeType != 8 )
					first[ pos++ ] = elem;

		} else
			while ( elem = second[ i++ ] )
				first[ pos++ ] = elem;

		return first;
	},

	unique: function( array ) {
		var ret = [], done = {};

		try {

			for ( var i = 0, length = array.length; i < length; i++ ) {
				var id = jQuery.data( array[ i ] );

				if ( !done[ id ] ) {
					done[ id ] = true;
					ret.push( array[ i ] );
				}
			}

		} catch( e ) {
			ret = array;
		}

		return ret;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		for ( var i = 0, length = elems.length; i < length; i++ )
			if ( !inv != !callback( elems[ i ], i ) )
				ret.push( elems[ i ] );

		return ret;
	},

	map: function( elems, callback ) {
		var ret = [];

		for ( var i = 0, length = elems.length; i < length; i++ ) {
			var value = callback( elems[ i ], i );

			if ( value != null )
				ret[ ret.length ] = value;
		}

		return ret.concat.apply( [], ret );
	}
});

var userAgent = navigator.userAgent.toLowerCase();

jQuery.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};

var styleFloat = jQuery.browser.msie ?
	"styleFloat" :
	"cssFloat";

jQuery.extend({
	boxModel: !jQuery.browser.msie || document.compatMode == "CSS1Compat",

	props: {
		"for": "htmlFor",
		"class": "className",
		"float": styleFloat,
		cssFloat: styleFloat,
		styleFloat: styleFloat,
		readonly: "readOnly",
		maxlength: "maxLength",
		cellspacing: "cellSpacing"
	}
});

jQuery.each({
	parent: function(elem){return elem.parentNode;},
	parents: function(elem){return jQuery.dir(elem,"parentNode");},
	next: function(elem){return jQuery.nth(elem,2,"nextSibling");},
	prev: function(elem){return jQuery.nth(elem,2,"previousSibling");},
	nextAll: function(elem){return jQuery.dir(elem,"nextSibling");},
	prevAll: function(elem){return jQuery.dir(elem,"previousSibling");},
	siblings: function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);},
	children: function(elem){return jQuery.sibling(elem.firstChild);},
	contents: function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ) );
	};
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function(name, original){
	jQuery.fn[ name ] = function() {
		var args = arguments;

		return this.each(function(){
			for ( var i = 0, length = args.length; i < length; i++ )
				jQuery( args[ i ] )[ original ]( this );
		});
	};
});

jQuery.each({
	removeAttr: function( name ) {
		jQuery.attr( this, name, "" );
		if (this.nodeType == 1)
			this.removeAttribute( name );
	},

	addClass: function( classNames ) {
		jQuery.className.add( this, classNames );
	},

	removeClass: function( classNames ) {
		jQuery.className.remove( this, classNames );
	},

	toggleClass: function( classNames ) {
		jQuery.className[ jQuery.className.has( this, classNames ) ? "remove" : "add" ]( this, classNames );
	},

	remove: function( selector ) {
		if ( !selector || jQuery.filter( selector, [ this ] ).r.length ) {
			jQuery( "*", this ).add(this).each(function(){
				jQuery.event.remove(this);
				jQuery.removeData(this);
			});
			if (this.parentNode)
				this.parentNode.removeChild( this );
		}
	},

	empty: function() {
		jQuery( ">*", this ).remove();

		while ( this.firstChild )
			this.removeChild( this.firstChild );
	}
}, function(name, fn){
	jQuery.fn[ name ] = function(){
		return this.each( fn, arguments );
	};
});

jQuery.each([ "Height", "Width" ], function(i, name){
	var type = name.toLowerCase();

	jQuery.fn[ type ] = function( size ) {
		return this[0] == window ?
			jQuery.browser.opera && document.body[ "client" + name ] ||

			jQuery.browser.safari && window[ "inner" + name ] ||

			document.compatMode == "CSS1Compat" && document.documentElement[ "client" + name ] || document.body[ "client" + name ] :

			this[0] == document ?
				Math.max(
					Math.max(document.body["scroll" + name], document.documentElement["scroll" + name]),
					Math.max(document.body["offset" + name], document.documentElement["offset" + name])
				) :

				size == undefined ?
					(this.length ? jQuery.css( this[0], type ) : null) :

					this.css( type, size.constructor == String ? size : size + "px" );
	};
});

function num(elem, prop) {
	return elem[0] && parseInt( jQuery.curCSS(elem[0], prop, true), 10 ) || 0;
}var chars = jQuery.browser.safari && parseInt(jQuery.browser.version) < 417 ?
		"(?:[\\w*_-]|\\\\.)" :
		"(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",
	quickChild = new RegExp("^>\\s*(" + chars + "+)"),
	quickID = new RegExp("^(" + chars + "+)(#)(" + chars + "+)"),
	quickClass = new RegExp("^([#.]?)(" + chars + "*)");

jQuery.extend({
	expr: {
		"": function(a,i,m){return m[2]=="*"||jQuery.nodeName(a,m[2]);},
		"#": function(a,i,m){return a.getAttribute("id")==m[2];},
		":": {
			lt: function(a,i,m){return i<m[3]-0;},
			gt: function(a,i,m){return i>m[3]-0;},
			nth: function(a,i,m){return m[3]-0==i;},
			eq: function(a,i,m){return m[3]-0==i;},
			first: function(a,i){return i==0;},
			last: function(a,i,m,r){return i==r.length-1;},
			even: function(a,i){return i%2==0;},
			odd: function(a,i){return i%2;},

			"first-child": function(a){return a.parentNode.getElementsByTagName("*")[0]==a;},
			"last-child": function(a){return jQuery.nth(a.parentNode.lastChild,1,"previousSibling")==a;},
			"only-child": function(a){return !jQuery.nth(a.parentNode.lastChild,2,"previousSibling");},

			parent: function(a){return a.firstChild;},
			empty: function(a){return !a.firstChild;},

			contains: function(a,i,m){return (a.textContent||a.innerText||jQuery(a).text()||"").indexOf(m[3])>=0;},

			visible: function(a){return "hidden"!=a.type&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden";},
			hidden: function(a){return "hidden"==a.type||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden";},

			enabled: function(a){return !a.disabled;},
			disabled: function(a){return a.disabled;},
			checked: function(a){return a.checked;},
			selected: function(a){return a.selected||jQuery.attr(a,"selected");},

			text: function(a){return "text"==a.type;},
			radio: function(a){return "radio"==a.type;},
			checkbox: function(a){return "checkbox"==a.type;},
			file: function(a){return "file"==a.type;},
			password: function(a){return "password"==a.type;},
			submit: function(a){return "submit"==a.type;},
			image: function(a){return "image"==a.type;},
			reset: function(a){return "reset"==a.type;},
			button: function(a){return "button"==a.type||jQuery.nodeName(a,"button");},
			input: function(a){return /input|select|textarea|button/i.test(a.nodeName);},

			has: function(a,i,m){return jQuery.find(m[3],a).length;},

			header: function(a){return /h\d/i.test(a.nodeName);},

			animated: function(a){return jQuery.grep(jQuery.timers,function(fn){return a==fn.elem;}).length;}
		}
	},

	parse: [
		/^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,

		/^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,

		new RegExp("^([:.#]*)(" + chars + "+)")
	],

	multiFilter: function( expr, elems, not ) {
		var old, cur = [];

		while ( expr && expr != old ) {
			old = expr;
			var f = jQuery.filter( expr, elems, not );
			expr = f.t.replace(/^\s*,\s*/, "" );
			cur = not ? elems = f.r : jQuery.merge( cur, f.r );
		}

		return cur;
	},

	find: function( t, context ) {
		if ( typeof t != "string" )
			return [ t ];

		if ( context && context.nodeType != 1 && context.nodeType != 9)
			return [ ];

		context = context || document;

		var ret = [context], done = [], last, nodeName;

		while ( t && last != t ) {
			var r = [];
			last = t;

			t = jQuery.trim(t);

			var foundToken = false,

				re = quickChild,

				m = re.exec(t);

			if ( m ) {
				nodeName = m[1].toUpperCase();

				for ( var i = 0; ret[i]; i++ )
					for ( var c = ret[i].firstChild; c; c = c.nextSibling )
						if ( c.nodeType == 1 && (nodeName == "*" || c.nodeName.toUpperCase() == nodeName) )
							r.push( c );

				ret = r;
				t = t.replace( re, "" );
				if ( t.indexOf(" ") == 0 ) continue;
				foundToken = true;
			} else {
				re = /^([>+~])\s*(\w*)/i;

				if ( (m = re.exec(t)) != null ) {
					r = [];

					var merge = {};
					nodeName = m[2].toUpperCase();
					m = m[1];

					for ( var j = 0, rl = ret.length; j < rl; j++ ) {
						var n = m == "~" || m == "+" ? ret[j].nextSibling : ret[j].firstChild;
						for ( ; n; n = n.nextSibling )
							if ( n.nodeType == 1 ) {
								var id = jQuery.data(n);

								if ( m == "~" && merge[id] ) break;

								if (!nodeName || n.nodeName.toUpperCase() == nodeName ) {
									if ( m == "~" ) merge[id] = true;
									r.push( n );
								}

								if ( m == "+" ) break;
							}
					}

					ret = r;

					t = jQuery.trim( t.replace( re, "" ) );
					foundToken = true;
				}
			}

			if ( t && !foundToken ) {
				if ( !t.indexOf(",") ) {
					if ( context == ret[0] ) ret.shift();

					done = jQuery.merge( done, ret );

					r = ret = [context];

					t = " " + t.substr(1,t.length);

				} else {
					var re2 = quickID;
					var m = re2.exec(t);

					if ( m ) {
						m = [ 0, m[2], m[3], m[1] ];

					} else {
						re2 = quickClass;
						m = re2.exec(t);
					}

					m[2] = m[2].replace(/\\/g, "");

					var elem = ret[ret.length-1];

					if ( m[1] == "#" && elem && elem.getElementById && !jQuery.isXMLDoc(elem) ) {
						var oid = elem.getElementById(m[2]);

						if ( (jQuery.browser.msie||jQuery.browser.opera) && oid && typeof oid.id == "string" && oid.id != m[2] )
							oid = jQuery('[@id="'+m[2]+'"]', elem)[0];

						ret = r = oid && (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : [];
					} else {
						for ( var i = 0; ret[i]; i++ ) {
							var tag = m[1] == "#" && m[3] ? m[3] : m[1] != "" || m[0] == "" ? "*" : m[2];

							if ( tag == "*" && ret[i].nodeName.toLowerCase() == "object" )
								tag = "param";

							r = jQuery.merge( r, ret[i].getElementsByTagName( tag ));
						}

						if ( m[1] == "." )
							r = jQuery.classFilter( r, m[2] );

						if ( m[1] == "#" ) {
							var tmp = [];

							for ( var i = 0; r[i]; i++ )
								if ( r[i].getAttribute("id") == m[2] ) {
									tmp = [ r[i] ];
									break;
								}

							r = tmp;
						}

						ret = r;
					}

					t = t.replace( re2, "" );
				}

			}

			if ( t ) {
				var val = jQuery.filter(t,r);
				ret = r = val.r;
				t = jQuery.trim(val.t);
			}
		}

		if ( t )
			ret = [];

		if ( ret && context == ret[0] )
			ret.shift();

		done = jQuery.merge( done, ret );

		return done;
	},

	classFilter: function(r,m,not){
		m = " " + m + " ";
		var tmp = [];
		for ( var i = 0; r[i]; i++ ) {
			var pass = (" " + r[i].className + " ").indexOf( m ) >= 0;
			if ( !not && pass || not && !pass )
				tmp.push( r[i] );
		}
		return tmp;
	},

	filter: function(t,r,not) {
		var last;

		while ( t && t != last ) {
			last = t;

			var p = jQuery.parse, m;

			for ( var i = 0; p[i]; i++ ) {
				m = p[i].exec( t );

				if ( m ) {
					t = t.substring( m[0].length );

					m[2] = m[2].replace(/\\/g, "");
					break;
				}
			}

			if ( !m )
				break;

			if ( m[1] == ":" && m[2] == "not" )
				r = isSimple.test( m[3] ) ?
					jQuery.filter(m[3], r, true).r :
					jQuery( r ).not( m[3] );

			else if ( m[1] == "." )
				r = jQuery.classFilter(r, m[2], not);

			else if ( m[1] == "[" ) {
				var tmp = [], type = m[3];

				for ( var i = 0, rl = r.length; i < rl; i++ ) {
					var a = r[i], z = a[ jQuery.props[m[2]] || m[2] ];

					if ( z == null || /href|src|selected/.test(m[2]) )
						z = jQuery.attr(a,m[2]) || '';

					if ( (type == "" && !!z ||
						 type == "=" && z == m[5] ||
						 type == "!=" && z != m[5] ||
						 type == "^=" && z && !z.indexOf(m[5]) ||
						 type == "$=" && z.substr(z.length - m[5].length) == m[5] ||
						 (type == "*=" || type == "~=") && z.indexOf(m[5]) >= 0) ^ not )
							tmp.push( a );
				}

				r = tmp;

			} else if ( m[1] == ":" && m[2] == "nth-child" ) {
				var merge = {}, tmp = [],
					test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
						m[3] == "even" && "2n" || m[3] == "odd" && "2n+1" ||
						!/\D/.test(m[3]) && "0n+" + m[3] || m[3]),
					first = (test[1] + (test[2] || 1)) - 0, last = test[3] - 0;

				for ( var i = 0, rl = r.length; i < rl; i++ ) {
					var node = r[i], parentNode = node.parentNode, id = jQuery.data(parentNode);

					if ( !merge[id] ) {
						var c = 1;

						for ( var n = parentNode.firstChild; n; n = n.nextSibling )
							if ( n.nodeType == 1 )
								n.nodeIndex = c++;

						merge[id] = true;
					}

					var add = false;

					if ( first == 0 ) {
						if ( node.nodeIndex == last )
							add = true;
					} else if ( (node.nodeIndex - last) % first == 0 && (node.nodeIndex - last) / first >= 0 )
						add = true;

					if ( add ^ not )
						tmp.push( node );
				}

				r = tmp;

			} else {
				var fn = jQuery.expr[ m[1] ];
				if ( typeof fn == "object" )
					fn = fn[ m[2] ];

				if ( typeof fn == "string" )
					fn = eval("false||function(a,i){return " + fn + ";}");

				r = jQuery.grep( r, function(elem, i){
					return fn(elem, i, m, r);
				}, not );
			}
		}

		return { r: r, t: t };
	},

	dir: function( elem, dir ){
		var matched = [],
			cur = elem[dir];
		while ( cur && cur != document ) {
			if ( cur.nodeType == 1 )
				matched.push( cur );
			cur = cur[dir];
		}
		return matched;
	},

	nth: function(cur,result,dir,elem){
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] )
			if ( cur.nodeType == 1 && ++num == result )
				break;

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType == 1 && n != elem )
				r.push( n );
		}

		return r;
	}
});

function returnFalse() {
  return false;
}
function returnTrue() {
  return true;
}

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code orignated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	add: function(elem, types, handler, data) {
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		if ( jQuery.browser.msie && elem.setInterval )
			elem = window;

		if ( !handler.guid )
			handler.guid = this.guid++;

		if( data != undefined ) {
			var fn = handler;

			handler = this.proxy( fn, function() {
				return fn.apply(this, arguments);
			});

			handler.data = data;
		}

		var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
			handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function(){
				if ( typeof jQuery != "undefined" && !jQuery.event.triggered )
					return jQuery.event.handle.apply(arguments.callee.elem, arguments);
			});
		handle.elem = elem;

		jQuery.each(types.split(/\s+/), function(index, type) {
			var parts = type.split(".");
			type = parts[0];
			handler.type = parts[1];

			var handlers = events[type];

			if (!handlers) {
				handlers = events[type] = {};

				if ( !jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem) === false ) {
					if (elem.addEventListener)
						elem.addEventListener(type, handle, false);
					else if (elem.attachEvent)
						elem.attachEvent("on" + type, handle);
				}
			}

			handlers[handler.guid] = handler;

			jQuery.event.global[type] = true;
		});

		elem = null;
	},

	guid: 1,
	global: {},

	remove: function(elem, types, handler) {
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		var events = jQuery.data(elem, "events"), ret, index;

		if ( events ) {
			if ( types == undefined || (typeof types == "string" && types.charAt(0) == ".") )
				for ( var type in events )
					this.remove( elem, type + (types || "") );
			else {
				if ( types.type ) {
					handler = types.handler;
					types = types.type;
				}

				jQuery.each(types.split(/\s+/), function(index, type){
					var parts = type.split(".");
					type = parts[0];

					if ( events[type] ) {
						if ( handler )
							delete events[type][handler.guid];

						else
							for ( handler in events[type] )
								if ( !parts[1] || events[type][handler].type == parts[1] )
									delete events[type][handler];

						for ( ret in events[type] ) break;
						if ( !ret ) {
							if ( !jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem) === false ) {
								if (elem.removeEventListener)
									elem.removeEventListener(type, jQuery.data(elem, "handle"), false);
								else if (elem.detachEvent)
									elem.detachEvent("on" + type, jQuery.data(elem, "handle"));
							}
							ret = null;
							delete events[type];
						}
					}
				});
			}

			for ( ret in events ) break;
			if ( !ret ) {
				var handle = jQuery.data( elem, "handle" );
				if ( handle ) handle.elem = null;
				jQuery.removeData( elem, "events" );
				jQuery.removeData( elem, "handle" );
			}
		}
	},

	trigger: function(type, data, elem, donative, extra) {
		data = jQuery.makeArray(data);

		if ( type.indexOf("!") >= 0 ) {
			type = type.slice(0, -1);
			var exclusive = true;
		}

		if ( !elem ) {
			if ( this.global[type] )
				jQuery("*").add([window, document]).trigger(type, data);

		} else {
			if ( elem.nodeType == 3 || elem.nodeType == 8 )
				return undefined;

			var val, ret, fn = jQuery.isFunction( elem[ type ] || null ),
				event = !data[0] || !data[0].preventDefault;

			if ( event ) {
				data.unshift({
					type: type,
					target: elem,
					preventDefault: function(){},
					stopPropagation: function(){},
					timeStamp: now()
				});
				data[0][expando] = true; // no need to fix fake event
			}

			data[0].type = type;
			if ( exclusive )
				data[0].exclusive = true;

			var handle = jQuery.data(elem, "handle");
			if ( handle )
				val = handle.apply( elem, data );

			if ( (!fn || (jQuery.nodeName(elem, 'a') && type == "click")) && elem["on"+type] && elem["on"+type].apply( elem, data ) === false )
				val = false;

			if ( event )
				data.shift();

			if ( extra && jQuery.isFunction( extra ) ) {
				ret = extra.apply( elem, val == null ? data : data.concat( val ) );
				if (ret !== undefined)
					val = ret;
			}

			if ( fn && donative !== false && val !== false && !(jQuery.nodeName(elem, 'a') && type == "click") ) {
				this.triggered = true;
				try {
					elem[ type ]();
				} catch (e) {}
			}

			this.triggered = false;
		}

		return val;
	},

	handle: function(event) {
		var val, ret, namespace, all, handlers;

		event = arguments[0] = jQuery.event.fix( event || window.event );

		namespace = event.type.split(".");
		event.type = namespace[0];
		namespace = namespace[1];
		all = !namespace && !event.exclusive;

		handlers = ( jQuery.data(this, "events") || {} )[event.type];

		for ( var j in handlers ) {
			var handler = handlers[j];

			if ( all || handler.type == namespace ) {
				event.handler = handler;
				event.data = handler.data;

				ret = handler.apply( this, arguments );

				if ( val !== false )
					val = ret;

				if ( ret === false ) {
					event.preventDefault();
					event.stopPropagation();
				}
				if ( event.isImmediatePropagationStopped && event.isImmediatePropagationStopped() ) {
          break;
        }
			}
		}

		return val;
	},

	fix: function(event) {
		if ( event[expando] == true )
			return event;

		var originalEvent = event;
		event = { originalEvent: originalEvent };
		var props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which".split(" ");
		for ( var i=props.length; i; i-- )
			event[ props[i] ] = originalEvent[ props[i] ];

		event[expando] = true;

		event.preventDefault = function() {
			if (originalEvent.preventDefault)
				originalEvent.preventDefault();
			originalEvent.returnValue = false;
		};
		event.stopPropagation = function() {
			if (originalEvent.stopPropagation)
				originalEvent.stopPropagation();
			originalEvent.cancelBubble = true;
		};
		event.isImmediatePropagationStopped = function() {
		  return false;
		};
		event.stopImmediatePropagation = function() {
	    event.isImmediatePropagationStopped = function() {
	      return true;
	    };
	    event.stopPropagation();
	  };

		event.timeStamp = event.timeStamp || now();

		if ( !event.target )
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either

		if ( event.target.nodeType == 3 )
			event.target = event.target.parentNode;

		if ( !event.relatedTarget && event.fromElement )
			event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
		}

		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) )
			event.which = event.charCode || event.keyCode;

		if ( !event.metaKey && event.ctrlKey )
			event.metaKey = event.ctrlKey;

		if ( !event.which && event.button )
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));

		return event;
	},

	proxy: function( fn, proxy ){
		proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
		return proxy;
	},

	special: {
		ready: {
			setup: function() {
				bindReady();
				return;
			},

			teardown: function() { return; }
		},

		mouseenter: {
			setup: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).bind("mouseover", jQuery.event.special.mouseenter.handler);
				return true;
			},

			teardown: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).unbind("mouseover", jQuery.event.special.mouseenter.handler);
				return true;
			},

			handler: function(event) {
				if ( withinElement(event, this) ) return true;
				event.type = "mouseenter";
				return jQuery.event.handle.apply(this, arguments);
			}
		},

		mouseleave: {
			setup: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).bind("mouseout", jQuery.event.special.mouseleave.handler);
				return true;
			},

			teardown: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).unbind("mouseout", jQuery.event.special.mouseleave.handler);
				return true;
			},

			handler: function(event) {
				if ( withinElement(event, this) ) return true;
				event.type = "mouseleave";
				return jQuery.event.handle.apply(this, arguments);
			}
		}
	}
};

jQuery.fn.extend({
	bind: function( type, data, fn ) {
		return type == "unload" ? this.one(type, data, fn) : this.each(function(){
			jQuery.event.add( this, type, fn || data, fn && data );
		});
	},

	one: function( type, data, fn ) {
		var one = jQuery.event.proxy( fn || data, function(event) {
			jQuery(this).unbind(event, one);
			return (fn || data).apply( this, arguments );
		});
		return this.each(function(){
			jQuery.event.add( this, type, one, fn && data);
		});
	},

	unbind: function( type, fn ) {
		return this.each(function(){
			jQuery.event.remove( this, type, fn );
		});
	},

	trigger: function( type, data, fn ) {
		return this.each(function(){
			jQuery.event.trigger( type, data, this, true, fn );
		});
	},

	triggerHandler: function( type, data, fn ) {
		return this[0] && jQuery.event.trigger( type, data, this[0], false, fn );
	},

	toggle: function( fn ) {
		var args = arguments, i = 1;

		while( i < args.length )
			jQuery.event.proxy( fn, args[i++] );

		return this.click( jQuery.event.proxy( fn, function(event) {
			this.lastToggle = ( this.lastToggle || 0 ) % i;

			event.preventDefault();

			return args[ this.lastToggle++ ].apply( this, arguments ) || false;
		}));
	},

	hover: function(fnOver, fnOut) {
		return this.bind('mouseenter', fnOver).bind('mouseleave', fnOut);
	},

	ready: function(fn) {
		bindReady();

		if ( jQuery.isReady )
			fn.call( document, jQuery );

		else
			jQuery.readyList.push( function() { return fn.call(this, jQuery); } );

		return this;
	}
});

jQuery.extend({
	isReady: false,
	readyList: [],
	ready: function() {
		if ( !jQuery.isReady ) {
			jQuery.isReady = true;

			if ( jQuery.readyList ) {
				jQuery.each( jQuery.readyList, function(){
					this.call( document );
				});

				jQuery.readyList = null;
			}

			jQuery(document).triggerHandler("ready");
		}
	}
});

var readyBound = false;

function bindReady(){
	if ( readyBound ) return;
	readyBound = true;

	if ( document.addEventListener && !jQuery.browser.opera)
		document.addEventListener( "DOMContentLoaded", jQuery.ready, false );

	if ( jQuery.browser.msie && window == top ) (function(){
		if (jQuery.isReady) return;
		try {
			document.documentElement.doScroll("left");
		} catch( error ) {
			setTimeout( arguments.callee, 0 );
			return;
		}
		jQuery.ready();
	})();

	if ( jQuery.browser.opera )
		document.addEventListener( "DOMContentLoaded", function () {
			if (jQuery.isReady) return;
			for (var i = 0; i < document.styleSheets.length; i++)
				if (document.styleSheets[i].disabled) {
					setTimeout( arguments.callee, 0 );
					return;
				}
			jQuery.ready();
		}, false);

	if ( jQuery.browser.safari ) {
		var numStyles;
		(function(){
			if (jQuery.isReady) return;
			if ( document.readyState != "loaded" && document.readyState != "complete" ) {
				setTimeout( arguments.callee, 0 );
				return;
			}
			if ( numStyles === undefined )
				numStyles = jQuery("style, link[rel=stylesheet]").length;
			if ( document.styleSheets.length != numStyles ) {
				setTimeout( arguments.callee, 0 );
				return;
			}
			jQuery.ready();
		})();
	}

	jQuery.event.add( window, "load", jQuery.ready );
}

jQuery.each( ("blur,focus,load,resize,scroll,unload,click,dblclick," +
	"mousedown,mouseup,mousemove,mouseover,mouseout,change,select," +
	"submit,keydown,keypress,keyup,error").split(","), function(i, name){

	jQuery.fn[name] = function(fn){
		return fn ? this.bind(name, fn) : this.trigger(name);
	};
});

var withinElement = function(event, elem) {
	var parent = event.relatedTarget;
	while ( parent && parent != elem ) try { parent = parent.parentNode; } catch(error) { parent = elem; }
	return parent == elem;
};

jQuery(window).bind("unload", function() {
	jQuery("*").add(document).unbind();
});
jQuery.fn.extend({
	_load: jQuery.fn.load,

	load: function( url, params, callback ) {
		if ( typeof url != 'string' )
			return this._load( url );

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		callback = callback || function(){};

		var type = "GET";

		if ( params )
			if ( jQuery.isFunction( params ) ) {
				callback = params;
				params = null;

			} else {
				params = jQuery.param( params );
				type = "POST";
			}

		var self = this;

		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function(res, status){
				if ( status == "success" || status == "notmodified" )
					self.html( selector ?
						jQuery("<div/>")
							.append(res.responseText.replace(/<script(.|\s)*?\/script>/g, ""))

							.find(selector) :

						res.responseText );

				self.each( callback, [res.responseText, status, res] );
			}
		});
		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function(){
			return jQuery.nodeName(this, "form") ?
				jQuery.makeArray(this.elements) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				(this.checked || /select|textarea/i.test(this.nodeName) ||
					/text|hidden|password/i.test(this.type));
		})
		.map(function(i, elem){
			var val = jQuery(this).val();
			return val == null ? null :
				val.constructor == Array ?
					jQuery.map( val, function(val, i){
						return {name: elem.name, value: val};
					}) :
					{name: elem.name, value: val};
		}).get();
	}
});

jQuery.each( "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i,o){
	jQuery.fn[o] = function(f){
		return this.bind(o, f);
	};
});

var jsc = now();

jQuery.extend({
	get: function( url, data, callback, type ) {
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		timeout: 0,
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		data: null,
		username: null,
		password: null,
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	lastModified: {},

	ajax: function( s ) {
		s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));

		var jsonp, jsre = /=\?(&|$)/g, status, data,
			type = s.type.toUpperCase();

		if ( s.data && s.processData && typeof s.data != "string" )
			s.data = jQuery.param(s.data);

		if ( s.dataType == "jsonp" ) {
			if ( type == "GET" ) {
				if ( !s.url.match(jsre) )
					s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
			} else if ( !s.data || !s.data.match(jsre) )
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			s.dataType = "json";
		}

		if ( s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre)) ) {
			jsonp = "jsonp" + jsc++;

			if ( s.data )
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			s.dataType = "script";

			window[ jsonp ] = function(tmp){
				data = tmp;
				success();
				complete();
				window[ jsonp ] = undefined;
				try{ delete window[ jsonp ]; } catch(e){}
				if ( head )
					head.removeChild( script );
			};
		}

		if ( s.dataType == "script" && s.cache == null )
			s.cache = false;

		if ( s.cache === false && type == "GET" ) {
			var ts = now();
			var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
			s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "");
		}

		if ( s.data && type == "GET" ) {
			s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;

			s.data = null;
		}

		if ( s.global && ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		var remote = /^(?:\w+:)?\/\/([^\/?#]+)/;

		if ( s.dataType == "script" && type == "GET"
				&& remote.test(s.url) && remote.exec(s.url)[1] != location.host ){
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.src = s.url;
			if (s.scriptCharset)
				script.charset = s.scriptCharset;

			if ( !jsonp ) {
				var done = false;

				script.onload = script.onreadystatechange = function(){
					if ( !done && (!this.readyState ||
							this.readyState == "loaded" || this.readyState == "complete") ) {
						done = true;
						success();
						complete();
						head.removeChild( script );
					}
				};
			}

			head.appendChild(script);

			return undefined;
		}

		var requestDone = false;

		var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();

		if( s.username )
			xhr.open(type, s.url, s.async, s.username, s.password);
		else
			xhr.open(type, s.url, s.async);

		try {
			if ( s.data )
				xhr.setRequestHeader("Content-Type", s.contentType);

			if ( s.ifModified )
				xhr.setRequestHeader("If-Modified-Since",
					jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT" );

			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e){}

		if ( s.beforeSend && s.beforeSend(xhr, s) === false ) {
			s.global && jQuery.active--;
			xhr.abort();
			return false;
		}

		if ( s.global )
			jQuery.event.trigger("ajaxSend", [xhr, s]);

		var onreadystatechange = function(isTimeout){
			if ( !requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout") ) {
				requestDone = true;

				if (ival) {
					clearInterval(ival);
					ival = null;
				}

				status = isTimeout == "timeout" && "timeout" ||
					!jQuery.httpSuccess( xhr ) && "error" ||
					s.ifModified && jQuery.httpNotModified( xhr, s.url ) && "notmodified" ||
					"success";

				if ( status == "success" ) {
					try {
						data = jQuery.httpData( xhr, s.dataType, s.dataFilter );
					} catch(e) {
						status = "parsererror";
					}
				}

				if ( status == "success" ) {
					var modRes;
					try {
						modRes = xhr.getResponseHeader("Last-Modified");
					} catch(e) {} // swallow exception thrown by FF if header is not available

					if ( s.ifModified && modRes )
						jQuery.lastModified[s.url] = modRes;

					if ( !jsonp )
						success();
				} else
					jQuery.handleError(s, xhr, status);

				complete();

				if ( s.async )
					xhr = null;
			}
		};

		if ( s.async ) {
			var ival = setInterval(onreadystatechange, 13);

			if ( s.timeout > 0 )
				setTimeout(function(){
					if ( xhr ) {
						xhr.abort();

						if( !requestDone )
							onreadystatechange( "timeout" );
					}
				}, s.timeout);
		}

		try {
			xhr.send(s.data);
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
		}

		if ( !s.async )
			onreadystatechange();

		function success(){
			if ( s.success )
				s.success( data, status );

			if ( s.global )
				jQuery.event.trigger( "ajaxSuccess", [xhr, s] );
		}

		function complete(){
			if ( s.complete )
				s.complete(xhr, status);

			if ( s.global )
				jQuery.event.trigger( "ajaxComplete", [xhr, s] );

			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
		}

		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		if ( s.error ) s.error( xhr, status, e );

		if ( s.global )
			jQuery.event.trigger( "ajaxError", [xhr, s, e] );
	},

	active: 0,

	httpSuccess: function( xhr ) {
		try {
			return !xhr.status && location.protocol == "file:" ||
				( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status == 1223 ||
				jQuery.browser.safari && xhr.status == undefined;
		} catch(e){}
		return false;
	},

	httpNotModified: function( xhr, url ) {
		try {
			var xhrRes = xhr.getResponseHeader("Last-Modified");

			return xhr.status == 304 || xhrRes == jQuery.lastModified[url] ||
				jQuery.browser.safari && xhr.status == undefined;
		} catch(e){}
		return false;
	},

	httpData: function( xhr, type, filter ) {
		var ct = xhr.getResponseHeader("content-type"),
			xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;
			
		// http://bugs.jquery.com/attachment/ticket/3598/jquery.diff	
		if ( xml && !data.documentElement && xhr.responseStream ) 
 	       try { data.load( xhr.responseStream ); } catch(e){}
 	       
		if ( xml && data.documentElement.tagName == "parsererror" )
			throw "parsererror";

		if( filter )
			data = filter( data, type );

		if ( type == "script" )
			jQuery.globalEval( data );

		if ( type == "json" )
			data = eval("(" + data + ")");

		return data;
	},

	param: function( a ) {
		var s = [];

		if ( a.constructor == Array || a.jquery )
			jQuery.each( a, function(){
				s.push( encodeURIComponent(this.name) + "=" + encodeURIComponent( this.value ) );
			});

		else
			for ( var j in a )
				if ( a[j] && a[j].constructor == Array )
					jQuery.each( a[j], function(){
						s.push( encodeURIComponent(j) + "=" + encodeURIComponent( this ) );
					});
				else
					s.push( encodeURIComponent(j) + "=" + encodeURIComponent( jQuery.isFunction(a[j]) ? a[j]() : a[j] ) );

		return s.join("&").replace(/%20/g, "+");
	}

});
jQuery.fn.extend({
	show: function(speed,callback){
		return speed ?
			this.animate({
				height: "show", width: "show", opacity: "show"
			}, speed, callback) :

			this.filter(":hidden").each(function(){
				this.style.display = this.oldblock || "";
				if ( jQuery.css(this,"display") == "none" ) {
					var elem = jQuery("<" + this.tagName + " />").appendTo("body");
					this.style.display = elem.css("display");
					if (this.style.display == "none")
						this.style.display = "block";
					elem.remove();
				}
			}).end();
	},

	hide: function(speed,callback){
		return speed ?
			this.animate({
				height: "hide", width: "hide", opacity: "hide"
			}, speed, callback) :

			this.filter(":visible").each(function(){
				this.oldblock = this.oldblock || jQuery.css(this,"display");
				this.style.display = "none";
			}).end();
	},

	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ){
		return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
			this._toggle.apply( this, arguments ) :
			fn ?
				this.animate({
					height: "toggle", width: "toggle", opacity: "toggle"
				}, fn, fn2) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
				});
	},

	slideDown: function(speed,callback){
		return this.animate({height: "show"}, speed, callback);
	},

	slideUp: function(speed,callback){
		return this.animate({height: "hide"}, speed, callback);
	},

	slideToggle: function(speed, callback){
		return this.animate({height: "toggle"}, speed, callback);
	},

	fadeIn: function(speed, callback){
		return this.animate({opacity: "show"}, speed, callback);
	},

	fadeOut: function(speed, callback){
		return this.animate({opacity: "hide"}, speed, callback);
	},

	fadeTo: function(speed,to,callback){
		return this.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		return this[ optall.queue === false ? "each" : "queue" ](function(){
			if ( this.nodeType != 1)
				return false;

			var opt = jQuery.extend({}, optall), p,
				hidden = jQuery(this).is(":hidden"), self = this;

			for ( p in prop ) {
				if ( prop[p] == "hide" && hidden || prop[p] == "show" && !hidden )
					return opt.complete.call(this);

				if ( p == "height" || p == "width" ) {
					opt.display = jQuery.css(this, "display");

					opt.overflow = this.style.overflow;
				}
			}

			if ( opt.overflow != null )
				this.style.overflow = "hidden";

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function(name, val){
				var e = new jQuery.fx( self, opt, name );

				if ( /toggle|show|hide/.test(val) )
					e[ val == "toggle" ? hidden ? "show" : "hide" : val ]( prop );
				else {
					var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat(parts[2]),
							unit = parts[3] || "px";

						if ( unit != "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						if ( parts[1] )
							end = ((parts[1] == "-=" ? -1 : 1) * end) + start;

						e.custom( start, end, unit );
					} else
						e.custom( start, val, "" );
				}
			});

			return true;
		});
	},

	queue: function(type, fn){
		if ( jQuery.isFunction(type) || ( type && type.constructor == Array )) {
			fn = type;
			type = "fx";
		}

		if ( !type || (typeof type == "string" && !fn) )
			return queue( this[0], type );

		return this.each(function(){
			if ( fn.constructor == Array )
				queue(this, type, fn);
			else {
				queue(this, type).push( fn );

				if ( queue(this, type).length == 1 )
					fn.call(this);
			}
		});
	},

	stop: function(clearQueue, gotoEnd){
		var timers = jQuery.timers;

		if (clearQueue)
			this.queue([]);

		this.each(function(){
			for ( var i = timers.length - 1; i >= 0; i-- )
				if ( timers[i].elem == this ) {
					if (gotoEnd)
						timers[i](true);
					timers.splice(i, 1);
				}
		});

		if (!gotoEnd)
			this.dequeue();

		return this;
	}

});

var queue = function( elem, type, array ) {
	if ( elem ){

		type = type || "fx";

		var q = jQuery.data( elem, type + "queue" );

		if ( !q || array )
			q = jQuery.data( elem, type + "queue", jQuery.makeArray(array) );

	}
	return q;
};

jQuery.fn.dequeue = function(type){
	type = type || "fx";

	return this.each(function(){
		var q = queue(this, type);

		q.shift();

		if ( q.length )
			q[0].call( this );
	});
};

jQuery.extend({

	speed: function(speed, easing, fn) {
		var opt = speed && speed.constructor == Object ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && easing.constructor != Function && easing
		};

		opt.duration = (opt.duration && opt.duration.constructor == Number ?
			opt.duration :
			jQuery.fx.speeds[opt.duration]) || jQuery.fx.speeds.def;

		opt.old = opt.complete;
		opt.complete = function(){
			if ( opt.queue !== false )
				jQuery(this).dequeue();
			if ( jQuery.isFunction( opt.old ) )
				opt.old.call( this );
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],
	timerId: null,

	fx: function( elem, options, prop ){
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig )
			options.orig = {};
	}

});

jQuery.fx.prototype = {

	update: function(){
		if ( this.options.step )
			this.options.step.call( this.elem, this.now, this );

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		if ( this.prop == "height" || this.prop == "width" )
			this.elem.style.display = "block";
	},

	cur: function(force){
		if ( this.elem[this.prop] != null && this.elem.style[this.prop] == null )
			return this.elem[ this.prop ];

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	custom: function(from, to, unit){
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;
		this.update();

		var self = this;
		function t(gotoEnd){
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		jQuery.timers.push(t);

		if ( jQuery.timerId == null ) {
			jQuery.timerId = setInterval(function(){
				var timers = jQuery.timers;

				for ( var i = 0; i < timers.length; i++ )
					if ( !timers[i]() )
						timers.splice(i--, 1);

				if ( !timers.length ) {
					clearInterval( jQuery.timerId );
					jQuery.timerId = null;
				}
			}, 13);
		}
	},

	show: function(){
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.show = true;

		this.custom(0, this.cur());

		if ( this.prop == "width" || this.prop == "height" )
			this.elem.style[this.prop] = "1px";

		jQuery(this.elem).show();
	},

	hide: function(){
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.hide = true;

		this.custom(this.cur(), 0);
	},

	step: function(gotoEnd){
		var t = now();

		if ( gotoEnd || t > this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			var done = true;
			for ( var i in this.options.curAnim )
				if ( this.options.curAnim[i] !== true )
					done = false;

			if ( done ) {
				if ( this.options.display != null ) {
					this.elem.style.overflow = this.options.overflow;

					this.elem.style.display = this.options.display;
					if ( jQuery.css(this.elem, "display") == "none" )
						this.elem.style.display = "block";
				}

				if ( this.options.hide )
					this.elem.style.display = "none";

				if ( this.options.hide || this.options.show )
					for ( var p in this.options.curAnim )
						jQuery.attr(this.elem.style, p, this.options.orig[p]);
			}

			if ( done )
				this.options.complete.call( this.elem );

			return false;
		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			this.update();
		}

		return true;
	}

};

jQuery.extend( jQuery.fx, {
	speeds:{
		slow: 600,
 		fast: 200,
 		def: 400
	},
	step: {
		scrollLeft: function(fx){
			fx.elem.scrollLeft = fx.now;
		},

		scrollTop: function(fx){
			fx.elem.scrollTop = fx.now;
		},

		opacity: function(fx){
			jQuery.attr(fx.elem.style, "opacity", fx.now);
		},

		_default: function(fx){
			fx.elem.style[ fx.prop ] = fx.now + fx.unit;
		}
	}
});
jQuery.fn.offset = function() {
	var left = 0, top = 0, elem = this[0], results;

	if ( elem ) with ( jQuery.browser ) {
		var parent       = elem.parentNode,
		    offsetChild  = elem,
		    offsetParent = elem.offsetParent,
		    doc          = elem.ownerDocument,
		    safari2      = safari && parseInt(version) < 522 && !/adobeair/i.test(userAgent),
		    css          = jQuery.curCSS,
		    fixed        = css(elem, "position") == "fixed";

		if ( elem.getBoundingClientRect ) {
			var box = elem.getBoundingClientRect();

			add(box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
				box.top  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop));

			add( -doc.documentElement.clientLeft, -doc.documentElement.clientTop );

		} else {

			add( elem.offsetLeft, elem.offsetTop );

			while ( offsetParent ) {
				add( offsetParent.offsetLeft, offsetParent.offsetTop );

				if ( mozilla && !/^t(able|d|h)$/i.test(offsetParent.tagName) || safari && !safari2 )
					border( offsetParent );

				if ( !fixed && css(offsetParent, "position") == "fixed" )
					fixed = true;

				offsetChild  = /^body$/i.test(offsetParent.tagName) ? offsetChild : offsetParent;
				offsetParent = offsetParent.offsetParent;
			}

			while ( parent && parent.tagName && !/^body|html$/i.test(parent.tagName) ) {
				if ( !/^inline|table.*$/i.test(css(parent, "display")) )
					add( -parent.scrollLeft, -parent.scrollTop );

				if ( mozilla && css(parent, "overflow") != "visible" )
					border( parent );

				parent = parent.parentNode;
			}

			if ( (safari2 && (fixed || css(offsetChild, "position") == "absolute")) ||
				(mozilla && css(offsetChild, "position") != "absolute") )
					add( -doc.body.offsetLeft, -doc.body.offsetTop );

			if ( fixed )
				add(Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
					Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop));
		}

		results = { top: top, left: left };
	}

	function border(elem) {
		add( jQuery.curCSS(elem, "borderLeftWidth", true), jQuery.curCSS(elem, "borderTopWidth", true) );
	}

	function add(l, t) {
		left += parseInt(l, 10) || 0;
		top += parseInt(t, 10) || 0;
	}

	return results;
};


jQuery.fn.extend({
	position: function() {
		var left = 0, top = 0, results;

		if ( this[0] ) {
			var offsetParent = this.offsetParent(),

			offset       = this.offset(),
			parentOffset = /^body|html$/i.test(offsetParent[0].tagName) ? { top: 0, left: 0 } : offsetParent.offset();

			offset.top  -= num( this, 'marginTop' );
			offset.left -= num( this, 'marginLeft' );

			parentOffset.top  += num( offsetParent, 'borderTopWidth' );
			parentOffset.left += num( offsetParent, 'borderLeftWidth' );

			results = {
				top:  offset.top  - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		}

		return results;
	},

	offsetParent: function() {
		var offsetParent = this[0].offsetParent;
		while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && jQuery.css(offsetParent, 'position') == 'static') )
			offsetParent = offsetParent.offsetParent;
		return jQuery(offsetParent);
	}
});


jQuery.each( ['Left', 'Top'], function(i, name) {
	var method = 'scroll' + name;

	jQuery.fn[ method ] = function(val) {
		if (!this[0]) return;

		return val != undefined ?

			this.each(function() {
				this == window || this == document ?
					window.scrollTo(
						!i ? val : jQuery(window).scrollLeft(),
						 i ? val : jQuery(window).scrollTop()
					) :
					this[ method ] = val;
			}) :

			this[0] == window || this[0] == document ?
				self[ i ? 'pageYOffset' : 'pageXOffset' ] ||
					jQuery.boxModel && document.documentElement[ method ] ||
					document.body[ method ] :
				this[0][ method ];
	};
});
jQuery.each([ "Height", "Width" ], function(i, name){

	var tl = i ? "Left"  : "Top",  // top or left
		br = i ? "Right" : "Bottom"; // bottom or right

	jQuery.fn["inner" + name] = function(){
		return this[ name.toLowerCase() ]() +
			num(this, "padding" + tl) +
			num(this, "padding" + br);
	};

	jQuery.fn["outer" + name] = function(margin) {
		return this["inner" + name]() +
			num(this, "border" + tl + "Width") +
			num(this, "border" + br + "Width") +
			(margin ?
				num(this, "margin" + tl) + num(this, "margin" + br) : 0);
	};

});})();

/*EOF*/		
		
		
if (!("console" in window) /** FIX CHROME|| !("firebug" in console)**/)
{
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

    window.console = {};
    for (var i = 0; i < names.length; ++i)
        window.console[names[i]] = function() {}
}

/*EOF*/

/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-07-22 01:44:59 +0200 (Sun, 22 Jul 2007) $
 * $Rev: 2446 $
 *
 * Version 2.1.1
 */

(function($){

/**
 * The bgiframe is chainable and applies the iframe hack to get
 * around zIndex issues in IE6. It will only apply itself in IE6
 * and adds a class to the iframe called 'bgiframe'. The iframe
 * is appeneded as the first child of the matched element(s)
 * with a tabIndex and zIndex of -1.
 *
 * By default the plugin will take borders, sized with pixel units,
 * into account. If a different unit is used for the border's width,
 * then you will need to use the top and left settings as explained below.
 *
 * NOTICE: This plugin has been reported to cause perfromance problems
 * when used on elements that change properties (like width, height and
 * opacity) a lot in IE6. Most of these problems have been caused by
 * the expressions used to calculate the elements width, height and
 * borders. Some have reported it is due to the opacity filter. All
 * these settings can be changed if needed as explained below.
 *
 * @example $('div').bgiframe();
 * @before <div><p>Paragraph</p></div>
 * @result <div><iframe class="bgiframe".../><p>Paragraph</p></div>
 *
 * @param Map settings Optional settings to configure the iframe.
 * @option String|Number top The iframe must be offset to the top
 * 		by the width of the top border. This should be a negative
 *      number representing the border-top-width. If a number is
 * 		is used here, pixels will be assumed. Otherwise, be sure
 *		to specify a unit. An expression could also be used.
 * 		By default the value is "auto" which will use an expression
 * 		to get the border-top-width if it is in pixels.
 * @option String|Number left The iframe must be offset to the left
 * 		by the width of the left border. This should be a negative
 *      number representing the border-left-width. If a number is
 * 		is used here, pixels will be assumed. Otherwise, be sure
 *		to specify a unit. An expression could also be used.
 * 		By default the value is "auto" which will use an expression
 * 		to get the border-left-width if it is in pixels.
 * @option String|Number width This is the width of the iframe. If
 *		a number is used here, pixels will be assume. Otherwise, be sure
 * 		to specify a unit. An experssion could also be used.
 *		By default the value is "auto" which will use an experssion
 * 		to get the offsetWidth.
 * @option String|Number height This is the height of the iframe. If
 *		a number is used here, pixels will be assume. Otherwise, be sure
 * 		to specify a unit. An experssion could also be used.
 *		By default the value is "auto" which will use an experssion
 * 		to get the offsetHeight.
 * @option Boolean opacity This is a boolean representing whether or not
 * 		to use opacity. If set to true, the opacity of 0 is applied. If
 *		set to false, the opacity filter is not applied. Default: true.
 * @option String src This setting is provided so that one could change
 *		the src of the iframe to whatever they need.
 *		Default: "javascript:false;"
 *
 * @name bgiframe
 * @type jQuery
 * @cat Plugins/bgiframe
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
$.fn.bgIframe = $.fn.bgiframe = function(s) {
	if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {
		s = $.extend({
			top     : 'auto', // auto == .currentStyle.borderTopWidth
			left    : 'auto', // auto == .currentStyle.borderLeftWidth
			width   : 'auto', // auto == offsetWidth
			height  : 'auto', // auto == offsetHeight
			opacity : true,
			src     : 'javascript:false;'
		}, s || {});
		var prop = function(n){return n&&n.constructor==Number?n+'px':n;},
		    html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
		               'style="display:block;position:absolute;z-index:-1;'+
			               (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
					       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
					       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
					       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
					       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
					'"/>';
		return this.each(function() {
			if ( $('> iframe.bgiframe', this).length == 0 )
				this.insertBefore( document.createElement(html), this.firstChild );
		});
	}
	return this;
};

})(jQuery);

/*EOF*/

/* add some jQuery 1.2 methods to 1.1.2 */
if (!$.fn.hasClass) {
	$.fn.hasClass = function(cn) {
		return this.is('.' + cn);
	};
}

if (!$.fn.slice) {
	$.fn.slice = function() {
		return this.pushStack( Array.prototype.slice.apply( this, arguments ) );
	};
}

(function() { // only adds the iframe when there are select elements
  var _bgiframe = $.fn.bgiframe;

  $.fn.bgiframe = $.fn.bgIframe = function(opts) {
    if ($('select').length > 0) {
      return _bgiframe.call(this, opts);
    } else {
      return this;
    }
  };

})();

/*EOF*/

/*
    json2.js
    2007-12-02

    Public Domain

    No warranty expressed or implied. Use at your own risk.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods:

        JSON.stringify(value, whitelist)
            value       any JavaScript value, usually an object or array.

            whitelist   an optional array prameter that determines how object
                        values are stringified.

            This method produces a JSON text from a JavaScript value.
            There are three possible ways to stringify an object, depending
            on the optional whitelist parameter.

            If an object has a toJSON method, then the toJSON() method will be
            called. The value returned from the toJSON method will be
            stringified.

            Otherwise, if the optional whitelist parameter is an array, then
            the elements of the array will be used to select members of the
            object for stringification.

            Otherwise, if there is no whitelist parameter, then all of the
            members of the object will be stringified.

            Values that do not have JSON representaions, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays will be replaced with null.
            JSON.stringify(undefined) returns undefined. Dates will be
            stringified as quoted ISO dates.

            Example:

            var text = JSON.stringify(['e', {pluribus: 'unum'}]);

        JSON.parse(text, filter)
            This method parses a JSON text to produce an object or
            array. It can throw a SyntaxError exception.

            The optional filter parameter is a function that can filter and
            transform the results. It receives each of the keys and values, and
            its return value is used instead of the original value. If it
            returns what it received, then structure is not modified. If it
            returns undefined then the member is deleted.

            Example:


            myData = JSON.parse(text, function (key, value) {
                return key.indexOf('date') >= 0 ? new Date(value) : value;
            });

    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    Use your own copy. It is extremely unwise to load third party
    code into your pages.
*/

/*jslint evil: true */

/*global JSON */

/*members "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    charCodeAt, floor, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join, length,
    parse, propertyIsEnumerable, prototype, push, replace, stringify, test,
    toJSON, toString
*/

if (!this.JSON) {

    JSON = function () {

        function f(n) {    // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        Date.prototype.toJSON = function () {


            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };


        var m = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };

        function stringify(value, whitelist) {
            var a,          // The array holding the partial texts.
                i,          // The loop counter.
                k,          // The member key.
                l,          // Length.
                r = /["\\\x00-\x1f\x7f-\x9f]/g,
                v;          // The member value.

            switch (typeof value) {
            case 'string':


                return r.test(value) ?
                    '"' + value.replace(r, function (a) {
                        var c = m[a];
                        if (c) {
                            return c;
                        }
                        c = a.charCodeAt();
                        return '\\u00' + Math.floor(c / 16).toString(16) +
                                                   (c % 16).toString(16);
                    }) + '"' :
                    '"' + value + '"';

            case 'number':


                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                return String(value);

            case 'object':


                if (!value) {
                    return 'null';
                }


                if (typeof value.toJSON === 'function') {
                    return stringify(value.toJSON());
                }
                a = [];
                if (typeof value.length === 'number' &&
                        !(value.propertyIsEnumerable('length'))) {


                    l = value.length;
                    for (i = 0; i < l; i += 1) {
                        a.push(stringify(value[i], whitelist) || 'null');
                    }


                    return '[' + a.join(',') + ']';
                }
                if (whitelist) {


                    l = whitelist.length;
                    for (i = 0; i < l; i += 1) {
                        k = whitelist[i];
                        if (typeof k === 'string') {
                            v = stringify(value[k], whitelist);
                            if (v) {
                                a.push(stringify(k) + ':' + v);
                            }
                        }
                    }
                } else {


                    for (k in value) {
                        if (typeof k === 'string') {
                            v = stringify(value[k], whitelist);
                            if (v) {
                                a.push(stringify(k) + ':' + v);
                            }
                        }
                    }
                }


                return '{' + a.join(',') + '}';
            }
        }

        return {
            stringify: stringify,
            parse: function (text, filter) {
                var j;

                function walk(k, v) {
                    var i, n;
                    if (v && typeof v === 'object') {
                        for (i in v) {
                            if (Object.prototype.hasOwnProperty.apply(v, [i])) {
                                n = walk(i, v[i]);
                                if (n !== undefined) {
                                    v[i] = n;
                                }
                            }
                        }
                    }
                    return filter(k, v);
                }




                if (/^[\],:{}\s]*$/.test(text.replace(/\\./g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(:?[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                    j = eval('(' + text + ')');


                    return typeof filter === 'function' ? walk('', j) : j;
                }


                throw new SyntaxError('parseJSON');
            }
        };
    }();
}


/*EOF*/

/**
 * @module core
 */
if (typeof TF7 === 'undefined') {
  /**
   * Objeto base de la biblioteca TF7.
   * @class TF7
   * @static
   */
  TF7 = {};

  (function(L) {

    /**
     * Calcula el path base para la carga de otros recursos.
     * @method getPath
     * @TODO poco fiable, revisar su uso
     */
    L.getPath = function() {
    	var path = "";
    	$("script")
    		.each(function() {
    			var pos;
    			if ((pos = this.src.search(/js\/tf7(-all)?-(c|j)\.js/)) != -1) {
    				path = this.src.substr(0, pos);
    				return false;
    			}
    		});
    	return path;
    };

    /**
     * Establece los paths base para la carga de cada uno de los tipos de recursos.
     * @method setPaths
     * @TODO poco fiable, revisar su uso
     */

    L.setPaths = function() {
    	var base = L.getPath();
    	L.conf.imgPath = base + "themes/default/img/";
    	L.conf.cssPath = base + "themes/default/css/";
    	L.conf.jsPath = base + "js/";
    };


    /**
     * Devuelve un objeto existente por path o lo crea si no existe.
     * @method namespace
     * @param {String} ns Path (separado por puntos)
     * @param {Object} [base=window] Objeto base para la bÃºsqueda
     * @return {Object}
     */
    L.namespace = function(ns, base) {
    	var i,
    	d = ns.split("."),
    	o = base || window;
    	for (i = 0; i < d.length; i++) {
    		o[d[i]] = o [d[i]] || {};
    		o = o[d[i]];
    	}
    	return o;
    };

    /**
     * Datos globales
     * @property globals
     * @type {Object}
     * @TODO buscar alternativa
     */
    L.globals = {};

    /**
     * Lista de ventanas que deben cerrarse al abandonar la pÃ¡gina.
     * Utilizada por el componente "que es"
     * @property closeOnUnload
     * @for TF7.globals
     * @type {Object}
     */
    L.globals.closeOnUnload = {};

    /**
     * Lista de variables globales que deben ser eliminadas al abandonar la pÃ¡gina
     * @property cleanup
     * @for TF7.globals
     * @type {Array}
     * @TODO deberÃ­a reemplazarse su uso por el de jQuery.data
     */
    L.globals.cleanup = [];


    /**
     * Namespace para widgets
     * @namespace TF7
     * @class widget
     * @TODO unificar TF7.widget y TF7.ui, declarar el namespace en un lugar mÃ¡s apropiado
     */
    L.namespace("widget", L);

  })(TF7);
}

/*EOF*/


(function(L) {

  /**
   * Extiende un constructor a partir de una superclase
   * @method extend
   * @for TF7
   * @param {Function} subc Subclase
   * @param {Function} superc Superclase
   * @param {Object} [methods] MÃ©todos adicionales que se aÃ±adirÃ¡n
   *   al prototipo de la subclase
   * @param {Object} [classMethods] MÃ©todos de clase adicionales
   */
  var extend = L.extend = function(subc, superc, methods, classMethods) {
  	var i, subp,
  	F = function() {},
  	supp = superc.prototype;
  	F.prototype = supp;
  	subp = new F();
  	subc.prototype = subp;
  	subp.constructor = subc;
  	subc.superclass = supp;
  	if (superc !== Object && supp.constructor !== Object.prototype.constructor) {
  		supp.constructor = superc;
  	}
  	if (methods) {
  		for (i in methods) {
  			subp[i] = methods[i];
  		}
  	}
  	if (classMethods) {
  	  merge(subc, classMethods);
  	}
  },

  /**
   * Crea un constructor susceptible de ser llamado sin el operador `new` y derivado
   * de una superclase.
   * @method makeClass
   * @for TF7
   * @param {Function} superc Superclase de la que derivar
   * @param {Object} [methods] MÃ©todos adicionales para el prototipo de la clase derivada
   * @param {Object} [classMethods] MÃ©todos de clase adicionales
   * @return {Function} Nuevo constructor
   */
  makeClass = L.makeClass = function(superc, methods, classMethods) {
    var type = function(args) {
      if (!(this instanceof arguments.callee)) {
        return new arguments.callee(arguments);
      }
      if ('initialize' in this) {
        this.initialize.apply(this, args.callee ? args : arguments);
      }
    };
    extend(type, superc, methods, classMethods);
    return type;
  },

  /**
   * Copia propiedades de un objeto a otro
   * @method merge
   * @for TF7
   * @param {Object} destination Objeto de destino
   * @param {Object} source* Objeto u objetos fuente
   * @return {Object} Objeto con las propiedades combinadas
   */
  merge = L.merge = function(destination, source) {
    var p;
    for (p in source) {
      if (source.hasOwnProperty(p)) {
        destination[p] = source[p];
      }
    }
    if (arguments.length > 2) {
      merge.apply(null, [destination].concat(TF7.Array(arguments, 2)));
    }
    return destination;
  };


})(TF7);

/*EOF*/

(function(L) {

  var ArrayP = Array.prototype,

  $break = {},

  /**
   * Toma un objeto array-like y retorna un array.
   *
   * @method Array
   * @for TF7
   * @param {Array|Arguments|NodeList} arrayLike Objeto a transformar en array
   * @param {Number} [from=0] Ã�ndice del primer elemento a incluir en el array de retorno.
   *   En caso de utilizar un valor negativo, se devuelven elementos desde el final del array
   * @return {Array} Array obtenido a partir del objeto arrayLike. En caso de suministrar
   *   un array, se retornarÃ¡ una copia
   */
  A = L.Array = function(arrayLike, from) {
    from = from || 0;
    return ArrayP.slice.call(arrayLike, from);
  };

  /**
   * Itera sobre cada elemento de un array ejecutando una funciÃ³n de callback.
   * El rango de elementos procesados se determina antes de la primera invocaciÃ³n de la
   * funciÃ³n de callback. Los elementos agregados al array tras la invocaciÃ³n de `each`
   * no se visitan. Los valores suministrados al callback corresponden al valor del elemento
   * en el momento de la visita.
   * @method each
   * @for TF7.Array
   * @param {Array} a Array sobre el que realizar la iteraciÃ³n
   * @param {Function} fn FunciÃ³n de callback. Recibe tres argumentos: el valor del
   *   Ã­tem actual, su Ã­ndice y el objeto sobre el que se itera
   * @param {Object} [context=undefined] Contexto de ejecuciÃ³n para la funciÃ³n de callback
   */
  A.each = ArrayP.forEach ?
    function(a, fn, context) {
      return a.forEach(fn, context);
    } :
    function(a, fn, context) {
      var l = a.length, i;
      fn = TF7.bind(fn, context);
      for (i = 0; i < l; i += 1) {
        if (i in a) { // no se ejecuta el callback para valores undefined
          fn(a[i], i, a);
        }
      }
    };

  /**
   * Itera sobre un array en busca de un valor dado y devuelve su posiciÃ³n.
   * La comparaciÃ³n de valores se realiza mediante identidad.
   * @method indexOf
   * @for TF7.Array
   * @param {Array} a Array en el que buscar
   * @param {Any} search Valor por localizar
   * @param {Number} [fromIndex=0] PosiciÃ³n de inicio de la bÃºsqueda
   * @return {Number} PosiciÃ³n del valor en la lista o `-1` si la lista no lo incluye.
   */
  A.indexOf = ArrayP.indexOf ?
    function(a, search, fromIndex) {
      return a.indexOf(search, fromIndex);
    } :
    function(a, search, fromIndex) {
      var l = a.length,
      i = fromIndex || 0;
      for ( ; i < l; i += 1) {
        if (a[i] === search) {
          return i;
        }
      }
      return -1;
    };


  /**
   * Filtra un array devolviendo una nueva colecciÃ³n que contiene los valores del original
   * para los que la funciÃ³n de callback devuelve `true`.
   * @method filter
   * @for TF7.Array
   * @param {Array} a Array en el que buscar
   * @param {Function} callback MÃ©todo de callback. Recibe como argumentos el valor, el
   *   Ã­ndice y el array original
   * @param {Object} [context=undefined] Contexto de ejecuciÃ³n del mÃ©todo de callback
   * @return {Array} Array con los valores filtrados
   */
  A.filter = ArrayP.filter ?
    function(a, callback, context) {
      return a.filter(callback, context);
    } :
    function(a, callback, context) {
      var i = 0, l = a.length, ret = [], val;
      callback = TF7.bind(callback, context);
      for ( ; i <  l; i += 1) {
        if (i in a) {
          val = a[i];
          if (callback(val, i, a)) {
            ret.push(val);
          }
        }
      }
      return ret;
    };


})(TF7);

/*EOF*/
(function(L) {

  var bind = L.bind = function(fn, context) {
    return function() {
      return fn.apply(context, arguments);
    }
  };


})(TF7);
TF7.jQuery = jQuery;
(function(L) {

  var stack = [],
  $ = L.jQuery;

  L.initialize = L.init = function(context) {
    if (context && typeof context == 'function') {
  		context = document;
  	}
  	context = context || document;
  	L.Array.each(stack, function(fn) {
  	  fn(context);
  	});
  };


  /**
   * AÃ±ade un mÃ©todo a la cola de inicializaciÃ³n de la interfaz.
   * @method onInit
   * @for TF7
   * @param {Function} method
   */
  L.onInit = function(method) {
    stack.push(method);
    return L;
  };


  $(document).ready(L.init);

})(TF7);


/*EOF*/

TF7.UI = {};
(function($) {

	function blurAll() {
		this.blur();
	}

	var locks = 0;
	var last_focused = null;
	var unfocusables = "input, a, textarea, select, button, *[@tabindex]";
  /**
   * Bloquea la interfaz base para el uso de popups modales inline
   */
	TF7.UI.lock = function(opts) {
	  var $background, $unfocusables;
	  opts = opts || {};
	  opts.exclude = opts.exclude || [];

	  if (locks == 0) {
	    last_focused = document.activeElement;
	  }

    $unfocusables = $(unfocusables);
    $unfocusables = $unfocusables.not($(opts.exclude)).not($(opts.exclude).find(unfocusables));
    $unfocusables
			.bind("focus", blurAll);

	  $background = $("#fons-modal");
		if (!$background.length) {
		  $background = $('<div id="fons-modal">').appendTo("body").bgIframe();
		}
		var docSize = getDocumentSize();
		$background
				.css({ height: docSize.y + "px", width: docSize.x + "px" });

		locks += 1;
	};

	/**
   * Elimina el bloqueo de la interfaz
   * Mantiene un contador, de manera que no se desbloquea hasta que
   * se han liberado tantos bloqueos como se han ejecutado
   */
	TF7.UI.unlock = function() {
		if (locks && --locks) return;
		$("#fons-modal").remove();
		$(unfocusables)
			.unbind("focus", blurAll);
		try {
		  last_focused.focus();
		  last_focused = null;
		} catch(e) {
		}
	};

})(jQuery);

/*EOF*/

(function($) {

	var _id = 0;
	var _overlays = {};
	var max_z = 10000;

  /**
   * Creates a dialog overlay
   * @constructor
   */
	TF7.UI.Overlay = function(el, opts) {

		this.init(el, opts);

	};

	TF7.UI.Overlay.prototype = {

		init : function(el, opts) {
			this.config = $.extend({}, TF7.UI.Overlay.__DEFAULTS__, opts || {});


		  var prefix = this.config.overlayClass;
		  var cnames = [prefix];
		  if (this.config.modal) cnames.push(prefix + '-modal');
      cnames.push(prefix + '-modal');
			if (!el) {
				el = $('<div class="'+ cnames.join(' ') +'"><div id="generic" class="'+prefix+'-frame"><p class="titol '+prefix+'-title">'+ this.config.title +'</p><div class="'+prefix+'-body"></div></div></div>').hide().appendTo(document.body)[0];
			}
			if(this.config.closeButton) {
				$('#generic', el).prepend('<a href="#" class="enllac-tancar-popup ' + this.config.closeSelector.substring(1) + '"><span>x</span></a>');
			}

			this.element = el;

			this.element.tabIndex = "-1";
			this.id = TF7.Dom.generateId(el);
			this.active = false;
			this.bind();
			_overlays[this.id] = this;

			if (!this.config.lazyIframeBackground) {
				this.iframize();
			}

			if (this.config.trigger) {
				this.addTrigger(this.config.trigger);
			}

		},
		show : function() {
			if (!this.active) {
				this.active = true;
				this.iframize();
				if (this.config.modal) {
					TF7.UI.lock({ exclude : 'div.' + this.config.overlayClass });
				}
				if (this.config.draggable) {
					$(this.element).simpleDrag(this.config.draggableHandler);
				}
				if (this.config.centerInView) {
          var alignment = this.config.centerInView === true ? 'mc-mc' : { 'x': 'tc-tc', 'y': 'ml-ml'}[this.config.centerInView];
          TF7.positioning.align(this.element, TF7.positioning.getVisibleRegion(), alignment);
				}
				if (this.config.top) {
				  $(this.element).css({top: this.config.top});
				}
				if (this.config.fixPosition) {
					$(this.element).fixPosition();
				}
				if (this.config.url) {
					if (this.ajax) {

					} else {
						if (!this.iframe) {
							this.iframe = $('<iframe height="100%" width="100%" frameborder="0" src="javascript:false;" onload="TF7.UI.Overlay.getWidget(this.parentNode.parentNode.parentNode).setTitle(this.contentWindow.document.title)"/>').appendTo($(this.element).find('div.' + this.config.overlayClass + '-body'))[0];
						}
						this.iframe.src = this.config.url;
					}
				}
				if (this.config.closeSelector) {
					var widget = this;
					$(this.element)
						.find(this.config.closeSelector)
							.bind('click', function(e) {
								widget.destroy();
								return false;
							});
				}
				$(this.element).show();
				this.bringToFront();
			}
		},
		hide : function() {
			if (this.active) {
				this.active = false;
				$(this.element).hide();
			}
			if (this.config.modal) {
				TF7.UI.unlock();
			}
		},
		destroy : function() {
			this.hide();
			this.unbind();
			delete _overlays[this.id];
			$(this.element).remove();
		},
		bind : function() {
		  var that = this;
		  var $react = $(this.element);
		  if (this.config.draggable && this.config.draggableHandler) {
		    $react = $react.add($(this.element).find(this.config.draggableHandler));
		  }
			$react
			  .bind('mousedown', function(e) {
			    that.bringToFront();
			  });
		},
		unbind : function() {
			$(this.element).unbind("mousedown");
			$(this.element).find(this.config.draggableHandler).unbind("mousedown");
		},
		bringToFront : function() {
		  max_z += 1;
      $(this.element).css({ zIndex: max_z });
      if (this.config.focusTo) {
  		  try {
  		    $(this.config.focusTo).focus();
  		  } catch(ex) {
  		  };
      }
  	  else {
  	    try {
  	      this.element.focus();
  	    } catch(ex) {};
  	  }
		},
		addTrigger : function(selector) {
			var widget = this;
			$(selector)
				.bind('click', function() {
					widget[widget.active ? 'hide' : 'show']();
				});
		},
		setTitle : function(t) {
			if (this.config.titleSelector) {
				$(this.element).find(this.config.titleSelector).html(t);
			}
		},
		iframize : function() {
			if (!this.iframized && typeof $.fn.bgIframe == 'function') {
				$(this.element).bgIframe();
			}
			this.iframized = true;
		}

	};


	TF7.UI.Overlay.getWidget = function(id) {
		if (id.nodeType) {
			id = TF7.Dom.generateId(id);
		}
		if (_overlays[id]) {
			return _overlays[id];
		}
	};

	TF7.UI.Overlay.__DEFAULTS__ = {
		modal        : false,
		trigger      : false,
		draggable    : false,
		draggableHandler : '.titol',
		titleSelector : '.titol',
		title : '',
		closeSelector   : '.tancar-popup',
		closeButton: true,
		centerInView : false, // `true`, 'x' o 'y'
		fixPosition  : false,
		overlayClass : 'popup',
		zIndex       : false,
		toTop : true,
		align : 'tc-tc',
		alignElement : document.body,
		url : false,
		ajax : false,
		lazyIframeBackground: true,
		focusTo : null
	};


})(jQuery);

/*EOF*/

/**
 * Funciones de gestiÃ³n del cursor de introducciÃ³n de texto
 *
 * @package TF7.UI
 */
(function($) {

  /**
   * Returns the index position of the caret for the given element
   * @param {DOMNodeElement} The input element (should be focused)
   * @returns {Integer|undefined} The position or undefined if the position cannot be calculated in this browser
   */
  TF7.UI.Caret = {
    getPosition : function (el) {
      if (el.selectionStart !== undefined) { // Gecko
        return el.selectionStart;
      }
      else if (document.selection) { // Internet Explorer
        var range = document.selection.createRange();
        var bookmark = range.getBookmark();
        var caretPos = bookmark.charCodeAt(2) - 2;
        return caretPos;
      }
      else {
        return undefined;
      }
    },

    /**
     * Puts the caret at the given position
     * @param {DOMNodeElement} obj
     * @param {Integer} pos Zero based index
     */
    setTo : function(obj, pos, posEnd) {
      posEnd = posEnd || pos;
      if (obj.createTextRange) {  // Explorer
          var range = obj.createTextRange();
          range.move("character", pos);
          range.select();
      }
      else if(obj.selectionStart !== undefined) { // Gecko
          obj.focus();
          obj.setSelectionRange(pos, pos);
      }
    },

    /**
     * Checks if the caret is at first position, to allow or disallow entering the decimal
     * and the minus symbol. Warning: fakes result for non IE-Gecko browsers
     * See the following sources for caret positioning:
     *   http://parentnode.org/javascript/working-with-the-cursor-position/
     *   http://www.bazon.net/mishoo/articles.epl?art_id=1292
     * @param {DOMElementNode}
     * @returns {Boolean}
     */
    isAtFirst : function(el) {
      var caretPosition = TF7.UI.Caret.getPosition(el);
      return caretPosition !== undefined ? caretPosition === 0 : el.value.length == 0;
    }
  }
})(jQuery);

/*EOF*/

/**
 * TF7.UI.SelectTable - Tabla de selecciÃ³n
 */
(function() {

TF7.UI.SelectTable = function(el, opts) {
	this.init(el, opts);
};

TF7.UI.SelectTable.prototype = {

	init : function(el, opts) {
		var conf = this.config = jQuery.extend({}, TF7.UI.SelectTable.__DEFAULTS__, opts);
		this.element = el;
		var $el = $(this.element);

		if (conf.selectAll && $el.find(conf.selectAllContainerSelector).length) {
			var selectAll = this.selectAll = $(conf.selectAllHtml);
			$el
				.find(conf.selectAllContainerSelector)
					.append(selectAll);

			selectAll.bind('click', bindAsEventListener(_selectAll_click, this));
		}

		if (conf.fullClickableRow) {
			function rem() {
				return false;
			}

			$el
				.find('tbody')
					.bind("click", bindAsEventListener(function(e) {
						if ($(e.target).filter(conf.excludeTargetSelector).length) return;
						var input = $(e.target).parents('tr').find('input[@type=checkbox], input[@type=radio]');
						if (input.length) {
							this.setChecked(input[0], !input[0].checked);
							input
								.bind('click', rem)
								.trigger('click')
								.unbind('click', rem);
						}
					}, this))
		}

		$el
			.find('tbody')
				.bind('click', bindAsEventListener(function(e) {
					if ($(e.target).filter('input[@type=radio], input[@type=checkbox]').length) {
						this.setChecked(e.target, e.target.checked);
					}
				}, this));

	}
	,
	setAllChecked : function(checked) {
		var widget  = this;
		$(this.element)
			.find('tbody input[@type=checkbox]')
				.each(function() {
					widget.setChecked(this, checked, true);
				});
	}
	,
	setChecked : function(el, checked, stopUpdate) {

		if (el.getAttribute('type') == 'radio' && el.checked) {
			return;
		}

		if (el.disabled) {
		  return;
		}

		$(el)
			.attr('checked', checked);
		if (this.config.activeClass) {
			if (el.type == 'radio') {
				$(this.element)
					.find('tbody tr')
						.removeClass(this.config.activeClass);
			}
			$(el).parents('tr')[checked ? 'addClass' : 'removeClass'](this.config.activeClass);
		}
		if (this.selectAll && !stopUpdate) {
			var checks = $(this.element).find('tbody input[@type=checkbox]');
			var checked1 = checks.filter('[@checked]');
			if (checked1.length == checks.length) {
				this.selectAll.attr('checked', 'checked');
			} else {
				this.selectAll.removeAttr('checked');
			}
		}
	}

};

TF7.UI.SelectTable.__DEFAULTS__ = {
	'selectAll' : true,
	'selectAllContainerSelector' : 'th.select-all',
	'selectAllHtml' : '<input type="checkbox" />',
	'hoverClass': 'over',
	'activeClass': 'active',
	'fullClickableRow': true,
	'excludeTargetSelector': 'a, input, span.accio, button, label, span.trigger'
};


function _selectAll_click(e) {
	this.setAllChecked(this.selectAll[0].checked);
}


function bindAsEventListener(fn, o) {
	var _m = fn;
	var args = [].slice.call(arguments, 1);
	var obj = args.shift();
	return function() {
		return _m.apply(obj, [].concat([].slice.call(arguments, 0)).concat(args).concat(this));
	};
}


})();

/*EOF*/

/**** TF7 CONF ****/

TF7.conf = {

	errorClassName: "error",
	tf7namespace: "http://tf7.lacaixa.es/",

	decSymbol: ",",

	thousSymbol: ".",

	dateFormat: "dmy",

	dateSplitter: "-", // al mostrar campos

	dateSplitterSystem : "/",

	dateSplitterRegexp: "[\\.|\\-|\/|\\s+]",

	lang: "es",

	jsPath : "/js/",
	cssPath : "/themes/default/css/",
	imgPath : "/themes/default/img/",

	helpPopupWidth : 500,
	helpPopupHeight: 400,

	errorPopupWidth : 500,
	errorPopupHeight: 400,


	hoverDelayOver: 200,
	hoverDelayOut: 450,

	accordionSpeed: {
		show: "slow",
		hide: "fast"
	},

	ajaxLoaderTimeout: 15000,

	ajaxLoaderHTML: '<div class="carregant"><p>%s</p></div>',

	ajaxLoaderError: '<div class="error-carrega"><p class="avis">%s</p><p><a href="%s">%s<\/a><\/p><\/div>',
	ajaxLoaderNotFound: '<div class="error-carrega"><p class="avis">%s</p><\/div>',
	ajaxLoaderLogin: '<div class="error-carrega"><p class="avis">%s</p><\/div>',

	modalPopupWrapper: '<div class="popup-modal"><\/div>',

	treeviewSpeed : null,

	useReplaceInAuthForm : false,

	guion_img : {
		information: "icono-guion-informacion.png",
		question: "icono-guion-pregunta.png",
		action: "icono-guion-respuesta.png"
	},

	c2cDialog : '<div class="caixa-dialeg-c2c"><div class="dialeg-c2c">\
		<h1>%s</h1>\
		<div class="dialeg-c2c-content">\
		<ol class="passos">\
			<li class="executat">%s</li>\
		</ol>\
		</div>\
		<form method="get">\
		<p class="botons">\
			<input class="boto" type="button" value="%s" name="cerrar" id="c2c-close" />\
			<a class="button" href="%s" />%s</a>\
		</p>\
		</form>\
	</div>\
	<div class="se"></div>\
	<div class="sd"></div>\
	<div class="ie"></div>\
	<div class="id"></div>\
	<div class="pin"></div>\
	</div>',

	c2cConfigUrl : 'http://configure.c2c/index.jsp?qs=test',

	c2cTimeout : 3000,

	feedbackSpeed : 500,

	filterStatusParam : '__filter_status',

  miniappsSplitter: '::'

};


/*EOF*/


TF7.l10n = {};

TF7.i18n = {};
(function(L) {

var id_count = 0,
dom = L.namespace('Dom', L);


dom.importNodeFiltered = function(n, depth, filter) {
	if (!n) return document.createTextNode("");
	if (typeof filter != "function")
		filter = function() { return true; };
	var nnode;
	if (n.nodeType == 1) {
		if (filter(n.nodeName)) {
			nnode = document.createElement(n.nodeName);
			var it = n.attributes;
			if (it && it.length) {
				for (var i = 0, c = it.length; i < c; i++) {
					if (filter(n.nodeName, it[i].nodeName, n.getAttribute(it[i].nodeName)))
						nnode.setAttribute(it[i].nodeName, n.getAttribute(it[i].nodeName));
				}
			}
		}
		if (depth && n.childNodes.length) {
			if (!nnode) nnode = document.createElement("span");
			it = n.childNodes;
			for (i = 0, c = it.length; i < c; i++) {
				nnode.appendChild(TF7.Dom.importNodeFiltered(it[i], depth, filter));
			}
		}
		return nnode || document.createTextNode("");
	} else {
		return document.createTextNode(n.nodeValue);
	}

};

/**
 * Devuelve el id del elemento si lo tiene o le asigna un identificador Ãºnico y lo retorna
 */
dom.generateId = function(el, prefix) {
	prefix = prefix || 'tf7-id-';
	if (el && el.id) {
		return el.id;
	}
	var id = prefix + id_count++;
	if (el) {
		el.id = id;
	}
	return id;
};



/**
 * Devuelve el name del elemento si lo tiene o le asigna un nombre Ãºnico y lo retorna
 * Si el elemento no tiene nombre, lo marca como unsuccessfull
 */
dom.assignName = function(el) {
	if (el.name)
		return el.name;
	var name = "tf7-name-" + id_count++;
	if (!el.name) {
		el.setAttribute("name", name);
		el.name = name;
		el._unsuccessful = true; // will be always unsuccessful
	}
	return name;
};

})(TF7);

/*EOF*/

(function(L) {

  var positioning = L.namespace('positioning', L);

  L.merge(positioning, {

    getViewportSize : function() {
    	var height = self.innerHeight; // Safari, Opera
    	var width = self.innerWidth;
      var mode = document.compatMode;
      if ( (mode || $.browser.msie) && !window.opera ) { // IE, Gecko
          height = (mode == 'CSS1Compat') ?
                  document.documentElement.clientHeight : // Standards
                  document.body.clientHeight; // Quirks
          width = (mode == 'CSS1Compat') ?
                  document.documentElement.clientWidth : // Standards
                  document.body.clientWidth; // Quirks
      }
      return { w: width, h: height, x: width, y: height };
    },

    getXY : function(el) {
    	var curleft = 0;
    	var curtop = 0;
    	var obj = el;
    	var clone;
    	if ($(el).is(':hidden')) {
    		clone = el.cloneNode(true);
    		$(clone).css('visibility', 'hidden').css('display', 'block');
    		el.parentNode.insertBefore(clone, el);
    		obj = clone;
    	}
    	if (obj.offsetParent)
    	{
    		while (obj.offsetParent)
    		{
    			curleft += obj.offsetLeft;
    			curtop += obj.offsetTop;
    			obj = obj.offsetParent;
    		}
    	}
    	if (clone)
    		clone.parentNode.removeChild(clone);
    	return { x: curleft, y: curtop };

    },

    setXY : function(el, x, y) {

    	var $el = $(el);

    	var position = $el.css('position');
    	if (position == 'static') {
    		$el.css('position', 'relative');
    		position = 'relative';
    	}

    	var pageXY = TF7.positioning.getXY(el);


    	var delta = [
    		parseInt($el.css('left'), 10) || getOffset(el)[0],
    		parseInt($el.css('top'), 10) || getOffset(el)[1]
    	];


    	var offset = getOffset(el);

    	if (isNaN(delta[0]))
    		delta[0] = position == 'relative' ? 0 : offset[0];

    	if (isNaN(delta[1]))
    		delta[1] = position == 'relative' ? 0 : offset[1];

    	if (x != null)
    		el.style.left = x - pageXY.x + delta[0] + 'px';

    	if (y != null)
    		el.style.top = y - pageXY.y + delta[1] + 'px';

    	function getOffset(el) {
    		var obj = el;
    		var clone;
    		if (!$(el).is(':visible')) {
    			clone = el.cloneNode('true');
    			el.parentNode.insertBefore(clone, el);
    			$(clone).css({visibility: 'hidden', display: 'block', position: 'absolute'});
    			obj = clone;
    		}
    		var ret = [ obj.offsetLeft, obj.offsetTop ];
    		if (clone)
    			clone.parentNode.removeChild(clone);
    		return ret;
    	}

    },

    getScrollingPosition : function() {
    	var x = 0, y = 0;
    	if (typeof window.pageXOffset != "undefined") {
    		x = window.pageXOffset;
    		y = window.pageYOffset;
    	} else if (typeof document.documentElement.scrollTop != "undefined" && document.documentElement.scrollTop > 0) {
    		x = document.documentElement.scrollLeft;
    		y = document.documentElement.scrollTop;
    	} else if (typeof document.body.scrollTop != "undefined") {
    		x = document.body.scrollLeft;
    		y = document.body.scrollTop;
    	}
    	return { x: x, y: y, l: x, t: y };
    },

    getVisibleRegion : function() {
    	var scroll = TF7.positioning.getScrollingPosition();
    	var vp     = TF7.positioning.getViewportSize();
    	return new TF7.positioning.Region(scroll.t, scroll.l + vp.w, scroll.t + vp.h, scroll.l);
    },

    align : function(el, ref, alignment, padding, offset) {
    	var context;

    	if (ref.constructor == Array) {
    		context = new TF7.positioning.Region(ref[0], ref[1], ref[0], ref[1]);
    	}
    	else if (ref.constructor == TF7.positioning.Region) {
    		context = ref;
    	}
    	else {
    		context = TF7.positioning.getRegion(ref);
    	}

    	var visible = TF7.positioning.getVisibleRegion();

    	if (padding)
    		visible.shorten(padding);

    	if (offset === undefined)
    		offset = [0, 0];

    	var trythese = alignment ? alignment : ['br-tl'];
    	if (typeof trythese == 'string')
    		trythese = alignment.split(',');


    	var ncoords, done;

    /*
    	for (var i = 0; i < trythese.length; ++i) {
    		var ncoords = getNewCoords(trythese[i]);
    		console.log('coords ', trythese[i], ncoords);
    		done = testPosition(ncoords);
    		if (done)
    			break;
    	}

    	if (!done)
    		ncoords = getNewCoords(trythese[0]);
    */

    	var ncoords = getBestPosition();

    	TF7.positioning.setXY(el, ncoords[1], ncoords[0]);


    	function getBestPosition() {
    		var aareas = [];
    		var acoords = [];
    		var coords, nregion;
    		for (var i = 0; i < trythese.length; ++i) {

    			coords = getNewCoords(trythese[i], offset[0].constructor == Array ? offset[i] : offset);
    			nregion = getCheckRegion(coords);
    			if (visible.contains(nregion)) {
    				firstSuccess = coords;
    				return coords;
    			}
    			if (visible.intersection(nregion)) {
    				acoords.push(coords);
    				aareas.push(visible.intersection(nregion).getArea());
    			}
    		}
    		var max = 0;
    		for (i = 0; i < aareas.length; i++) {
    			if (i > 0 && aareas[i] > aareas[i-1]) {
    				max = i;
    			}
    		}

    		return acoords[max];
    	};



    	function getNewCoords(al, offset) {

    		al = al.split('-');

    		var baseAnchor = al[0];
    		var coordAnchor = al[1];
    		var coords = {x:0, y:0};
    		var w, h;

    		w = $(el).width();
    		h = $(el).height();


    		if (baseAnchor.indexOf('b') != -1) {
    			coords.y = context.b;
    		}
    		else if (baseAnchor.indexOf('m') != -1) {
    			coords.y = parseInt((context.b + context.t) / 2, 10);
    		}
    		else {
    			coords.y = context.t;
    		}

    		if (baseAnchor.indexOf('l') != -1) {
    			coords.x = context.l;
    		}
    		else if (baseAnchor.indexOf('c') != -1) {
    			coords.x = parseInt((context.r + context.l) / 2, 10);
    		}
    		else {
    			coords.x = context.r;
    		}

    		if (coordAnchor.indexOf('b') != -1) {
    			coords.y -= h + offset[1];
    		}
    		else if (coordAnchor.indexOf('m') != -1) {
    			coords.y -= parseInt(h / 2, 10) + offset[1];
    		}
    		else {
    			coords.y += offset[1];
    		}

    		if (coordAnchor.indexOf('r') != -1) {
    			coords.x -= w + offset[0];
    		}
    		else if (coordAnchor.indexOf('c') != -1) {
    			coords.x -= parseInt(w / 2, 10) + offset[0];
    		}
    		else {
    			coords.x += offset[0];
    		}
    		return [ coords.y, coords.x];
    	}

    	function testPosition(coords) {
    		var t = coords[0];
    		var l = coords[1];
    		var w = $(el).width();
    		var h = $(el).height();
    		var nregion = new TF7.positioning.Region(t, l + w, t + h, l);
    		return visible.contains(nregion);
    	}

    	function getCheckRegion(coords) {
    		var t = coords[0];
    		var l = coords[1];
    		var w = $(el).width();
    		var h = $(el).height();
    		var nregion = new TF7.positioning.Region(t, l + w, t + h, l);
    		return nregion;
    	}
    },
    getRegion : function(el) {
    	var pos = TF7.positioning.getXY(el);
    	var w = $(el).width();
    	var h = $(el).height();
    	return new TF7.positioning.Region(pos.y, pos.x + w, pos.y + h, pos.x);
    }

  });


  positioning.Region = function(t, r, b, l) {
  	this.t = t;
  	this.r = r;
  	this.b = b;
  	this.l = l;
  };

  L.merge(positioning.Region.prototype, {
    contains : function(region) {
    	return (
    		region.l >= this.l &&
    		region.r <= this.r &&
    		region.b <= this.b &&
    		region.t >= this.t
    	);
    },
    intersection : function(region) {
    	var t = Math.max(this.t, region.t);
    	var l = Math.max(this.l, region.l);
    	var b = Math.min(this.b, region.b);
    	var r = Math.min(this.r, region.r);

    	if ( b >= t && r >= l)
    		return new TF7.positioning.Region(t, r, b, l);
    	else
    		return null;
    },
    getArea : function() {
    	return (this.b - this.t) * (this.r - this.l);
    },
    shorten : function(t, r, b, l) {
    	r = b = l = t;

    	if (l === undefined)
    		l = r !== undefined ? r : t;
    	if (b === undefined)
    		b = t;
    	if (r === undefined)
    		r = t;

    	this.t += t;
    	this.r -= r;
    	this.b -= b;
    	this.l += l;
    }
  });

})(TF7);

/*EOF*/

TF7.ajaxCallbacks = {};

TF7.ajaxCallbacks.guio = function(xml, holder) {
		var title = $("recipe > title", xml).text();
		var steps = [], items = [];
		var step, item, content;
		$("step", xml).each(function(){
			step = {};
			items = [];
			step.title = $("title", this).text();
			$("item", this).each(function() {
				item = {};
				content = [];
				item.role = $(this).attr("role");
				$(this.childNodes).each(function() {
					var importedNode = 	TF7.Dom.importNodeFiltered(
						this,
						true,
						function(name, attr, value) {
							var whitelist = {
								"p": true,
								"dl": true,
								"a": true,
								"ul": true,
								"li": true,
								"dl": true,
								"dt": true,
								"dd": true,
								"br": true
							};
							if (!attr)
								return whitelist[name] || false;
							var attrwhitelist = {
								"a": { "href": true }
							};
							return attrwhitelist[name] && attrwhitelist[name][attr] || false;
						}
					);
					if (importedNode) {
						content.push(importedNode);
					}
				});
				item.content = content;
				items.push(item);
			});
			step.items = items;
			steps.push(step);
		});
		$(holder).empty();
		holder.appendChild(recipe2Html(title, steps));
		$(holder).trigger("tf7ContentLoaded", ["success"]);

		function recipe2Html (title, steps, tags) {
			var d = document;
      var cont = d.createElement("div");
			var tit = d.createElement("h3");
			tit.className = "content-title super-emphasized";
			tit.appendChild(d.createTextNode(title));
			cont.appendChild(tit);
			if (steps.length) {
				var ol = d.createElement("ol");
				ol.className = "guio";
				var clonable = d.createElement("li");
				var li;
				cont.appendChild(ol);
				for (var i = 0, c = steps.length; i < c; i++) {
					var step = steps[i];
					li = clonable.cloneNode(false);
					ol.appendChild(li);
					li.appendChild(d.createTextNode(step.title));
					if (step.items && step.items.length) {
						var dl = d.createElement("dl");
						li.appendChild(dl);
						var dd, dt;
						for (var j = 0, l = step.items.length; j < l; j++) {
							var item = step.items[j];
							var role = item.role;
							dt = d.createElement("dt");
							dt.className = role;
							dd = d.createElement("dd");
							var img = d.createElement("img");
							img.alt = TF7.l10n["guion_alt" + role.substring(0, 1).toUpperCase() + role.substring(1)] || "";
							img.src = TF7.conf.imgPath + TF7.conf.guion_img[role];
							dt.appendChild(img);
							dl.appendChild(dt);
							if (item.content && item.content.length)
								for (var k = 0; k < item.content.length; k++)
									dd.appendChild(item.content[k]);
							dl.appendChild(dd);
						}
					}
				}
			}
			return cont;
		}
};
Function.prototype.bindAsEventListener = function(o) {
	var _m = this;
	var args = [].slice.call(arguments, 0);
	var obj = args.shift();
	return function(e) {
		return _m.apply(obj, [e, this].concat(args));
	}
};

/*EOF*/

/**
 * Pads a string to a desired length with custom chars
 *
 * @param len {Number} Desired output length
 * @param [str] {String} String used for padding, defaults to " " (space)
 * @param [side] {String} Pad on left side, right side or both. Acceptable values: "left", "right", "both". Defaults to "left"
 * @return {String}
 */
String.prototype.pad = function(len, str, side) {
	var s = len - this.length;
	if (s <= 0) return this;
	if (str === null) str = " ";
	var slen = str.length;
	var p = "";
	while (slen <= s) {
		s -= slen;
		p += str;
	}
	p += str.substring(0, s);
	var mid = Math.floor(p.length / 2);
	switch (side) {
		case "right":
			return this + p;
		case "both":
			return p.substr(0, mid)+this+p.substr(mid);
		default:
			return p + this;
	}
};

/*EOF*/

/**
 * Unformats a formatted number
 * @param {String} [decSymbol] Decimal separator. Defaults to TF7.conf.decSymbol
 * @param {String} [thousSymbol] Thousands separator. Defaults to TF7.conf.thousSymbol
 * @return {String}
 */
String.prototype.unformat = function(decSymbol, thousSymbol) {
	var ret = this;
	decSymbol = decSymbol === undefined ? TF7.conf.decSymbol : decSymbol;
	thousSymbol = thousSymbol === undefined ? TF7.conf.thousSymbol : thousSymbol;
	var re = thousSymbol == "." ? (/\./g) : new RegExp(thousSymbol, "g");
	return out = ret.replace(re, "").replace(decSymbol, ".");
};

/**
 * Returns a translated string, taken form the TF7.l10n object. If there is not an
 * available translation, returns the original string
 * @return {String}
 */
String.prototype.translate = function() {
	if (TF7.l10n && TF7.l10n[this]) {
		return TF7.l10n[this];
	}
	return this.toString();
};

String.prototype.t = function(o) {
	var s = this;
	for (var i in o) {
		s = s.replace(i, o[i]);
	}
	return s;
};


/**
 * Formats a number
 * @param {Object} decs
 * @param {Object} decSymbol
 * @param {Object} thousSymbol
 * @return {String}
 */
Number.prototype.format = function(decs, decSymbol, thousSymbol) {
	var out = "", n;
	decSymbol = (decSymbol === undefined) ? TF7.conf.decSymbol : decSymbol;
	thousSymbol = (thousSymbol === undefined) ? TF7.conf.thousSymbol : thousSymbol;
	n = String(decs != null ? this.toFixed(decs) : this);
	var minus = (n.substr(0, 1) == "-") ? true : false;
	n = (minus) ? n.substr(1) : n;
	n = n.replace(".", decSymbol);
	var parts = n.split(decSymbol);
	n = parts[0];
	for (var i = n.length; i > 3; i = i - 3) {
		out = thousSymbol + n.substr(i - 3, 3) + out;
		n = n.substr(0, i - 3);
	}
	if (n) {
		out = n + out;
	}
	if (parts[1]) {
		out = out + decSymbol + parts[1];
	}
	if (minus) {
		out = "-" + out;
	}
	return out;
};

if (!Array.prototype.map) {
	Array.prototype.map = function(fn, subj) {
		var l = this.length;
		var r = new Array(l);
		for (var i = 0; i < l; i++) {
			if (i in this) {
				r[i] = fn.call(subj, this[i], i, this);
			}
		}
		return r;
	};
}

/*EOF*/

/* Copyright (c) 2005 Scott S. McCoy
 * This was originally a non-object oriented interface
* Function printf(format_string,arguments...)
 * Javascript emulation of the C printf function (modifiers and argument types
 *    "p" and "n" are not supported due to language restrictions)
 *
 * Copyright 2003 K&L Productions. All rights reserved
 * http://www.klproductions.com
 *
 * Terms of use: This function can be used free of charge IF this header is not
 *               modified and remains with the function code.
 *
 * Legal: Use this code at your own risk. K&L Productions assumes NO resposibility
 *        for anything.
 ********************************************************************************/

String.prototype.sprintf = function () {
  var fstring = this.toString();

  var pad = function(str,ch,len) { var ps='';
      for(var i=0; i<Math.abs(len); i++) {
		  ps+=ch;
	  }
      return len>0?str+ps:ps+str;
  };
  var processFlags = function(flags,width,rs,arg) {
      var pn = function(flags,arg,rs) {
          if(arg>=0) {
              if(flags.indexOf(' ')>=0) {
				  rs = ' ' + rs;
			  } else if(flags.indexOf('+')>=0) {
				  rs = '+' + rs;
			  }
          } else {
              rs = '-' + rs;
		  }
          return rs;
      };
      var iWidth = parseInt(width,10);
      if(width.charAt(0) == '0') {
          var ec=0;
          if(flags.indexOf(' ')>=0 || flags.indexOf('+')>=0) {
			  ec++;
		  }
          if(rs.length<(iWidth-ec)) {
			  rs = pad(rs,'0',rs.length-(iWidth-ec));
		  }
          return pn(flags,arg,rs);
      }
      rs = pn(flags,arg,rs);
      if(rs.length<iWidth) {
          if(flags.indexOf('-')<0) {
			  rs = pad(rs,' ',rs.length-iWidth);
		  } else {
			  rs = pad(rs,' ',iWidth - rs.length);
		  }
      }
      return rs;
  };
  var converters = [];
  converters.c = function(flags,width,precision,arg) {
      if (typeof(arg) == 'number') {
		  return String.fromCharCode(arg);
	  } else if (typeof(arg) == 'string') {
		  return arg.charAt(0);
	  } else {
		  return '';
	  }
  };
  converters.d = function(flags,width,precision,arg) {
      return converters.i(flags,width,precision,arg);
  };
  converters.u = function(flags,width,precision,arg) {
      return converters.i(flags,width,precision,Math.abs(arg));
  };
  converters.i =  function(flags,width,precision,arg) {
      var iPrecision=parseInt(precision, 10);
      var rs = ((Math.abs(arg)).toString().split('.'))[0];
      if(rs.length<iPrecision) {
		  rs=pad(rs,' ',iPrecision - rs.length);
	  }
      return processFlags(flags,width,rs,arg);
  };
  converters.E = function(flags,width,precision,arg) {
      return (converters.e(flags,width,precision,arg)).toUpperCase();
  };
  converters.e = function(flags,width,precision,arg) {
      iPrecision = parseInt(precision, 10);
      if(isNaN(iPrecision)) {
		  iPrecision = 6;
	  }
      rs = (Math.abs(arg)).toExponential(iPrecision);
      if(rs.indexOf('.')<0 && flags.indexOf('#')>=0) {
		  rs = rs.replace(/^(.*)(e.*)$/,'$1.$2');
	  }
      return processFlags(flags,width,rs,arg);
  };
  converters.f = function(flags,width,precision,arg) {
      iPrecision = parseInt(precision, 10);
      if(isNaN(iPrecision)) {
		  iPrecision = 6;
	  }
      rs = (Math.abs(arg)).toFixed(iPrecision);
      if(rs.indexOf('.')<0 && flags.indexOf('#')>=0) {
		  rs = rs + '.';
	  }
      return processFlags(flags,width,rs,arg);
  };
  converters.G = function(flags,width,precision,arg) {
      return (converters.g(flags,width,precision,arg)).toUpperCase();
  };
  converters.g = function(flags,width,precision,arg) {
      iPrecision = parseInt(precision, 10);
      absArg = Math.abs(arg);
      rse = absArg.toExponential();
      rsf = absArg.toFixed(6);
      if(!isNaN(iPrecision)) {
          rsep = absArg.toExponential(iPrecision);
          rse = rsep.length < rse.length ? rsep : rse;
          rsfp = absArg.toFixed(iPrecision);
          rsf = rsfp.length < rsf.length ? rsfp : rsf;
      }
      if(rse.indexOf('.')<0 && flags.indexOf('#')>=0) {
		  rse = rse.replace(/^(.*)(e.*)$/,'$1.$2');
	  }
      if(rsf.indexOf('.')<0 && flags.indexOf('#')>=0) {
		  rsf = rsf + '.';
	  }
      rs = rse.length<rsf.length ? rse : rsf;
      return processFlags(flags,width,rs,arg);
  };
  converters.o = function(flags,width,precision,arg) {
      var iPrecision=parseInt(precision, 10);
      var rs = Math.round(Math.abs(arg)).toString(8);
      if(rs.length<iPrecision) {
		  rs=pad(rs,' ',iPrecision - rs.length);
	  }
      if(flags.indexOf('#')>=0) {
		  rs='0'+rs;
	  }
      return processFlags(flags,width,rs,arg);
  };
  converters.X = function(flags,width,precision,arg) {
      return (converters.x(flags,width,precision,arg)).toUpperCase();
  };
  converters.x = function(flags,width,precision,arg) {
      var iPrecision=parseInt(precision, 10);
      arg = Math.abs(arg);
      var rs = Math.round(arg).toString(16);
      if(rs.length<iPrecision) {
		  rs=pad(rs,' ',iPrecision - rs.length);
	  }
      if(flags.indexOf('#')>=0) {
		  rs='0x'+rs;
	  }
      return processFlags(flags,width,rs,arg);
  };
  converters.s = function(flags,width,precision,arg) {
      var iPrecision=parseInt(precision, 10);
      var rs = arg;
      if(rs.length > iPrecision) {
		  rs = rs.substring(0,iPrecision);
	  }
      return processFlags(flags,width,rs,0);
  };

  farr = fstring.split('%');
  retstr = farr[0];
  fpRE = /^([-+ #]*)(?:(\d*)\$|)(\d*)\.?(\d*)([cdieEfFgGosuxX])(.*)$/;
  for(var i = 1; i<farr.length; i++) {
      fps=fpRE.exec(farr[i]);
      if(!fps) {
		  continue;
	  }
	  var my_i = fps[2] ? fps[2] : i;
      if(arguments[my_i-1]) {
          retstr+=converters[fps[5]](fps[1],fps[3],fps[4],arguments[my_i-1]);
      }
      retstr += fps[6];
  }
  return retstr;
};

/*EOF*/


(function(L) {

  function createCookie(name,value,secs) {
  	if (secs) {
  		var date = new Date();
  		date.setTime(date.getTime()+(secs*1000));
  		var expires = "; expires="+date.toGMTString();
  	}
  	else var expires = "";
  	document.cookie = name+"="+value+expires+"; path=/";
  }

  function readCookie(name) {
  	var nameEQ = name + "=";
  	var ca = document.cookie.split(';');
  	for(var i=0;i < ca.length;i++) {
  		var c = ca[i];
  		while (c.charAt(0)==' ') c = c.substring(1,c.length);
  		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  	}
  	return null;
  }

  function eraseCookie(name) {
  	createCookie(name,"",-1);
  }

  L.cookie = {
    set : createCookie,
    get : readCookie,
    remove : eraseCookie
  };

})(TF7);

/*EOF*/

$.fn.hoverClass = function(cname) {
	return this.hover(
		function() { $(this).addClass(cname); },
		function() { $(this).removeClass(cname); }
	);
};

/*EOF*/

(function($) {
	$.extend($.fn, {
		mouseenter : function(f) {
			return $.browser.msie ?	this.bind("mouseenter", f) : this.hover(f, function() {});
		},

		mouseleave : function(f) {
			return $.browser.msie ? this.bind("mouseleave", f) : this.hover(function() {}, f);
		}
	});

	if ($.browser.msie) {
		$.extend($.fn, {
			hover : function(f, g) {
				return this.bind("mouseenter", f).bind("mouseleave", g);
			}
		});
	}
})(jQuery);


/*EOF*/

$.fn.addValidator = function(f, params) {
	return this.each(function(){
		if (!this._validators) this._validators = [];
		this._validators.push([f, params]);
	});
};

$.fn.beforeValidation = function(f) {
	return this.bind("beforeValidation", f);
};

$.fn.afterValidation = function(f) {
	return this.bind("afterValidation", f);
};

/*EOF*/

$.fn.accordion = function(o) {
	o = o || {};
	o.trigger = o.trigger || "h3";
	o.section = o.section || "div.seccio-persiana";
	o.className = o.className || "seleccionat";
	return this.each(function() {
		var p = this;
		$(this)
			.find(o.trigger)
				.click(function(e) {
					var t = e.target;
					var section = $(this).find("+ " + o.section);
					if (section.is(":visible")) return;
					$(p)
						.find(o.trigger)
							.removeClass(o.className)
						.end()
						.find(o.section)
							.filter(":visible")
							.slideUp((TF7 && TF7.conf && TF7.conf.accordionSpeed && TF7.conf.accordionSpeed.hide) || "fast");
					$(this).addClass(o.className);
					section.slideDown((TF7 && TF7.conf && TF7.conf.accordionSpeed && TF7.conf.accordionSpeed.show) || "slow");
				});
	});
};


/*EOF*/

/*
 * Plugin para jQuery
 * Envuelve el elemento seleccionado
 * en los contenedores (cadena XML) proporcionados
 */
$.fn.wrapInn = function(s) {
	return this.each(function(i) {
		var d = document.createElement('div');
		d.innerHTML = s;
		var ds = d.getElementsByTagName('*');
		if (ds.length === 0) ds = d.all; /* IE 5.x */
		var inn = this.innerHTML;
		ds[ds.length - 1].innerHTML = inn;
		this.innerHTML = d.innerHTML;
	});
};

function getDocumentSize() {
	if (window.innerHeight && window.scrollMaxY)
	{
		yScroll = window.innerHeight + window.scrollMaxY;
		xScroll = window.innerWidth + window.scrollMaxX;
	}
	else if (document.body.scrollHeight > document.body.offsetHeight)
	{
		yScroll = document.body.scrollHeight; // all but Explorer Mac
		xScroll = document.body.scrollWidth;
	}
	else
	{
		yScroll = document.body.offsetHeight; // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
	}
	return { x: xScroll, y: yScroll };
}

function findPos(obj) { // modded from http://www.quirksmode.org/js/findpos.html
	var curleft = 0;
	var curtop = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
			obj = obj.offsetParent;
		}
	}
	return { x: curleft, y: curtop };
}

$.fn.findPos = function() {
  return findPos(this.get(0));
};

$.fn.fixPosition = function() {
	return this.each(function() {
		var el = this;

		var _oldScroll = TF7.positioning.getScrollingPosition();


		$(window).bind('scroll', function() {
			var nScroll = TF7.positioning.getScrollingPosition();
			var pos = TF7.positioning.getXY(el);
			var ydiff = nScroll.y - _oldScroll.y;
			var xdiff = nScroll.x - _oldScroll.x;
			TF7.positioning.setXY(el, pos.x + xdiff, pos.y + ydiff);
			_oldScroll = TF7.positioning.getScrollingPosition();
		});

	});
};


function findMousePos(e) { // modded from http://www.quirksmode.org/js/events_properties.html#position
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY)		{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY)	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
	return { x: posx, y : posy };
}

function getViewportSize() {
	var size = { x: 0, y: 0 };
	if (typeof window.innerWidth != "undefined") {
		size = { x: window.innerWidth, y: window.innerHeight };
	} else if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != "undefined" && document.documentElement.clientWidth != 0) {
		size =	{ x: document.documentElement.clientWidth, y: document.documentElement.clientHeight };
	} else {
		size =	{ x: document.body.clientWidth, y: document.body.clientHeight };
	}
	return size;
}

function getScrollingPosition() {
	var pos = { x: 0, y: 0 };
	if (typeof window.pageXOffset != "undefined") {
		pos =  { x: window.pageXOffset, y: window.pageYOffset };
	} else if (typeof document.documentElement.scrollTop != "undefined" && document.documentElement.scrollTop > 0){
		pos = { x: document.documentElement.scrollLeft, y: document.documentElement.scrollTop };
	} else if (typeof document.body.scrollTop != "undefined") {
		pos = { x: document.body.scrollLeft, y: document.body.scrollTop };
	}
	return pos;
}


/*EOF*/

/* popup modal */
/* popupModal */


(function($) {
	$.extend($.fn, {
		tf7tabs: function() {
			var $panel = $(this);
			$panel
				.find("ul.pestanyes li")
					.not(".deshabilitat")
						.click(function() {
							if ($.className.has(this, "seleccionat")) {
								return false;
							}
							$(this).siblings().removeClass("seleccionat").end().addClass("seleccionat");
							$(this.parentNode.parentNode).find("div.fitxa").removeClass("seleccionat");
							var link = this.getElementsByTagName("a")[0];
							var href = link.href.substr(link.href.indexOf("#"));
							if ($.className.has(link, "carrega-dinamica")) {
								href = link.getAttribute("tf7target");
							}
							$(href).addClass("seleccionat");
							return false;
						})
					.end()
					.filter(".deshabilitat")
						.find("a") // el enlace en una pestaÃ±a deshabilitada no debe ser clicable
							.click(function(e) {
								return false;
							});
			return this;
		} // tf7tabs
	});
})(jQuery);

/*EOF*/

(function($) {
	$.extend($.fn, { tf7switcher: function(mode) {
		mode = mode || "amazon";
		if (mode == "amazon") {
			return this
			.find("label.switch input")
				.each(function() {
					var radio = this;
					var controls = $(this.parentNode.parentNode).getControls();
					controls
					.bind("change", function() {
						var val = typeof this.getValue == "function" ? this.getValue() : this.value;
						if (hasValue(val)) {
							$(radio).attr("checked", true);
						}
					})
					.bind("propertychange", function() {
						if (!TF7.globals.submitting && window.event.propertyName == "value") {
							if (hasValue(window.event.srcElement.value)) {
								$(radio).attr("checked", true);
							}
						}
					});
				})
			.end();
		} else if (mode == "enable") {
			return this
			.find("label.switch input")
				.click(function(e) {
					$(this).parents("ul.switcher")
						.find("label.switch input")
							.each(function() {
								var disable = this.checked ? false : true;
								var controls = $(this.parentNode.parentNode).getControls().not(this).each(function() {
									this[disable ? "disable" : "enable"]();
								});
								if (!disable) {
									controls[0].focus();
								}
							});
				})
				.eq(0)
					.click()
				.end();
		} else {
			return this;
		}

		}
	});
})(jQuery);

/*EOF*/

(function($) {
	$.tf7dynLoad = function(url, holder, o) {

			var s = $.extend({}, $.tf7dynLoad.defaults, o);

			var xhr;

			s.holderId = TF7.Dom.generateId($(holder)[0]);

			if($(holder).lenght) {
  			if (xhr = $(holder)[0]._xhr) { // si hay un proceso activo
  				try {
  					xhr.abort();
  					xhr = null;
  				} catch(e) {

  				}
  			}
	    }
			if (!s.allowRefresh) {
				var current = $(holder).attr("_currentURL");
				if (url == current) return;
			}

			$(holder).attr("_currentURL", url);


			s.before();
			s.cb_systemError = s.cb_systemError || cb_systemError;
			s.cb_systemLogin = s.cb_systemLogin || cb_systemLogin;

			if (s.forceRefresh && s.type.toLowerCase() == 'get') {
				url += url.indexOf("?") != -1 ? "&" : "?";
				url += o.timestampParamName + '=' + (new Date()).getTime();
			}

			try {
				$(holder)[0]._xhr = $.ajax({
					url: url,
					success: s.cb_success || cb_success,
					error: cb_error,
					dataType: s.dataType,
					data: s.data,
					type: s.type
				});
			} catch(e) {
				cb_error();
			}


			function cb_success(r) {
				r = fc.run(r, s);
				if (r !== false) {
					$(holder).empty().append(r);
					s.success(r);
					$(holder).trigger("tf7ContentLoaded", ["success"]);
				}
			}

			function cb_error(r) {
				if (s.critical) {
					var msg = TF7.conf.ajaxLoaderNotFound.sprintf("cargaAsincrona_error404".translate());
				}
				$(holder).empty().removeAttr("_currentURL").append(msg || "").trigger("tf7ContentLoaded", ["error"]);
				s.error();
			}

			function cb_systemError(r) {
				var base = window.location;
				$(holder).empty().append(TF7.conf.ajaxLoaderError.sprintf("cargaAsincrona_error".translate(), "#", "cargaAsincrona_verDetallesTecnicos".translate()))
					.find("a")
						.each(function() { this._failedResponse = r; })
						.click(function(e) {
							e.preventDefault();
							var x = TF7.conf.errorPopupWidth;
							var y = TF7.conf.errorPopupHeight;;
							var w = window.open("", "error", "status=yes, scrollbars=yes, resizable=yes, toolbar=no, width=" + x + ", height=" + y);
							var doc = this._failedResponse;//.replace("<head>", "<head><base href='" + location + "' />");
							doc = doc.replace(/<script type="text\/javascript">[\s\S]*<\/script>/, "");
							w.document.open("text/html");
							w.document.write(doc);
							w.document.close();
							w.focus();
							return false; // problemas con los popups en VM
						});
				return true;
			}

			function cb_systemLogin(r) {
				var msg = TF7.conf.ajaxLoaderLogin.sprintf("cargaAsincrona_error404".translate());
				$(holder).empty().removeAttr("_currentURL").append(msg || "").trigger("tf7ContentLoaded", ["error"]);
				return true;
			}

	};

	$.tf7dynLoad.defaults = {
		type: "get",
		critical: false,
		dataType: "other", // para que no ejecute scripts en cabecera
		data: null,
		wait : true, // true or CSS selector
		allowRefresh: true,
		forceRefresh : false,
		timestampParamName : '__forceRefreshTimestamp',
		before: function() {},
		success: function() {},
		error: function() {},
		complete: function() {},
		foo: "bar"
	};

	/*EOF*/
	
	var Filter = function(fn, cb) {
		this.fn = fn;
		this.cb = cb;
	};

	Filter.prototype = {
		run : function(r) {
			return this.fn.apply(this, arguments);
		}
	};

	var FilterChain = function() {
		this.filters = [];
	};

	FilterChain.prototype = {
		add : function(fn, cb) {
			this.filters.push(new Filter(fn, cb));
		}
		,
		run : function(r) {
			var ret = r;
			var filters = this.filters;
			for (var i=0; i < filters.length; i++) {
				ret = filters[i].run.apply(filters[i], [ret].concat(Array.prototype.slice.call(arguments, 1)));
				if (ret === false) {
					break;
				}
			}
			return ret;
		}
	};

	var fc = new FilterChain();
	fc.add(checkMeta);
	fc.add(getBody);
	fc.add(setTf7ReplaceInModalForms);


	function checkMeta(r, o) {
		var matches, done;
		if (typeof r != 'string') return r;
		var remeta = /<meta ?([^(>|\/)]*?) ?\/?>(<\/meta>)?(.|\s)*?/g;
		matches = r.match(remeta);
		if (matches) {
			for (var i = 0; i < matches.length; i++) {
				done = processMeta(matches[i], r, o);
				if (done) {
					o.error();
					$('#' + o.holderId).trigger("tf7ContentLoaded", ["error"]);
					return false;
				}
			}
		}
		return r;
	}

	function processMeta(m, r, o) {
		var s = m.replace("meta", "div");
		var n = $(s).attr("name") || "";
		switch (n) {
			case "status.system-error":
			case "status.session-expired":
				return o.cb_systemError(r);
			case "status.login":
				return o.cb_systemLogin(r);
			default:
				break;
		}
		return false;
	}

	function getBody(r, o) {
		if (typeof r == 'string') {
			var rebody = /<body[^>]*?>((.|\n)*?)<\/body>/;
			matches = rebody.exec(r);
			var x;
			if (matches && matches.length > 1) {
				x = matches[1];
			} else {
				x = r;
			}
			return x;
		}
		return r;
	}

	function setTf7ReplaceInModalForms(r, o) {
		if (typeof r != 'string') return r;
		var m = $("<div><\/div>")
			.append(r);
		m
			.find("div.popup-modal input[@type=submit]")
				.attr("tf7replace", '#' + o.holderId)
			.end();
		return m.html();
	}

})(jQuery);
jQuery.fn.enable = function(focus) {
  return this.each(function() {
    TF7.enable(this, true, focus);
  });
};

jQuery.fn.disable = function(focus) {
  return this.each(function() {
    TF7.enable(this, false, focus);
  });
};

TF7.arrayExtract = function(a, idx) {
  var ret = [];
  for (var i = 0, c = a.length; i < c; i++)
    ret.push(a[i][idx]);
  return ret;
};

TF7.ruleset = function(frmid, rsname, fields, extra) {
  var s = TF7.ruleset.store;
  if (!s[frmid]) {
    s[frmid] = {};
    TF7.ruleset.errors[frmid] = { fields: {}, extra : []};
    TF7.ruleset.errorsByType[frmid] = {};
  }
  s[frmid][rsname] = { fields: fields || {}, extra: extra || [] };
};

TF7.ruleset.store = {};
TF7.ruleset.errors = {};
TF7.ruleset.errorsByType = {};


TF7.ruleset.checkRuleset = function(frmid, rsname) {
  var valid = true;
  var fieldsuccess = true;
  var extrasuccess = true;
  var rs = TF7.ruleset.store[frmid] && TF7.ruleset.store[frmid][rsname];
  if (!rs)
    return;

  TF7.ruleset.clearExtraErrors(frmid);
  TF7.ruleset.clearByTypeErrors(frmid);

  var i, c;
  for (i in rs.fields) {
    fieldsuccess = TF7.ruleset.checkField(frmid, i, rs.fields[i], true);
    valid = !!(valid && fieldsuccess);
  }

  if (!rs.extra) rs.extra = [];

  for (i = 0, c = rs.extra.length; i < c; i ++) {
    extrasuccess = TF7.ruleset.checkExtra(frmid, rs.extra[i]);
    valid = valid && extrasuccess;
  }
  return valid;
};

TF7.ruleset.checkInnerFields = function(el) {
  var inner = $(el).getControls().get();
  var valid = true;
  for (var i = 0, c = inner.length; i < c; i++) {
    var fieldsuccess = TF7.ruleset.checkField(inner[i]._formid, inner[i].name);
    valid = valid && fieldsuccess;
  }
  return valid;
};

TF7.ruleset.checkField = function(frmid, fieldname, rules, main) {
  if (!rules)
    rules = TF7.ruleset.store[frmid] && TF7.ruleset.store[frmid]["default"] && TF7.ruleset.store[frmid]["default"].fields[fieldname];

  if (!rules)
    return true;

  TF7.ruleset.clearFieldErrors(frmid, fieldname);

  var element = TF7.getFieldByNameAndForm(fieldname, frmid)[0];
  if (!element || element.disabled) {
    return true;
  }

  if (element._inSet && main) { // skip inner validation
    return true;
  }

  $(element).trigger("beforevalidation");

  var valid = element.valid = true;
  var type = TF7.getType(element);
  var value = TF7.getValue(frmid, fieldname);

  var label = "";

  var i, c, r, fn, params, errors = [], rulesuccess, o, bytype = [];

  for (i = 0, c  = rules.length; i < c; i++) {
    r = rules[i];

    if (!hasValue(value) && r[4]) // la regla solo se aplica cuando existe el valor
      continue;

    fn = null;
    if (typeof r[0] == "function")
      fn = r[0];
    else if (TF7.validators[type] && typeof TF7.validators[type][r[0]] == "function")
      fn = TF7.validators[type][r[0]];
    else if (typeof TF7.validators[r[0]] == "function")
      fn = TF7.validators[r[0]];

    if (fn === null) {
      continue;
    }

    if (typeof r[1] == "function") {
      params = r[1](element);
      if (params !== null && params.constructor != Array) {
        params = [params];
      }
    } else if (r[1] && r[1].constructor == Array) {
      params = r[1];
    } else if (params === undefined || params === null) {
        params = [];
    }

    if (params[0] && typeof params[0] == "string" && params[0].indexOf('#') === 0) {
      params = TF7.getValue(frmid, $(params[0]).attr("name"));
    }

    rulesuccess = fn.apply(element, [value].concat(params));

    if (rulesuccess === false) {
      var errormsg = r[2] || (TF7.l10n.errors[type] && TF7.l10n.errors[type][r[0]]) || TF7.l10n.errors[r[0]];

      var singInAlert = true;

      if (typeof r[0] == "string") {

        if ({"required": 1}[r[0]]) {
          singInAlert = false;
        }

      }


      if (errormsg) {
        TF7.getLabel(frmid, fieldname);
        o = { "!label" : label };
        o = _appendParams(o, params);
        errors.push([errormsg.t(o), singInAlert]);
      }
      if (typeof r[0] == "string") {
        bytype.push(r[0]);
      }
    }
    valid = valid && rulesuccess;
    element.valid = valid;
    if (r[3] && !valid) { // regla de stop (requerido, por ejemplo)
      break;
    }


  }

  if (type.indexOf("group") == 0) { // campos compuestos
    if (hasValue(value) /*|| element.getAttribute("tf7required")*/) {
      rulesuccess = TF7.ruleset.checkInnerFields(element);
      valid = valid && rulesuccess;
    }
  }



  if (!valid && !element._inSet)
    $(element).trigger("invalid");



  $(element).trigger("aftervalidation");
  if (errors.length) {
    TF7.ruleset.setFieldErrors(frmid, fieldname, errors);
  }
  if (bytype.length) {
    TF7.ruleset.setByTypeErrors(frmid, label, bytype);
  }
  return valid;


  function _appendParams(o, p) {
    for (var i = 0, c = p.length; i < c; i++)
      o["!" + i] = p[i];
    return o;
  }

};

TF7.getType = function(element) {
  var type = element.getAttribute("tf7type") || element.getAttribute("type") || element.type || element.tagName.toLowerCase();
  if (element.tagName.toLowerCase() == "span") {
    if (type == "span") {
      type = "group";
    } else {
      type = "group" + type;
    }
  }
  return type;
};

TF7.getFieldByNameAndForm = function(fieldname, formId) {
  var fields = document.getElementsByName(fieldname);
  if (!fields.length) {
    fields = [];
    $('#' + formId).find('[@name=' + fieldname + ']').each(function() {
       fields.push(this)
    });
  }
  var form, ret = [];
  if (formId) {
    for (var i = 0; i < fields.length; i += 1) {
      if (fields[i]._formid == formId) {
        ret.push(fields[i]);
      }
    };
  } else {
    ret = fields;
  }
  return $(ret);
};


TF7.getValue = function(frmid, fieldname, collect) {
  var field = TF7.getFieldByNameAndForm(fieldname, frmid);
  var element = field[0];
  if (!element) return;
  var type = TF7.getType(element);
  switch (type) {
    case "checkbox":
    case "radio":
      var checks = $(element.form).find("input[@name=" + element.name + "]");
      var values = [];
      checks.each(function() {
        if (this.checked) values.push(this.value);
      });
      if (values.length == 1) {
        values = values[0];
      } else if (values.length == 0 && checks.length == 1) {
        values = false;
      }
      if (collect) {
        if (checks.length == 1 && !hasValue(values)) {
          values = "false";
        }
      }
      return values;
    case "select-multiple":
      var v = [];
      for (var i = 0; i < element.options.length; i++) {
        if (element.options[i].selected) {
          v.push(element.options[i].value);
        }
      }
      return v;
    case "number":
      return element.value.unformat();
    case "date":
      var val = jQuery.trim(element.value);
      return element.value.split(TF7.conf.dateSplitter).reverse();
    case "group":
    case "groupdatetime":
    case "groupmonth":
    case "grouptime":
    case "groupccc":
    case "groupcc":
    case "groupfuc":
      var val = [];
      $(element).getControls().each(function(i) {
        val.push(TF7.getValue(this._formid, this.name));
      });
      return val;
    case 'textarea':
      return (jQuery.trim(element.value)).replace(/<\/?[^>]+(>|$)/g, '');
    case "month":
    case "text":
    default:
      return jQuery.trim(element.value);
  }
};

TF7.getLabel = function(frmid, fieldname, force) {
  var field = $("#" + frmid + " [@name=" + fieldname + "]");
  var element = field[0];
  if (!element) return;
  if (!force && element._label) return element._label;
  var label;
  var type = TF7.getType(element);
  switch (type) {
    case "checkbox":
    case "radio":
      var $checks = $(element.form).find("input[@name=" + element.name + "]");
      if ($checks.length == 1) {
        label = $(element.parentNode).text();
      } else {
        var mainLabel = $(element).parents("div").eq(0).find("span.etiqueta");
        if (mainLabel.length) {
          label = mainLabel.text();
        } else {
        }
      }
      break;
    case "group":
    case "groupdatetime":
    case "groupMonth":
    case "grouptime":
    case "month":
    case "groupCcc":
    case "groupCc":
      label = $(element.parentNode).find("label").text();
      break;

    case "date":
    case "text":
    case "number":
    case "select-multiple":
    case "select-one":
    default:
      label = $(element.parentNode).find("label[@for=" + element.id + "]").text();
      break;

  }
  label = jQuery.trim(label || "").replace(/:$/, "").replace(/\*$/, "");
  element._label = label;
  return label;
};

TF7.enable = function(el, enable, focus) {
  enable = enable === undefined ? true : enable;
  if (el.tagName.toLowerCase() == 'div') {
    var fieldSelector = ':input, a, span.obridor';
    var $el = $(el);
    var $fields = $el.find(fieldSelector);

    if (enable) {
      var $relDivs = $el.find('div[@tf7rel]');
      var $notFields = $relDivs.find(fieldSelector);
      $fields = $fields.not('[@tf7rel]');
      var ret = [];
      $fields = $fields.each(function() {
        if ($notFields.index(this) == -1) {
          ret.push(this);
        }
      });
      $fields = $(ret);
    }
    $fields.each(function() {
      TF7.enable(this, enable);
      if (this._relid && this.checked) {
        $('#' + this._relid)
          .enable();
      }
    });

    if (enable && focus) {
      $fields.eq(0).focus();
    }

    var fn = !enable ? "addClass" : "removeClass";
    $(el)[fn]('inhabilitat');
    return;
  }

  var type = TF7.getType(el);

  switch(type) {
    case "radio":
    case "checkbox":
      el.disabled = !enable;
      break;
    case "date":
      el.disabled = !enable;
      var ns = el.nextSibling;
      if (ns && ns.tagName && ns.tagName.toLowerCase() == "button") {
        ns.disabled = !enable;
        ns.firstChild.src = ns.firstChild.getAttribute(!enable ? "_disabledimage" : "_enabledimage");
      }
      break;
    case "text":
    default:
      if (el.tagName == 'A') {
        if (enable) {
          el.tabIndex = 0;
        } else {
          el.tabIndex = -1;
        }
        if ($(el).parents('div.tf7-widget-menu-flyout-menu').length == 0) {
          $('img.escenari', el).each(function() {
            this.src = this.getAttribute(!enable ? '_disabledimage' : '_enabledimage');
          });
        }
      } else if (el.tagName == 'SPAN') {
        $('img', el).each(function() {
          this.src = this.getAttribute(!enable ? '_disabledimage' : '_enabledimage');
        });
      }
      el.disabled = !enable;
  }
};

TF7.ruleset.setByTypeErrors = function(frmid, label, bytype) {
  for (var i = 0, it; it = bytype[i]; i++) {
    if (!TF7.ruleset.errorsByType[frmid]) {
      TF7.ruleset.errorsByType[frmid] = {};
    }
    if (!TF7.ruleset.errorsByType[frmid][it]) {
      TF7.ruleset.errorsByType[frmid][it] = [];
    }
    TF7.ruleset.errorsByType[frmid][it].push(label);
  }
};

TF7.ruleset.clearByTypeErrors = function(frmid) {
  TF7.ruleset.errorsByType[frmid] = {};
};

TF7.ruleset.clearFieldErrors = function(frmid, fieldname) {
  TF7.ruleset.errors[frmid].fields[fieldname] = [];
};

TF7.ruleset.getFieldErrors = function(frmid, fieldname) {
  return TF7.arrayExtract(TF7.ruleset.errors[frmid].fields[fieldname], 0);
};

TF7.ruleset.setFieldErrors = function(frmid, fieldname, errors) {
  TF7.ruleset.errors[frmid].fields[fieldname] = errors;
};

TF7.ruleset.getFormErrors = function(frmid) {
  var rs = TF7.ruleset;
  var fieldErrors = [];
  for (var i in rs.errors[frmid]) {
    for (var j = 0, c = rs.errors[frmid][i].length; j < c; j++) {
      if (rs.errors[frmid][i][j][1]) {
        fieldErrors.push(rs.errors[frmid][i][0]);
      }
    }
  }
  return { fields: fieldErrors, types: TF7.ruleset.errorsByType[frmid] };
};

TF7.ruleset.checkExtra = function(frmid, extra) {
  var valid = true;
  var fn = extra[0];
  var error = extra[2] || TF7.l10n.errors.__extra__[extra[1]] || TF7.l10n.errors[extra[1]] || "";
  if (typeof fn == "function") {
    valid = fn.apply(null, []);
  } else if (fn && fn.constructor == Array) {
    var values = [];
    var fieldnames = [];
    for (var i = 0, c = fn.length; i < c; i++) {
      fieldnames.push(fn[i]);
      values.push(TF7.getValue(frmid, fn[i]));
    }
    fn = TF7.validators.extra[extra[1]];
    if (typeof fn == "function") {
      valid = fn.apply(null, values);
    }
  } else {

  }
  if (!valid && error) {
    var labels = [];
    if (fieldnames) {
      for (i = 0, c = fieldnames.length; i < c; i++) {
        labels.push(TF7.getLabel(frmid, fieldnames[i]));
      }
    }
    TF7.ruleset.addExtraError(frmid, [error.t({ "!labels" : labels.join(", ")}), 1]);
  }
  return valid;
};

TF7.ruleset.clearExtraErrors = function(frmid) {
  TF7.ruleset.errors[frmid].extra = [];
};

TF7.ruleset.addExtraError = function(frmid, error) {
  TF7.ruleset.errors[frmid].extra.push(error[0]);
};

TF7.ruleset.getExtraErrors = function(frmid) {
  return TF7.ruleset.errors[frmid].extra;
};

TF7.ruleset.addFieldType = function(frmid, rsname, fieldname, type) {
  var s = TF7.ruleset.store;
  if (!s[frmid]) {
    s[frmid] = {};
    TF7.ruleset.errors[frmid] = { fields: {}, extra: {}};
  }
  if (!s[frmid][rsname])
    s[frmid][rsname] = { fields: {} };
  if (!s[frmid][rsname].fields[fieldname])
    s[frmid][rsname].fields[fieldname] = [];
  s[frmid][rsname].fields[fieldname].push(["type"+type, null, null, null, true]);

};

TF7.ruleset.addFieldRule = function(frmid, rsname, fieldname, fn, params, error, stop, ifvalue) {

  var s = TF7.ruleset.store;
  if (!s[frmid]) {
    s[frmid] = {};
    TF7.ruleset.errors[frmid] = {};
  }
  if (!s[frmid][rsname])
    s[frmid][rsname] = { fields: {} };
  if (!s[frmid][rsname].fields[fieldname])
    s[frmid][rsname].fields[fieldname] = [];
  s[frmid][rsname].fields[fieldname].push([fn, params, error, stop, ifvalue]);
};

TF7.handleInvalid = function(e) {
  var $this = $(this);
  if (this.type == "checkbox" || this.type == "radio") {
    var hasMainLabel = $this.parents("ul").eq(0).prev("p.etiqueta").length;
    if (hasMainLabel) { // grupos con etiqueta
      $this.parents("ul").eq(0).parents("div").eq(0).addClass(TF7.conf.errorClassName);
    } else {
      $this
        .parents("p:eq(0)")
          .addClass(TF7.conf.errorClassName);
    }

    return;
  }
  $this.parents("p").addClass(TF7.conf.errorClassName);
};

TF7.handleBeforeValidation = function(e) {
  var $this = $(this);
  if (this.type == "checkbox" || this.type == "radio") {
    var hasMainLabel = $this.parents("div").eq(0).find("p.etiqueta").length;
    if (hasMainLabel) {
      $this.parents("div").eq(0).removeClass(TF7.conf.errorClassName);
    } else {
      $this
        .parents("p:eq(0)")
          .removeClass(TF7.conf.errorClassName);
    }
    return;
  }

  if (!this._inSet) {
    $(this).parents("p").removeClass(TF7.conf.errorClassName);
  }
};

TF7.handleAfterValidation = function(e) {

};


/*EOF*/
/**** TF7.initForms *****/ 

TF7.initForms = function(context) {

  context = context || document;

  var errorHolder;

  function createErrorHolder() {
    if ($('form').length && !document.getElementById('tooltip-error')) {
      errorHolder = $("<div class='tooltip-error' id='tooltip-error' />").bgiframe({top: -1, left: -1}).appendTo(document.body);
    }
  }


  function isAncestor(p, c) {
    var a = p.getElementsByTagName("*");
    for (var i = 0, len = a.length; i < len; i++) {
      if (a[i] == c) return true;
    }
    return false;
  }

  function showError(el) {
    if (el._inSet) return;
    if (el.valid !== false) return;
    errorHolder.hide();
    errorHolder.find('ul').remove();
    var errors = TF7.ruleset.getFieldErrors(el._formid, el.name);
    if (!errors.length)
      return;
    var $ul = $("<ul/>").appendTo(errorHolder);
    for (var i = 0, c = errors.length; i < c; i++) {
      $ul.append("<li>" + errors[i] + "</li>");
    }
    var pos = findPos(el);
    var diff = 12;

    if (el.getAttribute("tf7type") == "date") diff += 12;
    errorHolder
      .css({position: "absolute", top: pos.y + "px", left: pos.x + el.offsetWidth + diff + "px"})
      .show();

  }

  function hideError(el) {
    if (el._inSet) return;
    if (el == document.activeElement || isAncestor(el, document.activeElement)) return;
    if (errorHolder) errorHolder.hide();
  }


  var dateSplitter = TF7.conf.dateSplitterRegexp;

  $.DateFormatter.inputFormats.d_m_yy = [
    new RegExp(["^([0-9]{1,2})", dateSplitter, "([0-9]{1,2})", dateSplitter, "([0-9]{2}|[0-9]{4})$"].join("")),
    function(a) {
      return [ a[3].length == 2 ? $.DateFormatter.processTwoDigitsYear(+a[3]) : +a[3], +a[2], +a[1] ];
    }
  ];

  $.DateFormatter.processTwoDigitsYear = function (yy) {
    return 2000 + (+yy);
  };

  $.DateFormatter.joinCharacter = TF7.conf.dateSplitter;

  $("input[@tf7type=date]", context).dateFormatter(["ddmmyy", "ddmmyyyy", "d_m_yy"]);


  $("form", context)
    .each(function() {
      TF7.Dom.generateId(this);
    });


  createErrorHolder();

  $(context)
    .getControls()
      .each(function() {
        if (this.form) {
          this._formid = this.form.id;
        } else {
          if (!$(this).parents("form").length) {
            return;
          }

          this._formid = $(this).parents("form")[0].id;
        }
      })
      .not("[@type=hidden]")
        .not("[@type=checkbox]")
          .not("[@type=radio]")
            .focus(function(e) {
              showError(this);
            })
            .blur(function(e) {
              hideError(this);
            })
            .hover(function(e) {
              var that = this;
              if (this._errorCloseTimeout) {
                clearTimeout(this._errorCloseTimeout);
                this._errorCloseTimeout = null;
              }
              this._errorOpenTimeout = setTimeout(function() { showError(that); }, TF7.conf.hoverDelayOver);
            },
            function(e) {
              var that = this;
              if (this._errorOpenTimeout) {
                clearTimeout(this._errorOpenTimeout);
                this._errorOpenTimeout = null;
              }
              this._errorCloseTimeout = setTimeout(function() {
                hideError(that);
              }, TF7.conf.hoverDelayOut);
            })
          .end()
        .end()
        .each(function() {
          var ncount = 0;

          var n = TF7.Dom.assignName(this);

          TF7.ruleset.addFieldType(this._formid, "default", n, TF7.getType(this));

          var rules = [ "required", "step", "min", "max", "minlength", "maxlength", "pattern" ];
          var attr;



          for (var i = 0, c = rules.length; i < c; i++) {
            attr = this.getAttribute("tf7" + rules[i]) || this.getAttribute(rules[i]);
            if (attr) {
              TF7.ruleset.addFieldRule(this._formid, "default", n, rules[i], [attr], null, rules[i] == "required", rules[i] != "required");
            }
          }

        })
        .bind("beforevalidation", TF7.handleBeforeValidation)
        .bind("aftervalidation", TF7.handleAfterValidation)
        .bind("invalid", TF7.handleInvalid)
        .not("[@type=checkbox]")
          .not("[@type=radio]")
            .each(function(i) {
              if (this.parentNode.tagName.toLowerCase() == 'span' && this.parentNode.getAttribute('tf7set')) {
                this._inSet = true;
              }
              $(this) // radios y checkboxes solo se validan en el submit
                  .bind("change", function(e) {
                    TF7.ruleset.checkField(this._formid, this.name);
                    e.stopPropagation();
                  });
            })
          .end()
        .end()
        .filter("input[@tf7type=number]")
          .each(function() {
            var opts = { format: false };
            if (this.getAttribute('tf7step') == "1") {
              opts.decimal = false; // don't allow decimal symbol
            }
            if (this.getAttribute('tf7min') && this.getAttribute('tf7min') >= "0") {
              opts.minus = false;
            }
            if (this.getAttribute('tf7format')) {
              opts.format = true;
            }
            $(this).tf7numeric(opts);
          })
        .end()
        .filter("input[@tf7type=pan]")
          .tf7numeric({ decimal: false, minus: false })
        .end()
        .filter("input[@tf7pad]")
          .bind("aftervalidation", function() {
            var value   = jQuery.trim(this.value);
            if (!this.valid || !hasValue(value)) return;
            var charpad = this.getAttribute("tf7pad");
            var len     = charpad.split(":")[1] || this.getAttribute("maxlength");
            charpad = charpad.split(":").length > 1 ? charpad.split(":")[0] : charpad;
            this.value = String(value).pad(len, charpad);
          })
        .end()
        .add('input[@type=submit]')
          .filter("*[@tf7autofocus]")
            .each(function() {
              if ((document.activeElement && document.activeElement != document.body) || this.disabled) return;
              try {
                $(this).addClass('focused');
                this.focus();
                if (this.getAttribute("tf7autofocus") == "select") {
                  try {
                    this.select();
                  } catch(e) {}
                }
              } catch(e) {}
            })
          .end()
        .end()
        .filter('input[@maxlength]')
          .filter(function() {
            if (!!this.getAttribute('tf7autonext'))
              return true;
            if (!!$(this).parent('span[@tf7set=true]').length) {
              var last = this.parentNode.lastChild;
              if (last.nodeType != 1)
                last = last.previousSibling;
              return last != this;
            }
            return false;
          })
            .bind("keypress", function(e) {
              if(typeof e.charCode !== undefined) {
                /*// special keys have 'keyCode' and 'which' the same (e.g. backspace)
                if(e.keyCode == e.which && e.which != 0)
                  return;*/
                if(e.keyCode != 0 && e.charCode == 0 && e.which == 0)
                  return;
              }
              var el = this;
              el._nextTimeout = setTimeout(function() {
                if (el.value.length == el.maxLength) {
                  var nid = el.getAttribute('tf7autonext');
                  var next;
                  if (nid && nid.indexOf('#') === 0) {
                    next = $(nid)[0];
                  } else if (!nid || nid == 'true'){
                    var els = [];
                    for (var i = 0; i < el.form.elements.length; i++) {
                      els.push(el.form.elements[i]);
                    }
                    var idx = $(els).index(el);
                    next = $(els)[idx + 1];
                  }
                  if (next) {
                    try {
                      next.focus();
                      if (next.type != 'submit' && next.type != 'button')
                        next.select();
                    } catch(e) {
                    }
                  }
                }
              }, 0);
            })
        .end()
      .end();



    $("span[@tf7set]", context).find("input, select")
      .bind("change", function(e) {
        var container = $(this).parents("span").get(0);
        container._hasChanged = true;
      })
      .blur(function(e) {
        var container = $(this).parents("span").get(0);
        setTimeout(function() {
          if ($(document.activeElement).parents("span").get(0) != container) {
            $(container).trigger("blur");
            if (!container._hasChanged) return;
            $(container).trigger("change");
            container._hasChanged = false;
          }
        }, 0);
      })
      .focus(function(e) {
        var container = $(this).parents("span").eq(0).trigger("focus");
      });

    $("form", context)
      .find("ul.switcher")
        .tf7switcher()
      .end()
      .submit(function(e) {


        TF7.globals.submitting = true;
        if (!this._triedSubmission) {
          this._origAction = this.action;
          this._origMethod = this.method;
          this._origTf7replace = this.getAttribute("tf7replace");
          this._origTf7confirm = this.getAttribute("tf7confirm");
          this._triedSubmission = true;
        }

        var b = this.clicked;

        if (!b) {
          b = $(this).find("input[@type=submit]")[0];
        }

        var m = b.getAttribute("tf7method");
        var a = b.getAttribute("tf7action");
        var r = b.getAttribute("tf7replace");
        var c = b.getAttribute("tf7confirm");
        var rs = b.getAttribute("tf7ruleset");

        this._skipValidation = false;

        switch (rs) { // ruleset
          case "":
          case "none":
            this._skipValidation = true;
            break;
        }

        if (!rs && !this._skipValidation) {
          rs = "default";
        }

        this.ruleset = rs;
        this.method = m || this._origMethod;

        var form = this;

        if ($(this.clicked).hasClass('oap-button') && a && a.indexOf('{') === 0) {  // OAP, since r84
          try {
            var parsed = JSON.parse(a);
            var urls = parsed.urls;
            var select = parsed.select;
            select = TF7.getValue(this.id, select);
            var a = urls[select];
          } catch(e) {
            e.preventDefault();
          }

        }



        this.action = a || this._origAction;
        this.setAttribute("tf7replace", r || this._origTf7replace);
        this.setAttribute("tf7confirm", c || this._origTf7confirm);
      })
      .submit(function(e) {
        if (window.tinyMCE !== undefined) {
          tinyMCE.triggerSave();
        }
      })
      .submit(function(e) {
        var valid = this.valid = true;
        if (this._skipValidation) return;
        valid = TF7.ruleset.checkRuleset(TF7.Dom.generateId(this), this.ruleset);
        if (valid === false) {
          this.valid = false;
          e.preventDefault();
        }

      })
      .submit(function(e) {
        if (this._skipValidation) return;
        this._unconfirmed = null;
        if (!this.valid) return;
        var res = true;
        var tf7confirm = this.getAttribute("tf7confirm");
        if (tf7confirm && tf7confirm != 'null') {
          res = confirm(tf7confirm);
        }
        if (!res) {
          this._unconfirmed = true;
          e.preventDefault();
        }
      })
      .submit(function(e) {
        if (!this.valid) {
          var errors = TF7.ruleset.getFormErrors(this.id);
          var errormsg = "";

          var labels = [];
          for (var i in errors.types) {
            if (i == "required") {
              for (var j = 0, c = errors.types[i].length; j < c; j++) {
                if (errors.types[i][j])
                  labels.push(errors.types[i][j]);
              }
            }
          }

          if (labels.length)
            errormsg = "formularios_camposRequeridos".translate() + "\n  â€¢ " + labels.join("\n  â€¢ ");

          var extra = TF7.ruleset.getExtraErrors(this.id);

          for (i = 0, c = extra.length; i < c; i++) {
            errormsg += "\n\n" + extra[i];
          }

          if (!errormsg) {
            errormsg = this.getAttribute("tf7errormsg") || "formularios_error".translate();
          }

          alert(errormsg);
          e.preventDefault();
        }
      })
      .submit(function(e) {
        if (!this._skipValidation && (!this.valid || this._unconfirmed)) return false;

      	if ($(this).hasClass('lock-ui')) {
      		var $message = $('<div class="missatge-indicador-progres lock-form-message"><p>' + TF7.l10n.formularios_blockUI + '</p></div>');
        	$('body', context).prepend($message);

        	new TF7.UI.Overlay($message[0], {
            draggable: false,
            fixPosition: true,
            modal: true,
            centerInView: true
          }).show();
      	}
      })
      .submit(function(e) {
        if (!this._skipValidation && (!this.valid || this._unconfirmed)) return false;

        var tf7replace = this.getAttribute("tf7replace");
        var values = $(this).collectFormData();

        if (TF7.conf.useReplaceInAuthForm && !tf7replace && ($(this).parents("#autoritzacio").length || $(this).parents("#confirmacio").length || $(this).parents("#autoritzacioMultimotiu").length)) {
          e.preventDefault();

          for (var i = 0; i < values.length; i++) {
            var v = values[i];
            if (v.name.indexOf("_aut") == 0) {
              TF7.cookie.set(v.name, v.value, 5);
              values.splice(i, 1);
              i--;
            }
          }

          var append = jQuery.param(values);
          var action = this.action;
          window.location.replace([action, action.indexOf("?") != -1 ? "&" : "?", append].join(""));
          return false;
        }

        if (!tf7replace || tf7replace == 'null') {
        } else {
          var holder = tf7replace;
          var href = this.action;
          var method = this.method;

          if ($(this).parents("div.popup-modal").lenght) {
            $(this).parents("div.popup-modal").popupModalDestroy();
          }

          var o = {
            type: method,
            data: jQuery.param(values)
          };

          $(holder).empty().append(TF7.conf.ajaxLoaderHTML.sprintf("cargaAsincrona_cargando".translate()));

          $.tf7dynLoad(href, holder, o);

          e.preventDefault();
        }
        TF7.globals.submitting = false;
      })
      .find("input[@type=submit]")
        .click(function(e) {
          this.form.clicked = this;
        });

};

$.fn.setValue = function(v) {
  if (this[0] && this[0].setValue) {
    this[0].setValue(v);
  }
  return this;
};

$.fn.checkValidity = function() {
  return this.each(function() {
    if (this.checkValidity) this.checkValidity();
  });
};

$.fn.collectFormData = function() {

  function parseValue(v) {
    var input = v,
    ret = [],
    parts, index, i, splitter;
    if (input && input.constructor == Array) {
      for (i = 0; i < input.length; i++) {
        ret = ret.concat(parseValue(input[i]));
      }
    } else {
      splitter = input.indexOf(TF7.conf.miniappsSplitter) != -1 ? TF7.conf.miniappsSplitter : '&';
      parts = input.split(splitter);
      for (i = 0; i < parts.length; i++) {
        index = parts[i].indexOf('=')
        ret.push({ name: parts[i].substring(0, index), value: parts[i].substring(index + 1) });
      }
    }
    return ret;
  }

  /**
   * Clona un elemento de formulario.
   *
   * @param {NodeElement|String} el Elemento o nombre del elemento de formulario a tratar.
   * @param {Object} val Valor del nuevo campo.
   * @param {String} formId Identificador del formulario que contiene el campo.
   * @param {Boolean} clone Marca si el elemento debe clonarse o crearse.
   * @return {Object} Objeto con el par {name, value}.
   */
  function cloneFormElement(el, val, formId, clone) {
    var name = clone? el.name : el;
    var value = clone? el.value : val;
    var input = document.createElement('input');

    if (clone) {
      el.value = val;
      name = name + '_notprocessed_' + new Date().getTime();
    }
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    document.getElementById(formId).appendChild(input);

    return {name: name, value: value};
  }

  setFormDates(this[0]);
  var controls = $(this[0]).getControls();
  var a = [];
  var done = {}; // para evitar recolecciones por duplicado, triplicado, etc
  controls.each(function(i) {
    var name = this.name;
    if (this.disabled || !name || this._unsuccessful) return;
    if ((this.type == "checkbox" || this.type == "radio") && done[this.name]) return;
    var value = TF7.getValue(this._formid, this.name, true);
    if (value !== null) {
      var mval = jQuery.className.has(this, "multivalue") ? parseValue(value) : false;
      if (mval === false) {
        if (value && value.constructor == Array) { // documentar quÃ© casos
          for (var x = 0; x < value.length; x++) {
            a.push({name: name, value: value[x]});
          }
        } else {
          a.push({name: name, value: value});
        }
      } else {
        for (x = 0; x < mval.length; x++) {
          a.push({ name: mval[x].name, value: mval[x].value });
        }
      }

      switch (TF7.getType(this)) {
        case 'number':
          var el = cloneFormElement(this, value, this._formid, true);
          a.push(el);
          break;
        case 'select-multiple':
          for (var i = 0; i < value.length; i++) {
            cloneFormElement(this.name, value[i], this._formid, false);
          }
          break;
        case 'checkbox':
        case 'radio':
          if (mval !== false) {
            for (var x = 0; x < mval.length; x++) {
              cloneFormElement(mval[x].name, mval[x].value, this._formid, false);
            }
          }
          if (value.constructor != Array) {
            var $checks = $('#' + this._formid).find("input[@name=" + this.name + "]");
            if ($checks.length == 1) {
              if (!this.checked) {
                cloneFormElement(this.name, value, this._formid, false);
              }
            }
          }
          break;
      }
    }
    done[this.name] = true;
  });
  var b = $(this[0].clicked)[0];
  if (b.name) {
    a.push({name: b.name, value: b.value});
  }
  return a;
};


$.fn.getControls = function() {
  var selectors = [ "input", "textarea", "select", "span[@tf7set=true]" ];
  return $(selectors.join(","), this)
    .not("[@type=submit]")
    .not("[@type=reset]")
    .not("[@type=image]")
    .not('[@type=file]')
    .not("[@type=button]");
};

$.fn.getValue = function() {
  return this[0].getValue();
};


/****
 * 
 * 
 * 
 */

TF7.validators = {

  required: function(value, isrequired) {
    return isrequired && hasValue(value);
  },

  maxlength: function(value, max) {
    return value.length <= max;
  },

  minlength: function(value, min) {
    return value.length >= min;
  },

  pattern: function(value, pattern) {
    var re = new RegExp("^" + pattern + "$");
    return re.test(value);
  },

  step: function(value, step) {
    return true;
  },

  number: {
    min: function(val, min) {
      return (+val) >= (+min);
    },

    max: function(val, max) {
      return (+val) <= (+max);
    },

    step: function(val, step) {
      var p = Math.abs(Math.log(step) * Math.LOG10E).toFixed(0);
      return (+val).toFixed(p) == (+val);
    }
  },

  month : { // siempre viene de un select
    min: function(val, min) {
      val = val.split(TF7.conf.dateSplitterSystem);
      min = min.split(TF7.conf.dateSplitterSystem);
      var minYear = (+min[1]);
      var minMonth = (+min[0]);
      return (+val[1]) > minYear || ((+val[1]) >= minYear && (+val[0]) >= minMonth);
    },

    max : function(val, max) {
      val = max.split(TF7.conf.dateSplitterSystem);
      max = max.split(TF7.conf.dateSplitterSystem);
      var maxYear = (+max[1]);
      var maxMonth = (+max[0]);
      return (+val[1]) < maxYear || ((+val[1]) <= maxYear && (+val[0]) <= maxMonth);

    }
  },

  groupmonth : { // es un grupo de controles, recibe el valor como un array

    min: function(val, min) {
      min = min.split("/");
      return (+val[1]) > (+min[1]) || ((+val[1]) >= (+min[1]) && (+val[0]) >= (+min[0]));

    },

    max: function(val, max) {
      max = max.split("/");
      return (+val[1]) < (+max[1]) || ((+val[1]) <= (+max[1]) && (+val[0]) <= (+max[0]));
    }

  },

  checkbox : {
    min: function(val, min) {
      min = (+min);
      if (val.constructor == String && min <= 1) return true;
      if (val.constructor == Array) return val.length >= min;
      return false;
    },
    max: function(val, max) {
      max = (+max);
      if (val.constructor == String && max >= 1) return true;
      if (val.constructor == Array) return val.length <= max;
      return false;
    }
  },

  "select-multiple" : {
    min: function(val, min) {
      min = (+min);
      return val.length >= min;
    },
    max: function(val, max) {
      max = (+max);
      return val.length <= max;
    }
  }
  ,
  date: {
    min: function(val, min) {
      return TF7.validators.dateAfter(val, min.split("/").reverse());
    }
    ,
    max: function(val, max) {
      return TF7.validators.dateBefore(val, max.split("/").reverse());
    }
  }
  ,
  time: {
    min: function(val, min) {
      var a = min.split(":");
      return (+val[0]) > (+a[0]) || ((+val[0]) >= (+a[0]) && (+val[1]) >= (+a[1]));
    }
    ,
    max: function(val, max) {
      var a = max.split(":");
      return (+val[0]) < (+a[0]) || ((+val[0]) <= (+a[0]) && (+val[1]) <= (+a[1]));
    }
  }
  ,
  typenumber : function(val) {
    return (/^-?[\d]+(\.[\d]+)?$/).test(val);
  },

  typetext : function(val) {
    return true;
  },

  typecheckbox : function(val) {
    return true;
  },

  typemonth : function(val) {
    return true;
  },

  typeradio : function(val) {
    return true;
  },

  typegroup : function(val) {
    return true;
  },

  "typeselect-one" : function(val) {
    return true;
  },

  "typeselect-multiple" : function(val) {
    return true;
  }
  ,
  typepassword: function(val) {
    return true;
  }
  ,
  typepan : function(val) {
    return (""+val).search(/^[0-9]+$/) != -1 && (+val) > 0 && ((""+val).length != 16 || checkLuhn(val));
  }
  ,
  typeemail: function(val) {
    return (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(val);
  }
  ,
  typegroupcc : function(val) {
    return (
      val.length == 3
      &&
      val.join("").length == 14
      /*
      &&
      validarCadenaCC(val[0], val[1] + val[2])
      */
    );
  },

  typegroupccc : function(val) {
    return (
      val.length == 4
      &&
      val.join("").length == 20
      &&
      VerificaDigitControl(val.join(""))
    );
  },

  typegroupfuc : function(val) {
    return val.length == 3 && val.join('').search(/^[0-9]+$/) != -1 && (val.join('').length != 9 || checkLuhn(val.join('')));
  },

  typegroupmonth : function(val) {
    return TF7.validators.isdate([val[1], val[0], 1]);
  },

  typedate: function(val) {
    return TF7.validators.isdate(val);
  },

  typegrouptime: function(val) {
    var h = val[0];
    var i = val[1];
    var s = val[2];
    return hasValue(h) && Number(h) >= 0 && Number(h) < 24
      &&
      hasValue(i) && Number(i) >= 0 && Number(i) < 60
      &&
      (s === undefined || (hasValue(s) && Number(s) >= 0 && Number(s) < 60));

  }
  ,
  typegroupdatetime: function(val) {
    var time = val.slice(1);
    return TF7.validators.typedate(val[0]) && TF7.validators.typegrouptime(time);
  }
  ,
  extra : {

    some : function(/* arguments */) {
      var values = [].slice.call(arguments, 0);
      return hasValue(values);
    }

  },

  isdate: function(v) {
    var date = TF7.validators.helpers.dateFromArray(v);
    var d = +v[2];
    var m = +v[1] - 1;
    var y = +v[0];
    return (
      (date.getFullYear() == y)
      &&
      (date.getMonth() == m)
      &&
      (date.getDate() == d)
    );
  },

  dateAfter: function(v, after) {
    var d1 = TF7.validators.helpers.dateFromArray(v);
    var d2 = after ? TF7.validators.helpers.dateFromArray(after) : new Date();
    return d1 >= d2;
  },

  dateBefore: function(v, before) {
    var d1 = TF7.validators.helpers.dateFromArray(v);
    var d2 = before ? TF7.validators.helpers.dateFromArray(before) : new Date();
    return d1 <= d2;
  },

  email: function(v) {
    return TF7.validators.regexp(v, (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/));
  },

  helpers: {
    dateFromArray: function(a) {
      var d = parseInt(a[2], 10);
      var m = parseInt(a[1], 10) - 1;
      var y = parseInt(a[0]);
      return new Date(y, m, d);
    }
  }

};

function hasValue(val) {
  if (val === null || val === undefined) return false;
  switch(val.constructor) {
    case String:
      return val != "";
    case Number:
      return true;
    case Array:
      for (var i in val) {
        if (hasValue(val[i])) return true;
      }
  }
  return false;
}

function checkLuhn(val) {
  val = String(val);
  var len = val.length;
  var parity = len % 2;
  var digit, sum = 0;
  for (var i = 0; i < len; i++) {
    digit = Number(val.substr(i, 1));
    if (i % 2 == parity) digit *= 2;
    if (digit > 9) digit -= 9;
    sum += digit;
  }
  return sum % 10 == 0;
}

function setFormDates(form) {
    var c = $("p.date-container", form);
    c.each(function() {
      var dv, mv, yv, hv, iv, sv, tmp;

      var dmy = $(".date-dmy", this);
      var my  = dmy.length == 0 && $(".date-my", this);
      if (dmy.length) {
        var dmya = dmy.val().split(new RegExp(TF7.conf.dateSplitterRegexp));
        dv = dmya[0];
        mv = dmya[1] - 1;
        yv = dmya[2];
      } else if (my.length) {
        var mya = my[0].value.split(TF7.conf.dateSplitterSystem).reverse();
        if (hasValue(mya)) {
          mv = mya[1] - 1;
          yv = mya[0];
        }
      } else {
        var m = $(".date-m", this);
        if (m.length) {
          tmp = m[0].value;
          mv = hasValue(tmp) && tmp - 1;
        }
        var y = $(".date-y", this);
        if (y.length) {
          tmp = y[0].value;
          yv = hasValue(tmp) && tmp;
        }
      }

      var h = $(".date-h", this);
      if (h.length) hv = h.val();
      var i = $(".date-i", this);
      if (i.length) iv = i.val();
      var s = $(".date-s", this);
      if (s.length) sv = s.val();

      if (!yv && !mv && !iv) {
        $("input.date-value", this).val("");
        return;
      }


      var date = new Date();

      dv = dv === undefined && mv ? 1 : dv === undefined ? date.getDate() : dv;
      mv = mv === undefined ? date.getMonth() : mv;
      yv = yv === undefined ? date.getFullYear() : yv;
      hv = hv === undefined ? 0 : hv;
      iv = iv === undefined ? 0 : iv;
      sv = sv === undefined ? 0 : sv;

      date = new Date(yv, mv, dv, hv, iv, sv);

      var res = String(date.getDate()).pad(2, "0");
      res += "/";
      res += String(date.getMonth() + 1).pad(2, "0");
      res += "/";
      res += String(date.getFullYear());
      res += " ";
      res += String(date.getHours()).pad(2, "0");
      res += ":";
      res += String(date.getMinutes()).pad(2, "0");
      res += ":";
      res += String(date.getSeconds()).pad(2, "0");

      $("input.date-value", this).val(res);
    });
}

var VerificaDigitControl = function() {
  function sumaPesos(secuencia) {
    var pesos = new Array("6", "3", "7", "9", "10", "5", "8", "4", "2", "1");
    var i = 0;
    var peso = 0;
    var val = 0;
    var len = 0;
    len = secuencia.length;
    for(i=1; i <= len; ++i) {
      val = secuencia.charAt(len - i);
      peso = peso + pesos[i-1] * val;
    }
    peso = 11 - (peso % 11);
    if (peso == 10) peso = 1;
    else if (peso == 11) peso = 0;
    return peso;
  }

  function VerificaDigitControl(InString)
  {

    var entidad = InString.substring(0,4);
    var oficina = InString.substring(4,8);
    var digitosControl = InString.substring(8,10);
      var modalidad = InString.substring(10,12);
      var numeroCuenta  = InString.substring(12,18);
      var digitosControlCuenta = InString.substring(18,20);
      var digitosControlCCC = (sumaPesos(entidad+oficina)).toString() + sumaPesos(modalidad + numeroCuenta + (digitosControlCuenta)).toString();
    if (digitosControlCCC == digitosControl) return (true);
    else return (false);
  }

  return VerificaDigitControl;
}();

var validarCadenaCC = function() {

  var a_mascara = new Array(10);
  a_mascara[0] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0);
  a_mascara[1] = new Array(47,29,13,7,41,31,23,17,19,7,11,13);
  a_mascara[2] = new Array(94,58,26,14,82,62,46,34,38,14,22,26);
  a_mascara[3] = new Array(41,87,39,21,23,93,69,51,57,21,33,39);
  a_mascara[4] = new Array(88,16,52,28,64,24,92,68,76,28,44,52);
  a_mascara[5] = new Array(35,45,65,35,5,55,15,85,95,35,55,65);
  a_mascara[6] = new Array(82,74,78,42,46,86,38,2,14,42,66,78);
  a_mascara[7] = new Array(29,3,91,49,87,17,61,19,33,49,77,91);
  a_mascara[8] = new Array(76,32,4,56,28,48,84,36,52,56,88,4);
  a_mascara[9] = new Array(23,61,17,63,69,79,7,53,71,63,99,17);


  function validaFormatoCC(strInput)
  {
    var ok = false;

    if(!isNaN(strInput)){ ok = true; } //es una cadena de digitos
    else{ ok = false; } //es una cadena alfanumerica

    return ok;
  }//validaFormatoCC

  function validaLongitudCampo(strInput, longCampo)
  {
    var ok = false;

    if(strInput.length == longCampo ){ ok = true; }
    else{ ok = false; }

    return ok;
  }//validaLongitudNumeroCC


  function trim(strInput)
  {
    var strOutput="";

    if(strInput.length>0)
    {
      for(var i=0;i<strInput.length;i++)
      {
        if(strInput.charAt(i) != " "){strOutput=strOutput+strInput.charAt(i);}
      }
    }

    return strOutput;
  }//trim

  function valorCelda(value, pos)
  {
    var digito = parseInt(value);
    return a_mascara[digito][pos];
  }//valorCelda


  function validarCadenaCC(valueOficina, valueCC)
  {
    var dcOK = true;

    valueOficina = trim(valueOficina);
    valueCC = trim(valueCC);

    if( (!validaFormatoCC(valueOficina)) && (dcOK)){dcOK=false;}
    if( (!validaLongitudCampo(valueOficina,4)) && (dcOK)){dcOK=false;}
    if( (!validaFormatoCC(valueCC)) && (dcOK)){dcOK=false;}
    if( (!validaLongitudCampo(valueCC,10)) && (dcOK)){dcOK=false;}

    if(dcOK)
    {
      var str = valueOficina +  valueCC.substring(0,8);
      var suma =0;

      for(var i=0;i<str.length;i++)
      {
        suma = suma + valorCelda(str.charAt(i), i);
      }

      tmp =""+ suma;
      while(tmp.length<4)
      {
        tmp="0"+tmp;
      }

      valueDC = tmp.charAt(tmp.length-2) + tmp.charAt(tmp.length-1);
      var dcInput = valueCC.substring(8,10);
      if(dcInput == valueDC){dcOK=true;}
      else {dcOK=false;}
    }

    return dcOK;

  }//validarCadenaCC

  return validarCadenaCC;

}();
(function($) {

	function parse(s, re, f) {
		var a = re.exec(s);
		if (!a) return false;
		return dateFromArray(f(a));
	}

	function dateFromArray(a) {
		return new Date(a[0], a[1] - 1, a[2]);
	}

	function getParts(s, formats) {
		var date;
		var i = 0, fmt;
		while (!date && (fmt = formats[i++])) {
			date = parse(s, fmt[0], fmt[1]);
		}
		if (date) {
			var input = (fmt[2] || fmt[1])(fmt[0].exec(s));
			if (input[0] == date.getFullYear() && input[1] == date.getMonth() + 1 && input[2] == date.getDate()) {
				return input;
			}
		}
		return false;
	}

	function formatDate(el, formats, o) {
		var val = el.value;
		var output, parts = getParts(val, formats);
		if (parts && (output = o(parts)) && output != val) {
			el.value = output;
		}
	}

	$.extend({
		DateFormatter : {
			inputFormats : 	{
				"ddmmyy" : [
					(/^([0-9]{2})([0-9]{2})([0-9]{2})$/),
					function(a) {
						var year = $.DateFormatter.processTwoDigitsYear(+a[3]);
						return [ year, +a[2], +a[1] ];
					}
				],

				"ddmmyyyy" : [
					(/^([0-9]{2})([0-9]{2})([0-9]{4})$/),
					function(a) {
						return [+a[3], +a[2], +a[1]];
					}
				],

				"d/m/yy" : [
					(/^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{2}|[0-9]{4})$/),
					function(a) {
						return [a[3].length == 2 ? $.DateFormatter.processTwoDigitsYear(+a[3]) : +a[3], +a[2], +a[1]];
					}
				],

				"mmddyy" : [
					(/^([0-9]{2})([0-9]{2})([0-9]{2})$/),
					function(a) {
						var year = $.DateFormatter.processTwoDigitsYear(+a[3]);
						return [ year, +a[1], +a[2] ];
					}
				],

				"mmddyyyy" : [
					(/^([0-9]{2})([0-9]{2})([0-9]{4})$/),
					function(a) {
						return [+a[3], +a[1], +a[2]];
					}
				],

				"m/d/yy" : [
					(/^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{2}|[0-9]{4})$/),
					function(a) {
						return [a[3].length == 2 ? $.DateFormatter.processTwoDigitsYear(+a[3]) : +a[3], +a[1], +a[2]];
					}
				]

			},

			formatArray : function(a) {
				var o = [];
				return [
					(a[2] < 10 ? "0" : "") + a[2],
					(a[1] < 10 ? "0" : "") + a[1],
					a[0]
				].join($.DateFormatter.joinCharacter);
			},

			processTwoDigitsYear : function(yy) {
				return yy > 60 ? 1900 + yy : 2000 + yy;
			},

			joinCharacter : "/"

		} // DateFormatter
	});

	$.extend($.fn, {
		dateFormatter : function(i, o) {
			if (!o) o = $.DateFormatter.formatArray;
			if (!i) i = [ "ddmmyy", "ddmmyyyy", "d/m/yy" ];
			var formats = [], fmt;
			for (var x = 0; x < i.length; x++) {
				if (typeof i[x] == "string") {
					fmt = $.DateFormatter.inputFormats[i[x]];
					if (fmt) formats.push(fmt);
				} else {
					formats.push(i[x]);
				}
			}
			return this.bind("change", function() { formatDate(this, formats, o); });
		}
	});

})(jQuery);
/**
 * Allows only numeric input in form fields
 */

(function($) {
  /**
   * @memberOf jQuery.fn
   * @function
   * @name tf7numeric
   * @param {Object} [opts]
   * @config {String} [decimal] Decimal symbol or false to disallow. Defaults to ","
   * @config {String} [altDecimal] Alternative decimal symbol, false to disallow. Defaults to "."
   * @config {String} [minus] Minus symbol. Use false to disallow. Defaults to "-"
   * @config {Boolean} [allowPaste] Allow pasting data
   * @returns {jQuery} The jQuery object to continue the chain
   */
  $.fn.tf7numeric = function(opts) {

    if (typeof opts == 'string') {
      if (opts == 'destroy') {
        return this.each(function() {
          $(this)
            .unbind('keypress', kp_handler)
            .unbind('focus', focus_handler)
            .unbind('blur', blur_handler)
        });
      }
      else {
        opts = { decimal: opts };
      }
    }
    else if (opts === false) {
      opts = { decimal : opts };
    }


    var config = $.extend({}, $.fn.tf7numeric.__DEFAULTS__, opts || {});

    this
      .bind('keypress', config, kp_handler);


    if (config.milliardRemove) {
      this
        .bind('focus', config, focus_handler);
    }

    if (config.format) {
      this
        .bind('blur', config, blur_handler);
    }

    return this;

  };

  $.fn.tf7numeric.__DEFAULTS__ = {
    decimal : ',',
    altDecimal : '.',
    minus : '-',
    milliard : '.',
    milliardRemove : true,
    format: false
  };

  function focus_handler(e) {
    var val = this._beforeFocusValue = this.value;
    var selectAll = false;
    if (!!document.selection && document.selection.createRange().text == this.value) {
      selectAll = true;
    }
    if (val.indexOf(e.data.milliard) !== -1) {
      var pos, millPos = [];
      var caretPos = TF7.UI.Caret.getPosition(this);
      while ((pos = val.indexOf(e.data.milliard)) !== -1) {
        val = val.replace(e.data.milliard, '');
        millPos.push(pos + millPos.length);
      }
      var diff = 0;
      for (var i = 0; i < millPos.length; i++) {
        if (millPos[i] >= caretPos) {
          break;
        }
        else {
         diff++;
        }
      }
      var nCaretPos = caretPos - diff;
      this.value = val;
      if (selectAll) {
        this.select();
      }
      else {
        TF7.UI.Caret.setTo(this, nCaretPos);
      }
    }
  }


  /**
   * keypress handler, disallows invalid characters
   */
  function kp_handler(e) {

    if (e.ctrlKey || e.metaKey) {
      return true;
    }

    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;

    if (key == 13) {
      return;
    }

    var decimal = e.data.decimal;
    var altDecimal = e.data.altDecimal;
    var minus = e.data.minus;
		var allow;
		var atFirstPosition = TF7.UI.Caret.isAtFirst(this);
		var allowsDecimal = decimal && this.value.indexOf(decimal) === -1 && (minus && this.value.indexOf(minus) === 0 ? TF7.UI.Caret.getPosition(this) > 1 : !atFirstPosition);



		if(key < 48 || key > 57)
		{
			/* the minus symbol is only allowed at the first position */
			if(minus && key == minus.charCodeAt(0) && atFirstPosition && this.value.indexOf(minus) === -1) return true;
			/* only one decimal separator allowed */
			if(!decimal || !allowsDecimal && (key == decimal.charCodeAt(0) || (altDecimal && key == altDecimal.charCodeAt(0))) )
			{
				allow = false;
			}
			if(
				key != 8 /* backspace */ &&
				key != 9 /* tab */ &&
				key != 13 /* enter */ &&
				key != 35 /* end */ &&
				key != 36 /* home */ &&
				key != 37 /* left */ &&
				key != 39 /* right */ &&
				key != 46 /* del */
			)
			{
				allow = false;
			}
			else
			{
				if(typeof e.charCode != "undefined")
				{
					if(e.keyCode == e.which && e.which != 0)
					{
						allow = true;
					}
					else if(e.keyCode != 0 && e.charCode == 0 && e.which == 0)
					{
						allow = true;
					}
				}
			}
			if(allowsDecimal && (key == decimal.charCodeAt(0) || (altDecimal && key == altDecimal.charCodeAt(0))))
			{
				allow = true;
			}
		}
		else
		{
			allow = true;
		}

    if (allow && altDecimal && key == altDecimal.charCodeAt(0)) {
      var el = this;
      var config = e.data;
      setTimeout(function() {
        replaceAltDecimal(el, config);
      }, 0);
    }


		return allow;
	}


  function blur_handler(e) {
    var val = $.trim(this.value);
    if (val.length)
      this.value = formatNumber(val, e.data.decimal, e.data.milliard);
  }

  /**
   * replaces altDecimal by decimal
   */
  function replaceAltDecimal(el, config) {
    if (config.decimal && config.altDecimal) {
      var curVal = el.value;
      var caretStart = curVal.indexOf(config.altDecimal);
      if (caretStart !== -1) {
        el.value = el.value.replace(config.altDecimal, config.decimal);
        TF7.UI.Caret.setTo(el, caretStart + 1);
      }
    }
  }


  /**
   * Checks if the caret is at first position, to allow or disallow entering the decimal
   * and the minus symbol. Warning: fakes result for non IE-Gecko browsers
   * See the following sources for caret positioning:
   *   http://parentnode.org/javascript/working-with-the-cursor-position/
   *   http://www.bazon.net/mishoo/articles.epl?art_id=1292
   * @param {DOMElementNode}
   * @returns {Boolean}
   */
  function isCaretAtFirst(el) {
    var caretPosition = getCaretPosition(el);
    return caretPosition !== undefined ? caretPosition === 0 : el.value.length == 0;
  }


  /**
   * Returns the index position of the caret for the given element
   * @param {DOMNodeElement} The input element (should be focused)
   * @returns {Integer|undefined} The position or undefined if the position cannot be calculated in this browser
   */
  function getCaretPosition(el) {
    if (el.selectionStart !== undefined) { // Gecko
      return el.selectionStart;
    }
    else if (document.selection) { // Internet Explorer
      var range = document.selection.createRange();
      var bookmark = range.getBookmark();
      var caretPos = bookmark.charCodeAt(2) - 2;
      return caretPos;
    }
    else {
      return undefined;
    }
  }

  /**
   * Puts the caret at the given position
   * @param {DOMNodeElement} obj
   * @param {Integer} pos Zero based index
   */
  function setCaretTo(obj, pos, posEnd) {
    posEnd = posEnd || pos;
    if(obj.createTextRange) {  // Explorer
        var range = obj.createTextRange();
        range.move("character", pos);
        range.select();
    } else if(obj.selectionStart !== undefined) { // Gecko
        obj.focus();
        obj.setSelectionRange(pos, pos);
    }
  }

  function formatNumber(val, decSep, thousSep) {
		var re = new RegExp("^-?[\\d]+(" + decSep  + "[\\d]+)?$");
		if (re.test(val)) {
			return (+val.unformat(decSep, thousSep)).format(null, decSep, thousSep);
		}
		return val;
	}


})(jQuery);
$.fn.hoverRows = function(cname) {

  var getTr, hovered;

  getTr = function(el) {
    while (el && el.tagName) {
      if (el.tagName.toLowerCase() == 'tr') {
        return $(el);
      }
      el = el.parentNode;
    }
    return $([]);
  };

  hovered = null;

  this
    .mouseout(function(e) {
    	var parent = e.toElement || e.relatedTarget;
    	while ( parent && parent != this) {
    	  try { parent = parent.parentNode; } catch(error) { parent = this; }
  	  }
    	if (parent != this && hovered) {
    	  $(hovered).removeClass(cname);
    	  hovered = null;
    	}
    })
  	.mouseover(function(e) {
  		var $tr = getTr(e.target);
  		if (!$tr[0] != hovered) {
  		  if (hovered) {
    			$(hovered)
    				.removeClass(cname);
				}
  	    $tr.addClass(cname);
  	    hovered = $tr[0];
  		}
  	});

  return this;

};

var SimpleDrag = {

	obj: null,
	col : [],

	init: function(d, h) {
		d.handler = h && h != null ? h : d;
		$(d.handler).bind("mousedown", SimpleDrag.start);
		d.handler.obj = d;
		SimpleDrag.col.push(d);
	},

	start: function(e) {
		var o = SimpleDrag.obj = this.obj;

		$(o).css("cursor", "move");

		var pos = findMousePos(e);

		o.lastMouseX = pos.x;
		o.lastMouseY = pos.y;

		$(document)
			.bind("mousemove", SimpleDrag.drag)
			.bind("mouseup", SimpleDrag.end);

    return false;
	},

	drag: function(e) {
		var o = SimpleDrag.obj;

		var ey = e.clientY;
		var ex = e.clientX;

		var pos = findMousePos(e);
		ey = pos.y;
		ex = pos.x;

		var y = parseInt($(o).css("top"));
		var x = parseInt($(o).css("left"));

		var x = TF7.positioning.getXY(o);
		var y = x.y;
		x = x.x;


		var ny = y + ey - o.lastMouseY;
		var nx = x + ex - o.lastMouseX;

		o.lastMouseY = ey;
		o.lastMouseX = ex;

		TF7.positioning.setXY(o, nx, ny);

		return false;
	},

	end: function() {
		$(document)
			.unbind("mousemove", SimpleDrag.drag)
			.unbind("mouseup", SimpleDrag.end);
		$(SimpleDrag.obj).css("cursor", "");
		SimpleDrag.obj = null;
	},

	destroy: function(d) {
		try {
			$(d.handler).unbind("mousedown", SimpleDrag.start);
			d.handler.obj = null;
			d.handler = null;
		} catch(e) {}
	}




};

(function($) {

$.extend($.fn, {

	simpleDrag: function(h) {
		return this.each(function() {
			var handler = $(this).find(h)[0];
			SimpleDrag.init(this, handler);
		});
	},

	simpleDragDestroy: function() {
		return this.each(function() {
			SimpleDrag.destroy(this);
		});
	}


});

$(window).one("unload", function() {
	var i = SimpleDrag.col.length;
	do {
		if (SimpleDrag.col[i-1]) {
			$(SimpleDrag.col[i-1]).simpleDragDestroy();
		}
	} while (i--);
});


})(jQuery);

/** Adds the number of days array to the Date object. */
Date._MD = new Array(31,28,31,30,31,30,31,31,30,31,30,31);

/** Constants used for time computations */
Date.SECOND = 1000 /* milliseconds */;
Date.MINUTE = 60 * Date.SECOND;
Date.HOUR   = 60 * Date.MINUTE;
Date.DAY    = 24 * Date.HOUR;
Date.WEEK   =  7 * Date.DAY;

Date.parseDate = function(str, fmt) {
	var today = new Date();
	var y = 0;
	var m = -1;
	var d = 0;
	var a = str.split(/\W+/);
	var b = fmt.match(/%./g);
	var i = 0, j = 0;
	var hr = 0;
	var min = 0;
	for (i = 0; i < a.length; ++i) {
		if (!a[i])
			continue;
		switch (b[i]) {
		    case "%d":
		    case "%e":
			d = parseInt(a[i], 10);
			break;

		    case "%m":
			m = parseInt(a[i], 10) - 1;
			break;

		    case "%Y":
		    case "%y":
			y = parseInt(a[i], 10);
			(y < 100) && (y += (y > 29) ? 1900 : 2000);
			break;

		    case "%b":
		    case "%B":
			for (j = 0; j < 12; ++j) {
				if (Calendar._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) { m = j; break; }
			}
			break;

		    case "%H":
		    case "%I":
		    case "%k":
		    case "%l":
			hr = parseInt(a[i], 10);
			break;

		    case "%P":
		    case "%p":
			if (/pm/i.test(a[i]) && hr < 12)
				hr += 12;
			else if (/am/i.test(a[i]) && hr >= 12)
				hr -= 12;
			break;

		    case "%M":
			min = parseInt(a[i], 10);
			break;
		}
	}
	if (isNaN(y)) y = today.getFullYear();
	if (isNaN(m)) m = today.getMonth();
	if (isNaN(d)) d = today.getDate();
	if (isNaN(hr)) hr = today.getHours();
	if (isNaN(min)) min = today.getMinutes();
	if (y != 0 && m != -1 && d != 0)
		return new Date(y, m, d, hr, min, 0);
	y = 0; m = -1; d = 0;
	for (i = 0; i < a.length; ++i) {
		if (a[i].search(/[a-zA-Z]+/) != -1) {
			var t = -1;
			for (j = 0; j < 12; ++j) {
				if (Calendar._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) { t = j; break; }
			}
			if (t != -1) {
				if (m != -1) {
					d = m+1;
				}
				m = t;
			}
		} else if (parseInt(a[i], 10) <= 12 && m == -1) {
			m = a[i]-1;
		} else if (parseInt(a[i], 10) > 31 && y == 0) {
			y = parseInt(a[i], 10);
			(y < 100) && (y += (y > 29) ? 1900 : 2000);
		} else if (d == 0) {
			d = a[i];
		}
	}
	if (y == 0)
		y = today.getFullYear();
	if (m != -1 && d != 0)
		return new Date(y, m, d, hr, min, 0);
	return today;
};

/** Returns the number of days in the current month */
Date.prototype.getMonthDays = function(month) {
	var year = this.getFullYear();
	if (typeof month == "undefined") {
		month = this.getMonth();
	}
	if (((0 == (year%4)) && ( (0 != (year%100)) || (0 == (year%400)))) && month == 1) {
		return 29;
	} else {
		return Date._MD[month];
	}
};

/** Returns the number of day in the year. */
Date.prototype.getDayOfYear = function() {
	var now = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
	var then = new Date(this.getFullYear(), 0, 0, 0, 0, 0);
	var time = now - then;
	return Math.floor(time / Date.DAY);
};

/** Returns the number of the week in year, as defined in ISO 8601. */
Date.prototype.getWeekNumber = function() {
	var d = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
	var DoW = d.getDay();
	d.setDate(d.getDate() - (DoW + 6) % 7 + 3); // Nearest Thu
	var ms = d.valueOf(); // GMT
	d.setMonth(0);
	d.setDate(4); // Thu in Week 1
	return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
};

/** Checks date and time equality */
Date.prototype.equalsTo = function(date) {
	return ((this.getFullYear() == date.getFullYear()) &&
		(this.getMonth() == date.getMonth()) &&
		(this.getDate() == date.getDate()) &&
		(this.getHours() == date.getHours()) &&
		(this.getMinutes() == date.getMinutes()));
};

/** Set only the year, month, date parts (keep existing time) */
Date.prototype.setDateOnly = function(date) {
	var tmp = new Date(date);
	this.setDate(1);
	this.setFullYear(tmp.getFullYear());
	this.setMonth(tmp.getMonth());
	this.setDate(tmp.getDate());
};

/** Prints the date in a string according to the given format. */
Date.prototype.print = function (str, l10n) {
	var m = this.getMonth();
	var d = this.getDate();
	var y = this.getFullYear();
	var wn = this.getWeekNumber();
	var w = this.getDay();
	var s = {};
	var hr = this.getHours();
	var pm = (hr >= 12);
	var ir = (pm) ? (hr - 12) : hr;
	var dy = this.getDayOfYear();
	if (ir == 0)
		ir = 12;
	var min = this.getMinutes();
	var sec = this.getSeconds();
	s["%a"] = l10n.sdn[w]; // abbreviated weekday name [FIXME: I18N]
	s["%A"] = l10n.dn[w]; // full weekday name
	s["%b"] = l10n.smn[m]; // abbreviated month name [FIXME: I18N]
	s["%B"] = s["%F"] = l10n.mn[m]; // full month name
	s["%f"] = s["%F"].toLowerCase();
	s["%C"] = 1 + Math.floor(y / 100); // the century number
	s["%d"] = (d < 10) ? ("0" + d) : d; // the day of the month (range 01 to 31)
	s["%e"] = d; // the day of the month (range 1 to 31)
	s["%H"] = (hr < 10) ? ("0" + hr) : hr; // hour, range 00 to 23 (24h format)
	s["%I"] = (ir < 10) ? ("0" + ir) : ir; // hour, range 01 to 12 (12h format)
	s["%j"] = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy; // day of the year (range 001 to 366)
	s["%k"] = hr;		// hour, range 0 to 23 (24h format)
	s["%l"] = ir;		// hour, range 1 to 12 (12h format)
	s["%m"] = (m < 9) ? ("0" + (1+m)) : (1+m); // month, range 01 to 12
	s["%M"] = (min < 10) ? ("0" + min) : min; // minute, range 00 to 59
	s["%n"] = "\n";		// a newline character
	s["%p"] = pm ? "PM" : "AM";
	s["%P"] = pm ? "pm" : "am";
	s["%s"] = Math.floor(this.getTime() / 1000);
	s["%S"] = (sec < 10) ? ("0" + sec) : sec; // seconds, range 00 to 59
	s["%t"] = "\t";		// a tab character
	s["%U"] = s["%W"] = s["%V"] = (wn < 10) ? ("0" + wn) : wn;
	s["%u"] = w + 1;	// the day of the week (range 1 to 7, 1 = MON)
	s["%w"] = w;		// the day of the week (range 0 to 6, 0 = SUN)
	s["%y"] = ('' + y).substr(2, 2); // year without the century (range 00 to 99)
	s["%Y"] = y;		// year with the century
	s["%%"] = "%";		// a literal '%' character

	var re = /%./g;
		return str.replace(re, function (par) { return s[par] || par; });

};

Date.prototype.__msh_oldSetFullYear = Date.prototype.setFullYear;
Date.prototype.setFullYear = function(y) {
	var d = new Date(this);
	d.__msh_oldSetFullYear(y);
	if (d.getMonth() != this.getMonth())
		this.setDate(28);
	this.__msh_oldSetFullYear(y);
};

TF7.Calendar = function(onSelected, o) {

	this.cfg = {
		weekNumbers : false,
		minYear : 1970,
		maxYear : 2050,
		showOtherMonths : false,
		yearStep : 2,
		hiliteToday : true,
		hoverRows : true,
		multiple : null,
		l10n : {},
		foo: null
	};

	if (typeof onSelected == "function") {
		this.onSelected = onSelected;
	} else {
		o = onSelected;
	}

	jQuery.extend(this.cfg, o || {});

	this.activeDiv = null;
	this.currentDateEl = null;
	this.getDateStatus = null;
	this.getDateToolTip = null;
	this.getDateText = null;
	this.timeout = null;
	this.dragging = false;
	this.hidden = false;
	this.isPopup = true;
	this.aDays = null;
	this.table = null;
	this.element = null;
	this.tbody = null;
	this.firstdayname = null;
	this.monthsCombo = null;
	this.yearsCombo = null;
	this.hilitedMonth = null;
	this.activeMonth = null;
	this.hilitedYear = null;
	this.activeYear = null;
	this.dateClicked = false;

};



TF7.Calendar.displayWeekDays = function(cal, firstCell) {
	var dayprops = cal.cfg.l10n["dayprops"];
	var firstDay = cal.cfg.l10n["firstDayOfWeek"];
	var cell = firstCell;
	for (var i = 0; i < 7; ++i) {
		cell.className = "day name";
		var realDay = (i + firstDay) % 7;
		if (dayprops[realDay]) {
			cell.className += " weekend";
		}
		cell.innerHTML = cal.cfg.l10n.sdn[realDay];
		cell = cell.nextSibling;
	}
};


TF7.Calendar.click = function(e, cal) {
	var el = e.target;
	cal.dageClicked = false;

	if (el.disabled) {
		return false;
	}


	if (el.calDate) {
		var otherMonth = el.otherMonth; // WARNING: Strictly necessary
		cal.setDate(el.calDate);
		if (!otherMonth) {
			cal.dateClicked = true;
			cal.callHandler();
			if (cal.isPopup) cal.hide();
		}
		return;
	}
	while (el && el != cal.element && !el.navType && el.navType !== 0) {
		el = el.parentNode;
	}
	if (el && el.navType) {
		switch(el.navType) {
			case 1:
				cal.nextMonth();
				break;
			case -1:
				cal.prevMonth();
				break;
		}
		return;
	}

};

TF7.Calendar.mousedown = function(e, cal) {
	var el = e.target;
	if (el.disabled) {
		return false;
	}

	while (el && !el.calDate && el != cal.element && !el.navType && el.navType !== 0) {
		el = el.parentNode;
	}
	if (el && (el.navType || el.calDate)) {
		$(el).addClass("active");
	}
	if (el == cal.titleMonth) {
		if (cal.timeout) {
			clearTimeout(cal.timeout);
		}
		cal.timeout = setTimeout(function() {
			TF7.Calendar.showMonthsCombo(cal);
		}, 50);
	}

	if (el == cal.titleYear) {
		if (cal.timeout) {
			clearTimeout(cal.timeout);
		}
		cal.timeout = setTimeout(function() {
			TF7.Calendar.showYearsCombo(cal);
		}, 50);

	}
	return false; // cancel selection on Mozilla
};

TF7.Calendar.mouseup = function(e, cal) {
	var el = e.target;
	while (el && !el.calDate && el != cal.element && !el.navType && el.navType !== 0) {
		el = el.parentNode;
	}
	if (el && (el.navType || el.calDate)) {
		$(el).removeClass("active");
	}
	if (cal.timeout) {
		clearTimeout(cal.timeout);
		cal.timeout = null;
	}

	var date;
	if (e.target.month !== undefined) {
		date = new Date(cal.date);
		date.setMonth(e.target.month);
		cal.setDate(date);
	}

	if (e.target.year !== undefined) {
		date = new Date(cal.date);
		date.setFullYear(e.target.year);
		cal.setDate(date);
	}

	cal._hideCombos();
};

TF7.Calendar.keypress = function(e) {
	var done, date, year;
	var cal = TF7.globals.Calendar;
	if (e.keyCode == 9 || e.keyCode == 27) cal.hide();
	var modifier = e.ctrlKey;
	if (e.type == "keypress") { // cancelar movimiento
		switch (e.keyCode) {
			case 37:
			case 38:
			case 39:
			case 40:
				return false;
		}
	}
	if (modifier) {
		switch(e.keyCode) {
			case 37: // left
				cal.prevMonth();
				done = true;
				break;
			case 39: // right
				cal.nextMonth();
				done = true;
				break;
			case 40: // down
				date = new Date(cal.date);
				year = date.getFullYear();
				if (year < cal.cfg.maxYear) {
					date.setFullYear(year + 1);
					cal.setDate(date);
				}
				done = true;
				break;
			case 38: // up
				date = new Date(cal.date);
				year = date.getFullYear();
				if (year > cal.cfg.minYear) {
					date.setFullYear(year - 1);
					cal.setDate(date);
				}
				done = true;
				break;
		}
	} else {
		var ndate, step;
		switch (e.keyCode) {
			case 37: // left
				step = -1;
				break;
			case 39: // right
				step = +1;
				break;
			case 40: // down
				step = 7;
				break;
			case 38: // up
				step = -7;
				break;
			case 32: // space
			case 13: // enter
				cal.setDate(cal.currentDateEl.calDate);
				cal.callHandler();
				if (cal.isPopup) {
					e.stopPropagation();
					cal.hide();
				}
				done = true;
				break;
		}
	}

	if (step) {
		var invalid = false;
		ndate = new Date(cal.date);
		ndate.setDate(ndate.getDate() + step);
		if (cal.getDateStatus) {
			var st = cal.getDateStatus(ndate.setHours(0,0,0));
			if (st === true || ("" + st).indexOf("disabled") !== -1) {
				invalid = true;
			}
		}
		if (!invalid) {
			cal.setDate(ndate);
		}
		done = true;
	}

	if (done) {
		return false;
	}
};

TF7.Calendar.bodyclick = function(e) {
	var cal = TF7.globals.Calendar;
	var t = e.target;
	while (t) {
		if (t == cal.element) {
			return;
		}
		t = t.parentNode;
	}
	cal.hide();
};


TF7.Calendar.mouseover = function(e) {
	$(this).addClass("hilite");
};

TF7.Calendar.mouseout = function(e) {
	$(this).removeClass("hilite");
};

TF7.Calendar.showMonthsCombo = function(cal) {
	var mon = cal.date.getMonth();
	var $combo = $(cal.monthsCombo);
	$combo.find("div").removeClass("active").eq(mon).addClass("active");
	if (!cal.monthsCombo._initialized) {
		$combo.find("div").hover(TF7.Calendar.mouseover, TF7.Calendar.mouseout);
		cal.monthsCombo._initialized;
	}
	var cd = cal.titleMonth.firstChild;
	var css = {
		left : cd.offsetLeft + "px",
		top : (cd.offsetTop + cd.offsetHeight) + "px",
		width : cd.offsetWidth + "px"
	};
	$(cal.monthsCombo).css(css).show();
};

TF7.Calendar.showYearsCombo = function(cal) {
	var yc = cal.yearsCombo;
	var Y = cal.date.getFullYear();
	yr = $(yc).find('div:eq(0)')[0];
	var min = Math.max(Y - 5, cal.cfg.minYear);
	var max = Math.min(min + 12, cal.cfg.maxYear);
	if (max < min + 11) {
		min = max - 11;
		max = min + 12;
	}
	for (var i = min; i < max; ++i) {
		yr.innerHTML = i;
		yr.setAttribute("year", i);
		yr.year = i;
		yr = yr.nextSibling;
	}
	$yc = $(yc);
	$yc.find("div").removeClass("active").filter("[@year=" + cal.date.getFullYear() + "]").addClass("active");
	if (!yc._initialized) {
		$yc.find("div").hover(TF7.Calendar.mouseover, TF7.Calendar.mouseout);
		yc._initialized = true;
	}
	var cd = cal.titleYear.firstChild;
	var css = {
		left : cd.offsetLeft + "px",
		top : (cd.offsetTop + cd.offsetHeight) + "px",
		width : cd.offsetWidth + "px"
	};
	$(yc).css(css).show();
};

TF7.Calendar.prototype = {

	create: function(holder) {
		function create(el, parent) {
			var c = document.createElement(el);
			if (parent) parent.appendChild(c);
			return c;
		}

		function cell(row, text, cs, navType) {
			var cell = create("td", row);
			cell.colSpan = cs;
			cell.className = "button";
			if (navType != 0) {
			}
			cell.navType = navType;
			cell.innerHTML = "<div unselectable='on'>" + text + "</div>";
			return cell;
		}

		var parent = null;
		if (!holder) {
			parent = document.body;
			this.isPopup = true;
		} else {
			parent = holder;
			this.isPopup = false;
		}
		this.date = new Date();

		var div = create("div");
    $(div).bgIframe();
		this.element = div;
		div.className = "calendar";
		if (this.isPopup) {
			div.style.position = "absolute";
			div.style.display = "none";
		}

		var table = this.table = create("table", div);

		var thead = create("thead", table);

		var cell;
		var row = create("tr", thead);
		row.className = "headrow";

		this._nav_pm = cell(row, "&#x2039;", 1, -1);
		this._nav_pm.title = this.cfg.l10n.tt["prevMonth"];

		this.titleMonth = cell(row, "", this.cfg.weekNumbers ? 4 : 3, 300);
		this.titleMonth.className = "title title-month nav";

		this.titleYear = cell(row, "", 2, 300);
		this.titleYear.className = "title title-year nav";

		this._nav_nm = cell(row, "&#x203a;", 1, 1);
		this._nav_nm.title = this.cfg.l10n.tt["nextMonth"];

		row = create("tr", thead);
		row.className = "daynames";
		if (this.cfg.weekNumbers) {
			cell = create("td", row);
			cell.className = "name wn";
			cell.innerHTML = this.cfg.l10n["wk"];
		}
		for (var i = 7; i > 0; --i) {
			cell = create("td", row);
		}

		TF7.Calendar.displayWeekDays(this, row.childNodes[ this.weekNumbers ? 1 : 0 ]);

		var tbody = create("tbody", table);

		for (i = 6; i > 0; --i) {
			row = create("tr", tbody);
			if (this.cfg.weekNumbers) {
				cell = create("td", row);
			}
			for (var j = 7; j > 0; --j) {
				cell = create("td", row);
			}
		}

		div = create("div", this.element);
		$(div).bgIframe();
		this.monthsCombo = div;
		div.className = "combo";
		for (i = 0; i < this.cfg.l10n.mn.length; ++i) {
			var mn = create("div");
			mn.className = "label";
			mn.month = i;
			mn.innerHTML = this.cfg.l10n.mn[i];
			div.appendChild(mn);
		}

		div = create("div", this.element);
		this.yearsCombo = div;
		div.className = "combo";
		for (i = 12; i > 0; --i) {
			var yr = create("div");
			yr.className = "label";
			div.appendChild(yr);
		}
		$(div).bgIframe();
		this._init(this.date);
		parent.appendChild(this.element);
		this.bindEvents();

	} // end of create

,

	_init : function(date) {
		var today = new Date(),
			ty = today.getFullYear(),
			tm = today.getMonth(),
			td = today.getDate();

		this.table.style.visibility = "hidden";

		var year = date.getFullYear();

		if (year < this.cfg.minYear) {
			year = this.cfg.minYear;
		} else if (year > this.cfg.maxYear) {
			year = this.cfg.maxYear;
		}

		this.date = new Date(date);
		var month = date.getMonth();
		var mday = date.getDate();
		var noDays;// = date.getMonthDays();

		date.setDate(1);
		var day1 = (date.getDay() - this.cfg.l10n.firstDayOfWeek) % 7;
		if (day1 < 0) {
			day1 += 7;
		}
		date.setDate(-day1);
		date.setDate(date.getDate() + 1);

		var row = this.table.getElementsByTagName("tbody")[0].firstChild;
		var mn = this.cfg.l10n.smn[month];
		var aDays = [];
		var dayprops = this.cfg.l10n.dayprops;
		for (var i = 0; i < 6; ++i, row = row.nextSibling) {
			var cell = row.firstChild;
			if (this.cfg.weekNumbers) {
				cell.className = "day wn";
				cell.innerHTML = date.getWeekNumber();
				cell = cell.nextSibling;
			}
			row.className = "daysrow";
			var hasDays = false, iday, dpos = aDays[i] = [];
			for (var j = 0; j < 7; ++j, cell = cell.nextSibling, date.setDate(iday + 1)) {
				date.setHours(0, 0, 0);
				iday = date.getDate();
				var wday = date.getDay();
				cell.className = "day";
				cell.pos = i << 4 | j;
				cell.pos = [ i, j ];
				dpos[j] = cell;
				var currentMonth = (date.getMonth() == month);
				if (!currentMonth) {
					if (this.cfg.showOtherMonths) {
						cell.className += " othermonth";
						cell.otherMonth = true;
					} else {
						cell.className = "emptycell";
						cell.innerHTML = "&nbsp;";
						cell.disabled = true;
						continue;
					}
				} else {
					cell.otherMonth = false;
					hasDays = true;
				}
				cell.disabled = false;
				cell.innerHTML = this.getDateText ? this.getDateText(date, iday) : iday;
				/*if (dates) {
					dates[date.print("%Y%m%d")] = cell;
				}*/
				if (this.getDateStatus) {
					var status = this.getDateStatus( date, year, month, iday);
					if (status === true) {
						cell.className += " disabled";
						cell.disabled = true;
					} else {
						if (/disabled/i.test(status)) {
							cell.disabled = true;
						}
						cell.className += " " + status;
					}
				}
				if (!cell.disabled) {
					cell.calDate = new Date(date);
					cell.title = cell.calDate.print(this.cfg.l10n.tt["dateFormat"], this.cfg.l10n);
					if (!this.multiple && currentMonth && iday == mday && this.cfg.hiliteToday) {
						cell.className += " selected";
						this.currentDateEl = cell;
					}
					if (date.getFullYear() == ty && date.getMonth() == tm && iday == td) {
						cell.className += " today";
						cell.title += this.cfg.l10n.tt["partToday"];
					}
					if (dayprops[wday]) {
						cell.className += cell.otherMonth ? " oweekend" : " weekend";
					}
				} else {
					cell.removeAttribute("title");
				}

			} // end of for j

			if (!(hasDays /*|| this.cfg.showOtherMonths*/)) {
				row.className = "emptyrow";
			}

		} // end of for i

		this.aDays = aDays;

		this.titleMonth.firstChild.innerHTML = this.cfg.l10n.mn[month];
		this.titleYear.firstChild.innerHTML =  year;

		this.table.style.visibility = "visible";
	} // end of init
,

	_initMultipleDates : function() {
		if (this.multiple) {
			for (var i in this.multiple) {
				var cell = this.datesCells[i];
				var d = this.multiple[i];
				if (!d) continue;
				if (cell) cell.className += " selected";
			}
		}
	} // end of _initMultipleDates;
,

	setDate : function(date, force) {
		if (force || !date.equalsTo(this.date)) {
			this._init(date);
		}
	}
,

	show : function() {
		$("tbody", this.table)
			.find("tr")
				.removeClass("rowhilite")
				.find("td")
					.removeClass("hilite")
					.removeClass("active");
		this.element.style.display = "block";
		this.hidden = false;
		var cal = this;
		$(document)
			.bind("keydown", TF7.Calendar.keypress)
			.bind("keypress", TF7.Calendar.keypress);
		setTimeout(function() {
			$(document.body).bind("click", TF7.Calendar.bodyclick);
		}, 50);
	}
,

	showAt : function(x, y) {
		this.element.style.left = x + "px";
		this.element.style.top = y + "px";
		this.show();
	}

,

	align : function(anchor, positions, padding, offset) {
		$(this.element).css({visibility:'hidden', position: 'absolute', display: 'block'});
		TF7.positioning.align(this.element, anchor, positions, padding, offset);
		$(this.element).css({visibility: '', display: ''});
	}
,
	hide : function() {
		$(document)
			.unbind("keydown", TF7.Calendar.keypress)
			.unbind("keypress", TF7.Calendar.keypress)
			.unbind("click", TF7.Calendar.bodyclick);
		this._hideCombos();
		this.element.style.display = "none";
		this.hidden = true;
		if (this.onClose)
			this.onClose(this, this.date);
	}
,

	keypress : function(e) {
		return TF7.Calendar.keypress(e, this);
	}
,

	setMonth : function(date, m) { /* 0..11 */
		var day = date.getDate();
		var max = date.getMonthDays(m);
		if (day > max) {
			date.setDate(max);
		}
		date.setMonth(m);
	}

,

	nextMonth : function() {
		this.date.setDateOnly(this.date);
		var date = new Date(this.date);
		var mon = date.getMonth();
		var year = date.getFullYear();
		if (mon < 11) {
			this.setMonth(date, mon + 1);
		} else if (year < this.cfg.maxYear) {
			date.setFullYear(year + 1);
			this.setMonth(date, 0);
		}
		this.setDate(date);
	}

,

	prevMonth : function() {
		this.date.setDateOnly(this.date);
		var date = new Date(this.date);
		var mon = date.getMonth();
		var year = date.getFullYear();
		if (mon > 0) {
			this.setMonth(date, mon - 1);
		} else if (year > this.cfg.minYear) {
			date.setFullYear(year - 1);
			this.setMonth(date, 11);
		}
		this.setDate(date);
	}

,

	bindEvents : function() {
		var cal = this;
		$(this.element)
			.bind("click", function(e) {
				return TF7.Calendar.click(e, cal);
			})
			.bind("mousedown", function(e) {
				return TF7.Calendar.mousedown(e, cal);
			})
			.bind("mouseup", function(e) {
				return TF7.Calendar.mouseup(e, cal);
			})
			.find("tbody td")
				.hover(TF7.Calendar.mouseover, TF7.Calendar.mouseout);
		if (this.cfg.hoverRows) {
			$(this.element).find("tbody tr").hover(TF7.Calendar.mouseover, TF7.Calendar.mouseout);
		}

	}

,

	callHandler : function() {
		if (this.onSelected) {
			this.onSelected(this, this.date.print(this.cfg.l10n.dateFormat, this.cfg.l10n));
		}
	}

,

	onSelected: function(cal, date) {
	}
,

	_hideCombos : function() {
		this.monthsCombo.style.display = "none";
		this.yearsCombo.style.display = "none";
	}

,

	foo : "bar"


}; // end of TF7.Calendar.prototype











(function($) {

	$.fn.extend({

		tf7treeview : function(settings) {

			function toggleChild(el) {
				$(el)
					.swapClass(cn.collapsable, cn.expandable)
					.find(">ul")
					.toggle(cfg.speed);
			}


			var $this = $(this);

			var cn = {
				open: "open",
				closed: "closed",
				expandable: "expandable",
				collapsable: "collapsable",
				first: "first",
				last: "last",
				hitarea: "hitarea",
				fixed : "fixed"
			};

			var defaults = {

			};

			var cfg = $.extend(defaults, settings);

			$this.addClass("treeview");

			$( ( cfg.collapsed ? "li" : "li." +  cn.closed )  + ":not(." + cn.open + "):not(." + cn.fixed + ") > ul", this).hide();

			var parents = $("li:has(ul)", this);

			if (cfg.onparent)
				parents.each(function() {
					cfg.onparent(this);
				});

			parents
				.not("." + cn.fixed)
					.prepend('<span class="' + cn.hitarea + '" />')
					.find("." + cn.hitarea)
						.focusable()
						.bind("click", function(e) {
							toggleChild(this.parentNode);
						})
					.end()
					.filter(":has(>ul:hidden)")
						.addClass(cn.expandable)
					.end()
					.not(":has(>ul:hidden)")
						.addClass(cn.collapsable);

			$this
				.bind("selectstart", function(e) { return false; })
				.bind("click", function(e) {
					if ($(e.target).is("." + cn.hitarea) || e.target.tagName == "A") return;
					var p = e.target.tagName == "LI" ? e.target : $(e.target).parents("li")[0];
					if (p && !($(p).is("." + cn.fixed))) {
						toggleChild(p);
						return false;
					}
				});

		},

		swapClass : function (c1, c2) {
			return this.each(function() {
				var $this = $(this);
				if (jQuery.className.has(this, c1))
					$this.removeClass(c1).addClass(c2);
				else if (jQuery.className.has(this, c2))
					$this.removeClass(c2).addClass(c1);
			});
		}
	});
})(jQuery);
(function($) {

	$.fn.extend({

		tf7treecheckboxes : function() {
			return this.each(function() {
				$(this)
					.find("input[@type=checkbox], input[@type=radio]")
						.bind("click", clickHandler)
					.end()
					.find("label")
						.bind("click", labelClickHandler)
						.bind("dblclick", labelDblClickHandler);
			});
		}

	});

	function labelClickHandler(e) {
		e.preventDefault();
		e.stopPropagation();
		if (this._clickingTO) return;
		var trigger = $(this).parents("li:eq(0)").find("span.hitarea");
		var that = this;
		this._clickingTO = setTimeout(function() {
			trigger.trigger("click");
			that._clickingTO = null;
		}, 200);
	}

	function labelDblClickHandler(e) {
		e.preventDefault();
		clearTimeout(this._clickingTO);
		this._clickingTO = null;
		var ch = $(this).find("input[@type=checkbox]")[0];
		if (ch)
			ch.checked = !ch.checked;
		else {
			ch = $(this).find("input[@type=radio]")[0];
			if (ch && !ch.checked)
				ch.checked = true;
		}
		$(ch).trigger("click", [false]);
	}


	function clickHandler (e, propagate) {
		e.stopPropagation();
		unsetSemichecked(this);
		changeStatusesFrom(this, true, true);
		return propagate;
	}

	function changeStatusesFrom(el, up, down) {
		var status = el.checked;
		var parent = getCBParent(el);
		var siblings = getCBSiblingsAndDescendants(el);
		var children = getCBChildren(el);
		if (down && children.length) {
			jQuery.each(children, function() {
			  if (status) {
			    setChecked(this, false);
			  } else {
			    setUnchecked(this, false);
			  }
			});
		}
		if (parent && up) {
			if (el.checked && every(siblings, function(it) { return it.checked; }))
				setChecked(parent, up, false);
			else if (!el.checked && none(siblings, function(it) { return it.checked; }))
					setUnchecked(parent, up, false);
			else
				setSemichecked(parent, up);
		}
	}

	function setChecked(el, up, down) {
		el.checked = true;
		unsetSemichecked(el);
		if (up)
			changeStatusesFrom(el, up, false);

	}

	function setUnchecked(el, up, down) {
		el.checked = false;
		unsetSemichecked(el);
		if (up)
			changeStatusesFrom(el, up, false);
	}

	function setSemichecked(el, up) {
		el.checked = false;
		if (el.semichecked) return;
		el.semichecked = true;
		if (jQuery.browser.msie) {
			var cloned = getClone();
			el.parentNode.insertBefore(cloned, el);
			$(cloned).bind("click", function() {
				el.checked = true;
				unsetSemichecked(el);
				changeStatusesFrom(el, true, true);
			});
		} else
			$(el).addClass("semichecked");
		if (up)
			changeStatusesFrom(el, up);
	}

	function unsetSemichecked(el) {
		if (!el.semichecked) return;
		el.semichecked = false;
		if (jQuery.browser.msie) {
			$(el).prev(".semichecked").unbind().remove();
		} else
			$(el).removeClass("semichecked");
	}

	function getClone() {
		if (!getClone.clonable) {
			var clone = document.createElement("span");
			clone.className = "semichecked";
			clone.style.display = "inline-block";

			clone.style.width = "20px";
			clone.style.height = "20px";
			clone.style.position = "absolute";
			clone.style.marginLeft = "4px";
			getClone.clonable = clone;
		}
		return getClone.clonable.cloneNode(true);
	}

	function getCBParent(el) {
		var anc = $(el).parents("li:eq(0)").parents("li:eq(0)").find("input[@type=checkbox]:eq(0)");
		return anc.length && anc[0] != el ? anc[0] :  null;
	}

	function getCBSiblingsAndDescendants(el) {
		var siblings = $(el).parents("ul:eq(0)").find(">li input[@type=checkbox]").get();
		return siblings;
	}

	function getCBChildren(el) {
		var children = $(el).parents("li:eq(0)").find("ul:eq(0)").find("> li input[@type=checkbox]").get();
		return children;

	}

	function every(col, f) {
		for (var i = 0, c = col.length; i < c; i++)
			if (!f.call(null, col[i]))
				return false;
		return true;
	}

	function none(col, f) {
		for (var i = 0, c = col.length; i < c; i++)
			if (f.call(null, col[i]))
				return false;
		return true;
	}


})(jQuery);
/**
 * TF7.UI.HierarchicalTable - Hierarchical and collapsable table widget
 */
(function () {


	TF7.UI.HierarchicalTable = function(el, options) {
		this.source = el;
		this.options = jQuery.extend({}, TF7.UI.HierarchicalTable.__DEFAULTS__, options);
		this.options.regexp = new RegExp('(^|\\s+)'+ this.options.levelClassPrefix +'([0-9+])($|\\s+)');
		this.options.span = '<span class="' + this.options.triggerClass + '" tabindex="0" />';
		this.init();
	};

	TF7.UI.HierarchicalTable.__DEFAULTS__ = {
		defaultNodeStatus : 'closed',
		tableClass : 'tf7ui-collapsable-table',
		nodeClass : 'tf7ui-collapsable-table-node',
		collapsableClass : 'tf7ui-collapsable-table-node-collapsable',
		openClass : 'tf7ui-collapsable-table-node-open',
		closedClass : 'tf7ui-collapsable-table-node-closed',
		triggerClass: 'trigger',
		triggerAllClass : 'trigger-all',
		triggerContainerSelector: 'span.obridor',
		levelClassPrefix: 'level-',
		onBeforeShowChildren : function() {
			return true;
		}
	};



	TF7.UI.HierarchicalTable.prototype = {

		init: function() {
			var self = this;
			var $el = jQuery(this.source);

			if (!jQuery.browser.msie) {
				$el
					.find('tr:hidden')
						.each(function() {
							this.oldblock = 'table-row';
						});
			}

			jQuery('tbody tr', this.source)
				.each(function() {
					self.initRow(this);
				});

			jQuery('thead tr', this.source)
				.each(function() {
					self.initHeader(this);
				});

			$el.addClass(this.options.tableClass);

			this.bindEvents();
			this.updateMainTrigger();
		},

		bindEvents : function() {
			$el = jQuery(this.source);
			var listener = bindAsEventListener(onDOMEventHandler, this);
			var listenerh = bindAsEventListener(onHeadDOMEventHandler, this);
			$el
				.find('tbody')
					.bind('click', listener)
					.bind('keypress', listener)
					.bind('keydown', listener)
				.end()
				.find('thead')
					.bind('click', listenerh)
					.bind('keypress', listenerh)
					.bind('keydown', listenerh);
		},
		initRow : function(tr) {
			var $tr = jQuery(tr);
			var options = this.options;
			if ($tr.hasClass(options.nodeClass)) {
				if ($tr.hasClass(options.openClass) || !$tr.hasClass(options.collapsableClass)) {
					this.showChildrenByDefault(tr);
				}
				if ($tr.hasClass(options.collapsableClass)) {
					$tr
						.find(options.triggerContainerSelector + ':eq(0)')
							.each(function() {
								if (!jQuery(this).find('.' + options.triggerClass).length) {
									jQuery(this).prepend(options.span);
								}
							});
				}
			}
		},
		initHeader : function(tr) {
			var $tr = jQuery(tr);
			var options = this.options;
			$tr
				.find(options.triggerContainerSelector)
					.each(function() {
						if (!jQuery(this).find('.' + options.triggerAllClass).length) {
							jQuery(this).prepend(options.span);
						}
					});
		},
		showChildren : function(tr) {
			if (!this.options.onBeforeShowChildren.call(this, tr)) {
				return;
			}
			var $children = this.getChildren(tr);
			var widget = this;
			$children
				.show()
				.each(function() {
					if (jQuery(this).hasClass(widget.options.openClass)) {
						widget.showChildren(this);
					}
				});
			jQuery(tr).removeClass(this.options.closedClass).addClass(this.options.openClass);
		},
		hideChildren : function(tr, changeState) {
			if (changeState === undefined) {
				changeState = true;
			}
			var $children = this.getChildren(tr);
			var widget = this;
			$children
				.hide()
				.each(function() {
					if (jQuery(this).hasClass(widget.options.nodeClass)) {
						widget.hideChildren(this, false);
					}
				});
			if (changeState) {
				jQuery(tr).removeClass(this.options.openClass).addClass(this.options.closedClass);
			}
		},
		showChildrenByDefault : function(tr) {
			var level = +(tr.className.match(this.options.regexp)[2]);
			if (level == 0) {
				this.showChildren(tr);
			} else {
				var p = jQuery(tr).prev('tr.' + this.options.nodeClass + '.' + this.options.levelClassPrefix + (level - 1)).eq(0);
				if (p.length && (p.hasClass(this.options.openClass) || !p.hasClass(this.options.collapsableClass))) {
					this.showChildren(tr);
				}
			}
		},
		toggleChildren : function(tr) {
			if (jQuery(tr).hasClass(this.options.openClass)) {
				this.hideChildren(tr);
			} else {
				this.showChildren(tr);
			}
		},
		getChildren : function(tr) {
			var siblings = jQuery(tr.parentNode.getElementsByTagName("tr"));
			var index = siblings.index(tr);
			var level = +(tr.className.match(this.options.regexp)[2]);
			var nextLevel = level + 1;
			var levelClassPrefix = this.options.levelClassPrefix;
			var res = [];
			var end = false;
			siblings.slice(index + 1).each(function(i) {
				var childLevel;
				if (end) return false;
				end = jQuery(this).hasClass(levelClassPrefix + level);
				if (!end && jQuery(this).hasClass(levelClassPrefix + nextLevel)) {
					res.push(this);
				}
			});
			return jQuery(res);
		},
		expandAll : function() {
			var widget = this;
			jQuery('tbody tr.'+ widget.options.nodeClass + '.' + widget.options.closedClass, widget.source)
				.each(function() {
					widget.showChildren(this, false);
				});
			this.updateMainTrigger(true);
		},
		collapseAll : function() {
			var widget = this;
			jQuery('tbody tr.'+ widget.options.nodeClass + '.' + widget.options.openClass, widget.source)
				.each(function() {
					widget.hideChildren(this);
				});
			this.updateMainTrigger(false);
		},
		toggleAll : function(trigger) {
			var $tr = jQuery(trigger).parents('tr:first');
			if ($tr.hasClass(this.options.openClass)) {
				this.collapseAll();
			} else {
				this.expandAll();
			}
		},
		updateMainTrigger : function(open) {
			var $maintrigger = jQuery('thead span.'+ this.options.triggerClass, this.source);
			if ($maintrigger.length) {
				$tr = $maintrigger.parents('tr:first');
				if (open !== undefined) {
					$tr.addClass(open ? this.options.openClass : this.options.closedClass).removeClass(open ? this.options.closedClass : this.options.openClass);
				} else {
					var colapsables = jQuery('tbody tr.' + this.options.nodeClass, this.source).length;
					var oberts = jQuery('tbody tr.' + this.options.openClass, this.source).length;
					if (colapsables == oberts) {
						$tr.addClass(this.options.openClass).removeClass(this.options.closedClass);
					} else if (oberts == 0) {
						$tr.addClass(this.options.openClass).removeClass(this.options.openClass);
					}
				}
			}
		}

	};


	function onDOMEventHandler(e) {
		var options = this.options;
		var $t = jQuery(e.target);
		if (e.type == 'click') {
			if (
			  ($t.hasClass(options.triggerClass) || $t.is(options.triggerContainerSelector))
			  && $t.parents('tr:first').hasClass(options.collapsableClass)
			) {
					this.toggleChildren($t.parents('tr:first')[0]);
					this.updateMainTrigger();
			}
		}
		else if (e.type == 'keypress' || jQuery.browser.msie && e.type == 'keydown') {
			var handled;
			var which = e.which || e.charCode || e.keyCode;
			if ($t.hasClass(options.triggerClass)) {
				if (which == 39 || which == 43) { // right, +
					this.showChildren($t.parents('tr:first')[0]);
					this.updateMainTrigger();
					handled = true;
				} else if (which == 37 || which == 45) { // left, -
					this.hideChildren($t.parents('tr:first')[0]);
					this.updateMainTrigger();
					handled = true;
				} else if (which == 40 || which == 38) { // down || up
					var $siblings = $t.parents('tbody:first').find('tr:visible span.' + options.triggerClass);
					var idx = $siblings.index(e.target);
					var focusable = $siblings[idx + (which == 38 ? -1 : +1)];
					if (focusable) {
						focusable.focus();
					}
					handled = true;
				}
				if (handled) {
					e.preventDefault();
				}
			}
		}
	}

	function onHeadDOMEventHandler(e) {
		var $t = $(e.target);
		var options = this.options;
		var which = e.which || e.charCode || e.keyCode;
		var handled;
		if ($t.hasClass(options.triggerClass) || $t.is(options.triggerContainerSelector)) {
			if (e.type == 'click') {
				this.toggleAll(e.target);
			} else if (e.type == 'keypress' || e.type == 'keydown' && jQuery.browser.msie) {
				if (which == 39 || which == 43) { // right, +
					this.expandAll();
					handled = true;
				}	else if (which == 37 || which == 45) { // left, -
					this.collapseAll();
					handled = true;
				}
			}
			if (handled) {
				e.preventDefault();
			}
		}

	}


	function inHeader(el) {
		var cur = el.parentNode;
		while (cur && cur.tagName.toLowerCase() != 'table') {
			if (cur.tagName.toLowerCase() == 'thead') {
				return true;
			}
			cur = cur.parentNode;
		}
		return false;
	}

	function bindAsEventListener(fn, o) {
		var _m = fn;
		var args = [].slice.call(arguments, 1);
		var obj = args.shift();
		return function() {
			return _m.apply(obj, [].concat([].slice.call(arguments, 0)).concat(args).concat(this));
		};
	}


})();
$.fn.tf7uiHierarchicalTable = function(options) {
	options = options || {};
	return this.each(function() {
		new TF7.UI.HierarchicalTable(this, options);
	});
};

(function($) {

	$.fn.extend({

		tf7tabletreecheckboxes : function() {
			return this.each(function() {
				cleanWhitespace(this);
				$(this)
					.find("input[@type=checkbox]")
						.bind("click", clickHandler)
						.each(function(e) {
							if (this.checked) {
								changeStatusesFrom(this, true, true);
							}
						})
					.end();
			});
		}

	});

	function clickHandler (e, propagate) {
	  if (this.disabled) return propagate;
		e.stopPropagation();
		unsetSemichecked(this);
		changeStatusesFrom(this, true, true);
		return propagate;
	}

	function changeStatusesFrom(el, up, down) {
		var status = el.checked;
		var parent = getCBParent(el);
		var siblings = getCBSiblingsAndDescendants(el);
		var children = getCBChildren(el);
		var desc = getCBChildren(el, true);
		if (down && desc.length) {
			jQuery.each(desc, function() { if (status) setChecked(this, false); else setUnchecked(this, false); });
		}

		if (parent && up) {
			if (el.checked && every(siblings, function(it) { return it.checked; }))
				setChecked(parent, up, false);
			else if (!el.checked && none(siblings, function(it) { return it.checked; }))
					setUnchecked(parent, up, false);
			else
				setSemichecked(parent, up);
		}
	}

	function setChecked(el, up, down) {
		el.checked = true;
		unsetSemichecked(el);
		if (up)
			changeStatusesFrom(el, up, false);

	}

	function setUnchecked(el, up, down) {
		el.checked = false;
		unsetSemichecked(el);
		if (up)
			changeStatusesFrom(el, up, false);
	}

	function setSemichecked(el, up) {
		el.checked = false;
		if (el.semichecked) return;
		el.semichecked = true;
		if (jQuery.browser.msie) {
			var cloned = getClone();
			el.parentNode.insertBefore(cloned, el);
			$(cloned).bind("click", function() {
				el.checked = true;
				unsetSemichecked(el);
				changeStatusesFrom(el, true, true);
			});
		} else
			$(el).addClass("semichecked");
		if (up)
			changeStatusesFrom(el, up);
	}

	function unsetSemichecked(el) {
		if (!el.semichecked) return;
		el.semichecked = false;
		if (jQuery.browser.msie) {
			$(el).prev(".semichecked").unbind().remove();
		} else
			$(el).removeClass("semichecked");
	}

	function getClone() {
		if (!getClone.clonable) {
			var clone = document.createElement("span");
			clone.className = "semichecked";
			clone.style.display = "inline-block";

			clone.style.width = "20px";
			clone.style.height = "20px";
			clone.style.position = "absolute";
			clone.style.marginLeft = "4px";
			getClone.clonable = clone;
		}
		return getClone.clonable.cloneNode(true);
	}

	function getCBParent(el) {
		var tr = $(el).parents('tr')[0];
		var m = tr.className.match(/(^|\s+)nivell-([0-9+])($|\s+)/);
		var level = m && +m[2];
		if (!level)
			return null;
		var siblings = tr.parentNode.childNodes;
		var el, c = 0;
		while (siblings[c] && tr != siblings[c])
			c++;
		var parent;
		for (var i = c - 1; i >= 0; i--) {
			if ($(siblings[i]).is('.pare.nivell-' + (level - 1))) {
				parent = siblings[i];
				break;
			}
		}
		if (!parent)
			return null;
		var cb = $(parent).find('input[@type=checkbox]');
		return cb.length ? cb[0] : null;
	}

	function getCBSiblingsAndDescendants(el) {
		var parent = getCBParent(el);
		var ret = [];
		var children = parent ? getCBChildren(parent) : [el];
		for (var i = 0; i < children.length; i++) {
			ret.push(children[i]);
			var desc = getCBChildren(children[i], true);
			if (desc)
				ret.push.apply(ret, desc);
		}
		return ret;
	}

	function getCBChildren(el, recursive) {
		var tr = $(el).parents('tr')[0];
		var m = tr.className.match(/(^|\s+)nivell-([0-9+])($|\s+)/);
		var level = -1 && m && +m[2];
		if (level === -1)
			return [];
		var siblings = tr.parentNode.childNodes;
		var c = 0;
		while (siblings[c] && tr != siblings[c]) {
			c++;
		}
		var ret = [];
		var end = false;
		for (var i = c + 1; i < siblings.length; i++) {
			end = jQuery.className.has(siblings[i], "nivell-" + level);
			if (!end && $.className.has(siblings[i], 'nivell-' + (level + 1))) {
				ret.push(siblings[i]);
			}
			if (end)
				break;
		}
		var children = $(ret).find("input[@type=checkbox]").get();
		if (recursive) {
			ret = [];
			for (var j = 0; j < children.length; j ++) {
				ret.push(children[j]);
				ret.push.apply(ret, getCBChildren(children[j], true));
			}
			return ret;
		} else
			return children;

	}

	function every(col, f) {
		for (var i = 0, c = col.length; i < c; i++)
			if (!f.call(null, col[i]))
				return false;
		return true;
	}

	function none(col, f) {
		for (var i = 0, c = col.length; i < c; i++)
			if (f.call(null, col[i]))
				return false;
		return true;
	}

	function cleanWhitespace(element) {
    var node = element.firstChild;
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
        element.removeChild(node);
      node = nextNode;
    }
    return element;
  }



})(jQuery);
(function($) {
	function triggerClick(e) {
		if (e.keyCode == 13) {
			$(this).trigger("click");
			return false;
		}
	}

	$.extend($.fn, {
		focusable: function(handleEnter, cn) {
			this.attr("tabIndex", 0);
			if (handleEnter === undefined || handleEnter)
				this.bind("keypress", triggerClick);
			if (cn) {
				this
					.bind("focus", function() {
						$(this).addClass(cn);
					})
					.bind("blur", function() {
						$(this).removeClass(cn);
					});
			}
			return this;
		}
	});
})(jQuery);
TF7.CustomEvent = function(type, scope) {
	this.type = type;
	this.scope = scope || window;
	this.subscribers = [];
};

TF7.CustomEvent.prototype = {

	subscribe : function(fn, obj, override) {

		this.subscribers.push(new TF7.Subscriber(fn, obj, override));

	}
	,
	unsubscribe : function(fn, obj) {
		if (!fn)
			return this.unsubscribeAll();
		var found = false;
		var i, s;
		for (i = 0; i < this.subscribers.length; ++i) {
			s = this.subscribers[i];
			if (s && s.equals(fn, obj)) {
				this._delete(i);
				found = true;
			}
		}
		return found;
	}
	,
	unsubscribeAll : function() {
		for (var i = 0, c = 0; i < this.subscribers.length; ++i, ++c)
			this._delete(i--);
		return c;
	}
	,
	fire : function() {
		var len = this.subscribers.length;
		if (!len)
			return;

		var args = [].slice.call(arguments, 0);
		var ret, i;

		for (i = 0; i < len; ++i) {
			var s = this.subscribers[i];
			if (s) {
				var scope = s.getScope(this.scope);
				ret = s.fn.call(scope, this.type, args);
				if (false === ret)
					return false;
			}
		}
		return true;
	}
	,
	_delete : function(index) {
		var s = this.subscribers[index];
		if (s) {
			delete s.fn;
			delete s.obj;
		}
		this.subscribers.splice(index, 1);
	}

};

TF7.Subscriber = function(fn, obj, override) {
	this.fn = fn;
	this.obj = obj || null;
	this.override = override;
};

TF7.Subscriber.prototype.getScope = function(def) {
	if (this.override)
		if (this.override === true)
			return this.obj;
		else
			return this.override;
	return def;
};

TF7.Subscriber.prototype.equals = function(fn, obj) {
	if (obj)
		return (fn == this.fn && obj == this.obj);
	else
		return (fn == this.fn);
};
TF7.UI.FeedbackLite = function(el, conf) {

	this._dom = el;


};


TF7.UI.FeedbackLite.prototype = {

	show : function() {
		var widget = this;
		$(document.documentElement).addClass('hasFBL');
		if (!$(this._dom).find('span.feedback-lite-close').length)
			$(this._dom).append('<span class="feedback-lite-close"></span>');
		$(this._dom)
			.appendTo(document.body)
			.animate({ 'bottom': 0 }, TF7.conf.feedbackSpeed || 500)
			.hover(function() {
				$(this).addClass('hover');
			}, function() {
				$(this).removeClass('hover');
			})
			.find('span.feedback-lite-close')
				.focusable()
				.bind("click", function() {
					widget.hide();
				});
	},

	hide : function() {
		$(this._dom).hide();
		$(document.documentElement).removeClass("hasFBL");
	}

};
TF7.UI.Button = function(el, opts) {
  if (el && typeof el == 'object' && !el.nodeType) {
    opts = el;
    el = null;
  }
  opts = opts || {};
  this.config = $.extend({}, opts);
  if (el && el.nodeType) {
    this.element = el;
  } else {
    this.element = document.createElement('input');
    $(this.element)
      .attr({
        type : 'button',
        'class' : 'button',
        id: el || TF7.Dom.generateId(this.element),
        value : this.config.value
      });
    if (this.config.insertAfter) {
      var space = document.createTextNode(' ');
      $(this.config.insertAfter).after(this.element).next().before(space);
    }
  }
};
/**
 * Clase que gestiona la visualizaciÃ³n, el paso de parÃ¡metros y los eventos de
 * una miniaplicaciÃ³n genÃ©rica.
 * @class MiniappLauncher
 * @namespace TF7.UI
 * @extends TF7.UI.Button
 */

/**
 * Constructor de la clase
 * @constructor
 * @method MiniappLauncher
 * @param {NodeElement} el
 * @param {Object} opts Objeto de configuraciÃ³n
 * @config {NodeElement} resultField Campo destino del dato base devuelto por
 *  la miniaplicaciÃ³n
 * @config {String} url URL de la miniaplicaciÃ³n
 * @config {Object} inMap Objeto con el mapeo de los parÃ¡metros de entrada de
 *  la miniaplicaciÃ³n, formado por tuplas: el primer elemento es el nombre del
 *  campo de formulario que se quiere pasar y el segundo, es el identificador
 *  que se le quiere dar al parÃ¡metro en la queryString
 * @config {Object} outMap Objeto con el mapeo de los resultados de la
 *  miniaplicaciÃ³n, formado por tuplas: el primer elemento es el identificador
 *  del parÃ¡metro devuelto y el segundo, es el identificador del campo de
 *  formulario dÃ³nde se debe volcar el valor.
 */
TF7.UI.MiniappLauncher = function(el, opts) {
  opts = opts || {};
  opts.value = opts.value || "...";
  TF7.UI.MiniappLauncher.superclass.constructor.call(this, el, opts);
  this.initialize();
};

TF7.extend(TF7.UI.MiniappLauncher, TF7.UI.Button, {

  /**
   * MÃ©todo inicializador
   * @method initialize
   */
  initialize : function() {
    if (this.config.url) {
      var that = this,
      callback = this.getCallback(this.config.outMap),
      callbackReturn = this.getCallbackReturnedValues(this.config.resultField),
      inMap = this.config.inMap;
      var i, id, matches;
      for (i in this.config.outMap) {
        id = this.config.outMap[i];
        if (matches = id.match(/(.*)-text$/)) {
          var space = document.createTextNode(' ');
          $(this.config.insertAfter).after('<span id="'+id+'" />').next().before(space);
        }
      }

      $(this.element).bind('click', function() {
        new TF7.UI.Overlay(null, {
          url: that.getProcessedURL(that.config.url, that.config.inMap, that.config.resultField._formid),
          title: 'Cargando aplicaciÃ³n auxiliar...',
          centerInView: 'x',
          draggable: false,
          fixPosition: false,
          modal: true,
          top: '4em'
        }).show();
        window.miniappCallback = callback;
        window.miniappCallbackReturnedValues = callbackReturn;
      });
    }
  },

  /**
   * Devuelve la URL procesada de la miniaplicaciÃ³n. El proceso debe aÃ±adir a
   * la URL las posibles variables de entrada que puedan haber en map en
   * formato queryString
   *
   * @method getProcessedURL
   * @param {String} url URL base de la miniaplicaciÃ³n
   * @param {Object} map Objeto con el mapeo de los parÃ metros de entrada de la
   * 	miniaplicaciÃ³n
   * @param {String} formId Identificador del formulario que contiene la
   * 	miniaplicaciÃ³n
   * @return {String} URL procesada con los posibles parÃ metros aÃ±adidos en
   * 	formato queryString
   */
  getProcessedURL: function(url, map, formId) {
  	var name, value, inputParams = [];
  	if (map) {
      for (name in map) {
        value = TF7.getValue(formId, name);
        if (value) {
          inputParams.push(map[name] + '=' + value);
        } else {
          inputParams.push(map[name] + '=');
        }
      }

      if (url.indexOf('?') != -1) {
      	return url + '&' + inputParams.join('&');
      } else {
      	return url + '?' + inputParams.join('&');
      }
  	} else {
  	  return url;
  	}
  },

  /**
   * Devuelve una funciÃ³n de callback la cual rellena los campos del formulario
   * con los datos devueltos por la miniaplicaciÃ³n y lanza el evento
   * "miniapps.dataLoaded" asociado al campo destino del dato base informando
   * del fin del traspaso de datos.
   *
   * @method getCallback
   * @param {Object} map Objeto con el mapeo de datos de la miniaplicaciÃ³n
   * @return {Function} FunciÃ³n de callback
   */
  getCallback : function(map) {
    var field = this.config.resultField;
    return function(data) { // data debe ser un hash
  		var name, el, url;
  		for (var i in data) {
  			if (map[i]) {
  				name = map[i];
  				if (name.search('-text-url$') != -1) continue;
    			el = document.getElementById(name);
    			if (el) {
    			  if (el.tagName.toLowerCase() == 'input') {
      				el.value = data[i];
    			  } else {
    			    for (j in data) {
    			      if (map[j] == name + '-url') {
    			        url = data[j];
    			      }
    			    }
    			    if (url) {
    			      el.innerHTML = '<a href="' + url + '">' + data[i] + '</a>';
    			    } else {
      			    el.innerHTML = data[i];
    			    }
    			  }
    			}
  			}
  		}
  		$(field).trigger('miniapps.dataLoaded');
  		window.miniappCallback = null;
  	};
  },

  /**
   * Devuelve una funciÃ³n de callback la cual pone el foco en el Ãºltimo campo de
   * la mini aplicaciÃ³n en el formulario base.
   *
   * @method getCallbackReturnedValues
   * @param {NodeObject} field Campo retorno del formulario base
   * @return {Function} FunciÃ³n de callback
   */
  getCallbackReturnedValues : function(field) {
    return function () {
      if (field.getAttribute('tf7set')) {
        field = $(field).find('input:last')[0];
      }
      TF7.UI.Caret.setTo(field, field.value.length);
      window.miniappCallbackReturnedValues = null;
    }
  },

  /**
   * Manejador del evento onchange.
   * Al modificar el dato del campo de miniaplicaciÃ³n se borrarÃ¡n los datos de
   * todos los campos asociados menos el de este.
   * @method onchange
   */
  onchange: function() {
    var i, el, id,
    map = this.config.outMap;

    for (i in map) {
      id = map[i];
      if (id && id != this.config.resultField.id) {
        el = document.getElementById(id);
        if (el) {
          if (el._inSet) {
            if (el.parentNode.id != this.config.resultField.id) {
              el.value = '';
            }
          } else if (id.match(/(.*)-text$/)) {
            el.innerHTML = '';
          } else {
            el.value = '';
          }
        }
      }
    }
  }
});
(function($) {

TF7.widget.Module = function(el, conf) {
	if (el)
		this.init(el, conf);
};

TF7.widget.Module.CSS_CLASSNAME = 'tf7-module';

TF7.widget.Module.__EVENTS__ = 'beforeInit,init,append,beforeRender,render,changeContent,destroy,beforeShow,show,beforeHide,hide'.split(',');

TF7.widget.Module.prototype = {

	constructor : TF7.widget.Module,
	element : null,
	id : null,

	init : function(el, conf) {
		this.initEvents(TF7.widget.Module.__EVENTS__);
		var element;
		if (typeof el == 'string') {
			element = document.getElementById(el);
			if (!element) {
				element = document.createElement('div');
				element.id = el;
			}
		}
		else if (el.tagName)
			element = el;
		else if (el.jQuery)
			element = el[0];

		this.element = element;

		this.id = TF7.Dom.generateId(this.element);

		$(this.element).addClass(TF7.widget.Module.CSS_CLASSNAME);
	}
	,
	initEvents : function() {
		var evtypes = TF7.widget.Module.__EVENTS__;
		var len = evtypes.length;

		for (var i = 0; i < len; ++i) {
			this[evtypes[i] + 'Event'] = new TF7.CustomEvent(evtypes[i], this);
		}
	}

};

})(jQuery);


(function($) {

	TF7.widget.MenuManager = function() {

		var m_initialized = false;
		var m_items = {};
		var m_menus = {};
		var m_visibleMenus = {};
		var m_focusedMenuItem = null;

		function addItem(item) {
			var id = item.id;
			if (m_items[id] != item) {
				m_items[id] = item;
			}
		}

		function removeItem(item) {
			var id = item.id;
			if (m_items[id]) {
				delete m_items[id];
			}
		}

		function getMenuRootElement(el) {
			if (el && el.tagName) {
				if ($(el).is('div') || $(el).is('li'))
					return el;
				return getMenuRootElement(el.parentNode);
			}
			else {
				return null;
			}
		}


		function onDOMEvent(e) {
			var element = getMenuRootElement(e.target);
			var menuItem, menu;

			if (element) {
				var tagName = element.tagName.toLowerCase();
				if (tagName == 'li') {
					menu = m_menus[$(element).parents('div:eq(0)').attr('id')];
				}
				else if (tagName == 'div') {
					menu = m_menus[element.id];
				}
			}

			if (menu) {

				var customType = this[e.type + 'Event'];

				if (menuItem && !menuItem.getAttribute('disabled')) {

					menuItem[customType].fire(e);

					if (m_focusedMenuItem != menuItem) {
						if (m_focusedMenuItem)
							m_focusedMenuItem.blurEvent.fire();
						menuItem.focusEvent.fire();
					}

					menu[customType].fire(e, menuItem);

				}


			}
			else if (e.type == 'mousedown' || (e.type == 'keypress' && e.keyCode == 27)) {

				this.hideVisible();

			}

		}

		return {

			addMenu : function(menu) {
				if (!m_menus[menu.id]) {
					m_menus[menu.id] = menu;

					if (!m_initialized) {

						var evListener = onDOMEvent.bindAsEventListener(this);

						$(document)
							.bind('click', evListener)
							.bind('mouseover', evListener)
							.bind('mouseout', evListener)
							.bind('mousedown', evListener)
							.bind('mouseup', evListener)
							.bind('click', evListener)
							.bind('keydown', evListener)
							.bind('keyup', evListener)
							.bind('keypress', evListener);

						m_initialized = true;

					}


					menu.beforeShowingEvent.subscribe(function() {
						this.hideVisible();
					}.bindAsEventListener(this));

					menu.afterShowingEvent.subscribe(function() {
						m_visibleMenus[this.id] = this;
					});

					menu.afterHidingEvent.subscribe(function() {
						delete m_visibleMenus[this.id];
					});

				}
			}
,
			removeMenu : function(menu) {
				if (m_menus[menu.id]) {
					delete m_menus[menu.id];
				}
			}
,
			hideVisible : function(menu) {
				for (var i in m_visibleMenus) {
					m_visibleMenus[i].hide();
				}
			}
,
			getMenus : function() {
				return m_menus;
			}
,
			getMenu : function(sid) {
				if (m_menus[sid])
					return m_menus[sid];
			}
,
			toString : function() {
				return 'MenuManager';
			}
		};
	}();
})(jQuery);



(function($) {
	TF7.widget.Menu = function(el, conf) {
		if (conf) {
			this.parent = conf.parent;
			this.lazyLoad = conf.lazyLoad || false;
			this.itemData = conf.itemData || false;
		}

		TF7.widget.Menu.superclass.constructor.call(this, el, conf);

		this.config = $.extend({},TF7.widget.Menu.__DEFAULTS__);
		this.config = $.extend(this.config, conf || {});

	};

	TF7.widget.Menu.__DEFAULTS__ = {
		showDelay: 200,
		hideDelay: 450,
		hideOnESC : true,
		alignAnchor : new TF7.positioning.Region(0,0,0,0),
		alignPosition: 'tl-tl',
		alignOffset: [0, 0],
		alignPadding: 0
	};


	TF7.extend(TF7.widget.Menu, TF7.widget.Module, {
		_aListElements : [],
		_aItemGroups : [],
		activeItem : null,
		parent : null, /* menu o menuitem */
		element : null,

		init : function(el, config) {
			this._aItemGroups = [];
			this._aListElements = [];

			if (!this.ITEM_TYPE) {
				this.ITEM_TYPE = TF7.widget.MenuItem;
			}


			var element;

			if (typeof el == 'string')
				element = document.getElementById(el);
			else if (el.tagName)
				element = el;
			else if (el.jQuery)
				element = el[0];

			if (element) {
				this.element = element;
				this.id = TF7.Dom.generateId(element);
			}

			var e = ['beforeShowing', 'afterShowing', 'beforeHiding', 'afterHiding'];

			for (var i = 0; i < e.length; i++) {
				this[e[i] +'Event'] = new TF7.CustomEvent(e[i], this);
			};

			TF7.widget.MenuManager.addMenu(this);
			var f1 = this.cancelDelay.bindAsEventListener(this);
			var f2 = this.hideDelayed.bindAsEventListener(this);
			$(this.element)
				.hover(f1, f2);
		}
		,

		show: function() {
			this.beforeShowingEvent.fire();
			$(this.element).css({'visibility': 'hidden', 'display': 'block'});
			TF7.positioning.align(this.element, this.config.alignAnchor, this.config.alignPosition, this.config.alignPadding, this.config.alignOffset);
			$(this.element).css({'visibility': 'visible', 'display': 'none'});
			$(this.element).show();
			this.afterShowingEvent.fire();
		}
		,
		hide: function() {
			this.cancelDelay();
			this.beforeHidingEvent.fire();
			$(this.element).hide();
			this.afterHidingEvent.fire();
		}
		,
		showDelayed: function() {
			this.cancelDelay();
			this._timeout = setTimeout(function() {
				this.show();
			}.bindAsEventListener(this), this.config.showDelay);
		}
		,
		hideDelayed: function() {
			this.cancelDelay();
			this._timeout = setTimeout(function() {
				this.hide();
			}.bindAsEventListener(this), this.config.hideDelay);
		}
		,
		cancelDelay: function() {
			clearTimeout(this._timeout);
			this._timeout = null;
		}
	});
})(jQuery);
(function($) {

function onClickHandler(e, el) {
	var index = el.cellIndex;
	this.beforeSortEvent.fire(index);
	var rows = [];
	var sortType = this.config.colTypes[index];
	$(this.element)
		.find('tbody tr')
			.each(function() {
				var row = [];
				var content = $(this).find('> *:eq('+ index +')').text();

				if (typeof sortType == 'function') {
					 content = sortType(content);
				}
				else {
					switch(sortType) {
						case 'number':
							content = parseFloat(content);
							break;
						case 'fnumber':
							content = parseFloat(content.unformat());
							break;
						case 'istr':
						default:
							content = $.trim(content.toLowerCase());
					}
				}
				row.push(content);
				row.push(this);
				rows.push(row);
			});

	var asc = el._ascendingSort || $(el).is('.'+ this.config.cnAsc);
	var sortFn = !asc ? keyCompare : keyReverseCompare;
	rows.sort(sortFn(0));
	var tbody = this.element.getElementsByTagName('tbody')[0];
	for (var i = 0; i < rows.length; i++) {
		tbody.appendChild(rows[i][1]);
	}
	$(this.element).find('thead th').removeClass(this.config.cnAsc).removeClass(this.config.cnDesc);
	$(el)
		.addClass(asc ? this.config.cnDesc : this.config.cnAsc);
	el._ascendingSort = !asc;
	this.afterSortEvent.fire(index);

}

var keyCompare = function(key) {
	return function(a, b) {
		var x = a[key], y = b[key];
		return compare(x, y);
	};
};

var keyReverseCompare = function(key) {
	var comparator = keyCompare.apply(this, arguments);
	return function(a,b) {
		return comparator(b, a);
	};
};

var compare = function(x, y) {
	return (x == y) ? 0 : (x > y) ? 1 : -1;
};


TF7.widget.SortableTable = function(el, conf) {

	this.init(el, conf);


};

TF7.widget.SortableTable.__DEFAULTS__ = {

	cnSortable : 'reordenable',
	cnAsc : 'ascendent',
	cnDesc : 'descendent',
	onHeader : null

};

TF7.extend(TF7.widget.SortableTable, TF7.widget.Module, {

	init: function(el, conf) {
		this.config = $.extend({}, TF7.widget.SortableTable.__DEFAULTS__);
		if (conf)
			this.config = $.extend(this.config, conf);

		var cfg = this.config;

		this.beforeSortEvent = new TF7.CustomEvent('beforeSort', this);
		this.afterSortEvent = new TF7.CustomEvent('beforeSort', this);

		var handler = onClickHandler.bindAsEventListener(this);
		this.element = el;
		widget = this;
		$(this.element)
			.find('thead th')
				.each(function(i) {
					if (cfg.colTypes[i]) {
						$(this)
							.addClass(cfg.cnSortable)
							.bind('click', handler);
						if (cfg.onHeader != null)
							cfg.onHeader.call(widget, this);

					}
				});

	}



});


})(jQuery);
TF7.taglib = {};

/**
	TF7 Taglib - Funciones JavaScript de los tags TF7
	* Funciones para el pop-up de autorizacion y confirmacion
*/
function tf7Taglib_enviaAutorizacion(formId) {
  var form = document.getElementById(formId);

  var employeeField = document.getElementById('_aut_dummy_empleat');
  var employeeDCField = document.getElementById('_aut_dummy_empleatDC');
  var employeeValue = document.getElementById('_aut_dummy_empleat').value;
  var employee = 'U01' + employeeValue;

  var passwordField = document.getElementById('_aut_dummy_contrasenya');
  var passwordValue = document.getElementById('_aut_dummy_contrasenya').value;

  form.elements["_aut_usuari"].value = employee;
  form.elements["_aut_password"].value = passwordValue;
  form.elements["_aut_autoritzat"].value = "true";
}


function tf7Taglib_cancelaAutorizacion(formId) {
	var form = document.getElementById(formId);
	form.elements["_aut_autoritzat"].value = "false";
	form.elements["_aut_usuari"].value = "";
	form.elements["_aut_password"].value = "";
	form._skipValidation = true;
}

function tf7Taglib_enviaConfirmacion(formId) {
	var form = document.getElementById(formId);
	form.elements["_aut_autoritzat"].value = "true";
}

function tf7Taglib_cancelaConfirmacion(formId) {
	var form = document.getElementById(formId);
	form.elements["_aut_autoritzat"].value = "false";
	form._skipValidation = true;
}

/**
	TF7 Taglib - Funciones JavaScript de los tags TF7
*/
function tf7Taglib_goBack(){
        try{
        	external.flag("HISTORY_NAVIGATION");
        }catch(e){}
        history.go(-1);
}

function tf7Taglib_goForward(){
        try{
        	external.flag("HISTORY_NAVIGATION");
        }catch(e){}
        history.go(1);
}

/**
	Exportacion de Tabla a EXCEL
*/
function tf7Taglib_exportToExcel(identificador){
	var form = $('form#export_table_excel')[0];
	var selector = "#" + identificador + "_table, #" + identificador +  "_footer";

	if (!form) {
		$('<form id="export_table_excel" method="post" action="htmlToExcel" accept-charset="utf-8" ><input type="hidden" name="contenido"/></form>')
			.appendTo(document.body);
		form = $('form#export_table_excel')[0];
	}

	var contenidoElemento = "";
	form.contenido.value = "";

	$(selector).each(
		 		 function() {
		 		 		 form.contenido.value += this.innerHTML
		 		 }
			);


	form.submit();
}

/**
	Exportacion de Tabla a EXCEL vï¿½a formulario multipart
*/
function tf7Taglib_exportToExcel_mp(identificador){
	var form = $('form#export_table_excel_mp')[0];
	var selector = "#" + identificador + "_table, #" + identificador +  "_footer";

	if (!form) {
		$('<form id="export_table_excel_mp" enctype="multipart/form-data" method="post" accept-charset="utf-8" action="htmlToExcelMP"><input type="hidden" name="contenido"/></form>')
			.appendTo(document.body);
		form = $('form#export_table_excel_mp')[0];
	}

	var contenidoElemento = "";
	form.contenido.value = "";

	$(selector).each(
		 		 function() {
		 		 		 form.contenido.value += this.innerHTML
		 		 }
			);


	form.submit();
}
/**
	TF7 Arquitecture - HttpRefresh v0.2
*/
function tf7Taglib_startHttpRefresh(url, timeout) {

	timeout = timeout || 3000;

	function createRefreshFrame(url) {
		var iframe = document.createElement('iframe');
		iframe.src = url;
		iframe.style.display = 'none';
		document.body.appendChild(iframe);
	}

	window.setTimeout(function() {
		createRefreshFrame(url);
	}, timeout);

}
/**
 * @module utils
 */
(function(L) {

var ns = L.namespace('utils', L);

/**
 * Ofrece mÃ©todos para leer valores de una cadena en formato querystring.
 * @class QueryString
 * @namespace TF7.utils
 * @static
 */
ns.QueryString = function() {

  var defaultQuery = function(s) {
    return s === undefined ? window.location.search.slice(1) : s;
  },

  toObject = function(s, splitter) {
    var ret = {}, parts, i, index;
    s = defaultQuery(s) || '';
    if (s) {
      /*parts = s.split(/[&=]/);
      for (i = 0 ; i < parts.length; i = i + 2) {
        ret[parts[i]] = unescape(parts[i+1]) || undefined;
      }*/
      splitter = splitter || '&';
      parts = s.split(splitter);
      for (i = 0; i < parts.length; i++) {
        index = parts[i].indexOf('=')
        ret[parts[i].substring(0, index)] = unescape(parts[i].substring(index + 1)) || undefined;
      }
      return ret;
    } else {
      return null;
    }
  },

  getValue = function(name, s) {
    return toObject(s)[name];
  };

  return {
    /**
     * Obtiene un objeto a partir de una cadena en formato querystring.
     * @method toObject
     * @param {String} [queryString=window.location.search]
     * @param {String} [splitter=&] Separador de la cadena querystring
     * @return {Object} La cadena deserializada como objeto
     */
    toObject : toObject,
    /**
     * Devuelve el valor de un argumento en una cadena en formato querystring.
     * @method getValue
     * @param {String} name Nombre del parÃ¡metro buscado
     * @param {String} [queryString=window.location.search]
     */
    getValue : getValue
  };

}();

})(TF7);

document.documentElement.className = 'js';

if (window.top != window) {
  document.documentElement.className += ' in-popup';
}

if (jQuery.ajaxSetup) {
  jQuery.ajaxSetup({ timeout: TF7.conf.ajaxLoaderTimeout });
} else if (jQuery.ajaxTimeout) {
  jQuery.ajaxTimeout(TF7.conf.ajaxLoaderTimeout);
}

document.createElement('abbr');



$(document).bind('click', function(e) {
  var $t = $(e.target);
  if (!$t.is('a')) {
    $t = $t.parents('a:eq(0)');
  }
  if ($t.length) {
    var pingto = $t.attr('tf7ping');
    if (pingto) {
      var m = pingto.split(/\s+/);
      for (var i = 0; i < m.length; i++) {
        $.ajax({ url: m[i], type: 'post', beforeSend: function(x) {
            x.setRequestHeader('Ping-From', window.location);
            x.setRequestHeader('Ping-To', $t[0].href);
          }
        });
      }
    }
  }

});

$(document).ready(TF7.setPaths);

$(window).one("unload", function() {
	var i, c;
	for (i in TF7.globals.closeOnUnload) {
		if (!TF7.globals.closeOnUnload[i].closed) {
			try {
				TF7.globals.closeOnUnload[i].close();
			} catch(e) {}
		}
	}
	for (i = 0, c = TF7.globals.cleanup.length; i < c; i++)
		delete TF7.globals[TF7.globals.cleanup[i]];
});

jQuery(window).one("unload", function() {
	$("iframe, #fons-modal").remove();
});

TF7.behaviour = {};
TF7.behaviour.links = function(e) {
	var name = this.getAttribute("tf7target");
	var reload = this.getAttribute('tf7reload');
	var href = $(this).attr('href');
	var x = parseInt(this.getAttribute("width") || this.getAttribute("tf7width") || TF7.conf.helpPopupWidth, 10);
	var y = parseInt(this.getAttribute("height") || this.getAttribute("tf7height") || TF7.conf.helpPopupHeight, 10);
	var l = parseInt((window.screen.availWidth - x) / 2, 10);
	var t = parseInt((window.screen.availHeight - y) / 2, 10);
	var w = window.open(href, name, "status=yes, scrollbars=yes, resizable=yes, toolbar=no, width=" + x + ", height=" + y + ", left=" + l + ", top=" + t);
	if (w) {
		w.focus();
		if (reload == 'focus') {
			$(window).focus(function(e) {
				if (!w || w.closed) {
					window.location.reload();
				}
			});
		}
	}
	e.preventDefault();
};
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {
    $('div.anidat a, div.anidat div.menu-desplegable span.obridor').click(function(e) {
      if (this.disabled) {
        e.stopImmediatePropagation();
      }
      return !this.disabled;
    });


    var enabledImage = L.conf.imgPath + 'icono-link-escenario.gif',
    disabledImage = L.conf.imgPath + 'icono-link-escenario-enlace-desplegable.gif';
    $('div.anidat a')
      .focus(function() {
        if (this.disabled) {
          this.blur();
        }
      })
      .find('img.escenari')
        .attr('_enabledimage', enabledImage)
        .attr('_disabledimage', disabledImage)
      .end();
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {
  	$("a.autofocus").eq(0).each(function() {
  		if ((document.activeElement && document.activeElement != document.body) || this.disabled) return false;
  		try {
  			this.focus();
  		} catch(e) {}
  		return false;
  	});
  });

}(TF7));
(function(L) {
  var $ = L.jQuery;

  L.onInit(function() {
    if ($("div.feedback-lite").length) {
      $(document.documentElement).addClass('hasFBL');
    }
  });

  $(window).load(
  	function() {
  		$("div.feedback-lite").each(function() {
  			var fb = new TF7.UI.FeedbackLite(this);
  			fb.show();
  		});
  	}
  );


}(TF7));

(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {


    var prefix = context == document ? "" : "div";
    $("div.contenidor", context).append('<div class="se"><\/div><div class="sd"><\/div><div class="ie"><\/div><div class="id"><\/div>');

    /*
    $("div.dialeg-c2c", context).wrap('<div class="caixa-dialeg-c2c"><\/div>');
    $("div.caixa-dialeg-c2c", context).append('<div class="se"><\/div><div class="sd"><\/div><div class="ie"><\/div><div class="id"><\/div><div class="pin"><\/div>');
    $("div.caixa-dialeg-c2c", context).addClass('caixa-dialeg-c2c-se');
    */


    $(prefix + "#form-buscador", context).append('<div class="se"><\/div><div class="sd"><\/div>');
    $(prefix + "#menu-buscador .titol-menu", context).append('<span class="se"><\/span><span class="sd"><\/span>');
    $(prefix + "#menu-buscador .seleccionat", context).append('<span class="se"><\/span><span class="ie"><\/span>');
    $(prefix + "#menu-buscador", context).append('<hr \/>');
    $(prefix + "#resultats-buscador", context).append('<div id="rc-resultats-buscador"><\/div>');
    $(prefix + "#rc-resultats-buscador", context).append('<div class="ie-resultats-buscador"><\/div><div class="id-resultats-buscador"><\/div>');
    $(prefix + "#caixa-llista-resultats", context).append('<div class="se-llista-resultats"><\/div><div class="sd-llista-resultats"><\/div><div class="ie-llista-resultats"><\/div><div class="id-llista-resultats"><\/div>');

    $("#titol-aplicacio .canal", context).append('<span class="se"><\/span><span class="sd"><\/span><span class="ie"><\/span><span class="id"><\/span>');

    $("ul.llistat-links-horitzontals", context)
      .find("li:first-child")
        .addClass("primer")
      .end()
      .find("li:last-child")
        .addClass("ultim")
      .end();

    $("ul.switcher li > label:first-child + *:not(a), ul.switcher li > label:first-child + a + *", context).addClass("primera-fila");


    $("div.agrupador-horitzontal", context).each(function() {
      var label = $(this).find("span.label-wrapper:first");
      label.addClass("primer");
    });





    if ($.browser.msie) {
      $("div.llistat, ul.llistat, div.disclosure-box", context).next(".llistat, .disclosure-box").addClass("llistat-apilat");
      $("div.contenidor div.llistat-simple", context).next(".llistat-destacat").addClass("llistat-destacat-apilat"); // TODO: eliminar
      $("form.vertical div.llistat, form.vertical ul.llistat", context).next("p.llistat-entrada, div.fila-inputs, div.columna-inputs, div.graella-inputs").addClass("element-formulari-apilat");
    }
    if ($.browser.msie) {
      $("form.vertical p, form.vertical div.fila-inputs, form.vertical div.columna-inputs, form.vertical div.graella-inputs, form.vertical .llistat", context).next(".content-title").addClass("content-title-separat");
    }
    if ($.browser.msie) {
      $("form.vertical div.anidat div.llistat-entrada:last-child, form.vertical div.anidat ul.llistat-normal:last-child", context).addClass("ultim");
    }

    $("div.llistat-simple .titol-destacat", context).append('<span class="se"><\/span><span class="sd"><\/span><span class="ie"><\/span><span class="id"><\/span>');

    $(".content-title.emphasized, .content-title.super-emphasized", context).append('<span class="se"><\/span><span class="sd"><\/span><span class="ie"><\/span><span class="id"><\/span>');

    $('a.buttonlink').append('<span class="tl" \/><span class="bl" \/><span class="br" \/><span class="tr" \/>');

  });


}(TF7));
(function(L) {

  var $ = L.jQuery;

  function init(context) {
    $("div.filtres input[@type='submit']", context).attr("disabled", true);

    function enableSubmit(e) {
      $(this.form).find("input[@type=submit]").removeAttr("disabled");
    }

    $("div.filtres", context)
      .find("select")
        .bind("change",enableSubmit)
      .end()
      .find("input[@type=checkbox], input[@type=radio]")
        .bind("click", enableSubmit)
      .end()
      .find("input[@type=text]")
        .bind("keypress", enableSubmit)
        .bind("propertychange", function() {
          if (window.event.propertyName == "value") enableSubmit.call(window.event.srcElement);
        });
  }

  function setupPagination(context) {

  	$("ul.paginador", context)
  		.each(function() {
  			var filtre = null;
  			if (filtre = this.getAttribute("tf7filter")) {
  				$(this).find("a").bind("click", function() {
  					var status = $('#' + filtre).eq(0).hasClass("toggle-box-visible");
  					var href = $(this).attr("href");
  					href = href.replace(new RegExp('(\\?|&)' + TF7.conf.filterStatusParam + '=(open|closed)'), '');
  					href += href.indexOf("?") == -1 ? "?" : "&";
  					href += TF7.conf.filterStatusParam + '=' + (status ? "open" : "closed");
  					this.href = href;
  				});
  			}
  		});

  }

  L.onInit(init);
  L.onInit(setupPagination);

}(TF7));
(function(L) {
  var $ = L.jQuery;

  L.onInit(function(context) {

    $('table.colapsable', context)
      .each(function() {
        if ($(this).hasClass('oberta')) {
          $(this).find('tr.pare.colapsable').addClass('obert');
        }
      })
      .tf7uiHierarchicalTable({ nodeClass: 'pare', collapsableClass: 'colapsable', closedClass: 'tancat', openClass: 'obert', levelClassPrefix: 'nivell-', defaultStatus: 'open', onBeforeShowChildren: onbeforechildren })
      .find('tbody tr.pare:not(.obert)').addClass('tancat');

      function onbeforechildren(tr) {
        var href = tr._childrenLoaded ? false : $(tr).find('span.obridor').attr('href');
        if (href) {
          loadChildren.call(this, tr, href);
          return false;
        }
        return true;
      }

      function loadChildren(tr, href) {
        var widget = this;
        tr._childrenLoaded = true;
        var colspan = 0;
        $(tr).find('th, td').each(function() {
          colspan += this.colSpan || 1;
        });

        var selfLevel = (+tr.className.match(/nivell-([0-9]+)/)[1]);
        var className = 'nivell-' + (selfLevel + 1);
        var loading = TF7.conf.ajaxLoaderHTML.sprintf("cargaAsincrona_cargando".translate());
        var html = '<tr class='+ className +'><td colspan="'+ colspan +'">'+ loading +'</td></tr>';
        var newrow = $(html);
        if (!$.browser.msie)
          newrow[0].oldblock = 'table-row';
        $(tr).after(newrow);
        this.showChildren(tr);

        var o = {};

        o.cb_success = function(r) { // recibe un fragmento de HTML
          var last = newrow;
          var loadedRows = [];
          var $rows = $(r).find('tbody tr');

          $rows.each(function(i) {
            var m = this.className.match(/nivell-([0-9]+)/);
            var rlevel = m && (+m[1]) || 0;
            var className = ' nivell-' + (selfLevel + rlevel + 1);
            this.className = this.className.replace(/nivell-[0-9]+/, '') + className;
            if (!$.browser.msie)
              this.oldblock = 'table-row';
            last.after(this);
            loadedRows.push(this);
            last = $(this);
          });

          $(loadedRows).each(function() {
            var $this = $(this);
            if ($this.is('.pare.colapsable')) {
              $this.addClass('tancat');
            }
            widget.initRow(this);
            TF7.init(this);
          });

          if (newrow.is(':visible')) {
            newrow.remove();
            widget.showChildren(tr);
          } else {
            newrow.remove();
          }


        };

        o.critical = true;
        o.forceRefresh = true;

        $.tf7dynLoad(href, newrow.find('td'), o);


      }
  });

}(TF7));
(function(L) {
  var $ = L.jQuery;

  L.onInit(function(context) {
    $('table.jerarquica.seleccio tbody', context)
      .tf7tabletreecheckboxes();
  });

}(TF7));
(function(L) {
  var $ = L.jQuery;

  L.onInit(function(context) {

    TF7.globals.menuDesplegado = null;
    TF7.globals.cleanup.push("menuDesplegado");
    var emSize = (function() {
      var d = document.createElement("div");
      document.body.appendChild(d);
      d.style.width = "1em";
      var em = d.offsetWidth;
      document.body.removeChild(d);
      return em;
    }());
    var maxWidth = 0;

    function closeOnESC(e) {
      if (e.keyCode == 27 && TF7.globals.menuDesplegado) { // ESC
        hide();
      }
    }

    function closeOnClick(e) {
      if (TF7.globals.menuDesplegado) {
        hide();
      }
    }

    function hide() {
      try {
        $(TF7.globals.menuDesplegado).hide().css({"margin-top": ""}).parents("div.contenidor-taula").removeClass("z21");
        TF7.desplegablesTaules.controlDesplegable = null;
        unbind();
      } catch (e) {}
    }

    function unbind() {
      $(document)
        .unbind("keypress", closeOnESC)
        .unbind("click", closeOnClick);
    }

    function initializeButton(cell, calculateWidth) {
      var $buttons = $(cell)
      .find("span.accio")
        .wrap("<button><\/button>")
        .parent();
      var but = $buttons[0];
      if (!but)
        return;
      var el = $buttons.parents('div:eq(0)').find('ul').wrap('<div class="tf7-widget-menu-flyout-menu"></div>').parent()[0];
      var id = TF7.Dom.generateId(el);
      var m = new TF7.widget.Menu(el, {alignAnchor: but, alignPosition: 'br-tr,tr-br', alignOffset: [[-emSize, 4], [-emSize, -2]]});
      m.beforeShowingEvent.subscribe(function() {
        $(this.element)
          .parents("div.contenidor-taula")
            .addClass("z21");
       });
      m.afterShowingEvent.subscribe(function() {
          if (!$.browser.msie) return; // just for IE
          var max = 0;
          $(this.element).bgiframe().find('a').each(function() {
            var width = $(this).width();
            if (width > max)
              max = width;
          }).css({width: max + 'px'});
        });
      m.afterHidingEvent.subscribe(function() {
        $(this.element)
          .parents("div.contenidor-taula")
            .removeClass("z21");
       });
      $(but)
        .bind('click', function() {
          if (this._cancelClick)
            return;
          m.show();
        })
        .bind('mousedown', function() {
          this._cancelClick = $(m.element).is(':visible');
        });

      if (calculateWidth) {
        $buttons
          .each(function(i) {
            if (!maxWidth) {
              var ow = this.offsetWidth;
              if (ow === 0) {
                $(this).parents("tr").show();
                ow = this.offsetWidth;
                $(this).parents("tr").hide();
              }
              maxWidth = Math.max(ow, maxWidth || 0);
              return false;
            }
          });

      }
    }


    if (context && context.tagName && context.tagName.toLowerCase() == 'tr') {
      $(context).find('td.accions').each(function() { var el = this; initializeButton(el);});
    } else {
      $("table", context)
        .each(function() {
          maxWidth = 0;
          $("td.accions", this).each(function() { var el = this; initializeButton(el, false); });
          if (maxWidth)
            $("th.accions", this)
              .css("width", maxWidth / emSize + "em");
        });
      }

  });

}(TF7));
(function(L) {
  var $ = L.jQuery;
  L.onInit(function(context) {
    $('table.seleccio', context)
      .each(function() {
        new TF7.UI.SelectTable(this);
      });
  });
}(TF7));
(function(L) {
  var $ = L.jQuery;

  L.onInit(function (context) {
    $('table tbody', context)
      .hoverRows('over');
  });

}(TF7));

(function(L) {
  var $ = L.jQuery;

  L.onInit(function(context) {

    function closeOnESC(e) {
      if (e.keyCode == 27) { //ESC
        hideMenu();
      };
    }

    function closeOnESC2(e) {
      if (e.keyCode == 27)
        hideMenu2();
    }

    function closeOnClick2() {
      if (TF7.globals.menuDesplegado) {
        hideMenu2();
      }
    }

    function hideMenu(childOf) {
      if (childOf) {
        $("#desplegable-clonat").each(function() {
          if (this._childOf == childOf) {
            this.parentNode.removeChild(this);
          }
        });
      } else {
        $("#desplegable-clonat").remove();
        $(document.body).unbind("keyup", closeOnESC);
      }
    }

    function hideMenu2() {
      try {
        $(TF7.globals.menuDesplegado).hide().css({"margin-top": ""}).parents("li:eq(0)").removeClass("z21").parents("div.contenidor:eq(0)").removeClass("z21");
        TF7.desplegablesTaules.controlDesplegable = null;
        unbind();
      } catch (e) {}
    }

    function unbind() {
      $(document.body)
        .unbind("keypress", closeOnESC2)
        .unbind("click", closeOnClick2);
    }

    function initHoverMenu(li) {
      $(li)
      .find("span.obridor")
        .append('<span class="icona"><\/span>')
        .hover(function() {
          var that = this.parentNode;
          var span = this;
          if (that._closeMenuTimeout) {
            clearTimeout(that._closeMenuTimeout);
            that._closeMenuTimeout = null;
          }
          that._openMenuTimeout = setTimeout(function() {
            hideMenu();
            var ul = $(that).find("ul").eq(0);
            var xul = ul[0];

            ul.css('visibility', 'hidden').css('display', 'block');

            var clone = ul[0].cloneNode(true);
            clone.id = "desplegable-clonat";

            ul.css('display', 'none').css('visibility', 'visible');

            $(clone).appendTo(document.body).css('display', 'block').css('visibility', 'hidden');
            var max = 0;
            $(clone).find('a').each(function() {
              var width = $(this).width();
              if (width > max)
                max = width;
            }).css({width: max + 'px'});
            TF7.positioning.align(clone, span, 'bl-tl,tl-bl,br-tr,tr-br', 10, [[40, 2], [40, 2], [0, 2], [0, 2]]);
            $(clone).css({visibility: 'visible'}).show();

            clone._childOf = that;

            $("#desplegable-clonat").hover(function() {
              if (that._closeMenuTimeout) {
                clearTimeout(that._closeMenuTimeout);
                that._closeMenuTimeout = null;
              }
              this._beenHere = true;
            }, function(){
              if (that._openMenuTimeout) {
                clearTimeout(that._openMenuTimeout);
                that._openMenuTimeout = null;
              }
              if (!this._beenHere) return;
              that._closeMenuTimeout = setTimeout(function() {
                hideMenu(that);
              }, TF7.conf.hoverDelayOut);

            });

            $(document).bind("keyup", closeOnESC);
          }, TF7.conf.hoverDelayOver);
        }, function() {
          var that = this.parentNode;
          if (that._openMenuTimeout) {
            clearTimeout(that._openMenuTimeout);
            that._openMenuTimeout = null;
          }
          that._closeMenuTimeout = setTimeout(function() {
            hideMenu(that);
          }, TF7.conf.hoverDelayOut);
        });
    }

    function initClickMenu(li) {
      $(li)
        .find("span.obridor")
          .focusable()
          .append('<span class="icona"><\/span>')
          .bind("click", function(e) {
            var $ul = $(this.parentNode).find("ul");
            var visible = $ul.is(":visible");
            if (visible) {
              hideMenu2();
              return;
            }
            if (TF7.globals.menuDesplegado)
              hideMenu2();

            $ul
              .parents("li:eq(0)")
                .addClass("z21")
                .parents("div.contenidor:eq(0)")
                  .addClass("z21")
                .end()
              .end()
              .show()
              .hover(function() {
                if (this._closeMenuTimeout) clearTimeout(this._closeMenuTimeout);
                this._closeMenuTimeout = null;
              }, function() {
                var that = this;
                if (!this._closeMenuTimeout) {
                  this._closeMenuTimeout = setTimeout(hideMenu2, TF7.conf.hoverDelayOut);
                }
              });
            var css = {};
            css["z-index"] = "10000";
            css["left"] = "0";
            css["top"] = -$ul[0].offsetHeight + 1 + "px";
            $ul.css(css);
            var scroll = getScrollingPosition();
            var vp = getViewportSize();
            var pos = $ul.findPos();
            var maxy = vp.y + scroll.y;
            css["width"] = this.offsetWidth + "px";
            if (pos.y - $ul[0].offsetHeight - 25 < scroll.y) {
              css["top"] = "25px";
            }
            $ul.css(css);
            $(document.body)
              .bind("keypress", closeOnESC2)
              .bind("click", closeOnClick2);
            TF7.globals.menuDesplegado = $ul[0];
            e.stopPropagation();
          });
    }



    $("div.llistat-links-contingut li.desplegable", context)
      .each(function() {
        if ($(this).parents("div.ambits").length) {
          initClickMenu(this);
        } else {
          initHoverMenu(this);
        }
      });

  });

}(TF7));
(function(L) {
  var $ = L.jQuery;

  L.onInit(function(context) {
    $("#error h2 span", context).click(function() {
      $("dl", this.parentNode.parentNode).toggle();
      $(this).toggleClass("visibles");
    });
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {
  	$('div.accions-globals select', context)
  		.change(function () {
  			var url = $(this).find('option:selected').val();
  			if(url) {
  			  var form = $(this).parents('form');
  		    form.attr('action', url);

  		    form[0].clicked = this;
  		    form.submit();
  			}
  		});

    if ($.browser.msie) {
      $('div.contenidor-taula div.accions-globals + table').addClass('taula-accions-globals');
    }
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {

    var openedMenu = null;

    /**
     * FunciÃ³ que amaga el menÃº
     */
    function hideMenu() {
      $('div.menu-desplegable').removeClass('menu-desplegable-obert');
      $('#menu-desplegable-clonat')
        .insertAfter($('#menu-position'))
        .removeAttr('style')
        .removeAttr('id');

      $('#menu-position').remove();
      $(document.body).unbind('keyup', closeOnESC);
      openedMenu = null;
    }

    /**
     * FunciÃ³ que tanca el menÃº al clicar la tecla ESC
     *
     * @param {Object} e Event a capturar
     */
    function closeOnESC(e) {
      if (e.keyCode == 27) { //ESC
        hideMenu();
      };
    }

    /**
     * FunciÃ³ que tanca el menÃº al clicar la tecla ESC
     *
     * @param {Object} e Event a capturar
     */
    function closeOnClick(e) {
      if($('#menu-desplegable-clonat').length) {
        hideMenu();
      }
    }

    $('div.menu-desplegable', context)
      .each(function() {
        var enabledImage = L.conf.imgPath + 'icono-desplegable-simple-gran-img.gif',
        disabledImage = L.conf.imgPath + 'icono-desplegable-simple-gran-img-disabled.png',
        $but = $(this).find('span.obridor'),
        title = $but.html(),
        lastSpace = title.lastIndexOf(' ');

        if (lastSpace) {
          title = title.substring(0, lastSpace + 1) + '<span class="nowrap">' + title.substring(lastSpace + 1);
        } else {
          title = '<span class="nowrap">' + title;
        }

        $but.html('<span class="title">' + title + '<img src="' + TF7.conf.imgPath + 'icono-desplegable-simple-gran-img.gif" alt="" _enabledimage="' + enabledImage + '" _disabledimage="' + disabledImage + '" /></span></span>');
        $but.find('span.title').hover(function() {
              $(this).addClass('over');
            }, function() {
              $(this).removeClass('over');
            });
        $(this).find('ul').wrap('<div class="tf7-widget-menu-flyout-menu"></div>');

        $but.bind('click', function(e) {
          if ($('#menu-desplegable-clonat').length) {
            hideMenu();
          }
          if (openedMenu != this) {
            openedMenu = this;
            $(this).parents('div.menu-desplegable').addClass('menu-desplegable-obert');
            var ul = $(this).parent().find('div.tf7-widget-menu-flyout-menu').eq(0);

            ul.css('visibility', 'hidden').css('display', 'block');
            var clone = ul[0];
            clone.id = 'menu-desplegable-clonat';
            ul.css({'display': 'none', 'visibility': 'visible'});

            var el = document.createElement('span');
            el.id = 'menu-position';
            clone.parentNode.insertBefore(el, clone);
            $(clone).appendTo(document.body).css({display: 'block', visibility: 'hidden'});
            var max = 0;
            $(clone).find('a').each(function() {
              var width = $(this).width();
              if (width > max)
                max = width;
            }).css({width: max + 'px'});

            var icoImg = $(this).find('img')[0],
            nowrap = $(this).find('span.nowrap')[0],
            nowrapPR = $(nowrap).css('padding-right').replace('px', '');
            TF7.positioning.align(clone, nowrap, 'br-tr,tr-br,bl-tl,tl-bl', 0, [[-nowrapPR, 1], [-nowrapPR,-2], [nowrap.offsetWidth - icoImg.offsetWidth, 0], [nowrap.offsetWidth - icoImg.offsetWidth, -1]]);
            $(clone).css('visibility', 'visible').show();
          }
          else {
            openedMenu = null;
          }
          return false;
        });

        $(document).bind('keyup', closeOnESC);
        $(document).bind('click', closeOnClick);
      });
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {

  	function getDPI() {
  		var d = document.createElement("div");
  		document.body.appendChild(d);
  		d.style.width = "1in";
  		var dpi = d.offsetWidth;
  		document.body.removeChild(d);
  		return dpi;
  	}

  	function resizeTableContainer(c) {
  		var vp   = getViewportSize();
  		var cheight = $(c).css("height", "").height();
  		var theight = $(c).find("table").height();
  		if (document.compatMode && document.compatMode == "BackCompat") // IE6 en Quirks no aÃ±ade el ancho del borde
  			theight += parseInt($(c).find("table").css("border-width"), 10) * 2;
  		var total = document.body.scrollHeight + document.body.scrollTop;

          if (window.innerHeight && window.scrollMaxY) {
              yScroll = window.innerHeight + window.scrollMaxY;
          } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
              yScroll = document.body.scrollHeight;
          } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
              yScroll = document.body.offsetHeight;
          }

  		var total = yScroll + theight - cheight;
  		var dpi = getDPI();
  		var exceedsX = $(c).width() < $(c).find("table").width();
  		var adjust = exceedsX ? (dpi == 96 ? 17 : 24) : 0;
  		total -= adjust;
  		var fheight;

  		if (total > vp.y) {
  			var v = vp.y - (total - theight);
  			if (v < 90) v = 90;
  			var p = 0;
  			fheight = v + p;
  		}
  		if (fheight)
  			$(c).css("height", fheight + (exceedsX ? -adjust : 0) + "px");
  		else {
  			var dpi = getDPI();
  			var p = dpi == 96 ? 17 : 24;
  			if (jQuery.browser.msie)
  				$(c).find("table").css("margin-bottom", exceedsX ? p : 0 + "px").parent().css("padding-bottom", "1px");
  		}
  		$(c)[fheight ? "addClass" : "removeClass"]("scroll-taula-y");

  	}

  	$("div.scroll-taula.adaptable", context)
  		.each(function() {
  			resizeTableContainer(this);
  		});



  		$("div.scroll-taula table", context)
  			.each(function() {
  				if (this.parentNode.style.height) {
  					$(this.parentNode).addClass("scroll-taula-y");
  				} else if ($(this).width() > $(this.parentNode).width()) {
  					var dpi = getDPI();
  					var p = dpi == 96 ? 17 : 24;
  					if (jQuery.browser.msie)
  						$(this).css("margin-bottom", p + "px").parent().css("padding-bottom", "1px");
  				}
  			});


  	$(window).resize(function() {
  		$("div.scroll-taula.adaptable")
  			.each(function() {
  				if (this._resizeTimeout) {
  					clearTimeout(this._resizeTimeout);
  					this._resizeTimeout = null;
  				}
  				var c = this;
  				this._resizeTimeout = setTimeout(function() { resizeTableContainer(c); }, 13);
  			});

  	});
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context, cancel) {
  	if (cancel) return;

  	function dynLoad(e) {
  		var url = this.href;
  		var holder = this.getAttribute("tf7target") || this.parentNode;
  		if (jQuery.className.has(this, "auto") || (holder == this.parentNode && !this.getAttribute("tf7target"))) {
  			$(holder).each(function() {
  				this._autoHolder = true;
  			});
  		}

  		$(holder).bind("tf7ContentLoaded", function(e, status) {
  			$(this).unbind(e);
  			TF7.init(this);
  			var ac = $(this).parents("#persianes").eq(0);
  			if (ac.length) {
  				var links = $(jQuery.className.has(this, "seccio-persiana") ? this : $(this).parents("seccio-persiana"))
  					.prev()
  						.trigger((this._autoHolder || status == "message") ? "inexistant" : "click")
  						.find("a.carrega-dinamica");
  					if (status != "message") {
  						links.unbind("click", dynLoad).bind("click", function(e) { e.preventDefault(); });
  					}
  			}
  			this._xhr = null;
  			this._autoHolder = null;
  		});


  		var o = {};

  		if (jQuery.className.has(this, "critical")) o.critical = true;
  		if (jQuery.className.has(this, "force-refresh")) o.forceRefresh = true;

  		if (this.className.indexOf("carrega-dinamica-cb-") != -1) {
  			var matches = this.className.match(/carrega-dinamica-cb-([a-z]+)/);
  			if (typeof TF7.ajaxCallbacks[matches[1]] == "function") {
  				o.cb_success = function(xml) {
  					TF7.ajaxCallbacks[matches[1]](xml, holder);
  				};
  				o.dataType = "xml";
  			}
  		}

  		if (this.parentNode.tagName.toLowerCase().substr(0,1) == "h") {

  			if (e) e.stopPropagation();

  			o.wait = this.parentNode;

  			o.critical = true;

  			$(o.wait).removeClass("error");

  			o.refresh = false;

  			var trigger = this;

  			o.success = function() {
  				$(o.wait).removeClass("carregant");
  				$(trigger).unbind("click", dynLoad).bind("click", function(e) { e.preventDefault(); });
  			};

  			o.error = function() {
  				$(o.wait).removeClass("carregant").addClass("error");
  			};

  		}

  		if (!o.wait) {
  			$(holder).empty().append(TF7.conf.ajaxLoaderHTML.sprintf("cargaAsincrona_cargando".translate()));
  		} else {
  			$(o.wait).addClass("carregant");
  		}


  		if (e) e.preventDefault();
  		$.tf7dynLoad(url, holder, o);
  	}

  	$("a.carrega-dinamica", context)
  			.bind("click", dynLoad)
  			.filter(".auto")
  				.bind('fakeclick', dynLoad)
  				.trigger('fakeclick');
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {
  	var selector = "#persianes";
  	if (context !== document) selector = "div" + selector;
  	$(context)
  		.find(selector).accordion( { trigger: ".titol-persiana" } )
  		.find(".titol-minifitxa").append('<span class="se"><\/span><span class="sd"><\/span>')
  		.end()
  		.find(".titol-persiana")
  			.filter(":first")
  				.addClass("primer-titol")
  				.append('<span class="se"><\/span><span class="sd"><\/span>')
  			.end()
  			.filter(":last")
  				.addClass("darrer-titol")
  				.append('<span class="ie"><\/span><span class="id"><\/span>')
  			.end()
  			.end()
  			.each(function() {
  				var $this = $(this);
  				var a = $(this).find("a");
  				if (a.length) {
  					$this.css({padding: 0});
  				}
  			})
  		.end();

  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  function init(context) {
  	if (document.activeElement) return;
  	document.activeElement = document.body;
  	$("input, select, textarea, button", context)
  		.blur(function() {
  			document.activeElement = document.body;
  		})
  		.focus(function() {
  			document.activeElement = this;
  		});
  }

  L.onInit(init);

}(TF7));
(function(L) {

  L.onInit(TF7.initForms);

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {
  	var index = 0;
  	$("a[@rel=help], a[@rel=context-help]", context)
  		.click(function(e) {
  			var name = "help" + index++;
  			var x = parseInt(this.getAttribute("width") || TF7.conf.helpPopupWidth, 10);
  			var y = parseInt(this.getAttribute("height") || TF7.conf.helpPopupHeight, 10);
  			var vsize = getViewportSize();
  			var wh = window.outerHeight || vsize.y;
  			var ww = window.outerWidth || vsize.x;
  			var offsetX = window.screenX != undefined ? window.screenX : window.screenLeft != undefined ? window.screenLeft : 0;
  			var offsetY = window.screenY != undefined ? window.screenY : window.screenTop != undefined ? window.screenTop : 0;
  			var pos = findMousePos(e);
  			var left = pos.x + offsetX;
  			var top = pos.y - getScrollingPosition().y + offsetY - y + (wh - vsize.y) - 32;
  			if ((left + x) >= window.screen.width) {
  				left = window.screen.width - x;
  			}
  			var w = window.open(this.href, name, "status=yes, scrollbars=yes, resizable=yes, toolbar=no, width=" + x + ", height=" + y + ", left=" + left + ", top=" + top);
  			if (w) {
  				w.focus();
  				TF7.globals.closeOnUnload[name] = w;
  			}
  			return false;
  		});
  });


}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {

  	var pos;

  	function showTooltip(e) {
  		if (this._hideTooltipTimeout) {
  			clearTimeout(this._hideTooltipTimeout);
  			this._hideTooltipTimeout = null;
  		}
  		var id = this.id;
  		if ($("div.tooltip[@tf7for=" + id + "]:visible").length) return;
  		pos = findMousePos(e);
  		var that = this;
  		this._showTooltipTimeout = setTimeout(function() {
  			var context = new TF7.positioning.Region(pos.y, pos.x, pos.y, pos.x);
  			var tc = $("div.tooltip")
  				.hide()
  				.filter("[@tf7for=" + id + "]")
  					.appendTo(document.body)
  					.css({"visibility": "hidden", "display": "block"});
  			if (tc[0]) {
  				TF7.positioning.align(tc[0], context, 'br-tl,bl-tr,tl-br,tr-bl', 10, [3,3]);
  			}
  			tc
  				.css({visibility: "visible" })
  				.show()
          .bgIframe();
  			$(that).addClass('tooltip-on');
  			}, TF7.conf.hoverDelayOver);
  	}

  	function hideTooltip() {
  		if (this._showTooltipTimeout) {
  			clearTimeout(this._showTooltipTimeout);
  			this._showTooltipTimeout = null;
  		}
  		var id = this.id;
  		var that = this;
  		this._hideTooltipTimeout = setTimeout(function() {
  			$("div.tooltip[@tf7for=" + id + "]").hide();
  			$(that).removeClass('tooltip-on');
  		}, 1);
  	}

  	$("th[@title]", context)
  		.find("*[@title]")
  			.removeAttr("title");

  	$("tbody th.has-tooltip, tbody td.has-tooltip, span.import.has-tooltip", context)
  		.removeAttr("title") // nunca tendrÃ¡ title propio
  		.hover(showTooltip, hideTooltip)
  			.find("*[@title]")
  				.hover(function() {
  					var parent = $(this).parent("td");
  					if (!parent.length)
  						parent = $(this).parent("th");
  					if (parent.length) {
  						var p = parent[0];
  						if (p._showTooltipTimeout) {
  							clearTimeout(p._showTooltipTimeout);
  							p._showTooltipTimeout = null;
  						}
  					}
  					var id = parent.attr("id");
  					$("div.tooltip[@tf7for=" + id + "]").hide();
  				},
  				function() {

  				});
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  function init(context) {
  	$("a[@tf7target^='_']", context)
  		.not(".carrega-dinamica")
  		.click(TF7.behaviour.links);
  }

  function setupCloseButtons(context) {
  	$("#tancar-finestra", context).click(function() {
  		try {
  			window.close();
  		} catch(e) {}
  	});
	}

  L.onInit(init);
  L.onInit(setupCloseButtons);

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context){
  	$("div.pestanyes-fitxes", context).tf7tabs();
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {
      $("ul.treeview", context)
          .each(function(i) {
  			var o = { speed: TF7.conf.treeviewSpeed };
  			if (!jQuery.className.has(this, "open"))
  				o.collapsed = true;
  			if (jQuery.className.has(this, "use-numbers"))
  				o.onparent = function(el) {
  					var l = $("> ul > li", el).length;
  					$(el).find("> ul").before("(" + l +")");
  				};
              $(this).tf7treeview(o);
          })
  		.tf7treecheckboxes();
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function (context) { // solamente se aplican en pies de tabla
  	$("p.botons a.button", context)
  	.each(function() {
  		var b = $(this).before('<input type="button" value="' + this.innerHTML + '" \/>').prev();
  		b[0].className = this.className;
  		b
  			.attr('href', $(this).attr('href'))
  			.attr('tf7target', $(this).attr('tf7target') || '')
  			.attr('tf7reload', $(this).attr('tf7reload') || '')
  			.attr('tf7width', $(this).attr('width') || '')
  			.attr('tf7height', $(this).attr('height') || '')
  			.attr('title', $(this).attr('title') || '');

  		if (b.attr('tf7target')) {
  			b.click(TF7.behaviour.links);
  		} else {
  			b.click(function() {
  				window.location.href = $(this).attr('href');
  			});
  		}
  		$(this).remove();
  	});
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function (context) {

  	function openC2c(el, url) {
  		TF7.UI.lock();
  		var dialog = $(
  			TF7.conf.c2cDialog.sprintf(
  				"c2c_title".translate(),
  				"c2c_estableciendo".translate(),
  				"c2c_cerrar".translate(),
  				TF7.conf.c2cConfigUrl,
  				"c2c_configurar".translate()
  			)
  		).css("visibility", "hidden").appendTo(document.body);
  		var pos = findPos(el);
  		var scroll = getScrollingPosition();
  		var w = dialog[0].offsetWidth;
  		var h = dialog[0].offsetHeight;
  		pos.x += parseInt(el.offsetWidth / 2, 10); // desde la mitad
  		var x = pos.x - w - 50;
  		var y = pos.y - h - 60;
  		var east = true;
  		var south = true;
  		var vp = getViewportSize();

  		if (x < 100) {
  			x += w + 50;
  			east = false;
  		}


  		if (y - 50 < scroll.y) {
  			y += dialog[0].offsetHeight + el.offsetHeight + 120;
  			south = false;
  		}


  		dialog.addClass("caixa-dialeg-c2c-" + (south ? "s" : "n") + (east ? "e" : "w")).css({left: x + "px"});
  		if (south)
  			dialog.css({bottom: scroll.y + vp.y - y - dialog[0].offsetHeight + "px"});
  		else
  			dialog.css({top: y + "px"});
  		dialog.css({visibility: "visible"});
  		dialog.find("#c2c-close").click(function() { closeC2c($(this).parents("div.caixa-dialeg-c2c"));});
  		dialog.find("ol.passos").after(TF7.conf.ajaxLoaderHTML.sprintf(""));

  		TF7.init(dialog); // comportamientos de botones y demÃ¡s


  	var holder = dialog.find('div.dialeg-c2c-content');
  	holder.bind("tf7ContentLoaded", function(e, status) {
  		if ($.browser.msie)
  			$(this).parents('div.caixa-dialeg-c2c').find("div.ie, div.id").hide().show();
  	});

  	$.tf7dynLoad(url, holder, {
  		dataType: "html",
  		type: "GET",
  		critical: true,
  		wait: 'div.carregant',
  		forceRefresh : true,
  		cb_success: function(r) {
  			var success = !($('<div></div>').html(r).find(".error-proces").length);
  			var cont = dialog.find('form').remove().end().find("div.dialeg-c2c-content").empty().html(r);
  			var id = TF7.Dom.generateId(cont[0]);
  			cont.find('a.carrega-dinamica:not([@tf7target])').attr('tf7target', '#'+id).bind('click', function() {
  				var c = $(this.getAttribute('tf7target'));
  				if (c.length)
  					clearTimeout(c[0]._hideTimeout);
  			});
  			TF7.init(cont);
  			if (success && TF7.conf.c2cTimeout)
  				cont[0]._hideTimeout = setTimeout(function() {
  					closeC2c(dialog);
  				}, TF7.conf.c2cTimeout);
  			$(holder).trigger("tf7ContentLoaded", ["success"]);
  		}
  	});

  	}

  	function closeC2c(dialog) {
  		$(dialog).hide();
  		TF7.UI.unlock();
  	}


  	$("span.c2c a, a.c2c", context)
  		.bind("click", function(e) {
  			e.preventDefault();
  			var m = this.className.match(/(^|\s+)c2c-anchor-link-([a-z0-9-]+)($|\s+)/i);
  			var orig;
  			if (m && m[2]) {
  				orig = $('#' + m[2])[0];
  			}
  			if (!orig) {
  				orig = this;
  			}
  			openC2c(orig, this.href);
  		});

  	$("#c2c-close", context).bind("click", function() { closeC2c($(this).parents("div.caixa-dialeg-c2c"));});


  });


}(TF7));
(function(L) {

  var $ = L.jQuery;

  function init(context) {
  	$('span.tf7-widget-menu-hover-trigger', context)
  		.each(function() {
  			var sel = this.getAttribute('tf7menu');
  			var menuEl = $(sel)[0];
  			if (menuEl) {
  				$(sel).appendTo(document.body);
  				(function(trigger) {
  					var mymenu = new TF7.widget.Menu(menuEl, { showDelay: 200, hideDelay: 450, alignAnchor: trigger, alignOffset: [[3, -1], [3, -1], [3,-1], [3,-1]], alignPosition: 'bl-tl,tr-br,br-tr,tl-bl', alignPadding: 10 });

  					mymenu.afterShowingEvent.subscribe(function() {
         		  if (!$.browser.msie) return; // just for IE
         		  var max = 0;
         		  $(this.element).bgiframe().find('a').each(function() {
         		    var width = $(this).width();
         		    if (width > max)
           		    max = width;
         		  }).css({width: max + 'px'});
            });

  					$(trigger)
  						.hover(function() {
  							mymenu.showDelayed();
  						}, function() {
  							mymenu.hideDelayed();
  						})
  						.bind('click', function() {
  							mymenu.cancelDelay();
  							if (!$(mymenu.element).is(':visible'))
  								mymenu.show();
  						});
  				})(this);
  				$(this).append('<span class="icona"><\/span>');
  			}
  		});
	}

	L.onInit(init);

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {
  	$('span.tf7-widget-menu-click-trigger', context)
  		.each(function() {
  			var but = $(this).wrap('<button class="desplegable"><\/button>').parent()[0];
  			var opts = {
  				alignAnchor : but,
  				alignPosition : 'bl-tl,tr-br,bl-tl,tl-bl',
  				alignOffset : [[0,2], [0,-1], [0,2], [0,-1]],
  				alignPadding: 10
  			};
  			var el = $(this.getAttribute('tf7menu'))[0];
  			if (el) {
          		$(el).appendTo(document.body);
  				var m = new TF7.widget.Menu(el, opts);

  				m.afterShowingEvent.subscribe(function() {
  	     		  	if (!$.browser.msie) return; // just for IE
  	     		  	var max = but.offsetWidth - 12;
  	     		  	$(this.element).find('a').each(function() {
  	     		    	var width = $(this).width();
  	     		    	if (width > max)
  	       		    	max = width;
  	     		  	}).css({width: max + 'px'}).end().bgiframe();
          		});

  				$(but)
  					.bind('click', function() {
  						if (this._cancelClick)
  							return;
  						m.show();
  					})
  					.bind('mousedown', function() {
  						if ($(m.element).is(':visible')) {
  							this._cancelClick = true;
  						}
  						else {
  							this._cancelClick = false;
  						}
  					});
  			}
  		});
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  function init(context) {
    if ($.browser.msie && context == document) { // run only once, only in IE
      var lastfocused;

      $(document).bind('focusin', function(e) {
        if (lastfocused && !$(lastfocused).is('iframe')) {
          $(lastfocused).removeClass('focus');
        }
        lastfocused = e.target;
        if (!$(lastfocused).is('iframe')) {
          $(lastfocused).addClass('focus');
        }
      });
    }
  }

  L.onInit(init);

}(TF7));
(function(L) {

  var  $ = L.jQuery;

  L.onInit(function(context) {

  	$("input.print", context).bind('click', function(e) {
  		window.print();
  		e.preventDefault();
  	});

  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function (context) {
  	$('a.submilink').click(function () {
      var form = null,
      field = null,
      input = null,
      $foldableMenu = $(this).parents('#menu-desplegable-clonat');

  		if ($(this).hasClass('field-submilink')) {

  		  form = document.createElement('form');
  		  form.style.display = 'none';
  		  form.id = TF7.Dom.generateId(form);
  		  form.method = 'post';
  		  $(this).after(form);

  		  if ($foldableMenu.length) {
  		    field = document.getElementById('menu-position').parentNode.parentNode;
  		  } else {
  		    field = this.parentNode.parentNode;
  		  }

  		  $(':input', field).each(function(){
  		    input = document.createElement('input');
  		    input.name = this.name;
  		    input.type = 'hidden';
  		    input.value = this.value;
  		    input._formid = form.id;
  		    form.appendChild(input);
  		  });
  		} else {

        if ($foldableMenu.length) {
          form = $('#menu-position').parents('form')[0];
        } else {
          form = $(this).parents('form')[0];
        }
  		}

      $(this).attr('tf7ruleset', 'none');

  		form.clicked = this;
  		form.action = this.href;
  		$(form).submit();

  		return false;
  	});
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {
    $('table.files-ordenables', context).each(function(i) {
      TF7.widget.SortableRowsTable(this, {});
    });
  });

}(TF7));
(function(L) {

  var $ = L.jQuery;

  L.onInit(function(context) {
    $('select.chain-select', context).each(function() {

      var dwrDS = TF7.DWRDataSource({
        DWRObjectName: 'InfrastructureOperations',
        DWRFunctionName: 'getChild',
        format: $(this).attr('tf7tauxformat')
      });

      var opts = {
        related : $('#' + $(this).attr('tf7child'))[0],
        dataSource : dwrDS,
        findKey : $(this).attr('tf7tauxid')
      };

      TF7.widget.ChainSelect(this, opts);
    });
  });

}(TF7));

(function(L) {

L.onInit(calendaris);

var $ = L.jQuery;

function calendaris(context) {

	if (L.Calendar) {
		initCalendaris(context);
	}
}

function initCalendaris(context) {

	$("form input[@tf7type=date]", context).each(function() {
		if (!L.globals.Calendar) {

			L.Calendar.l10n  = {


				dateFormat : L.l10n.calendario_dateFormat,

				firstDayOfWeek : +L.l10n.calendario_firstDayOfWeek,

				dayprops : L.l10n.calendario_dayprops.split(",").map(function(v) { return (+v); }),

				dn : L.l10n.calendario_dn.split(",").map(jQuery.trim),

				sdn : L.l10n.calendario_sdn.split(",").map(jQuery.trim),

				mn : L.l10n.calendario_mn.split(",").map(jQuery.trim),

				smn : L.l10n.calendario_smn.split(",").map(jQuery.trim),

				tt : {
					"prevMonth" : L.l10n.calendario_ttPrevMonth,
					"nextMonth" : L.l10n.calendario_ttNextMonth,
					"today" : L.l10n.calendario_ttToday,
					"partToday" : L.l10n.calendario_ttPartToday,
					"dateFormat" : L.l10n.calendario_ttDateFormat
				}

			};

			L.globals.Calendar = new L.Calendar({ l10n: L.Calendar.l10n, hoverRows: false });
			L.globals.Calendar.create();
		};
		var disabled = false;
		var enabledimage = L.conf.imgPath + "icono-calendario.png";
		var disabledimage = L.conf.imgPath + "icono-calendario-deshabilitado.gif";
		var img = this.disabled ? disabledimage : enabledimage;
		disabled = this.disabled;
		var but = $('<button class="boto-calendari" type="button" ' + (disabled ? 'disabled="disabled"' : '') + ' title="' + "calendario_abrirCalendario".translate() + '"><img src="' + img + '" _enabledimage="' + enabledimage + '" _disabledimage="' + disabledimage + '" alt="' + "calendario_abrirCalendario".translate() + '"/></button>')
			.bind("click", function(e) {
				var dest = this.previousSibling;
				if (dest._openDatePicker) {
					e.preventDefault();
					return;
				} else {
					e.stopPropagation();
				}
				dest._openDatePicker = true;
				var c = L.globals.Calendar;
				if (c.hidden != true) {
					c.hide();
				}
				var date;
				if (dest.value && dest.valid !== false) {
					var val = L.getValue(dest._formid, dest.name);
					date = new Date(val[0], val[1] - 1, val[2]);
				} else {
					date = new Date();
				}

				var min, max;
				min = dest.getAttribute("tf7min");
				if (min) {
					min = min.split(L.conf.dateSplitterSystem);
					min = new Date(+min[2], +min[1] - 1, +min[0]);
				}
				max = dest.getAttribute("tf7max");
				if (max) {
					max = max.split(L.conf.dateSplitterSystem);
					max = new Date(+max[2], +max[1] - 1, +max[0]);
					max.setHours(0, 0, 1);
				}

				c.getDateStatus = function(date) {
					if ((min && date < min) || (max && date > max)) return true;
				};

				c.onSelected = function(calendar, date) {
					dest.value = date;
					dest.nextSibling.focus();
					$(dest).trigger("change");
				};

				c.onClose = function(calendar, date) {
					setTimeout(function() {
						dest._openDatePicker = false;
					}, 50);
				};

				c.setDate(date, min || max); // si hay mÃ­nimo o mÃ¡ximo, forzamos


				var pos = findPos(this);
				c.align(this, 'tl-tl,bl-bl,br-tr', 50, [0,0]);
				c.show();
				e.preventDefault();

			});

		$(this).after(but);
	});
}

})(TF7);
(function(L) {

  var $ = L.jQuery;

  L.onInit(passwordCapsControl);

  function passwordCapsControl(context) {
    $('input[@type=password]', context)
      .bind('keyup', ku_handler);
  }

  function ku_handler(e) {
    if (this.value != this._ccLastValue) {
      var msg = 'formularios_mayusculas'.translate();
      var $messageHolder = $(this).next('span.caps-warning');
      if (this.value.search(/[A-Z]/) != -1) {
        if (!$messageHolder.length) {
          $messageHolder = $(this).after('<span class="caps-warning"></span>').next();
        }
        $messageHolder.html(msg).show();
        $(this).parents('.login-ags').addClass("caps-warning");
      }
      else {
        $messageHolder.html('').hide();
        $(this).parents('.login-ags').removeClass("caps-warning");
      }
      this._ccLastValue = this.value;
    }
  }

})(TF7);
(function(L) {

var $ = L.jQuery;

L.onInit(init);

var VISIBLE_CLASS = 'toggle-box-visible';

function init(context) {
  $('div.toggle-box span.toggle-box-trigger', context)
    .bind('click', trigger_click);
}

function trigger_click(e) {
  var $trigger = $(this);
  var $main = $trigger.parents('div.toggle-box:eq(0)');
  var $content = $main.find('> div.toggle-box-content');
  if ($main.hasClass(VISIBLE_CLASS)) {
    $main.removeClass(VISIBLE_CLASS);
    $content.hide();
  }
  else {
    $main.addClass(VISIBLE_CLASS);
    $content.show();
    var $form = $content.find('form');
    var form, elements;
    if ($form.length) {
      if ($form.length > 1) {
        form = $content.find('div.toggle-form-item-visible form')[0];
      }
      if (!form) {
        form = $form[0];
      }
      elements = form.elements;
    }
    else {
      form = $content.parents('form')[0];
      if (form) {
        elements = $content.find('*').get();
      }
    }
    if (elements) {
      loop: for (var el, i = 0, c = elements.length; i < c; i++) {
      	el = elements[i];
      	switch (el.tagName.toLowerCase()) {
      	case "input":
      	case "select":
      	case "textarea":
        	if (el.type == "hidden" || el.disabled) continue; // continua iteraciÃ³n
      		try {
      			el.focus();
      		} catch(e) {}
      		break loop;
      	default:
      	}
      }
    }
  }
}

})(TF7);
(function(L) {

L.onInit(init);

function init(context) {
	$('div.toggle-form span.toggle-form-trigger', context)
		.bind('click', trigger_click);
}

function trigger_click(e) {
	var $trigger = $(this);
	var $main = $trigger.parents('div.toggle-form:eq(0)');
	var $formBoxes = $main.find('div.toggle-form-item');
	var $current = $formBoxes.filter('.toggle-form-item-visible');
	var $alt = $formBoxes.not('.toggle-form-item-visible');

	$current.hide().removeClass('toggle-form-item-visible');
	$alt.show().addClass('toggle-form-item-visible');

	var form = $alt.find('form')[0];
	var curForm = $current.find('form')[0];

	if (form) {

		var curEls = curForm.elements;
		var altEls = form.elements;

		var curEl;
		var elName;
		var elValue;

		var altEl;
		var altElType;

		for (i = 0, cur = curEls.length; i < cur; i++) {

			curEl = curEls[i];

			elName = curEl.name;
			elValue = curEl.value;


			for (j = 0, alt = altEls.length; j < alt; j++) {

				altEl = altEls[j];

				if (altEl.name == elName) {

					switch (altEl.type) {
						case "text":
							altEl.value = elValue;
							break;
						case "radio":
						case "checkbox":
							if (altEl.value == elValue) {
								altEl.checked = curEl.checked;
								console.log("here");
							}
							console.log("valor alt: " + altEl.value + " valor alt: " + elValue);
							break;
						case "select-one":
							altEl.selectedIndex = curEl.selectedIndex;
							break;
					}
				}
			}
		}



		var elements = form.elements;
		loop: for (var el, i = 0, c = elements.length; i < c; i++) {
			el = elements[i];
			if (el.type == "hidden" || el.disabled) continue; // continua iteraciÃ³n
			switch (el.tagName.toLowerCase()) {
				case "input":
				case "select":
				case "textarea":
					try {
						el.focus();
					} catch(e) {
					}
				break loop;
				default:
	    	}
	    }


		if ($current.find('form').hasClass("vertical")) {
			$trigger.text(L.l10n.formularios_masParametros).removeClass("ocultar-avansat");
		} else if ($current.find('form').hasClass("horitzontal")) {
			$trigger.text(L.l10n.formularios_menosParametros).addClass("ocultar-avansat");
		}

	}
}

})(TF7);
(function(L) {

var $ = L.jQuery;

L.onInit(init);

var VISIBLE_CLASS = 'disclosure-box-visible';

function init(context) {
  $('div.disclosure-box span.disclosure-box-trigger', context)
    .bind('click', trigger_click);
}

function trigger_click(e) {
  var $trigger = $(this);
  var $main = $trigger.parents('div.disclosure-box:eq(0)');
  var $content = $main.find('> div.disclosure-box-content');
  $content.show();
  $trigger.hide();
  $main.addClass(VISIBLE_CLASS);
}

})(TF7);
(function(L) {

var $ = L.jQuery;

L.onInit(init);

function init(context) {
  $('textarea[@tf7maxlength]', context)
    .bind('keyup', ku_handler)
    .each(function() {
      recount(this);
    });
}


var _lastValue; // compartimos entre instancias

function ku_handler(e) {
  if (this.value != _lastValue) {
    recount(this);
    _lastValue = this.value;
  }
}

function recount(el) {
  var $el = $(el);
  var len = el.value.length;
  var max = $el.attr('tf7maxlength');
  var res = (+max) - len;
  $el
    .prev('span.label-wrapper')
      .find('span.maxlength-message strong')
        .html(res);
}

})(TF7);
(function(L) {

  var $ = L.jQuery;

  L.onInit(initDependants);

  function initDependants(context) {
    $('div, input, textarea, select', context)
    .filter("[@tf7rel]")
      .each(function() {
        function triggerAll(e, recursive) {
          if (recursive == false) return;
          var name = this.name;
          $("input[@name=" + name + "]", this.form)
            .not(this)
            .each(function() {
              disableRelated(this);
            });
        }

        function disableRelated(el, focus) {
          focus = focus === undefined ? true : focus;
          $("#" + el._relid).disable(focus);
        }

        function enableRelated(el, focus) {
          focus = focus === undefined ? true : focus;
          $("#" + el._relid).enable(focus);
        }

        var id = L.Dom.generateId(this);
        var selector = this.getAttribute("tf7rel");
        $(selector)
          .each(function() {
            this._relid = id;
          })
          .bind("click", function(e, recursive, focus) {
            if (this.checked) {
              enableRelated(this, focus);
            } else {
              disableRelated(this, focus);
            }
            return recursive;
          })
          .filter("[@type=radio]")
            .each(function() {
              var name = this.name;
              $("input[@name=" + name + "]", this.form)
                .each(function() {
                  if (this._triggerAll) return;
                  $(this).bind("click", triggerAll);
                  this._triggerAll = true;
                });
            })
          .end()
          .trigger("click", [false, false]);
      })
    .end();
  }

})(TF7);
(function(L) {
  var $ = L.jQuery;
  L.onInit(miniappLaunchers);
  function miniappLaunchers() {
    $('input, span').filter('.miniapp-launcher')
      .each(function() {
        var constructorName = 'MiniappLauncher', miniapp;
        miniapp = new L.UI[constructorName](null, {
          resultField: this,
          insertAfter: this,
          url: this.getAttribute('tf7auxform'),
          inMap: L.utils.QueryString.toObject(this.getAttribute('tf7auxforminmap'), L.conf.miniappsSplitter),
          outMap: L.utils.QueryString.toObject(this.getAttribute('tf7auxformoutmap'), L.conf.miniappsSplitter)
        });

        $(this)
          .bind('change', { 'miniapp': miniapp }, _handleOnChange)
          .bind('miniapps.dataLoaded', function(e) {
            TF7.ruleset.checkField(this._formid, this.name);
          });
      });
  }

  function _handleOnChange(e) {
    e.data.miniapp.onchange();
  }
})(TF7);
(function(L) {

  var $ = L.jQuery;

  L.onInit(miniappTransferData);

  function miniappTransferData() {
    var callbackReturn = window.parent.top.miniappCallbackReturnedValues;
    $('form input.miniapp-transfer-data')
      .bind('click', function() {
        var values = $(this.form).collectFormData(),
        ret = {};
        for (var i = 0; i < values.length; i += 1) {
          ret[values[i].name] = values[i].value;
        }
        window.parent.top.miniappCallback(ret);
        destroyOverlay();
        callbackReturn();
        return false;
      });

    $('form input.tancar-popup')
      .bind('click', function() {
        destroyOverlay();
        if (callbackReturn) callbackReturn();
      });

    if (window != window.parent) {
      var context = window.frameElement.parentNode.parentNode.parentNode || window.frameElement.parentNode.parentNode.parentNode.parentNode;
      $('a.tancar-popup', window.top.document)
        .bind('click', function() {
          if (callbackReturn) callbackReturn();
        });
    }
  }

  function destroyOverlay() {
    if (window == window.parent) return;
    var m = window.parent.top.TF7.UI.Overlay.getWidget;
    var widget = (m(window.frameElement.parentNode.parentNode.parentNode) || m(window.frameElement.parentNode.parentNode.parentNode));
    if (widget) widget.destroy();
  }

})(TF7);
(function(L) {

  var $ = L.jQuery;

  function modalPopups(context) {
  	$('div.popup-modal', context)
  	  .appendTo(document.body)
  		.each(function() {
  			new TF7.UI.Overlay(this, {draggable: false, fixPosition: true, modal: true, centerInView: true, focusTo: $('.focused', this)[0]}).show();
  		});
	}

	TF7.onInit(modalPopups);

})(TF7);
(function(L) {

  var $ = L.jQuery;

  L.onInit(function (context) {
    $('span.mceEditor table tbody')
      .unbind('mouseover')
      .unbind('mouseout');

    $('div.rich-text-area div.accions-globals + div.output').addClass('rich-text-area-accions-globals-output');
  });

}(TF7));
/**
 * Tipo de cuenta genÃ©rica con desplegable para seleccionar el tipo de producto
 */
(function(L) {
  var $ = L.jQuery;

  L.onInit(function(context) {
    $('span.generic-account').each(function() {
      var data = [],
      products = TF7.taglib.office_products,
      config, id;

      for (id in products) {
        data.push({office: id, values: products[id]});
      }
      config = {
          dataSource: TF7.DataSource({'data': data}),
          findKey: 'office',
          noCentralizedKey: 'NCENT',
          defaultValuesKey: 'DEFAULT',
          officeField: $(this).find('input:eq(0)')[0],
          selectField: $(this).find('select')[0],
          l10nSelectOne: 'chain_selects_select_one'.translate()
        };
      TF7.widget.GenericAccount(this, config);
    });
  });
})(TF7);
(function(L) {
  var $ = L.jQuery;

  L.onInit(function(context) {
    $('table.seleccio', context).each(function() {
      var $form = $(this).parents('form:eq(0)');
      $('div.accions-globals ul.paginador a', this.parentNode).bind('click', function () {
        var $controls = $form.getControls(),
        altered = false,
        i = 0;

        while (i < $controls.length && !altered) {
          switch ($controls[i].type) {
            case 'radio':
            case 'checkbox':
              altered = $controls[i].checked !== $controls[i].defaultChecked;
              break;

            case 'select-multiple':
            case 'select-one':
              for (var j = 0; j < $controls[i].options.length && !altered; j++) {
                altered = $controls[i].options[j].selected !== $controls[i].options[j].defaultSelected;
              }
              break;

            case 'text':
            case 'textarea':
            default:
              altered = $controls[i].value !== $controls[i].defaultValue;
              break;
          }
          i++;
        }

        if (altered) {
          if (confirm(TF7.l10n.select_table_warning_message)) {
            window.onbeforeunload = null;
          } else {
            return false;
          }
        }
      });
    });
  });
}) (TF7);
(function(L) {

/**
 * Almacen de objetos.
 * @property store
 * @type Object
 * @private
 * @for
 */
var store = {},
/**
 * Contador de identificadores.
 * @property id_count
 * @type Number
 * @for
 */
id_count = 0,
/**
 * Nombre de la propiedad utilizada para asignar identificadores.
 * @property property
 * @type String
 * @private
 * @for
 */
property = 'data' + Date(),
/**
 * Recupera un valor del almacen de datos.
 * @method read
 * @private
 * @for
 */
read = function(obj, name) {
  var values = getObject(obj);
  if (values) {
    return values[name];
  }
  return undefined;
},
/**
 * Establece un valor en el almacen de datos
 * @method set
 * @private
 * @for
 */
set = function(obj, name, value) {
  getObject(obj, true)[name] = value;
},
/**
 * Elimina un valor del almacen.
 * @method remove
 * @private
 * @for
 */
remove = function(obj, name) {
  var o = getObject(obj);
  if (!o) return;
  if (name) {
    delete o[name];
  }
  else {
    delete store[obj[property]];
    delete obj[property];
  }
},
/**
 * Recupera o crea un objeto en el almacen
 * @method getObject
 * @private
 * @for
 */
getObject = function(obj, create) {
  var id = obj[property];
  if (id === undefined) id = obj[property] = id_count++;
  if (id in store) return store[id];
  if (create) return store[id] = {};
};

/**
 * Asigna y recupera datos. Ãšsese para asignar valores a nodos DOM
 * como sustituto de los expandos.
 * @method data
 * @for TF7
 * @TODO documentar argumentos y signaturas
 */
L.data = function(obj, name, value) {
  if (value === undefined) {
    return read(obj, name);
  }
  else {
    return set(obj, name, value);
  }
};

/**
 * Destruye propiedades
 * @method removeData
 * @for TF7
 * @TODO documentar argumentos y signaturas
 */
L.removeData = remove;


})(TF7);
/**
 * @module datasource
 */
/**
 * Clase base para los data source TF7
 * @class DataSource
 * @namespace TF7
 */
(function(L) {

  L.DataSource = L.makeClass(Object, {

    /**
     * Inicializador de la clase
     * @method initialize
     * @param {Object} opts Opciones de inicializaciÃ³n del objeto
     * @constructor
     */
    initialize: function(opts) {
      this.settings = TF7.merge({
        data : []
      }, opts);
    },


    /**
     * Busca los elementos con clave <code>query.key</code> y valor
     * <code>query.value</code> en el data source, y llama a la funciÃ³n
     * <code>callback</code> con argumento el array de resultados.
     * @method find
     * @param {Object} query Objeto con la clave (en <code>query.key</code>) y
     *  el valor (en <code>query.value</code>) para hacer la bÃºsqueda.
     * @param {Function} callback FunciÃ³n que se llama al terminar la bÃºsqueda
     *  con el array de resultados encontrados como parÃ¡metro.
     * @return {Array} En caso de no especificar una funciÃ³n de callback, se
     *  devuelve el resultado de la bÃºsqueda.
     */
    find: function(query, callback) {
      var data = this.settings.data;
      var ret = [];
      for (var i = 0; i < data.length; i += 1) {
        if (data[i][query.key] == query.value) {
          ret.push(data[i]);
        }
      }
      if (callback) {
        callback(ret);
      } else {
        return ret;
      }
    }
  });

})(TF7);
/**
 * @module datasource
 */
/**
 * Clase que encapsula un data source para datos recogidos a travÃ©s de DWR
 * @class DWRDataSource
 * @namespace TF7
 * @extends TF7.DataSource
 */
(function(L) {

  L.DWRDataSource = L.makeClass(TF7.DataSource, {

    /**
     * Inicializador de la clase
     * @method initialize
     * @constructor
     * @param {Object} opts Opciones de inicializaciÃ³n del objeto
     * @throws TypeError A DWRObjectName and a DWRFunctionName must be set for every DWRDataSource
     */
    initialize: function(opts) {
      if (!opts.DWRObjectName || !opts.DWRFunctionName) {
        throw new TypeError('A DWRObjectName and a DWRFunctionName must be set for every DWRDataSource');
      }

      opts.DWRCall = window[opts.DWRObjectName][opts.DWRFunctionName];
      this.constructor.superclass.initialize.call(this, opts);
    },


    /**
     * Busca los elementos con clave <code>query.key</code> y valor <code>query.value</code> en el data source, y llama a la funciÃ³n <code>callback</code> con argumento el array de resultados. Esta funciÃ³n sobreescribe la funciÃ³n {@link DataSource#find} de la clase base {@link DataSource}.
     * @method find
     * @param {Object} query Objeto con la clave (en <code>query.key</code>) y el valor (en <code>query.value</code>) para hacer la bÃºsqueda.
     * @param {Function} callback FunciÃ³n que se llama al terminar la bÃºsqueda con el array de resultados encontrados como parÃ¡metro.
     * @see DataSource#find
     */
    find: function(query, callback) {
      var obj = this;
      var opts = {
          callback: function(data) {
            _handleProcessData(obj, data, callback);
          },
          errorHandler: function(msg, e) {
            callback(-1);
          }
      };
      this.settings.DWRCall.apply(null, [query.key, this.settings.format, query.value, opts]);
    },


    /**
     * Procesa los datos que le llegan de la invocaciÃ³n al mÃ©todo DWR y llama a la funciÃ³n <code>callback</code> con estos cÃ³mo parÃ¡metro.
     * @param {Object} data Objeto con los resultados de la invocaciÃ³n al mÃ©todo DWR. La sintaxis del objeto es {{clave: valor}*}
     * @param {Function} callback FunciÃ³n que se llama al terminar el procesamiento de los datos con estos como parÃ¡metro.
     * @method _processData
     * @private
     */
    _processData: function(data, callback) {
      var ret = [];
      if (data) {
        for (i in data) {
          ret.push({value: i, label: data[i]});
        }
      }
      callback(ret);
    }

  }, {
    __DEFAULTS__: {
      DWRObjectName: null,
      DWRFunctionName: null,
      DWRCall: null,
      format: ''
    }
  });


  /**
   * FunciÃ³n que llama a un mÃ©todo del objeto <code>obj</code> pasÃ¡ndole los otros dos argumentos como parÃ¡metros.
   * @method _handleProcessData
   * @param {Object} obj
   * @param {Array} data
   * @param {Function} callback
   * @private
   */
  function _handleProcessData(obj, data, callback) {
    obj._processData(data, callback);
  }

})(TF7);
/**
 * @module widget
 */


/**
 * Clase base para los widgets TF7
 * @class Base
 * @namespace TF7.widget
 */
(function(L) {

  var ns = L.namespace("widget", L);

  ns.Base = L.makeClass(Object, {

    /**
     * Inicializador de la clase
     * @method initialize
     * @param {ElementNode} el
     * @param {Object} opts Opciones de inicializaciÃ³n del objeto
     */
    initialize: function(el, opts) {
      this.element = el;
      this.settings = TF7.merge({}, opts);
    }
  });
})(TF7);
/**
 * @module widget
 */

/**
 * Clase que encapsula el widget de selects dependientes
 * @TODO mejorar un poco la documentaciÃ³n
 * @class ChainSelect
 * @namespace TF7.widget
 */
(function(L){
  var $ = L.jQuery;
  var ns = L.namespace("widget", L)

  ns.ChainSelect = L.makeClass(ns.Base, {

    /**
     * Inicializador de la clase
     * @method initialize
     * @param {ElementNode} el
     * @param {Object} opts Opciones de inicializaciÃ³n del objeto
     * @throws TypeError A DataSource must be set for every ChainSelect
     */
    initialize: function(el, opts) {
      if (!opts.dataSource) {
        throw new TypeError('A DataSource must be set for every ChainSelect');
      }
      opts = TF7.merge({}, this.constructor.__DEFAULTS__, opts);
      this.constructor.superclass.initialize.call(this, el, opts);
      this.bindEvents();
      TF7.data(this.element, 'widget.ChainSelect', this);

      this.settings.l10nLoadingMessage = 'chain_selects_loading_message'.translate();
      this.settings.l10nErrorMessage = 'chain_selects_loading_error_message'.translate();
      this.settings.l10nSelectOne = 'chain_selects_select_one'.translate();

      if (this.element.value) {
        $(this).trigger('change');
      }
    },


    /**
     * Registra los manejadores de eventos asociados al objeto.
     * @method bindEvents
     */
    bindEvents: function() {
      $(this.element).bind('change', { widget: this }, _handleOnchange);
    },


    /**
     * Manejador del evento change del objeto. Si se ha seleccionado un elemento vÃ¡lido, se recarga el select dependiente con los valores acordes del data source y se deshabilita la cadena de selects que pueda haber a partir de este.
     * @method onchange
     */
    onchange: function() {
      var $related = $(this.settings.related);
      this.disableChain();

      if (this.settings.errorState) {
        $(this.element).parent().removeClass('error');
        $('option:last', this.element).remove();
        this.settings.errorState = false;
      }

      if (this.element.value) {
        $related.append(new Option(this.settings.l10nLoadingMessage));
        $related.show();
        this.settings.dataSource.find({ key: this.settings.findKey, value: this.element.value }, TF7.bind(_findCallback, this));
      }
    },


    /**
     * Deshabilita la cadena de selects dependientes, ademÃ¡s de borrar su contenido.
     * @method disableChain
     * @param {Boolean} hide Indica si se debe ocultar o no el select ademÃ¡s de deshabilitarlo.
     */
    disableChain: function(hide) {
      if (this.settings.related) {
        var $related = $(this.settings.related);

        $related.html('').attr('disabled', true);
        $related.parent().addClass('inhabilitat');
        if (hide && this.settings.hideOnEmpty) {
          $related.hide();
        }
        var relatedWidget = TF7.data(this.settings.related, 'widget.ChainSelect');
        if (relatedWidget) {
          relatedWidget.disableChain(true);
        }
      }
    }
  }, {
    __DEFAULTS__ : {
      related : null,
      dataSource : null, // MUST BE overrided
      findKey : 'parent', // override as apropiate
      l10nLoadingMessage : 'Loading...',
      l10nSelectOne : '-Select-',
      l10nErrorMessage: 'Error in loading data from server.',
      hideOnEmpty : true
    }
  });


  /**
   * Manejador del evento change. Llama a un mÃ©todo de la classe para manejar el evento.
   * @method _handleOnChange
   * @param {EventObject} e
   * @private
   */
  function _handleOnchange(e) {
    e.data.widget.onchange();
  }


  /**
   * Procesa los resultados de la bÃºsqueda y los muestra en el select dependiente. En caso de error, hace el proceso oportuno
   * @method _findCallback
   * @param {Array|integer} Array de resultados para procesar. En caso de que el parÃ¡metro sea -1, este se interpreta como un error y se hace el proceso oportuno.
   * @private
   */
  function _findCallback(result) {
    if (result == -1) {
      $(this.element).parent().addClass('error');
      this.settings.errorState = true;

      $(this.element).append(new Option(this.settings.l10nErrorMessage, ''));
      this.element.selectedIndex = this.element.length - 1;

      this.disableChain();
    } else {
      var $related = $(this.settings.related);
      $related.html('');
      if (result.length) {
        $related.append('<option>' + this.settings.l10nSelectOne + '<\/option>');
        $.each(result, function(k, v) {
          $related.append('<option value="' + v.value + '">' + v.label + '<\/option>');
        });
        $related.removeAttr('disabled');
        $related.parent().removeClass('inhabilitat');
        this.settings.related.selectedIndex = 0;
      }
      else if (this.settings.hideOnEmpty) {
        $related.hide();
      }
    }
  }
})(TF7);
/**
 * Clase que encapsula el widget de tablas ordenables
 * @class SortableRowsTable
 * @namespace TF7.widget
 * @module widget
 */
(function(L) {
  var $ = L.jQuery;
  var ns = L.namespace("widget", L);

  ns.SortableRowsTable = L.makeClass(ns.Base, {

    /**
     * Inicializador de la clase
     * @method initialize
     * @constructor
     * @param {ElementNode} el
     * @param {Object} opts Opciones de inicializaciÃ³n del objeto
     */
    initialize: function(el, opts) {
      opts = TF7.merge({}, this.constructor.__DEFAULTS__, opts);
      this.constructor.superclass.initialize.call(this, el, opts);

      this.settings.l10nMoveUpAltText = 'sortable_rows_table_move_up_alt_text'.translate();
      this.settings.l10nMoveUpTitle = 'sortable_rows_table_move_up_title'.translate();
      this.settings.l10nMoveDownAltText = 'sortable_rows_table_move_down_alt_text'.translate();
      this.settings.l10nMoveDownTitle = 'sortable_rows_table_move_down_title'.translate();

      var that = this;
      $('td.ordenable', this.element).each(function(i) {
        var select = $('select', that.element)[0];
        var html = '<input type="hidden" id="' + select.id + '" name="' + select.name + '" value="' + select.value + '" />';
        var $row = $(this).parents('tr:eq(0)');
        if (_isTopLimit($row)) {
          html += '<ul><li class="up" style="display:none;"><img src="' + TF7.conf.imgPath + that.settings.MoveUpDefaultImage + '" alt="' + that.settings.l10nMoveUpAltText + '" title="' + that.settings.l10nMoveUpTitle + '" /></li><li class="down"><img src="' + TF7.conf.imgPath + that.settings.MoveDownDefaultImage + '" alt="' + that.settings.l10nMoveDownAltText + '" title="' + that.settings.l10nMoveDownTitle + '" /></li></ul>';
        } else if (_isBottomLimit($row)) {
          html += '<ul><li class="up"><img src="' + TF7.conf.imgPath + that.settings.MoveUpDefaultImage + '" alt="' + that.settings.l10nMoveUpAltText + '" title="' + that.settings.l10nMoveUpTitle + '" /></li><li class="down" style="display:none;"><img src="' + TF7.conf.imgPath + that.settings.MoveDownDefaultImage + '" alt="' + that.settings.l10nMoveDownAltText + '" title="' + that.settings.l10nMoveDownTitle + '" /></li></ul>';
        } else {
          html += '<ul class="up-down"><li class="up"><img src="' + TF7.conf.imgPath + that.settings.MoveUpDefaultImage + '" alt="' + that.settings.l10nMoveUpAltText + '" title="' + that.settings.l10nMoveUpTitle + '" /></li><li class="down"><img src="' + TF7.conf.imgPath + that.settings.MoveDownDefaultImage + '" alt="' + that.settings.l10nMoveDownAltText + '" title="' + that.settings.l10nMoveDownTitle + '" /></li></ul>';
        }
        $(this).html(html);

        that.bindEvents(this)
      });
    },


    /**
     * Registra los manejadores de eventos asociados al objeto.
     * @method bindEvents
     * @param {ElementNode} el Nodo al que le queremos asociar los eventos
     */
    bindEvents: function(el) {
      $('li', el)
        .hover(function() {
          var img = this.firstChild;
          img.src = img.src.replace(/\.gif$/, '-over.gif');
        }, function() {
          var img = this.firstChild;
          img.src = img.src.replace(/-over\.gif$/, '.gif');
        })
        .click(function() {
          var delta = $(this).hasClass('down') ? 1 : -1;
          var $row = $(this).parents('tr:eq(0)');
          _moveAndUpdate($row, delta);

          var img = this.firstChild;
          img.src = img.src.replace(/-over\.gif$/, '.gif');
        });
    }
  },
  {
  /**
   * @property __DEFAULTS__
   */
    __DEFAULTS__: {
      MoveUpDefaultImage: 'tabla-icono-ordenar-fila-subir.gif',
      MoveUpOverImage: 'tabla-icono-ordenar-fila-subir-over.gif',
      MoveDownDefaultImage: 'tabla-icono-ordenar-fila-bajar.gif',
      MoveDownOverImage: 'tabla-icono-ordenar-fila-bajar-over.gif'
    }
  });


  /**
   * Informa si el elemento en cuestiÃ³n estÃ¡ en el borde superior de la tabla (en tablas simples) o del nivel actual (en tablas jerÃ¡rquicas)
   * @method _isTopLimit
   * @private
   * @param {jQueryObject} $elem
   * @return {Boolean}
   */
  function _isTopLimit($elem) {
    return !$elem.prev().length || $elem.prev().hasClass('pare');
  }


  /**
   * Informa si el elemento en cuestiÃ³n estÃ¡ en el borde inferior de la tabla (en tablas simples) o del nivel actual (en tablas jerÃ¡rquicas)
   * @method _isBottomLimit
   * @private
   * @param {jQueryObject} $elem
   * @return {Boolean}
   */
  function _isBottomLimit($elem) {
    return !$elem.next().length || $elem.next().hasClass('pare');
  }


  /**
   * Mueve un elemento y actualiza su estado
   * @method _moveAndUpdate
   * @private
   * @param {jQueryObject} $elem
   * @param {Integer} delta=[-1, 1]
   */
  function _moveAndUpdate($elem, delta) {
    var $anchor = (delta > 0 ? $elem.next() : $elem.prev());
    if($anchor.length && !$anchor.hasClass('pare')) {
      $anchor[delta > 0 ? 'after' : 'before']($elem[0]);

      var $input = $('input', $elem);
      $input.val(parseInt($input.val()) + delta);
      var elemVal = $input.val();
      $input = $('input', $anchor);
      $input.val(parseInt($input.val()) - delta);
      var anchorVal = $input.val();

      if (_isTopLimit($elem)) {
        _updateMenu($elem, $anchor, 'up');
      } else if (_isBottomLimit($elem)) {
        _updateMenu($elem, $anchor, 'down');
      }
      if (_isTopLimit($anchor)) {
        _updateMenu($anchor, $elem, 'up');
      } else if (_isBottomLimit($anchor)) {
        _updateMenu($anchor, $elem, 'down');
      }

      var elemClass = $elem.attr('class') ? $elem.attr('class') : '';
      var anchorClass = $anchor.attr('class') ? $anchor.attr('class') : '';
      $elem.attr('class', anchorClass);
      $anchor.attr('class', elemClass);

      $elem.addClass('hilite');
      setTimeout(function () {
        $elem.removeClass('hilite');
      }, 400);
    }
  }

  /**
   * Actualiza el menÃº de opciones para la ordenaciÃ³n
   * @method _updateMenu
   * @private
   * @param {jQueryObject} $newCornerElem Elemento que pasa a estar en una de las esquinas
   * @param {jQueryObject} $oldCornerElem Elemento que deja de estar en una de las esquinas
   * @param {String} corner=['up','down'] Esquina involucrada
   */
  function _updateMenu($newCornerElem, $oldCornerElem, corner) {
    $('td.ordenable ul', $newCornerElem)
      .removeClass()
      .find('li.' + corner).hide();

    if (_isTopLimit($oldCornerElem) || _isBottomLimit($oldCornerElem)) {
      $('td.ordenable ul li.' + corner, $oldCornerElem).show();
    } else {
      $('td.ordenable ul', $oldCornerElem)
        .addClass('up-down')
        .find('li.' + corner).show();
    }
  }
})(TF7);
/**
 * Clase que encapsula el widget de la cuenta genÃ©rica
 * @class GenericAccount
 * @namespace TF7.widget
 */
(function(L){
  var $ = L.jQuery;
  var ns = L.namespace("widget", L);

  ns.GenericAccount = L.makeClass(ns.Base, {

    /**
     * Inicializador de la clase
     * @method initialize
     * @param {ElementNode} el
     * @param {Object} opts Opciones de inicializaciÃ³n del objeto
     * @config {DataSource} dataSource Fuente de datos para el widget
     * @config {ElementNode} officeField Campo de formulario de la oficina
     * @config {ElementNode} selectField Campo de formulario (select) dÃ³nde se
     *  deben cargar los valores de tipos de contrato.
     * @config {String} findKey Clave de bÃºsqueda
     * @config {String} noCentralizedKey Clave de los datos para las oficinas
     *  no centralizadas.
     * @config {String} l10nSelectOne Variable de idioma
     * @throws TypeError A DataSource must be set for every GenericAccount
     */
    initialize: function(el, opts) {
      if (!opts.dataSource) {
        throw new TypeError('A DataSource must be set for every GenericAccount');
      }
      opts = TF7.merge({}, this.constructor.__DEFAULTS__, opts);
      this.constructor.superclass.initialize.call(this, el, opts);

      this.optionSelected = $(this.settings.selectField).find('option:selected')[0];
      this.optionSelected = this.optionSelected ? {index: this.optionSelected.index, value: this.optionSelected.value} : null;

      this.bindEvents();
      this.findValue();
    },


    /**
     * Registra los manejadores de eventos asociados al objeto.
     * @method bindEvents
     */
    bindEvents: function() {
      if (this.settings.officeField) {
        $(this.settings.officeField).bind('change', {widget: this}, _handleOnChange);
      }
    },


    /**
     * Manejador del evento change del objeto. Si se ha introducido un valor
     * vÃ¡lido, se recarga el select dependiente con los valores acordes del
     * data source. En caso contrario, se cargan los valores predeterminados.
     * @method findValue
     */
    findValue: function() {
      if (this.settings.officeField.value) {
        this.settings.dataSource.find({ key: this.settings.findKey, value: this.settings.officeField.value }, TF7.bind(_findCallback, this));
      } else {
        this.settings.dataSource.find({ key: this.settings.findKey, value: this.settings.defaultValuesKey }, TF7.bind(_findCallback, this));
      }
    }
  }, {
    __DEFAULTS__ : {
      dataSource : null, // MUST BE overrided
      findKey : null, // override as apropiate
      noCentralizedKey: null,
      defaultValuesKey: null,
      officeField: null,
      selectField: null,
      l10nSelectOne : '-Select-'
    }
  });


  /**
   * Manejador del evento change. Llama a un mÃ©todo de la classe para manejar
   * el evento.
   * @method _handleOnChange
   * @param {EventObject} e
   * @private
   */
  function _handleOnChange(e) {
    e.data.widget.findValue();
  }


  /**
   * Procesa los resultados de la bÃºsqueda y los muestra en el select
   * dependiente. En caso que <code>result</code> estÃ© vacÃ­o, muestra los
   * resultados de la bÃºsqueda por <code>this.settings.noCentralizedKey</code>
   * @method _findCallback
   * @param {Array} Array de resultados para procesar. En caso de que estÃ©
   *  vacÃ­o, se lanza la bÃºsqueda de nuevo con
   *  <code>this.settings.noCentralizedKey</code>
   * @private
   */
  function _findCallback(result) {
    var $select = $(this.settings.selectField),
    values = null;

    $select.html('');
    if (!result.length) {
      this.settings.dataSource.find({ key: this.settings.findKey, value: this.settings.noCentralizedKey }, TF7.bind(_findCallback, this));
    } else {
      values = result[0].values;
      for (var i in values) {
        $select.append('<option value="' + i + '">' + values[i] + '<\/option>');
      }
      if ($('option', $select).length > 1) {
        $select.prepend('<option>' + this.settings.l10nSelectOne + '<\/option>');
      }

      if (this.optionSelected) {
        var option = $select.find('option[value="' + this.optionSelected.value + '"]')[0];
      }
      if (option) {
        this.settings.selectField.selectedIndex = option.index;
      } else {
        this.settings.selectField.selectedIndex = 0;
      }
    }
  }
})(TF7);
(function(L) {
  myIframe = null;
  var $ = L.jQuery,
  ns = L.namespace("widget", L),
  DEBUG = false;


  /**
   * Widget para el envÃ­o asÃ­ncrono de ficheros
   * Utiliza campos ocultos de formulario para recoger la informaciÃ³n. Se utiliza
   * el identificador del <input type="file"> + postfijos configurables.
   * Por defecto:
   *   <p>
   *     <input type="hidden" id="identificador_post_url" value="upload.php" />
   *     <input type="hidden" id="identificador_ticket" name="ticket" />
   *     <label for="arxiu">Subir archivo:</label>
   *     <input size="20" type="file" id="file-1" class="async-upload" name="file_upload" />
   *   </p>
   */
  ns.AsyncUploader = L.makeClass(ns.Base, {
    /**
     * Constructor. Ver __DEFAULTS__ para las opciones disponibles
     */
    initialize : function(el, opts) {
      this.element = el;
      this.id = this.element.id;
      opts = TF7.merge({}, this.constructor.__DEFAULTS__, opts);
      this.constructor.superclass.initialize.call(this, el, opts);
      this.bindEvents();
      L.data(this.element, 'widget.AsyncUploader', this);
      this.settings.l10nCancel = 'async_uploader_cancel'.translate();
      this.settings.l10nUploading = 'async_uploader_uploading'.translate();
      this.settings.l10nErrorMessage = 'async_uploader_error_message'.translate();
      this.settings.l10nRemove = 'async_uploader_remove'.translate();
    },
    bindEvents : function() {
      $(this.element).bind('change', { widget: this }, _handleOnChange);
    },
    onChange : function() {
      this.markAsFailed(false);
      this.initUpload();
    },
    initUpload : function() {
      this.onBeforeUpload();
      var $form = this.$form = this.createForm();
      $form.append(this.element);
      if (this.settings.useWindowNameCrossDomainHack) {
        $form.append($('<input type="hidden" name="responseType" value="js" />'));
      }
      this.$iframe = this.createIframe();
      this.$iframe.bind('load', { widget: this }, iframeOnload);
      this.$iframe.bind('error', { widget: this }, _handleIframeOnError);
      $form.submit();
    },
    createIframe : function() {
      var $iframe = $('<iframe name="' + this.id + this.settings.iframePostFix + '" src="javascript:false;"' + (DEBUG ? '' : ' style="display:none"')+ '>');
      $(document.body).append($iframe);
      return $iframe;
    },
    createForm : function() {
      var destUrl = $('#' + this.id + this.settings.postUrlFieldPostFix).val(),
      $form = $('<form enctype="multipart/form-data" action="' +
      destUrl +
      '" method="POST" target="' + this.id + this.settings.iframePostFix + '" style="display:none;">' +
      '</form>');
      $(document.body).append($form);
      return $form;
    },
    /**
     * Parsea el resultado de la carga del iframe y ejecuta la funciÃ³n de callback.
     * Si no puede parsear el resultado, llama al callback con status de error.
     */
    iframeOnload : function(iframe) {
      if (this.settings.useWindowNameCrossDomainHack) {
        this.$iframe.unbind();
        this.$iframe.bind('load', { widget: this }, _windowNameHackLoad);
        this.$iframe[0].contentWindow.location = this.settings.blankUrl;
      }
      else {
        var oDoc = this.$iframe[0].contentWindow || this.$iframe[0].contentDocument,
        $body,
        status,
        code;
        try {
          if (oDoc.document.XMLDocument) { // IE
            $body = $(oDoc.document.XMLDocument);
            status = $body.find('respuesta resultado')[0].text;
            code = $body.find('respuesta codigo')[0].text;
          }
          else { // Others
            $body = $(oDoc.document);
            status = $body.find('respuesta resultado')[0].textContent;
            code = $body.find('respuesta codigo')[0].textContent;
          }
        }
        catch (ex) {
          status = "ERROR";
          code = 0;
        }
        this.callback(status, code);
      }
    },
    callback : function(status, code) {
      if (status == "OK") {
        this.onSuccess(code);
      }
      else {
        this.onError(code);
      }
      this.onAfterUpload(status, code);
    },
    /**
     * Rutinas que se ejecutan antes del inicio del envÃ­o
     */
    onBeforeUpload : function() {
      var $placeholder = $('<input type="text" id="' + this.id + '_placeholder" readonly="readonly" disabled="disabled" />'),
      $el = $(this.element),
      $parent = $el.parent(),
      $uploading,
      $cancel,
      filename;
      filename = $el.val();
      filename = filename.match(/([^\\\/]*)$/)[1];
      $placeholder.val(filename);
      $el.before($placeholder);
      $uploading = $('<span class="' + this.settings.uploadingSpanClassname + '" />');
      $uploading.append(this.settings.l10nUploading);
      $uploading.append(document.createTextNode(' '));
      $cancel = this.createButton(this.settings.l10nCancel);
      $cancel.bind('click', { widget: this }, _handleOnCancel);
      $uploading.append($cancel);
      $parent.append($uploading);
      this.$placeholder = $placeholder;
      this.$uploading = $uploading;
    },
    /**
     * Rutinas que se ejecutan tras el upload independientemente de si ha tenido
     * o no Ã©xito
     */
    onAfterUpload: function(status, code) {
      this.$uploading.remove();
      this.removeIframe();
    },
    /**
     * Asigna el nÃºmero de ticket retornado al control oculto correspondiente;
     * elimina el indicador de "cargando" y el botÃ³n de cancelaciÃ³n;
     * aÃ±ade el botÃ³n de "eliminar"
     */
    onSuccess : function(code) {
      var $placeholder = $('<span class="placeholder"></span>').html(this.$placeholder.val()),
      $parent = this.$placeholder.parent();
      this.$placeholder.remove();
      $parent.append($placeholder);
      $parent.append(document.createTextNode(' '));
      this.$placeholder = $placeholder;
      $('#' + this.id + this.settings.ticketFieldPostFix).val(code);
      var $remove = this.createButton(this.settings.l10nRemove);
      $remove.bind('click', { widget: this }, _handleOnRemove);
      $parent.append($remove);
      this.$remove = $remove;
    },
    /**
     * Refresca la interfaz y marca el error
     */
    onError : function(code) {
      this.refreshUi();
      this.markAsFailed();
    },
    /**
     * Cancela la carga y refresca la interfaz
     */
    onCancel: function() {
      this.cancelUpload();
      this.refreshUi();
    },
    /**
     * Refresca la interfaz
     */
    onRemove: function() {
      this.refreshUi();
    },
    /**
     * Cancela la carga
     */
    cancelUpload : function() {
      this.removeIframe();
    },
    /**
     * Refresco de interfaz:
     * - se elimina el indicador de carga en proceso
     * - se elimina el iframe auxiliar
     * - se recupera el control original
     * - se elimina el form auxiliar
     * - se elimina el botÃ³n "eliminar"
     * - se resetea el valor del campo auxiliar de nÃºmero de ticket
     */
    refreshUi : function() {
      this.$uploading.remove();
      this.removeIframe();
      this.$placeholder.before(this.element).remove();
      this.$form.remove();
      if (this.$remove) this.$remove.remove();
      $('#' + this.id + this.settings.ticketFieldPostFix).val('');
    },
    /**
     * AÃ±ade o elimina la marca de error al contenedor y muestra o elimina
     * el literal de error
     * @param {Boolean} [b=true] Cuando es false, se eliminan las marcas
     */
    markAsFailed : function(b) {
      b = (b === undefined ? true : b);
      var $errorMessage,
      $parent = $(this.element).parent().parent();
      $parent.find('p.control')[b ? 'addClass' : 'removeClass']('error');
      if (!b && this.$errorMessage) {
        this.$errorMessage.remove();
      }
      if (b) {
        var $errorMessage = $('<ul class="errors"><li>' + this.settings.l10nErrorMessage +'</li></ul>');
        $parent.append($errorMessage);
        this.$errorMessage = $errorMessage;
      }
    },
    removeIframe : function() {
      this.$iframe.unbind().remove();
    },
    /**
     * MÃ©todo auxiliar para la creaciÃ³n de los botones "cancelar" y "eliminar"
     */
    createButton : function(text) {
      var $but = $('<a class="buttonlink" href="javascript:;">' + text + '</a>');
      if (this.settings.buttonSpans) {
        $but.append($(this.settings.buttonSpans));
      }
      return $but;
    },
    /**
     * Bloquea el resto de la interfaz mientras se realiza el upload
     */
    lockUi: function() {
      if (!this.lockedUI) {
        var $message = $('<div class="missatge-indicador-progres lock-form-message"><p>' + TF7.l10n.formularios_blockUI + '</p></div>');
        $('body').prepend($message);

        new TF7.UI.Overlay($message[0], {
          draggable: false,
          fixPosition: true,
          modal: true,
          centerInView: true
        }).show();

        this.lockedUI = true;
      }
    },
    /**
     * Desbloquea la interfaz
     */
    unlockUi: function() {
      if (this.lockedUI) {
        var widget = TF7.UI.Overlay.getWidget($('div.lock-form-message').attr('id'));
        if (widget) {
          widget.destroy();
          this.lockedUI = false;
        }
      }
    }

  }, {
    __DEFAULTS__ : {
      postUrlFieldPostFix : "_post_url",
      iframePostFix : "_iframe",
      ticketFieldPostFix : "_ticket",
      buttonSpans : '<span class="tl"></span><span class="bl"></span><span class="br"></span><span class="tr"></span>',
      uploadingSpanClassname : "uploading",
      timeout : 10000,
      useWindowNameCrossDomainHack: false,
      blankUrl : "blank.html"
    }
  });


  function _handleOnChange(e) {
    e.data.widget.onChange();
  }

  function _handleOnCancel(e) {
    e.data.widget.onCancel();
  }

  function _handleOnRemove(e) {
    e.data.widget.onRemove();
  };

  function iframeOnload(e) {
    e.data.widget.iframeOnload(this);
  }

  function _handleIframeOnError(e) {
    e.data.widget.callback('ERROR', 0);
  }

  function _windowNameHackLoad(e) {
    var $doc = $(this.contentWindow.name),
    status = $doc.find('resultado').html(),
    code = $doc.find('codigo').html(),
    s2,
    replacements;
    if (!status || !code) {
      replacements = {
        'respuesta' : 'div',
        'resultado' : 'b',
        'codigo' : 'i'
      };
      s2 = this.contentWindow.name.replace(/(<\/?)([^\s>]+)\s?([^>]*)>/g, function(m,s1,s2,s3) {
        return s1 + (replacements[s2] || s2) + s3 + '>';
      });
      $doc = $(s2);
      status = $doc.find(replacements['resultado']).html();
      code = $doc.find(replacements['codigo']).html();
    }
    e.data.widget.callback.apply(e.data.widget, [status, code]);
  }

}(TF7));
(function(L) {

  var $ = L.jQuery,

  init_async_uploaders = function(context) {
    $("input.async-upload", context)
      .each(function() {
        TF7.widget.AsyncUploader(this, {
          useWindowNameCrossDomainHack : true,
          blankUrl : TF7.conf.blankUrl
        });
      });
  };

  L.onInit(init_async_uploaders);

}(TF7));
/*
 * Copyright 2005 Joe Walker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Declare an object to which we can add real functions.
 */
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

/**
 * Set an alternative error handler from the default alert box.
 * @see getahead.org/dwr/browser/engine/errors
 */
dwr.engine.setErrorHandler = function(handler) {
  dwr.engine._errorHandler = handler;
};

/**
 * Set an alternative warning handler from the default alert box.
 * @see getahead.org/dwr/browser/engine/errors
 */
dwr.engine.setWarningHandler = function(handler) {
  dwr.engine._warningHandler = handler;
};

/**
 * Setter for the text/html handler - what happens if a DWR request gets an HTML
 * reply rather than the expected Javascript. Often due to login timeout
 */
dwr.engine.setTextHtmlHandler = function(handler) {
  dwr.engine._textHtmlHandler = handler;
};

/**
 * Set a default timeout value for all calls. 0 (the default) turns timeouts off.
 * @see getahead.org/dwr/browser/engine/errors
 */
dwr.engine.setTimeout = function(timeout) {
  dwr.engine._timeout = timeout;
};

/**
 * The Pre-Hook is called before any DWR remoting is done.
 * @see getahead.org/dwr/browser/engine/hooks
 */
dwr.engine.setPreHook = function(handler) {
  dwr.engine._preHook = handler;
};

/**
 * The Post-Hook is called after any DWR remoting is done.
 * @see getahead.org/dwr/browser/engine/hooks
 */
dwr.engine.setPostHook = function(handler) {
  dwr.engine._postHook = handler;
};

/**
 * Custom headers for all DWR calls
 * @see getahead.org/dwr/????
 */
dwr.engine.setHeaders = function(headers) {
  dwr.engine._headers = headers;
};

/**
 * Custom parameters for all DWR calls
 * @see getahead.org/dwr/????
 */
dwr.engine.setParameters = function(parameters) {
  dwr.engine._parameters = parameters;
};

/** XHR remoting type constant. See dwr.engine.set[Rpc|Poll]Type() */
dwr.engine.XMLHttpRequest = 1;

/** XHR remoting type constant. See dwr.engine.set[Rpc|Poll]Type() */
dwr.engine.IFrame = 2;

/** XHR remoting type constant. See dwr.engine.setRpcType() */
dwr.engine.ScriptTag = 3;

/**
 * Set the preferred remoting type.
 * @param newType One of dwr.engine.XMLHttpRequest or dwr.engine.IFrame or dwr.engine.ScriptTag
 * @see getahead.org/dwr/browser/engine/options
 */
dwr.engine.setRpcType = function(newType) {
  if (newType != dwr.engine.XMLHttpRequest && newType != dwr.engine.IFrame && newType != dwr.engine.ScriptTag) {
    dwr.engine._handleError(null, { name:"dwr.engine.invalidRpcType", message:"RpcType must be one of dwr.engine.XMLHttpRequest or dwr.engine.IFrame or dwr.engine.ScriptTag" });
    return;
  }
  dwr.engine._rpcType = newType;
};

/**
 * Which HTTP method do we use to send results? Must be one of "GET" or "POST".
 * @see getahead.org/dwr/browser/engine/options
 */
dwr.engine.setHttpMethod = function(httpMethod) {
  if (httpMethod != "GET" && httpMethod != "POST") {
    dwr.engine._handleError(null, { name:"dwr.engine.invalidHttpMethod", message:"Remoting method must be one of GET or POST" });
    return;
  }
  dwr.engine._httpMethod = httpMethod;
};

/**
 * Ensure that remote calls happen in the order in which they were sent? (Default: false)
 * @see getahead.org/dwr/browser/engine/ordering
 */
dwr.engine.setOrdered = function(ordered) {
  dwr.engine._ordered = ordered;
};

/**
 * Do we ask the XHR object to be asynchronous? (Default: true)
 * @see getahead.org/dwr/browser/engine/options
 */
dwr.engine.setAsync = function(async) {
  dwr.engine._async = async;
};

/**
 * Does DWR poll the server for updates? (Default: false)
 * @see getahead.org/dwr/browser/engine/options
 */
dwr.engine.setActiveReverseAjax = function(activeReverseAjax) {
  if (activeReverseAjax) {
    if (dwr.engine._activeReverseAjax) return;
    dwr.engine._activeReverseAjax = true;
    dwr.engine._poll();
  }
  else {
    if (dwr.engine._activeReverseAjax && dwr.engine._pollReq) dwr.engine._pollReq.abort();
    dwr.engine._activeReverseAjax = false;
  }
};

/**
 * The default message handler.
 * @see getahead.org/dwr/browser/engine/errors
 */
dwr.engine.defaultErrorHandler = function(message, ex) {
  dwr.engine._debug("Error: " + ex.name + ", " + ex.message, true);
  if (message == null || message == "") alert("A server error has occured.");
  else if (message.indexOf("0x80040111") != -1) dwr.engine._debug(message);
  else alert(message);
};

/**
 * The default warning handler.
 * @see getahead.org/dwr/browser/engine/errors
 */
dwr.engine.defaultWarningHandler = function(message, ex) {
  dwr.engine._debug(message);
};

/**
 * For reduced latency you can group several remote calls together using a batch.
 * @see getahead.org/dwr/browser/engine/batch
 */
dwr.engine.beginBatch = function() {
  if (dwr.engine._batch) {
    dwr.engine._handleError(null, { name:"dwr.engine.batchBegun", message:"Batch already begun" });
    return;
  }
  dwr.engine._batch = dwr.engine._createBatch();
};

/**
 * Finished grouping a set of remote calls together. Go and execute them all.
 * @see getahead.org/dwr/browser/engine/batch
 */
dwr.engine.endBatch = function(options) {
  var batch = dwr.engine._batch;
  if (batch == null) {
    dwr.engine._handleError(null, { name:"dwr.engine.batchNotBegun", message:"No batch in progress" });
    return;
  }
  dwr.engine._batch = null;
  if (batch.map.callCount == 0) return;

  if (options) dwr.engine._mergeBatch(batch, options);

  if (dwr.engine._ordered && dwr.engine._batchesLength != 0) {
    dwr.engine._batchQueue[dwr.engine._batchQueue.length] = batch;
  }
  else {
    dwr.engine._sendData(batch);
  }
};

/** @deprecated */
dwr.engine.setPollMethod = function(type) { dwr.engine.setPollType(type); };
dwr.engine.setMethod = function(type) { dwr.engine.setRpcType(type); };
dwr.engine.setVerb = function(verb) { dwr.engine.setHttpMethod(verb); };
dwr.engine.setPollType = function() { dwr.engine._debug("Manually setting the Poll Type is not supported"); };


/** The original page id sent from the server */
dwr.engine._origScriptSessionId = "${scriptSessionId}";

/** The session cookie name */
dwr.engine._sessionCookieName = "${sessionCookieName}"; // JSESSIONID

/** Is GET enabled for the benefit of Safari? */
dwr.engine._allowGetForSafariButMakeForgeryEasier = "${allowGetForSafariButMakeForgeryEasier}";

/** The script prefix to strip in the case of scriptTagProtection. */
dwr.engine._scriptTagProtection = "${scriptTagProtection}";

/** The default path to the DWR servlet */
dwr.engine._defaultPath = "${defaultPath}";

/** Do we use XHR for reverse ajax because we are not streaming? */
dwr.engine._pollWithXhr = "${pollWithXhr}";

/** The read page id that we calculate */
dwr.engine._scriptSessionId = null;

/** The function that we use to fetch/calculate a session id */
dwr.engine._getScriptSessionId = function() {
  if (dwr.engine._scriptSessionId == null) {
    dwr.engine._scriptSessionId = dwr.engine._origScriptSessionId + Math.floor(Math.random() * 1000);
  }
  return dwr.engine._scriptSessionId;
};

/** A function to call if something fails. */
dwr.engine._errorHandler = dwr.engine.defaultErrorHandler;

/** For debugging when something unexplained happens. */
dwr.engine._warningHandler = dwr.engine.defaultWarningHandler;

/** A function to be called before requests are marshalled. Can be null. */
dwr.engine._preHook = null;

/** A function to be called after replies are received. Can be null. */
dwr.engine._postHook = null;

/** An map of the batches that we have sent and are awaiting a reply on. */
dwr.engine._batches = {};

/** A count of the number of outstanding batches. Should be == to _batches.length unless prototype has messed things up */
dwr.engine._batchesLength = 0;

/** In ordered mode, the array of batches waiting to be sent */
dwr.engine._batchQueue = [];

/** What is the default rpc type */
dwr.engine._rpcType = dwr.engine.XMLHttpRequest;

/** What is the default remoting method (ie GET or POST) */
dwr.engine._httpMethod = "POST";

/** Do we attempt to ensure that calls happen in the order in which they were sent? */
dwr.engine._ordered = false;

/** Do we make the calls async? */
dwr.engine._async = true;

/** The current batch (if we are in batch mode) */
dwr.engine._batch = null;

/** The global timeout */
dwr.engine._timeout = 0;

/** ActiveX objects to use when we want to convert an xml string into a DOM object. */
dwr.engine._DOMDocument = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.5.0", "Msxml2.DOMDocument.4.0", "Msxml2.DOMDocument.3.0", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XMLDOM"];

/** The ActiveX objects to use when we want to do an XMLHttpRequest call. */
dwr.engine._XMLHTTP = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];

/** Are we doing comet or polling? */
dwr.engine._activeReverseAjax = false;

/** The iframe that we are using to poll */
dwr.engine._outstandingIFrames = [];

/** The xhr object that we are using to poll */
dwr.engine._pollReq = null;

/** How many milliseconds between internal comet polls */
dwr.engine._pollCometInterval = 200;

/** How many times have we re-tried to poll? */
dwr.engine._pollRetries = 0;
dwr.engine._maxPollRetries = 0;

/** Do we do a document.reload if we get a text/html reply? */
dwr.engine._textHtmlHandler = null;

/** If you wish to send custom headers with every request */
dwr.engine._headers = null;

/** If you wish to send extra custom request parameters with each request */
dwr.engine._parameters = null;

/** Undocumented interceptors - do not use */
dwr.engine._postSeperator = "\n";
dwr.engine._defaultInterceptor = function(data) { return data; };
dwr.engine._urlRewriteHandler = dwr.engine._defaultInterceptor;
dwr.engine._contentRewriteHandler = dwr.engine._defaultInterceptor;
dwr.engine._replyRewriteHandler = dwr.engine._defaultInterceptor;

/** Batch ids allow us to know which batch the server is answering */
dwr.engine._nextBatchId = 0;

/** A list of the properties that need merging from calls to a batch */
dwr.engine._propnames = [ "rpcType", "httpMethod", "async", "timeout", "errorHandler", "warningHandler", "textHtmlHandler" ];

/** Do we stream, or can be hacked to do so? */
dwr.engine._partialResponseNo = 0;
dwr.engine._partialResponseYes = 1;
dwr.engine._partialResponseFlush = 2;

/** Is this page in the process of unloading? */
dwr.engine._unloading = false;

/**
 * @private Send a request. Called by the Javascript interface stub
 * @param path part of URL after the host and before the exec bit without leading or trailing /s
 * @param scriptName The class to execute
 * @param methodName The method on said class to execute
 * @param func The callback function to which any returned data should be passed
 *       if this is null, any returned data will be ignored
 * @param vararg_params The parameters to pass to the above class
 */
dwr.engine._execute = function(path, scriptName, methodName, vararg_params) {
  var singleShot = false;
  if (dwr.engine._batch == null) {
    dwr.engine.beginBatch();
    singleShot = true;
  }
  var batch = dwr.engine._batch;
  var args = [];
  for (var i = 0; i < arguments.length - 3; i++) {
    args[i] = arguments[i + 3];
  }
  if (batch.path == null) {
    batch.path = path;
  }
  else {
    if (batch.path != path) {
      dwr.engine._handleError(batch, { name:"dwr.engine.multipleServlets", message:"Can't batch requests to multiple DWR Servlets." });
      return;
    }
  }
  var callData;
  var lastArg = args[args.length - 1];
  if (typeof lastArg == "function" || lastArg == null) callData = { callback:args.pop() };
  else callData = args.pop();

  dwr.engine._mergeBatch(batch, callData);
  batch.handlers[batch.map.callCount] = {
    exceptionHandler:callData.exceptionHandler,
    callback:callData.callback
  };

  var prefix = "c" + batch.map.callCount + "-";
  batch.map[prefix + "scriptName"] = scriptName;
  batch.map[prefix + "methodName"] = methodName;
  batch.map[prefix + "id"] = batch.map.callCount;
  for (i = 0; i < args.length; i++) {
    dwr.engine._serializeAll(batch, [], args[i], prefix + "param" + i);
  }

  batch.map.callCount++;
  if (singleShot) dwr.engine.endBatch();
};

/** @private Poll the server to see if there is any data waiting */
dwr.engine._poll = function() {
  if (!dwr.engine._activeReverseAjax) return;

  var batch = dwr.engine._createBatch();
  batch.map.id = 0; // TODO: Do we need this??
  batch.map.callCount = 1;
  batch.isPoll = true;
  if (dwr.engine._pollWithXhr == "true") {
    batch.rpcType = dwr.engine.XMLHttpRequest;
    batch.map.partialResponse = dwr.engine._partialResponseNo;
  }
  else {
    if (navigator.userAgent.indexOf("Gecko/") != -1) {
      batch.rpcType = dwr.engine.XMLHttpRequest;
      batch.map.partialResponse = dwr.engine._partialResponseYes;
    }
    else {
      batch.rpcType = dwr.engine.XMLHttpRequest;
      batch.map.partialResponse = dwr.engine._partialResponseNo;
    }
  }
  batch.httpMethod = "POST";
  batch.async = true;
  batch.timeout = 0;
  batch.path = dwr.engine._defaultPath;
  batch.preHooks = [];
  batch.postHooks = [];
  batch.errorHandler = dwr.engine._pollErrorHandler;
  batch.warningHandler = dwr.engine._pollErrorHandler;
  batch.handlers[0] = {
    callback:function(pause) {
      dwr.engine._pollRetries = 0;
      setTimeout(dwr.engine._poll, pause);
    }
  };

  dwr.engine._sendData(batch);
  if (batch.rpcType == dwr.engine.XMLHttpRequest && batch.map.partialResponse == dwr.engine._partialResponseYes) {
    dwr.engine._checkCometPoll();
  }
};

/** Try to recover from polling errors */
dwr.engine._pollErrorHandler = function(msg, ex) {
  dwr.engine._pollRetries++;
  dwr.engine._debug("Reverse Ajax poll failed (pollRetries=" + dwr.engine._pollRetries + "): " + ex.name + " : " + ex.message);
  if (dwr.engine._pollRetries < dwr.engine._maxPollRetries) {
    setTimeout(dwr.engine._poll, 10000);
  }
  else {
    dwr.engine._activeReverseAjax = false;
    dwr.engine._debug("Giving up.");
  }
};

/** @private Generate a new standard batch */
dwr.engine._createBatch = function() {
  var batch = {
    map:{
      callCount:0,
      page:window.location.pathname + window.location.search,
      httpSessionId:dwr.engine._getJSessionId(),
      scriptSessionId:dwr.engine._getScriptSessionId()
    },
    charsProcessed:0, paramCount:0,
    parameters:{}, headers:{},
    isPoll:false, handlers:{}, preHooks:[], postHooks:[],
    rpcType:dwr.engine._rpcType,
    httpMethod:dwr.engine._httpMethod,
    async:dwr.engine._async,
    timeout:dwr.engine._timeout,
    errorHandler:dwr.engine._errorHandler,
    warningHandler:dwr.engine._warningHandler,
    textHtmlHandler:dwr.engine._textHtmlHandler
  };
  if (dwr.engine._preHook) batch.preHooks.push(dwr.engine._preHook);
  if (dwr.engine._postHook) batch.postHooks.push(dwr.engine._postHook);
  var propname, data;
  if (dwr.engine._headers) {
    for (propname in dwr.engine._headers) {
      data = dwr.engine._headers[propname];
      if (typeof data != "function") batch.headers[propname] = data;
    }
  }
  if (dwr.engine._parameters) {
    for (propname in dwr.engine._parameters) {
      data = dwr.engine._parameters[propname];
      if (typeof data != "function") batch.parameters[propname] = data;
    }
  }
  return batch;
};

/** @private Take further options and merge them into */
dwr.engine._mergeBatch = function(batch, overrides) {
  var propname, data;
  for (var i = 0; i < dwr.engine._propnames.length; i++) {
    propname = dwr.engine._propnames[i];
    if (overrides[propname] != null) batch[propname] = overrides[propname];
  }
  if (overrides.preHook != null) batch.preHooks.unshift(overrides.preHook);
  if (overrides.postHook != null) batch.postHooks.push(overrides.postHook);
  if (overrides.headers) {
    for (propname in overrides.headers) {
      data = overrides.headers[propname];
      if (typeof data != "function") batch.headers[propname] = data;
    }
  }
  if (overrides.parameters) {
    for (propname in overrides.parameters) {
      data = overrides.parameters[propname];
      if (typeof data != "function") batch.map["p-" + propname] = "" + data;
    }
  }
};

/** @private What is our session id? */
dwr.engine._getJSessionId =  function() {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
    if (cookie.indexOf(dwr.engine._sessionCookieName + "=") == 0) {
      return cookie.substring(dwr.engine._sessionCookieName.length + 1, cookie.length);
    }
  }
  return "";
};

/** @private Check for reverse Ajax activity */
dwr.engine._checkCometPoll = function() {
  for (var i = 0; i < dwr.engine._outstandingIFrames.length; i++) {
    var text = "";
    var iframe = dwr.engine._outstandingIFrames[i];
    try {
      text = dwr.engine._getTextFromCometIFrame(iframe);
    }
    catch (ex) {
      dwr.engine._handleWarning(iframe.batch, ex);
    }
    if (text != "") dwr.engine._processCometResponse(text, iframe.batch);
  }
  if (dwr.engine._pollReq) {
    var req = dwr.engine._pollReq;
    var text = req.responseText;
    if (text != null) dwr.engine._processCometResponse(text, req.batch);
  }

  if (dwr.engine._outstandingIFrames.length > 0 || dwr.engine._pollReq) {
    setTimeout(dwr.engine._checkCometPoll, dwr.engine._pollCometInterval);
  }
};

/** @private Extract the whole (executed an all) text from the current iframe */
dwr.engine._getTextFromCometIFrame = function(frameEle) {
  var body = frameEle.contentWindow.document.body;
  if (body == null) return "";
  var text = body.innerHTML;
  if (text.indexOf("<PRE>") == 0 || text.indexOf("<pre>") == 0) {
    text = text.substring(5, text.length - 7);
  }
  return text;
};

/** @private Some more text might have come in, test and execute the new stuff */
dwr.engine._processCometResponse = function(response, batch) {
  if (batch.charsProcessed == response.length) return;
  if (response.length == 0) {
    batch.charsProcessed = 0;
    return;
  }

  var firstStartTag = response.indexOf("//#DWR-START#", batch.charsProcessed);
  if (firstStartTag == -1) {
    batch.charsProcessed = response.length;
    return;
  }

  var lastEndTag = response.lastIndexOf("//#DWR-END#");
  if (lastEndTag == -1) {
    return;
  }

  if (response.charCodeAt(lastEndTag + 11) == 13 && response.charCodeAt(lastEndTag + 12) == 10) {
    batch.charsProcessed = lastEndTag + 13;
  }
  else {
    batch.charsProcessed = lastEndTag + 11;
  }

  var exec = response.substring(firstStartTag + 13, lastEndTag);

  dwr.engine._receivedBatch = batch;
  dwr.engine._eval(exec);
  dwr.engine._receivedBatch = null;
};

/** @private Actually send the block of data in the batch object. */
dwr.engine._sendData = function(batch) {
  batch.map.batchId = dwr.engine._nextBatchId;
  dwr.engine._nextBatchId++;
  dwr.engine._batches[batch.map.batchId] = batch;
  dwr.engine._batchesLength++;
  batch.completed = false;

  for (var i = 0; i < batch.preHooks.length; i++) {
    batch.preHooks[i]();
  }
  batch.preHooks = null;
  if (batch.timeout && batch.timeout != 0) {
    batch.timeoutId = setTimeout(function() { dwr.engine._abortRequest(batch); }, batch.timeout);
  }
  if (batch.rpcType == dwr.engine.XMLHttpRequest) {
    if (window.XMLHttpRequest) {
      batch.req = new XMLHttpRequest();
    }
    else if (window.ActiveXObject && !(navigator.userAgent.indexOf("Mac") >= 0 && navigator.userAgent.indexOf("MSIE") >= 0)) {
      batch.req = dwr.engine._newActiveXObject(dwr.engine._XMLHTTP);
    }
  }

  var prop, request;
  if (batch.req) {
    if (batch.async) {
      batch.req.onreadystatechange = function() {
        if (typeof dwr != 'undefined') dwr.engine._stateChange(batch);
      };
    }
    if (batch.isPoll) {
      dwr.engine._pollReq = batch.req;
      if (!(document.all && !window.opera)) batch.req.batch = batch;
    }
    var indexSafari = navigator.userAgent.indexOf("Safari/");
    if (indexSafari >= 0) {
      var version = navigator.userAgent.substring(indexSafari + 7);
      if (parseInt(version, 10) < 400) {
        if (dwr.engine._allowGetForSafariButMakeForgeryEasier == "true") batch.httpMethod = "GET";
        else dwr.engine._handleWarning(batch, { name:"dwr.engine.oldSafari", message:"Safari GET support disabled. See getahead.org/dwr/server/servlet and allowGetForSafariButMakeForgeryEasier." });
      }
    }
    batch.mode = batch.isPoll ? dwr.engine._ModePlainPoll : dwr.engine._ModePlainCall;
    request = dwr.engine._constructRequest(batch);
    try {
      batch.req.open(batch.httpMethod, request.url, batch.async);
      try {
        for (prop in batch.headers) {
          var value = batch.headers[prop];
          if (typeof value == "string") batch.req.setRequestHeader(prop, value);
        }
        if (!batch.headers["Content-Type"]) batch.req.setRequestHeader("Content-Type", "text/plain");
      }
      catch (ex) {
        dwr.engine._handleWarning(batch, ex);
      }
      batch.req.send(request.body);
      if (!batch.async) dwr.engine._stateChange(batch);
    }
    catch (ex) {
      dwr.engine._handleError(batch, ex);
    }
  }
  else if (batch.rpcType != dwr.engine.ScriptTag) {
    var idname = batch.isPoll ? "dwr-if-poll-" + batch.map.batchId : "dwr-if-" + batch.map.batchId;
    batch.div = document.createElement("div");
    document.body.appendChild(batch.div);
    batch.div.innerHTML = "<iframe src='javascript:void(0)' frameborder='0' style='width:0px;height:0px;border:0;' id='" + idname + "' name='" + idname + "' onload='dwr.engine._iframeLoadingComplete (" + batch.map.batchId + ");'></iframe>";
    batch.document = document;
    batch.iframe = batch.document.getElementById(idname);
    batch.iframe.batch = batch;
    batch.mode = batch.isPoll ? dwr.engine._ModeHtmlPoll : dwr.engine._ModeHtmlCall;
    if (batch.isPoll) dwr.engine._outstandingIFrames.push(batch.iframe);
    request = dwr.engine._constructRequest(batch);
    if (batch.httpMethod == "GET") {
      batch.iframe.setAttribute("src", request.url);
    }
    else {
      batch.form = batch.document.createElement("form");
      batch.form.setAttribute("id", "dwr-form");
      batch.form.setAttribute("action", request.url);
      batch.form.setAttribute("style", "display:none;");
      batch.form.setAttribute("target", idname);
      batch.form.target = idname;
      batch.form.setAttribute("method", batch.httpMethod);
      for (prop in batch.map) {
        var value = batch.map[prop];
        if (typeof value != "function") {
          var formInput = batch.document.createElement("input");
          formInput.setAttribute("type", "hidden");
          formInput.setAttribute("name", prop);
          formInput.setAttribute("value", value);
          batch.form.appendChild(formInput);
        }
      }
      batch.document.body.appendChild(batch.form);
      batch.form.submit();
    }
  }
  else {
    batch.httpMethod = "GET"; // There's no such thing as ScriptTag using POST
    batch.mode = batch.isPoll ? dwr.engine._ModePlainPoll : dwr.engine._ModePlainCall;
    request = dwr.engine._constructRequest(batch);
    batch.script = document.createElement("script");
    batch.script.id = "dwr-st-" + batch.map["c0-id"];
    batch.script.src = request.url;
    document.body.appendChild(batch.script);
  }
};

dwr.engine._ModePlainCall = "/call/plaincall/";
dwr.engine._ModeHtmlCall = "/call/htmlcall/";
dwr.engine._ModePlainPoll = "/call/plainpoll/";
dwr.engine._ModeHtmlPoll = "/call/htmlpoll/";

/** @private Work out what the URL should look like */
dwr.engine._constructRequest = function(batch) {
  var request = { url:batch.path + batch.mode, body:null };
  if (batch.isPoll == true) {
    request.url += "ReverseAjax.dwr";
  }
  else if (batch.map.callCount == 1) {
    request.url += batch.map["c0-scriptName"] + "." + batch.map["c0-methodName"] + ".dwr";
  }
  else {
    request.url += "Multiple." + batch.map.callCount + ".dwr";
  }
  var sessionMatch = location.href.match(/jsessionid=([^?]+)/);
  if (sessionMatch != null) {
    request.url += ";jsessionid=" + sessionMatch[1];
  }

  var prop;
  if (batch.httpMethod == "GET") {
    batch.map.callCount = "" + batch.map.callCount;
    request.url += "?";
    for (prop in batch.map) {
      if (typeof batch.map[prop] != "function") {
        request.url += encodeURIComponent(prop) + "=" + encodeURIComponent(batch.map[prop]) + "&";
      }
    }
    request.url = request.url.substring(0, request.url.length - 1);
  }
  else {
    request.body = "";
    if (document.all && !window.opera) {
      var buf = [];
      for (prop in batch.map) {
        if (typeof batch.map[prop] != "function") {
          buf.push(prop + "=" + batch.map[prop] + dwr.engine._postSeperator);
        }
      }
      request.body = buf.join("");
    }
    else {
      for (prop in batch.map) {
        if (typeof batch.map[prop] != "function") {
          request.body += prop + "=" + batch.map[prop] + dwr.engine._postSeperator;
        }
      }
    }
    request.body = dwr.engine._contentRewriteHandler(request.body);
  }
  request.url = dwr.engine._urlRewriteHandler(request.url);
  return request;
};

/** @private Called by XMLHttpRequest to indicate that something has happened */
dwr.engine._stateChange = function(batch) {
  var toEval;

  if (batch.completed) {
    dwr.engine._debug("Error: _stateChange() with batch.completed");
    return;
  }

  var req = batch.req;
  try {
    if (req.readyState != 4) return;
  }
  catch (ex) {
    dwr.engine._handleWarning(batch, ex);
    dwr.engine._clearUp(batch);
    return;
  }

  if (dwr.engine._unloading) {
    dwr.engine._debug("Ignoring reply from server as page is unloading.");
    return;
  }

  try {
    var reply = req.responseText;
    reply = dwr.engine._replyRewriteHandler(reply);
    var status = req.status; // causes Mozilla to except on page moves

    if (reply == null || reply == "") {
      dwr.engine._handleWarning(batch, { name:"dwr.engine.missingData", message:"No data received from server" });
    }
    else if (status != 200) {
      dwr.engine._handleError(batch, { name:"dwr.engine.http." + status, message:req.statusText });
    }
    else {
      var contentType = req.getResponseHeader("Content-Type");
      if (!contentType.match(/^text\/plain/) && !contentType.match(/^text\/javascript/)) {
        if (contentType.match(/^text\/html/) && typeof batch.textHtmlHandler == "function") {
          batch.textHtmlHandler({ status:status, responseText:reply, contentType:contentType });
        }
        else {
          dwr.engine._handleWarning(batch, { name:"dwr.engine.invalidMimeType", message:"Invalid content type: '" + contentType + "'" });
        }
      }
      else {
        if (batch.isPoll && batch.map.partialResponse == dwr.engine._partialResponseYes) {
          dwr.engine._processCometResponse(reply, batch);
        }
        else {
          if (reply.search("//#DWR") == -1) {
            dwr.engine._handleWarning(batch, { name:"dwr.engine.invalidReply", message:"Invalid reply from server" });
          }
          else {
            toEval = reply;
          }
        }
      }
    }
  }
  catch (ex) {
    dwr.engine._handleWarning(batch, ex);
  }

  dwr.engine._callPostHooks(batch);

  dwr.engine._receivedBatch = batch;
  if (toEval != null) toEval = toEval.replace(dwr.engine._scriptTagProtection, "");
  dwr.engine._eval(toEval);
  dwr.engine._receivedBatch = null;
  dwr.engine._validateBatch(batch);
  if (!batch.completed) dwr.engine._clearUp(batch);
};

/**
 * @private This function is invoked when a batch reply is received.
 * It checks that there is a response for every call in the batch. Otherwise,
 * an error will be signaled (a call without a response indicates that the
 * server failed to send complete batch response).
 */
dwr.engine._validateBatch = function(batch) {
  if (!batch.completed) {
    for (var i = 0; i < batch.map.callCount; i++) {
      if (batch.handlers[i] != null) {
        dwr.engine._handleWarning(batch, { name:"dwr.engine.incompleteReply", message:"Incomplete reply from server" });
        break;
      }
    }
  }
}

/** @private Called from iframe onload, check batch using batch-id */
dwr.engine._iframeLoadingComplete = function(batchId) {
  var batch = dwr.engine._batches[batchId];
  if (batch) dwr.engine._validateBatch(batch);
}

/** @private Called by the server: Execute a callback */
dwr.engine._remoteHandleCallback = function(batchId, callId, reply) {
  var batch = dwr.engine._batches[batchId];
  if (batch == null) {
    dwr.engine._debug("Warning: batch == null in remoteHandleCallback for batchId=" + batchId, true);
    return;
  }
  try {
    var handlers = batch.handlers[callId];
    batch.handlers[callId] = null;
    if (!handlers) {
      dwr.engine._debug("Warning: Missing handlers. callId=" + callId, true);
    }
    else if (typeof handlers.callback == "function") handlers.callback(reply);
  }
  catch (ex) {
    dwr.engine._handleError(batch, ex);
  }
};

/** @private Called by the server: Handle an exception for a call */
dwr.engine._remoteHandleException = function(batchId, callId, ex) {
  var batch = dwr.engine._batches[batchId];
  if (batch == null) { dwr.engine._debug("Warning: null batch in remoteHandleException", true); return; }
  var handlers = batch.handlers[callId];
  batch.handlers[callId] = null;
  if (handlers == null) { dwr.engine._debug("Warning: null handlers in remoteHandleException", true); return; }
  if (ex.message == undefined) ex.message = "";
  if (typeof handlers.exceptionHandler == "function") handlers.exceptionHandler(ex.message, ex);
  else if (typeof batch.errorHandler == "function") batch.errorHandler(ex.message, ex);
};

/** @private Called by the server: The whole batch is broken */
dwr.engine._remoteHandleBatchException = function(ex, batchId) {
  var searchBatch = (dwr.engine._receivedBatch == null && batchId != null);
  if (searchBatch) {
    dwr.engine._receivedBatch = dwr.engine._batches[batchId];
  }
  if (ex.message == undefined) ex.message = "";
  dwr.engine._handleError(dwr.engine._receivedBatch, ex);
  if (searchBatch) {
    dwr.engine._receivedBatch = null;
    dwr.engine._clearUp(dwr.engine._batches[batchId]);
  }
};

/** @private Called by the server: Reverse ajax should not be used */
dwr.engine._remotePollCometDisabled = function(ex, batchId) {
  dwr.engine.setActiveReverseAjax(false);
  var searchBatch = (dwr.engine._receivedBatch == null && batchId != null);
  if (searchBatch) {
    dwr.engine._receivedBatch = dwr.engine._batches[batchId];
  }
  if (ex.message == undefined) ex.message = "";
  dwr.engine._handleError(dwr.engine._receivedBatch, ex);
  if (searchBatch) {
    dwr.engine._receivedBatch = null;
    dwr.engine._clearUp(dwr.engine._batches[batchId]);
  }
};

/** @private Called by the server: An IFrame reply is about to start */
dwr.engine._remoteBeginIFrameResponse = function(iframe, batchId) {
  if (iframe != null) dwr.engine._receivedBatch = iframe.batch;
  dwr.engine._callPostHooks(dwr.engine._receivedBatch);
};

/** @private Called by the server: An IFrame reply is just completing */
dwr.engine._remoteEndIFrameResponse = function(batchId) {
  dwr.engine._clearUp(dwr.engine._receivedBatch);
  dwr.engine._receivedBatch = null;
};

/** @private This is a hack to make the context be this window */
dwr.engine._eval = function(script) {
  if (script == null) return null;
  if (script == "") { dwr.engine._debug("Warning: blank script", true); return null; }
  return eval(script);
};

/** @private Called as a result of a request timeout */
dwr.engine._abortRequest = function(batch) {
  if (batch && !batch.completed) {
    dwr.engine._clearUp(batch);
    if (batch.req) batch.req.abort();
    dwr.engine._handleError(batch, { name:"dwr.engine.timeout", message:"Timeout" });
  }
};

/** @private call all the post hooks for a batch */
dwr.engine._callPostHooks = function(batch) {
  if (batch.postHooks) {
    for (var i = 0; i < batch.postHooks.length; i++) {
      batch.postHooks[i]();
    }
    batch.postHooks = null;
  }
};

/** @private A call has finished by whatever means and we need to shut it all down. */
dwr.engine._clearUp = function(batch) {
  if (!batch) { dwr.engine._debug("Warning: null batch in dwr.engine._clearUp()", true); return; }
  if (batch.completed) { dwr.engine._debug("Warning: Double complete", true); return; }

  if (batch.div) batch.div.parentNode.removeChild(batch.div);
  if (batch.iframe) {
    for (var i = 0; i < dwr.engine._outstandingIFrames.length; i++) {
      if (dwr.engine._outstandingIFrames[i] == batch.iframe) {
        dwr.engine._outstandingIFrames.splice(i, 1);
      }
    }
    batch.iframe.parentNode.removeChild(batch.iframe);
  }
  if (batch.form) batch.form.parentNode.removeChild(batch.form);

  if (batch.req) {
    if (batch.req == dwr.engine._pollReq) dwr.engine._pollReq = null;
    delete batch.req;
  }

  if (batch.timeoutId) {
    clearTimeout(batch.timeoutId);
    delete batch.timeoutId;
  }

  if (batch.map && (batch.map.batchId || batch.map.batchId == 0)) {
    delete dwr.engine._batches[batch.map.batchId];
    dwr.engine._batchesLength--;
  }

  batch.completed = true;

  if (dwr.engine._batchQueue.length != 0) {
    var sendbatch = dwr.engine._batchQueue.shift();
    dwr.engine._sendData(sendbatch);
  }
};

/** @private Abort any XHRs in progress at page unload (solves zombie socket problems in IE). */
dwr.engine._unloader = function() {
  dwr.engine._unloading = true;

  dwr.engine._batchQueue.length = 0;

  for (var batchId in dwr.engine._batches) {
    var batch = dwr.engine._batches[batchId];
    if (batch && batch.map) {
      if (batch.req) {
        batch.req.abort();
      }
      dwr.engine._clearUp(batch);
    }
  }
};
if (window.addEventListener) window.addEventListener('unload', dwr.engine._unloader, false);
else if (window.attachEvent) window.attachEvent('onunload', dwr.engine._unloader);

/** @private Generic error handling routing to save having null checks everywhere */
dwr.engine._handleError = function(batch, ex) {
  if (typeof ex == "string") ex = { name:"unknown", message:ex };
  if (ex.message == null) ex.message = "";
  if (ex.name == null) ex.name = "unknown";
  if (batch && typeof batch.errorHandler == "function") batch.errorHandler(ex.message, ex);
  else if (dwr.engine._errorHandler) dwr.engine._errorHandler(ex.message, ex);
  if (batch) dwr.engine._clearUp(batch);
};

/** @private Generic error handling routing to save having null checks everywhere */
dwr.engine._handleWarning = function(batch, ex) {
  if (typeof ex == "string") ex = { name:"unknown", message:ex };
  if (ex.message == null) ex.message = "";
  if (ex.name == null) ex.name = "unknown";
  if (batch && typeof batch.warningHandler == "function") batch.warningHandler(ex.message, ex);
  else if (dwr.engine._warningHandler) dwr.engine._warningHandler(ex.message, ex);
  if (batch) dwr.engine._clearUp(batch);
};

/**
 * @private Marshall a data item
 * @param batch A map of variables to how they have been marshalled
 * @param referto An array of already marshalled variables to prevent recurrsion
 * @param data The data to be marshalled
 * @param name The name of the data being marshalled
 */
dwr.engine._serializeAll = function(batch, referto, data, name) {
  if (data == null) {
    batch.map[name] = "null:null";
    return;
  }

  switch (typeof data) {
  case "boolean":
    batch.map[name] = "boolean:" + data;
    break;
  case "number":
    batch.map[name] = "number:" + data;
    break;
  case "string":
    batch.map[name] = "string:" + encodeURIComponent(data);
    break;
  case "object":
    if (data instanceof String) batch.map[name] = "String:" + encodeURIComponent(data);
    else if (data instanceof Boolean) batch.map[name] = "Boolean:" + data;
    else if (data instanceof Number) batch.map[name] = "Number:" + data;
    else if (data instanceof Date) batch.map[name] = "Date:" + data.getTime();
    else if (data && data.join) batch.map[name] = dwr.engine._serializeArray(batch, referto, data, name);
    else batch.map[name] = dwr.engine._serializeObject(batch, referto, data, name);
    break;
  case "function":
    break;
  default:
    dwr.engine._handleWarning(null, { name:"dwr.engine.unexpectedType", message:"Unexpected type: " + typeof data + ", attempting default converter." });
    batch.map[name] = "default:" + data;
    break;
  }
};

/** @private Have we already converted this object? */
dwr.engine._lookup = function(referto, data, name) {
  var lookup;
  for (var i = 0; i < referto.length; i++) {
    if (referto[i].data == data) {
      lookup = referto[i];
      break;
    }
  }
  if (lookup) return "reference:" + lookup.name;
  referto.push({ data:data, name:name });
  return null;
};

/** @private Marshall an object */
dwr.engine._serializeObject = function(batch, referto, data, name) {
  var ref = dwr.engine._lookup(referto, data, name);
  if (ref) return ref;

  if (data.nodeName && data.nodeType) {
    return dwr.engine._serializeXml(batch, referto, data, name);
  }

  var reply = "Object_" + dwr.engine._getObjectClassName(data) + ":{";
  var element;
  for (element in data) {
    if (typeof data[element] != "function") {
      batch.paramCount++;
      var childName = "c" + dwr.engine._batch.map.callCount + "-e" + batch.paramCount;
      dwr.engine._serializeAll(batch, referto, data[element], childName);

      reply += encodeURIComponent(element) + ":reference:" + childName + ", ";
    }
  }

  if (reply.substring(reply.length - 2) == ", ") {
    reply = reply.substring(0, reply.length - 2);
  }
  reply += "}";

  return reply;
};

/** @private Returns the classname of supplied argument obj */
dwr.engine._errorClasses = { "Error":Error, "EvalError":EvalError, "RangeError":RangeError, "ReferenceError":ReferenceError, "SyntaxError":SyntaxError, "TypeError":TypeError, "URIError":URIError };
dwr.engine._getObjectClassName = function(obj) {
  if (obj && obj.constructor && obj.constructor.toString)
  {
    var str = obj.constructor.toString();
    var regexpmatch = str.match(/function\s+(\w+)/);
    if (regexpmatch && regexpmatch.length == 2) {
      return regexpmatch[1];
    }
  }

  if (obj && obj.constructor) {
	for (var errorname in dwr.engine._errorClasses) {
      if (obj.constructor == dwr.engine._errorClasses[errorname]) return errorname;
    }
  }

  if (obj) {
    var str = Object.prototype.toString.call(obj);
    var regexpmatch = str.match(/\[object\s+(\w+)/);
    if (regexpmatch && regexpmatch.length==2) {
      return regexpmatch[1];
    }
  }

  return "Object";
};

/** @private Marshall an object */
dwr.engine._serializeXml = function(batch, referto, data, name) {
  var ref = dwr.engine._lookup(referto, data, name);
  if (ref) return ref;

  var output;
  if (window.XMLSerializer) output = new XMLSerializer().serializeToString(data);
  else if (data.toXml) output = data.toXml;
  else output = data.innerHTML;

  return "XML:" + encodeURIComponent(output);
};

/** @private Marshall an array */
dwr.engine._serializeArray = function(batch, referto, data, name) {
  var ref = dwr.engine._lookup(referto, data, name);
  if (ref) return ref;

  if (document.all && !window.opera) {
    var buf = ["Array:["];
    for (var i = 0; i < data.length; i++) {
      if (i != 0) buf.push(",");
      batch.paramCount++;
      var childName = "c" + dwr.engine._batch.map.callCount + "-e" + batch.paramCount;
      dwr.engine._serializeAll(batch, referto, data[i], childName);
      buf.push("reference:");
      buf.push(childName);
    }
    buf.push("]");
    reply = buf.join("");
  }
  else {
    var reply = "Array:[";
    for (var i = 0; i < data.length; i++) {
      if (i != 0) reply += ",";
      batch.paramCount++;
      var childName = "c" + dwr.engine._batch.map.callCount + "-e" + batch.paramCount;
      dwr.engine._serializeAll(batch, referto, data[i], childName);
      reply += "reference:";
      reply += childName;
    }
    reply += "]";
  }

  return reply;
};

/** @private Convert an XML string into a DOM object. */
dwr.engine._unserializeDocument = function(xml) {
  var dom;
  if (window.DOMParser) {
    var parser = new DOMParser();
    dom = parser.parseFromString(xml, "text/xml");
    if (!dom.documentElement || dom.documentElement.tagName == "parsererror") {
      var message = dom.documentElement.firstChild.data;
      message += "\n" + dom.documentElement.firstChild.nextSibling.firstChild.data;
      throw message;
    }
    return dom;
  }
  else if (window.ActiveXObject) {
    dom = dwr.engine._newActiveXObject(dwr.engine._DOMDocument);
    dom.loadXML(xml); // What happens on parse fail with IE?
    return dom;
  }
  else {
    var div = document.createElement("div");
    div.innerHTML = xml;
    return div;
  }
};

/** @param axarray An array of strings to attempt to create ActiveX objects from */
dwr.engine._newActiveXObject = function(axarray) {
  var returnValue;
  for (var i = 0; i < axarray.length; i++) {
    try {
      returnValue = new ActiveXObject(axarray[i]);
      break;
    }
    catch (ex) { /* ignore */ }
  }
  return returnValue;
};

/** @private Used internally when some message needs to get to the programmer */
dwr.engine._debug = function(message, stacktrace) {
  var written = false;
  try {
    if (window.console) {
      if (stacktrace && window.console.trace) window.console.trace();
      window.console.log(message);
      written = true;
    }
    else if (window.opera && window.opera.postError) {
      window.opera.postError(message);
      written = true;
    }
  }
  catch (ex) { /* ignore */ }

  if (!written) {
    var debug = document.getElementById("dwr-debug");
    if (debug) {
      var contents = message + "<br/>" + debug.innerHTML;
      if (contents.length > 2048) contents = contents.substring(0, 2048);
      debug.innerHTML = contents;
    }
  }
};
if (InfrastructureOperations == null) var InfrastructureOperations = {};
InfrastructureOperations._path = '';
InfrastructureOperations.setPath = function(path) {
  if (!path) path = TF7.conf.absisAjaxBasePath;
  return InfrastructureOperations._path = path;
};

/** The original page id sent from the server */
dwr.engine._origScriptSessionId = "6BBCF05EB14930DC31116CE31CF12AE1";

/** The session cookie name */
dwr.engine._sessionCookieName = "JSESSIONID"; // JSESSIONID

/** Is GET enabled for the benefit of Safari? */
dwr.engine._allowGetForSafariButMakeForgeryEasier = "false";

/** The script prefix to strip in the case of scriptTagProtection. */
dwr.engine._scriptTagProtection = "throw 'allowScriptTagRemoting is false.';";

/** The default path to the DWR servlet */
dwr.engine._defaultPath = '';

/** Do we use XHR for reverse ajax because we are not streaming? */
dwr.engine._pollWithXhr = "false";

/** @private Work out what the URL should look like */
dwr.engine._constructRequest = function(batch) {
  var request = { url:batch.path + batch.mode, body:null };
  if (batch.isPoll == true) {
    request.url += "ReverseAjax.tf7";
  }
  else if (batch.map.callCount == 1) {
    request.url += batch.map["c0-scriptName"] + "." + batch.map["c0-methodName"] + ".tf7";
  }
  else {
    request.url += "Multiple." + batch.map.callCount + ".tf7";
  }
  var sessionMatch = location.href.match(/jsessionid=([^?]+)/);
  if (sessionMatch != null) {
    request.url += ";jsessionid=" + sessionMatch[1];
  }

  var prop;
  if (batch.httpMethod == "GET") {
    batch.map.callCount = "" + batch.map.callCount;
    request.url += "?";
    for (prop in batch.map) {
      if (typeof batch.map[prop] != "function") {
        request.url += encodeURIComponent(prop) + "=" + encodeURIComponent(batch.map[prop]) + "&";
      }
    }
    request.url = request.url.substring(0, request.url.length - 1);
  }
  else {
    request.body = "";
    if (document.all && !window.opera) {
      var buf = [];
      for (prop in batch.map) {
        if (typeof batch.map[prop] != "function") {
          buf.push(prop + "=" + batch.map[prop] + dwr.engine._postSeperator);
        }
      }
      request.body = buf.join("");
    }
    else {
      for (prop in batch.map) {
        if (typeof batch.map[prop] != "function") {
          request.body += prop + "=" + batch.map[prop] + dwr.engine._postSeperator;
        }
      }
    }
    request.body = dwr.engine._contentRewriteHandler(request.body);
  }
  request.url = dwr.engine._urlRewriteHandler(request.url);
  return request;
};




InfrastructureOperations.getChild = function(tauxCode, format, parentKey, callback){
  dwr.engine._execute(InfrastructureOperations.setPath(), 'InfrastructureOperations', 'getChilds', tauxCode, format, parentKey, callback);
}
