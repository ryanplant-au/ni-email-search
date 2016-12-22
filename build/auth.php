<?php
$username = $_GET['username'];
$password = $_GET['password'];
$value = file_get_contents("http://forums.ni.com/restapi/vc/authentication/sessions/login?restapi.response_format=json&user.login=" . $username . "&user.password=" . $password);
echo $value;
