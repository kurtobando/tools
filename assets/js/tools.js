
// https://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
// https://www.sitepoint.com/es6-arrow-functions-new-fat-concise-syntax-javascript/

function Tools() {
	
	let xmlhr_response;

	this.search;
	this.xmlhr = new XMLHttpRequest();
	this.request_method = 'GET';
	this.request_URL = 'ajax_request.php?search=';

	
	
	this.ajax = function() {
		
		// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
		this.xmlhr.open( this.request_method, this.request_URL + this.search, true );
		
		// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
		this.xmlhr.setRequestHeader( 'X-Requested-With', 'xmlhttprequest' );
		
		// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
		this.xmlhr.send();
		
	}
	
	
	
	this.run = function( callback ) {
		
		this.ajax();
		
		this.xmlhr.onload = () => {
			
			console.log( 'onload ...' );
			
			// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status
			if( this.xmlhr.status === 200 && this.xmlhr.readyState ){
				
				xmlhr_response = JSON.parse( this.xmlhr.responseText );

				callback();
			}
		}
		
		this.xmlhr.onloadstart = () => {
			
			console.log( 'onloadstart ...' );
		}
		
		this.xmlhr.loadend = () => {
			
			console.log( 'loadend ...' );
		}
		
		this.xmlhr.onprogress = () => {
			
			console.log( 'onprogress ...' );
		}
		
		this.xmlhr.timeout = () => {
			
			console.log( 'onprogress ...' );
		}
		
		this.xmlhr.abort = () => {
			
			console.log( 'abort ...' );
		}
		
		this.xmlhr.error = () => {
			
			console.log( 'error ...' );
		}
		
	}
	
	
	
	this.whois = function() {
		
		console.log( 'whois() ...' );
		
		this.run( function(){
			console.log( xmlhr_response.WHOIS );
		});
		
	}
	
	
	
	this.dig = function() {
		
		console.log( 'dig()  ...' );
		
		this.run( function(){
			console.log( xmlhr_response.DIG );
		});
		
	}
}
