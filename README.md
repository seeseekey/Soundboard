# Soundboard

A simple HTML5 soundboard.

* define a boards.json (see boards.example for example)
* put assets in the assets folder
* start index.html and enjoy.

## Broadcast mode

For a distributed setup, the broadcast mode can be activated. To do this, the broadcast switch in boards.json must be set to true.

The corresponding websocket server can be found in the broadcast/api directory. This is activated by means of:

```php server.php```

to start it. Nginx can be used as a websocket reverse proxy:

```
server {
		...

        location /soundboard/ {
               proxy_pass http://localhost:8000/;
    	       proxy_http_version 1.1;
    	       proxy_set_header Upgrade $http_upgrade;
               proxy_set_header Connection "Upgrade";
               proxy_set_header Host $host;
        }
}
```

The broadcast receiver should use the index.html in the broadcast folder in the browser

## Links

* https://seeseekey.net/archive/120814/
