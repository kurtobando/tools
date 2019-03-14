// for screen sizes
var screen_width = document.getElementById("screen-width");
var screen_height = document.getElementById("screen-height");

screen_width.innerHTML = window.screen.width;
screen_height.innerHTML = window.screen.height;


// for domain query form
let xmlhr = new XMLHttpRequest();

let domainQueryForm = document.domainQueryForm;
let domainQueryInput = domainQueryForm.domainQueryInput;
let tag_ul_dns = document.getElementById("dns-results");
let tag_li = document.createElement("li");
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
		xmlhr.open('GET','//dev.kurtobando.com/tools/tools/dns_ajax?domain-query=' + domainQueryInput.value, true);
		xmlhr.setRequestHeader("X-Requested-With",'xmlhttprequest');
		
		// readyState will be 1
		xmlhr.onloadstart = function () {
			console.info("->onloadstart");
			console.log('status:', xmlhr.status);
			console.log('readyState:', xmlhr.readyState);
			
			tag_ul_dns.innerHTML = "loading ...";
		};
		
		// readyState will be 3
		xmlhr.onprogress = function () {
			console.info("->onprogress");
			console.log('status:', xmlhr.status);
			console.log('readyState:', xmlhr.readyState);
			
			tag_ul_dns.innerHTML = "almost there ...";
		};
		
		// readyState will be 4
		xmlhr.onload = function () {
			console.info("->onload");
			console.log('status:', xmlhr.status);
			console.log('readyState:', xmlhr.readyState);
			
			// clear loading text 
			tag_ul_dns.innerHTML = "";
			
			// parse JSON 
			done_parse = JSON.parse(xmlhr.responseText);
			
			// display records to dns-results div
			display_to_html(done_parse.NS, "NS");
			display_to_html(done_parse.CNAME, "CNAME");
			display_to_html(done_parse.AAAA, "AAAA");
			display_to_html(done_parse.A, "A");
			display_to_html(done_parse.MX, "MX (w/ corresponding Mail A record)");
			display_to_html(done_parse.TXT, "TXT");
			
			// display whois
			if(done_parse.whois !== undefined){
				whois.innerHTML = done_parse.whois;
			}
		};
		
		xmlhr.send();
		
	});
	

	// https://zellwk.com/blog/looping-through-js-objects/
	function display_to_html(json, record_name){
		
		if(typeof json === "object"){
			
			let temp_ul = document.createElement("ul");
			
			// insert records name here for example (A, NS, MX and TXT)
			let temp_li_record_name = document.createElement("li");
				temp_li_record_name.innerHTML = record_name;
				temp_ul.appendChild(temp_li_record_name);

			// insert each dns to li then add the temp ul tag
			for (const [key, value] of Object.entries(json)) {
				
				let temp_li_value = document.createElement("li");
					temp_li_value.innerHTML = value;

					temp_ul.appendChild(temp_li_value);
					tag_ul_dns.appendChild(temp_ul);
			}
		}
	}

