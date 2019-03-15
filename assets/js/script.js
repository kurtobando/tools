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
let reputation = document.getElementById("reputation");
let whois = document.getElementById("whois-results");
let domain_query = document.getElementById("domain-query");
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
			
			// show domain query in results
			domain_query.innerHTML = "";
			domain_query.innerHTML = "Search result: " + domainQueryInput.value;
			
			// parse JSON 
			done_parse = JSON.parse(xmlhr.responseText);
			
			// display records to dns-results div
			display_to_html(done_parse.NS, "NS");
			display_to_html(done_parse.CNAME, "CNAME with corresponding ipv4,ivp6 record");
			display_to_html(done_parse.AAAA, "AAAA");
			display_to_html(done_parse.A, "A");
			display_to_html(done_parse.MX, "MX with corresponding ipv4,ivp6 record");
			display_to_html(done_parse.TXT, "TXT");
			display_to_html(done_parse.SRV, "SRV");

			// display whois
			if(done_parse.whois !== undefined){
				whois.innerHTML = done_parse.whois;
			}
			
			// display dns history link
			display_dns_history(domainQueryInput.value);
			
			// display reputation
			display_reputation(domainQueryInput.value);
			
			// display error
			if(done_parse.error !== undefined){
				dns_result.innerHTML = done_parse.error;
			}
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
				
				// if value lenght is undefined, then we are now working with SRV
				if(value.length === undefined){
					for (const [x, y] of Object.entries(value)){
						
						let dns_result_div = document.createElement("div");
							
							// if last record = target, add break line
							dns_result_div.innerHTML = (x === "target") ? x + " : " + y + "<br><br>" : x + " : " + y ;
						
							dns_result_section.appendChild(dns_result_div);
							dns_result.appendChild(dns_result_section);
					}
				}
				else{
					let dns_result_div = document.createElement("div");
						dns_result_div.innerHTML = value;

						dns_result_section.appendChild(dns_result_div);
						dns_result.appendChild(dns_result_section);
				}
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
		let dns_history_link; 
		
		if(ValidateIPaddress(query)){
			dns_history_link = "https://securitytrails.com/list/ip/" + query;
		}
		else{
			dns_history_link  = "https://securitytrails.com/domain/" + query + "/history/ns";
		}
		
		let a_tag = document.createElement("a");
			a_tag.setAttribute("href", dns_history_link );
			a_tag.setAttribute("target", "_blank");
			a_tag.setAttribute("class", "uk-button-link");
			a_tag.innerHTML = "View DNS History";
		
		dns_history.innerHTML = "";
		dns_history.appendChild(a_tag);
	}

	function display_reputation(query){
		
		let reputation_link = "https://www.talosintelligence.com/reputation_center/lookup?search=" + query;
		
		let a_tag = document.createElement("a");
			a_tag.setAttribute("href", reputation_link);
			a_tag.setAttribute("target", "_blank");
			a_tag.setAttribute("class", "uk-button-link");
			a_tag.innerHTML = "View Reputation";
		
		reputation.innerHTML = "";
		reputation.appendChild(a_tag)  ;
	}

