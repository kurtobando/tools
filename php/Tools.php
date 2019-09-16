<?php

error_reporting(0);

class Tools{
	
	
	
	private $domain;
	private $result;
	
	
	
	// htmlentities — Convert all applicable characters to HTML entities
	// https://www.php.net/manual/en/function.htmlentities.php
	
	// trim — Strip whitespace (or other characters) from the beginning and end of a string
	// https://www.php.net/manual/en/function.trim.php
	
	public function set_domain( $domain = '' ) {
		
		if( !empty( $domain ) ){
			
			$this->domain = htmlentities( trim( $domain ) ) . ".";
			return $this->domain;
		}

		exit( 'exit' );
	}
	
	
	
	// shell_exec — Execute command via shell and return the complete output as a string
	// https://www.php.net/manual/en/function.shell-exec.php
	
	private function domain_whois() {
		
		$this->result[ 'WHOIS' ] = shell_exec( "whois " . $this->domain );
		
		return $this->result[ 'WHOIS' ];
	}
	
	
	
	// dns_get_record — Fetch DNS Resource Records associated with a hostname
	// https://www.php.net/manual/en/function.dns-get-record.php
	
	private function domain_dig_a() {
		
				$this->result[ 'DIG' ][ 'A' ] = dns_get_record( $this->domain, DNS_A );
		return 	$this->result[ 'DIG' ][ 'A' ];
	}
	
	private function domain_dig_aaaa() {
		
				$this->result[ 'DIG' ][ 'AAAA' ] = dns_get_record( $this->domain, DNS_AAAA );
		return 	$this->result[ 'DIG' ][ 'AAAA' ];
	}
	
	private function domain_dig_cname() {

				$this->result[ 'DIG' ][ 'CNAME' ] = dns_get_record( $this->domain, DNS_CNAME );
		return 	$this->result[ 'DIG' ][ 'CNAME' ];
	}
	
	private function domain_dig_mx() {
		
				$this->result[ 'DIG' ][ 'MX' ] = dns_get_record( $this->domain, DNS_MX );
		return 	$this->result[ 'DIG' ][ 'MX' ];
	}
	
	private function domain_dig_ns() {
		
				$this->result[ 'DIG' ][ 'NS' ] = dns_get_record( $this->domain, DNS_NS );
		return 	$this->result[ 'DIG' ][ 'NS' ];
	}
	
	private function domain_dig_txt() {
		
				$this->result[ 'DIG' ][ 'TXT' ] = dns_get_record( $this->domain, DNS_TXT );
		return 	$this->result[ 'DIG' ][ 'TXT' ];
	}
	
	private function domain_dig_soa() {
		
				$this->result[ 'DIG' ][ 'SOA' ] = dns_get_record( $this->domain, DNS_SOA );
		return 	$this->result[ 'DIG' ][ 'SOA' ];
	}
	
	private function domain_dig_srv(){
		
				$this->result[ 'DIG' ][ 'SRV' ] = dns_get_record( $this->domain, DNS_SRV );
		return 	$this->result[ 'DIG' ][ 'SRV' ];
	}
	
	
	
	public function get_result(){
		
		// execute private function
		$this->domain_whois();
		$this->domain_dig_a();
		$this->domain_dig_aaaa();
		$this->domain_dig_cname();
		$this->domain_dig_mx();
		$this->domain_dig_ns();
		$this->domain_dig_txt();
		$this->domain_dig_soa();
		$this->domain_dig_srv();
		
		// remove empty array
		// https://www.geeksforgeeks.org/program-to-remove-empty-array-elements-in-php/
		
		foreach ( $this->result[ 'DIG' ] as $key => $value ) {
			
			if( empty($value) ) {
				unset( $this->result[ 'DIG' ][ $key ]  );
			} 
		}
		
		// echo result with json format
		echo json_encode( $this->result );
	}
}



?>