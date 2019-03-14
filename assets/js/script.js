// for screen sizes
var screen_width = document.getElementById("screen-width");
var screen_height = document.getElementById("screen-height");

screen_width.innerHTML = window.screen.width;
screen_height.innerHTML = window.screen.height;


// for domain query form
let xmlhr = new XMLHttpRequest();

let domainQueryForm = document.domainQueryForm;
let domainQueryInput = domainQueryForm.domainQueryInput;
let dns_result = document.getElementById("dns-results");
let dns_history = document.getElementById("dns-history");
let whois = document.getElementById("whois-results");
let done_parse;


	domainQueryForm.addEventListener('submit', function(event){

		console.info(xmlhr);
		console.info(event);
		
		// prevent default submit in form
		event.preventDefault();
		
		// prevent empty search
		if(domainQueryInput.value.trim() === ""){
			console.info("->empty domain or query ip");
			return false;
		}

		// send get request
		xmlhr.open('GET', base_url + 'tools/dns_ajax?domain-query=' + domainQueryInput.value, true);
		xmlhr.setRequestHeader("X-Requested-With",'xmlhttprequest');
		
		// readyState will be 1
		xmlhr.onloadstart = function () {
			console.info("->onloadstart");
			console.log('status:', xmlhr.status);
			console.log('readyState:', xmlhr.readyState);
			
			dns_result.innerHTML = "loading ...";
		};
		
		// readyState will be 3
		xmlhr.onprogress = function () {
			console.info("->onprogress");
			console.log('status:', xmlhr.status);
			console.log('readyState:', xmlhr.readyState);
			
			dns_result.innerHTML = "almost there ...";
		};
		
		// readyState will be 4
		xmlhr.onload = function () {
			console.info("->onload");
			console.log('status:', xmlhr.status);
			console.log('readyState:', xmlhr.readyState);
			
			// clear loading text 
			dns_result.innerHTML = "";
			
			// parse JSON 
			done_parse = JSON.parse(xmlhr.responseText);
			
			// display records to dns-results div
			display_to_html(done_parse.NS, "NS");
			display_to_html(done_parse.CNAME, "CNAME with corresponding ipv4,ivp6 record");
			display_to_html(done_parse.AAAA, "AAAA");
			display_to_html(done_parse.A, "A");
			display_to_html(done_parse.MX, "MX with corresponding ipv4,ivp6 record");
			display_to_html(done_parse.TXT, "TXT");
			
			// display whois
			if(done_parse.whois !== undefined){
				whois.innerHTML = done_parse.whois;
			}
			
			// display dns history link
			display_dns_history(domainQueryInput.value);
		};
		
		xmlhr.send();
		
	});
	

	// https://zellwk.com/blog/looping-through-js-objects/
	function display_to_html(json, record_name){
		
		if(typeof json === "object"){
			
			let dns_result_section = document.createElement("section");
			
			// insert records name here for example (A, NS, MX and TXT)
			let dns_result_strong = document.createElement("strong");
				dns_result_strong.innerHTML = record_name;
				dns_result_section.appendChild(dns_result_strong);

			// insert each dns to li then add the temp ul tag
			for (const [key, value] of Object.entries(json)) {
				
				let dns_result_div = document.createElement("div");
					dns_result_div.innerHTML = value;

					dns_result_section.appendChild(dns_result_div);
					dns_result.appendChild(dns_result_section);
			}
		}
	}

	function display_dns_history(query){
		
		// validated IP Address 
		function ValidateIPaddress(ipaddress) {
			if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
				return (true)
			}
			return (false)
		}
		
		// Prepare securitytrails link
		var dnsHistory; 
		
		if(ValidateIPaddress(query)){
			dnsHistory= "https://securitytrails.com/list/ip/" + query;
		}
		else{
			dnsHistory = "https://securitytrails.com/domain/" + query + "/history/ns";
		}
		let a_tag = document.createElement("a");
			a_tag.setAttribute("href", dnsHistory);
			a_tag.setAttribute("target", "_blank");
			a_tag.innerHTML = "View DNS History";
		
		dns_history.innerHTML = "";
		dns_history.appendChild(a_tag)  ;
	}

