let dig_form = document.getElementById('dig_form');
let dig_result = document.getElementById('dig_result');
let xmlhr = new XMLHttpRequest();




// execute on submit
dig_form.addEventListener('submit', function(event) {

	event.preventDefault();

	// filter if search if empty string
	if (dig_form.search.value.trim() !== '') {

		// display pre tag 
		dig_result.setAttribute('class', '');

		// call XMLHttpRequest
		callTools(dig_form.search.value);

		return 0;
	}

	// hide pre tag 
	dig_result.setAttribute('class', 'uk-invisible');

	return 0;

});



// execute XMLHttpRequest with 'domains' as the search query
function callTools(domain) {

	xmlhr.open('GET', 'php/Tools.php?search=' + domain, true);
	xmlhr.setRequestHeader("X-Requested-With", 'xmlhttprequest');
	xmlhr.send();

	xmlhr.onloadstart = function() {

		dig_result.innerHTML = '<div uk-spinner></div>';
	}

	xmlhr.onloadend = function() {}

	xmlhr.onload = function() {

		dig_result.innerHTML = '<p>Records for: ' + domain + '</p>';

		parseTools(JSON.parse(xmlhr.responseText));
	}

	xmlhr.onprogress = function() {

		dig_result.innerHTML = 'loading ...';
	}

	xmlhr.onerror = function(e) {

		dig_result.innerHTML = e;

		console.error(e);
	}

}



// prepare 'xmlhr_response' result show in HTML
function parseTools(xmlhr_response) {

	// 	console.log( xmlhr_response.WHOIS );
	// 	console.log( xmlhr_response.DIG );
	// 	console.log( getValueOf( xmlhr_response.DIG.A, 'ip' ) );
	// 	console.log( getValueOf( xmlhr_response.DIG.AAAA, 'ipv6' ) );
	// 	console.log( getValueOf( xmlhr_response.DIG.MX, 'target' ) );
	// 	console.log( getValueOf( xmlhr_response.DIG.MX_A, 'ip' ) );
	// 	console.log( getValueOf( xmlhr_response.DIG.MX_A, 'ipv6' ) );
	// 	console.log( getValueOf( xmlhr_response.DIG.TXT, 'txt' ) );

	// error handling
	if (xmlhr_response.WHOIS == 'No whois server is known for this kind of object.\n') {

		dig_result.innerHTML = xmlhr_response.WHOIS;

		return 0;

	}

	// NS record
	dislayArrayPerLine(getValueOf(xmlhr_response.DIG.NS, 'target'), 'NS RECORD');

	// A record
	dislayArrayPerLine(getValueOf(xmlhr_response.DIG.A, 'ip'), 'A RECORD');
	
	// AAAA record
	dislayArrayPerLine(getValueOf(xmlhr_response.DIG.AAAA, 'ipv6'), 'AAAA RECORD');
	
	// MX and Mail A + AAAA(if any) record
	let obj_ = xmlhr_response.DIG.MX_A;
	
	if (obj_ !== undefined){
		
		dig_result.appendChild(createElement('MX RECORD', 'b'));
	
		Object.keys( obj_ ).map( indexOfArray => {
			
			dig_result.appendChild(createElement(obj_[indexOfArray][0].host));
			
			if (obj_[indexOfArray][0]){
				dig_result.appendChild(createElement(obj_[indexOfArray][0].ip, 'span'));
			}
			
			if(obj_[indexOfArray][1]){
				dig_result.appendChild(createElement('	' + obj_[indexOfArray][1].ipv6, 'span'));
			}
			
		});
	}
	
	// CNAME record
	dislayArrayPerLine(getValueOf(xmlhr_response.DIG.CNAME, 'target'), 'CNAME RECORD');
	
	// TXT record
	dislayArrayPerLine(getValueOf(xmlhr_response.DIG.TXT, 'txt'), 'TXT RECORD');

	// Whois record
	dig_result.appendChild(createElement('WHOIS', 'b'));
	dig_result.appendChild(createElement(xmlhr_response.WHOIS));

}



// create HTML element
// 'content' is the  desired content of an the default element
// 'el' is (default) HTML element
function createElement(content, el = 'div') {

	let element = document.createElement(el);
	let text = document.createTextNode(content);

	if (content !== undefined) {

		element.appendChild(text);

		return element;
	}

	return 0;

}



// loop array from raw json and return value of "shouldReturnValue"
// for example: getValueOf(object, 'ip');
// return value of key 'ip' from object
function getValueOf(obj, shouldReturnValue) {
	
	if (obj.length == 0) {

		return 0;
	}

	let array = Object.keys(obj).map(indexOfArray => {

		return obj[indexOfArray];
	});

	let object = Object.keys(array).map(indexOfObject => {

		if (array[indexOfObject][shouldReturnValue] !== undefined) {

			return array[indexOfObject][shouldReturnValue];
		}

		return 0;
	});

	return object;

}



function dislayArrayPerLine(anArray, headline) {

	if (anArray.length == undefined) {

		return 0;
	}

	dig_result.appendChild(createElement(headline, 'b'));

	for (let item in anArray) {

		dig_result.appendChild(createElement(anArray[item]));
	}
	
}