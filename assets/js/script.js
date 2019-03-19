// for screen sizes
// var screen_width = document.getElementById("screen-width");
// var screen_height = document.getElementById("screen-height");

// screen_width.innerHTML = window.screen.width;
// screen_height.innerHTML = window.screen.height;



// for domain query form
let xmlhr = new XMLHttpRequest();

// name of form and input tags
let domainQueryForm = document.domainQueryForm;
let domainQueryInput = domainQueryForm.domainQueryInput;
let domainQueryError = document.querySelector(".uk-alert-danger");

// div inside pre tags
let result_dns = document.getElementById("result_dns");
let result_whois = document.getElementById("result_whois");
let result_pre_tag = document.querySelector(".uk-background-muted");

// display all helpful links
let link_dns_history = document.getElementById("link_dns_history");
let link_reputation = document.getElementById("link_reputation");
let link_whois = document.getElementById("link_whois");
let link_dig = document.getElementById("link_dig");

// search input field
let domain_query = document.getElementById("domain-query");
let done_parse;


	domainQueryForm.addEventListener('submit', function(event){
		
		// prevent default submit in form
		event.preventDefault();
		
		// prevent empty search
		if(domainQueryInput.value.trim() === ""){
			
			// display error message
			if(domainQueryError.hasAttribute("hidden") === true){
				domainQueryError.removeAttribute("hidden");
			}
			
			return false;
		}
		
		// display pre tag after form submit
		if(result_pre_tag.hasAttribute("hidden") === true){
			result_pre_tag.removeAttribute("hidden");
			
			// hide error message
			domainQueryError.setAttribute("hidden", "");
		}
		
		// send get request
		xmlhr.open('GET', base_url + 'tools/dns_ajax?domain-query=' + domainQueryInput.value, true);
		xmlhr.setRequestHeader("X-Requested-With",'xmlhttprequest');
		
		// readyState will be 1
		xmlhr.onloadstart = function () {
			result_dns.innerHTML = "loading ...";
		};
		
		// readyState will be 3
		xmlhr.onprogress = function () {
			result_dns.innerHTML = "almost there ...";
		};
		
		// readyState will be 4
		xmlhr.onload = function () {
			
			// clear loading text 
			result_dns.innerHTML = "";
			
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
				result_whois.innerHTML = done_parse.whois;
			}
			
			// display dns history link
			display_link_dns_history(domainQueryInput.value);
			
			// display link_reputation
			display_link_reputation(domainQueryInput.value);
			
			// whois link
			display_whois(domainQueryInput.value);
			
			// dig link
			display_dig(domainQueryInput.value);
			
			// display error
			if(done_parse.error !== undefined){
				result_dns.innerHTML = done_parse.error;
			}
		};
		
		xmlhr.send();
		
	});
	

	// https://zellwk.com/blog/looping-through-js-objects/
	function display_to_html(json, record_name){
		
		if(typeof json === "object"){
			
			// parent tag for each DNS records divs
			let result_dns_section = document.createElement("section");
			
			// insert records name here for example (A, NS, MX and TXT)
			let result_dns_strong 				= document.createElement("strong");
				result_dns_strong.innerHTML 	= record_name;
				result_dns_section.appendChild(result_dns_strong);

			// insert each dns to div then add the temp section tag
			for (const [key, value] of Object.entries(json)) {
				
				// if value lenght is undefined, then we are now working with SRV
				if(value.length === undefined){
					for (const [x, y] of Object.entries(value)){
						
						let result_dns_div = document.createElement("div");
							
							// if last record = target, add break line
							result_dns_div.innerHTML = (x === "target") ? x + " : " + y + "<br><br>" : x + " : " + y ;
						
							result_dns_section.appendChild(result_dns_div);
							result_dns.appendChild(result_dns_section);
					}
				}
				else{
					let result_dns_div = document.createElement("div");
						result_dns_div.innerHTML = value;

						result_dns_section.appendChild(result_dns_div);
						result_dns.appendChild(result_dns_section);
				}
			}
		}
	}

	function display_link_dns_history(query){
		
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
		
		link_dns_history.innerHTML = "";
		link_dns_history.appendChild(a_tag);
	}

	function display_link_reputation(query){
		
		let reputation_link = "https://www.talosintelligence.com/reputation_center/lookup?search=" + query;
		
		let a_tag = document.createElement("a");
			a_tag.setAttribute("href", reputation_link);
			a_tag.setAttribute("target", "_blank");
			a_tag.setAttribute("class", "uk-button-link");
			a_tag.innerHTML = "View Reputation";
		
		link_reputation.innerHTML = "";
		link_reputation.appendChild(a_tag)  ;
	}

	function display_whois(query){
		
		let whois_link = "https://www.whois.com/whois/" + query;
		
		let a_tag = document.createElement("a");
			a_tag.setAttribute("href", whois_link);
			a_tag.setAttribute("target", "_blank");
			a_tag.setAttribute("class", "uk-button-link");
			a_tag.innerHTML = "View Whois Link";
		
		link_whois.innerHTML = "";
		link_whois.appendChild(a_tag)  ;
	}

	function display_dig(query){
		
		let dig_link = "https://toolbox.googleapps.com/apps/dig/#ANY/" + query;
		
		let a_tag = document.createElement("a");
			a_tag.setAttribute("href", dig_link);
			a_tag.setAttribute("target", "_blank");
			a_tag.setAttribute("class", "uk-button-link");
			a_tag.innerHTML = "View Dig";
		
		link_dig.innerHTML = "";
		link_dig.appendChild(a_tag)  ;
	}

