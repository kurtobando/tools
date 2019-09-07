<?php



class Tools{
	
	// https://www.php.net/manual/en/function.dns-get-record.php
	
	private $domain;
	private $result;
	
	
	public function set_domain( $domain = ''){
		
		if(!empty( $domain )){
			return $this->domain =  htmlentities(trim( $domain )) . ".";
		}
		
		exit('exit');
	}
	
	
	private function __domain_whois(){
		return $this->result['WHOIS'] = shell_exec("whois " . $this->domain);
	}
	
	
	private function __domain_dig_a(){
		return $this->result['DIG']['A'] = dns_get_record( $this->domain, DNS_A);
	}
	
	
	private function __domain_dig_aaaa(){
		return $this->result['DIG']['AAAA'] = dns_get_record( $this->domain, DNS_AAAA);
	}
	
	
	private function __domain_dig_cname(){
		return $this->result['DIG']['CNAME'] = dns_get_record( $this->domain, DNS_CNAME);
	}
	
	
	private function __domain_dig_mx(){
		return $this->result['DIG']['MX'] = dns_get_record( $this->domain, DNS_MX);
	}
	
	
	private function __domain_dig_mx_a(){
		
		$mx_i = 0;
		$mx_records = $this->result['DIG']['MX'];
		$mx_records_count = count($this->result['DIG']['MX']);
		
		foreach($mx_records as $mx){
			$this->result['DIG']['MX_A'][$mx_i] = dns_get_record( $mx['target'] . '.', DNS_A + DNS_AAAA);
			$mx_i++;
		}
		
		return $this->result['DIG']['MX_A'];
	}
	
	
	private function __domain_dig_ns(){
		return $this->result['DIG']['NS'] = dns_get_record( $this->domain, DNS_NS);
	}
	
	
	private function __domain_dig_txt(){
		return $this->result['DIG']['TXT'] = dns_get_record( $this->domain, DNS_TXT);
	}
	
	
	private function __domain_dig_soa(){
		return $this->result['DIG']['SOA'] = dns_get_record( $this->domain, DNS_SOA);
	}
	
	
	private function __domain_dig_srv(){
		return $this->result['DIG']['SRV'] = dns_get_record( $this->domain, DNS_SRV);
	}
	
	
	public function get_result(){
		
		$this->__domain_whois();
		$this->__domain_dig_a();
		$this->__domain_dig_aaaa();
		$this->__domain_dig_cname();
		$this->__domain_dig_mx();
		$this->__domain_dig_mx_a();
		$this->__domain_dig_ns();
		$this->__domain_dig_txt();
		$this->__domain_dig_soa();
		$this->__domain_dig_srv();
		
		echo json_encode($this->result);
	}
	
}



?>