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
	
	<link rel="apple-touch-icon" sizes="180x180" href="assets/favicon/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16x16.png">
	<link rel="manifest" href="assets/favicon/site.webmanifest">
	
	<!-- UIkit CSS -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/css/uikit.min.css" />
	<link rel="stylesheet" href="<?php echo base_url();?>assets/css/style.css" type="text/css">
	<script>
		let base_url = "<?php echo base_url();?>";
	</script>
</head>

<body>
	<div class="uk-container">
		<a href="#scroll-up" uk-scroll></a>
		
		
		<div class="uk-margin-top uk-margin-bottom">
		
			<!-- https://stackoverflow.com/questions/3003145/how-to-get-the-client-ip-address-in-php -->
			<!-- https://stackoverflow.com/questions/24266212/how-to-get-ip-address-in-codeigniter -->
<!-- 			<label for="ip-address" uk-icon="world"></label> -->
<!-- 			<span class="uk-badge"><?php //echo $this->input->ip_address(); ?></span> -->
			

			<!-- https://stackoverflow.com/questions/1504459/getting-the-screen-resolution-using-php -->
<!-- 			<label for="screen-width" uk-icon="desktop">Screen width </label> -->
<!-- 			<span class="uk-badge" id="screen-width"></span> -->

<!-- 			<label for="screen-height"  uk-icon="desktop">Screen height </label> -->
<!-- 			<span class="uk-badge" id="screen-height"></span> -->
		
		</div>
		
		
		<form action="" method="get" name="domainQueryForm">
			<div class="uk-flex uk-flex-middle">
				<input class="uk-input" type="text" name="domainQueryInput" value ="<?php echo $this->input->get("domain-query"); ?>"placeholder="e.g. gmail.com, www.gmail.com, mail.google.com" autofocus autocomplete>
				<input class="uk-button uk-button-primary" type="submit" value="Dig Records">
			</div>
			
			<div class="uk-margin-bottom"></div>
			
		</form>

	
<!-- 		<label uk-icon="copy">Copy </label> -->
		<div id="link_dns_history" class="uk-margin-left uk-display-inline-block"></div>
		<div id="link_reputation" class="uk-margin-left uk-display-inline-block"></div>
		<div id="link_whois" class="uk-margin-left uk-display-inline-block"></div>
		<div id="link_dig" class="uk-margin-left uk-display-inline-block"></div>
		<pre class="uk-background-muted">
			<div id="domain-query"></div> 
			<div id="result_dns"></div> 
			<div id="result_whois"></div>
		</pre>
<!-- 		<a class="uk-button uk-button-primary uk-float-right" href="#scroll-up" uk-scroll>Scroll Up</a> -->
	</div>
	
	
	<!-- UIkit JS -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit-icons.min.js"></script>
	<script src="<?php echo base_url();?>assets/js/script.js"></script>
</body>

</html>