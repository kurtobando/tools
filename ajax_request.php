<?php

// error_reporting(0);

require 'php/Tools.php';

$Tools = new Tools();
$Tools->set_domain( $_GET['search'] );
$Tools->get_result();