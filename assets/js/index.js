


// get form with an attr name "dig form"
document.forms.dig_form.addEventListener( 'submit', function( event ) {

	console.log( 'form has been submited ...' );
	event.preventDefault();

	
	
	let dig_search 		= document.getElementById('dig_search');
	let dig_url 		= document.getElementById('dig_url');
	let result_dig 		= document.getElementById('result_dig');
	let result_whois 	= document.getElementById('result_whois');
	let dig 			= new Tools();
	let whois 			= new Tools();

	
	
	// reset innerHTML 
	dig_url.innerHTML = '';
	result_dig.innerHTML = '';
	result_whois.innerHTML = '';
	
	
	
	// loads spinner
	//result_dig.innerHTML = '<div uk-spinner></div>';
	result_whois.innerHTML = '<div uk-spinner></div>';
	
	
	
	// pass dig_search value to each (search) property
	dig.search 		= dig_search.value.trim();
	whois.search 	= dig_search.value.trim();
	
	
	
	dig.dig( function( response ) {
		
		// console.log( response );
		
		// remove spinner in dig container only
		//document.querySelectorAll( '.uk-spinner' )[0].removeAttribute( 'uk-spinner' );
		
		
		// display records per line
		result_dig.innerHTML += '<b>DNS Result for ' + dig_search.value.trim() + '</b><br>';
		
		dislayArrayPerLine( getValueOf( response.NS, 'target' ), 'NS', result_dig );
		dislayArrayPerLine( getValueOf( response.A, 'ip' ), 'A', result_dig );
		dislayArrayPerLine( getValueOf( response.AAAA, 'ipv6' ), 'AAAA ', result_dig );
		dislayArrayPerLine( getValueOf( response.CNAME, 'target' ), 'CNAME', result_dig );
		dislayArrayPerLine( getValueOf( response.TXT, 'txt' ), 'TXT ', result_dig );
		 
		displayMailARecord( getValueOf( response.MX, 'target' ), result_dig )
		
	});
	
	
	
	whois.whois( function( response ) {
		
		// console.log( response );
		
		result_whois.innerHTML 	= response;
	});
	
	
	
	// adds links in #dig_url
	dig_url.appendChild( createAnchorTag( 'Whois', 'https://www.whois.com/whois/' + dig_search.value.trim() ) );
	dig_url.appendChild( createAnchorTag( 'Google Dig', 'https://toolbox.googleapps.com/apps/dig/#ANY/' + dig_search.value.trim() ) );
	dig_url.appendChild( createAnchorTag( 'Reputation', 'https://www.talosintelligence.com/reputation_center/lookup?search=' + dig_search.value.trim() ) );
	dig_url.appendChild( createAnchorTag( 'DNS History', 'https://securitytrails.com/domain/' + dig_search.value.trim() + '/history/ns' ) );
	dig_url.appendChild( createAnchorTag( 'Website Archive', 'https://web.archive.org/web/*/' + dig_search.value.trim() ) );
	dig_url.appendChild( createAnchorTag( 'IP location', 'https://tools.keycdn.com/geo?host=' + dig_search.value.trim() ) );
	dig_url.appendChild( createAnchorTag( 'Google Pagespeed', 'https://developers.google.com/speed/pagespeed/insights/?url=' + dig_search.value.trim() ) );
	dig_url.appendChild( createAnchorTag( 'SSL Checker', 'https://www.sslshopper.com/ssl-checker.html#hostname=' + dig_search.value.trim() ) );
	dig_url.appendChild( createAnchorTag( 'Sucuri Scan', 'https://sitecheck.sucuri.net/results/' + dig_search.value.trim() ) );
	
});




// create HTML element with default 'div' tag
function createElement( content, el = 'div' ) {

	let element 	= document.createElement( el );
	let text 		= document.createTextNode( content );

	if ( content !== undefined ) {

		element.appendChild( text );

		return element;
	}

	return 0;

}



function createAnchorTag( text, href ) {
	
	let a_url = createElement( text, 'a' );
		a_url.setAttribute( 'href', href );
		a_url.setAttribute( 'target', '_blank' );
	
	return a_url;
	
}



function getValueOf( obj, shouldReturnValue ) {
	
	if ( obj === undefined || obj.length === 0 ) {

		return 0;
	}

	let array = Object.keys( obj ).map( indexOfArray => {

		return obj[ indexOfArray ];
	});

	let object = Object.keys( array ).map( indexOfObject => {

		if ( array[ indexOfObject ][ shouldReturnValue ] !== undefined ) {

			return array[ indexOfObject ][ shouldReturnValue ];
		}

		return 0;
	});

	return object;

}



function dislayArrayPerLine( anArray, headline, parentElement ) {

	if ( anArray.length == undefined ) {

		return 0;
	}

	parentElement.appendChild( createElement( headline, 'b' ) );

	for ( let item in anArray ) {

		parentElement.appendChild( createElement( anArray[ item ] ) );
	}
	
}


function displayMailARecord( MX, parentElement ) {
	
	if ( MX === undefined ) {

		return 0;
	}
	

	
	// set counter to ensure <b> tag display only once
	let counter = 0;
	
	for ( let item in MX ) {
		
		// prepare dig each MX records 
		let dig_mail_a = new Tools();
			dig_mail_a.search = MX[ item ];
			dig_mail_a.dig( function( response ) {

				if ( counter == 0 ) {
					parentElement.innerHTML += '<b>MX</b><br>';
				}

				parentElement.innerHTML += MX[ item ] + '<br>';
				parentElement.innerHTML += getValueOf( response.A, 'ip' ) + '<br>';
				parentElement.innerHTML += getValueOf( response.AAAA, 'ipv6' ) + '<br>';

				counter++;
			});

	}
	
}

