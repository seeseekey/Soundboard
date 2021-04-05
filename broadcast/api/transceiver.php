<?php

declare(strict_types=1);

use Bloatless\WebSocket\Application\Application;
use Bloatless\WebSocket\Connection;

class Transceiver extends Application
{
    /**
     * @var array $clients
     */
    private array $clients = [];

    /**
     * Handles new connections to the application.
     *
     * @param Connection $connection
     * @return void
     */
    public function onConnect(Connection $connection): void
    {
        $id = $connection->getClientId();
        $this->clients[$id] = $connection;
    }

    /**
     * Handles client disconnects.
     *
     * @param Connection $connection
     * @return void
     */
    public function onDisconnect(Connection $connection): void
    {
        $id = $connection->getClientId();
        unset($this->clients[$id]);
    }

    /**
     * Handles incomming data/requests.
     * If valid action is given the according method will be called.
     * Send data to all clients
     *
     * @param string $data
     * @param Connection $client
     * @return void
     */
    public function onData(string $data, Connection $client): void
    {
        try {

            foreach ($this->clients as $receiverClient) {

                if($receiverClient == $client) {
                    continue;
                }

                $receiverClient->send($data);
            }

            return;
        } catch (\RuntimeException $e) {
            echo $e;
        }
    }

    /**
     * Handles data pushed into the websocket server using the push-client.
     *
     * @param array $data
     */
    public function onIPCData(array $data): void
    {
        return; // Do nothing
    }
}
