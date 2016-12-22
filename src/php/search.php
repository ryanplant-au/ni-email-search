<?php
$session_key = $_GET['sessionKey'];
$email = $_GET['email'];
echo file_get_contents('http://forums.ni.com/restapi/vc/users/email/' . $email . '?restapi.response_format=json&restapi.session_key=' . $session_key);
