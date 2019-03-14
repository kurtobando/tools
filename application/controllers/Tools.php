<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Tools extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	
	private function private__dns_query($query){
		
		// store dns records
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
		if(!empty($query)) :
			
			// remove the dns_get_record warning
			error_reporting(0);
		
			// whois query
			$dig_result["whois"] = shell_exec("whois " . $query);
		
			// add . to read subdomains records
			$query = trim($query) . ".";
			$result = dns_get_record($query, DNS_ALL);
		
			if ($result === false) {
				$dig_result["error"] = "no records propagating";
			} 
			
			// retrieve DNS records manually
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

			// prepare json output for ajax request 
			echo json_encode($dig_result);

		endif;
	}
	
	public function index()
	{
		$this->load->view('index');
	}
	
	public function dns_ajax(){
		
		// disable access via browser, only in ajax
		if(!$this->input->is_ajax_request()){
			exit("No AJAX Request Received");
		}
		
		$this->private__dns_query($this->input->get("domain-query"));

	}
}
