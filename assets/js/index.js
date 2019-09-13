


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

	dig.search 		= dig_search.value;
	whois.search 	= dig_search.value;
	
	dig.dig( function( response ) {
		
		console.log( response );
		
		result_dig.innerHTML 	= response;
	});
	
	whois.whois( function( response ) {
		
		console.log( response );
		
		result_whois.innerHTML 	= response;
	});

});

