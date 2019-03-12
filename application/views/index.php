<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>Tools</title>
	<meta name="author" content="Kurt Obando">
	<meta name="description" content="Custom Tools for Web Troubleshooting for Domains/Hosting">
	<meta name="keywords" content="toos, web hosting, domain name, dig, whois, myipaddress">
	
	<!-- UIkit CSS -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/css/uikit.min.css" />
	<link rel="stylesheet" href="<?php echo base_url();?>assets/css/style.css" type="text/css">
</head>

<body>
	<div class="uk-container">
		<a href="#scroll-up" uk-scroll></a>
		
		
		<div class="uk-margin-top uk-margin-large-bottom">
		
			<!-- https://stackoverflow.com/questions/3003145/how-to-get-the-client-ip-address-in-php -->
			<!-- https://stackoverflow.com/questions/24266212/how-to-get-ip-address-in-codeigniter -->
			<label for="ip-address" uk-icon="world"></label>
			<span class="uk-badge"><?php echo $this->input->ip_address(); ?></span>
			

			<!-- https://stackoverflow.com/questions/1504459/getting-the-screen-resolution-using-php -->
			<label for="screen-width" uk-icon="desktop">Screen width </label>
			<span class="uk-badge" id="screen-width"></span>

			<label for="screen-height"  uk-icon="desktop">Screen height </label>
			<span class="uk-badge" id="screen-height"></span>
		
		</div>
		
		
		<form action="" method="get">
			<div class="uk-flex uk-flex-middle">
				<input class="uk-input" type="text" name="domain-query" value ="<?php echo $this->input->get("domain-query"); ?>"placeholder="e.g. gmail.com, www.gmail.com, mail.google.com" autofocus autocomplete>
				<input class="uk-button uk-button-primary" type="submit" value="Dig Records">
			</div>
			
			<div class="uk-margin-bottom"></div>
			
		</form>

	
<!-- 		<label uk-icon="copy">Copy </label> -->
		<pre class="uk-background-muted">
			<?php

			// store dns records in
			$dig_result = array();


			$record_NS 		= array();
			$record_A 		= array();
			$record_AAAA 	= array();
			$record_TXT 	= array();
			$record_CNAME 	= array();	
			$record_CNAME_values = array();	
			$record_MX 		= array();
			$record_MX_values = array();


			// prevent empty queries
			if(empty($this->input->get("domain-query"))){
				exit();
			}


			// http://php.net/manual/en/function.dns-get-record.php
			// add . to read subdomains records
			$query = trim($this->input->get("domain-query")) . ".";

			$result = dns_get_record($query, DNS_ALL);
			// print_r($result);

			foreach ($result as $key => $val){

				// get all NS
				if($result[$key]['type'] === "NS"){
					array_push(
						$record_NS,
						$val['target']
					);

					$dig_result["NS"] = $record_NS;
				}


				// get all A
				if($result[$key]['type'] === "A"){
					array_push(
						$record_A,
						$val['ip']
					);

					$dig_result["A"] = $record_A;
				}


				// get all CNAME
				if($result[$key]['type'] === "CNAME"){

					// check MX IPs only for A and AAAA
					$CNAME_values = dns_get_record($val['target'], DNS_A + DNS_AAAA);

					foreach($CNAME_values as $index => $value ){

						$ipv4 = isset($CNAME_values[0]['ip']) ? $CNAME_values[0]['ip'] : "";
						$ipv6 = isset($CNAME_values[1]['ipv6']) ? $CNAME_values[1]['ipv6'] : "";

						$record_CNAME_values = array(
							$val['target'],
							$ipv4, 
							$ipv6
						);
					}

					array_push(
						$record_CNAME,
						$record_CNAME_values
					);

					$dig_result["CNAME"] = $record_CNAME;
				}


				// get all AAAA
				if($result[$key]['type'] === "AAAA"){
					array_push(
						$record_AAAA,
						$val['ipv6']
					);

					$dig_result["AAAA"] = $record_AAAA;
				}


				// get all TXT
				if($result[$key]['type'] === "TXT"){
					array_push(
						$record_TXT,
						$val['txt']
					);

					$dig_result["TXT"] = $record_TXT;
				}


				// get all MX
				if($result[$key]['type'] === "MX"){

					// check MX IPs only for A and AAAA
					$MX_values = dns_get_record($val['target'], DNS_A + DNS_AAAA);

					foreach($MX_values as $index => $value ){

						$ipv4 = isset($MX_values[0]['ip']) ? $MX_values[0]['ip'] : "";
						$ipv6 = isset($MX_values[1]['ipv6']) ? $MX_values[1]['ipv6'] : "";

						$record_MX_values = array(
							$val['target'],
							$ipv4, 
							$ipv6
						);
					}

					array_push(
						$record_MX,
						$record_MX_values
					);

					$dig_result["MX"] = $record_MX;
				}
			}


			print_r($dig_result);
			
			print "<hr>";
			
			$whois = shell_exec("whois " . $query);
			print_r($whois);
	
			?>
		</pre>
	</div>
	
	<a class="uk-button uk-button-primary uk-float-right" href="#scroll-up" uk-scroll>Scroll Up</a>
	
	<!-- UIkit JS -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit-icons.min.js"></script>
	<script src="<?php echo base_url();?>assets/js/script.js"></script>
</body>

</html>