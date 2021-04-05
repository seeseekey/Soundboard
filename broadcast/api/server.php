<?php

require __DIR__ . '/vendor/autoload.php';
include 'transceiver.php';

$server = new \Bloatless\WebSocket\Server('localhost', 8000, '/tmp/phpwss.sock');

// server settings
$server->setMaxClients(50);
$server->setCheckOrigin(false);
$server->setMaxConnectionsPerIp(5);

// add your applications
$server->registerApplication('transceiver', Transceiver::getInstance());

$server->run();
