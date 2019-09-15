


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

	
	
	// reset #dig_url innerHTML 
	dig_url.innerHTML = '';
	
	
	
	// pass dig_search value to each (search) property
	dig.search 		= dig_search.value.trim();
	whois.search 	= dig_search.value.trim();
	
	
	
	dig.dig( function( response ) {
		
		console.log( response );
		
		result_dig.innerHTML 	= response;
	});
	
	
	
	whois.whois( function( response ) {
		
		console.log( response );
		
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


