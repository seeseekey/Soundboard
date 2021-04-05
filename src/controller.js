class Controller {

    constructor() {

        // Setup vars
        this.data = null;
        this.player = [];
    }

    connect(broadcastUrl) {

        this.webSocket = new WebSocket(broadcastUrl);

        this.webSocket.onopen = function (evt) {
            console.log(evt);
            $("#connection").html("(connected)");
        };

        this.webSocket.onerror = function (evt) {
            console.log(evt);
            this.close();
        };

        this.webSocket.onclose = function (evt) {
            console.log(evt);
            $("#connection").html("(disconnected)");
            setTimeout(function () { this.connect(broadcastUrl); }.bind(this), 1000);
        }.bind(this);
    }

    sendPlayerEvent(action, player) {

        if (this.webSocket == undefined) {
            return; // No broadcast mode activated
        }

        var msg = {
            action: action,
            data: "",
            url: document.URL + player.Filename,
            volume: player.Volume,
            loop: player.Loop
        };

        // Send the msg object as a JSON-formatted string.
        this.webSocket.send(JSON.stringify(msg));
    }

    addSoundButton(filename, id, description, category) {
        var html = "";

        html += "<div class='soundboardButton'>";
        html += "<div id='button-" + id + "'>" + description + "<br/><small>" + category + "</small><br/></div>";
        html += "<hr/>";
        html += '<input id="slider-' + id + '" type="range" min="0" max="1" step="0.01" value="1">'
        html += '<input id="checkbox-' + id + '" type="checkbox">';
        html += '<label for="checkbox-' + id + '" style="text-align: center;">Loop</label>'
        html += '<div class="progress" id="progress-' + id + '"></div>';
        html += "</div>";

        $("#pane").append(html);

        $("#checkbox-" + id).change(function () {
            console.log("state + " + id);
            var checked = $("#checkbox-" + id).prop("checked");
            this.player[id].loop(checked);
            this.sendPlayerEvent("loop", this.player[id]);

        }.bind(this));

        $("#slider-main-volume").on('input', '', function () {

            var mainVolumeLevel = $("#slider-main-volume").val();
            console.log("Main volume level: " + mainVolumeLevel);

            this.player.forEach(function (item, index) {
                item.mainVolume(mainVolumeLevel);
                this.sendPlayerEvent("volume", this.player[id]);
            }.bind(this));

        }.bind(this));

        $("#slider-" + id).on('input', '', function () {

            var volumeLevel = $("#slider-" + id).val();
            console.log("Volume level: " + volumeLevel);

            this.player[id].volume(volumeLevel);
            this.sendPlayerEvent("volume", this.player[id]);
        }.bind(this));

        this.player.push(new Player(filename));

        $("#button-" + id).click(function () {

            console.log("Button: " + id);

            if (this.player[id].status == PlayerStatus.Play) {

                this.player[id].stop();
                this.sendPlayerEvent("stop", this.player[id]);

                $("#progress-" + id).css("transition", "");
                $("#progress-" + id).css("width", "0%");

            } else {

                this.player[id].play();
                this.sendPlayerEvent("play", this.player[id]);

                console.log(this.player[id].Duration);
                var duration = this.player[id].Duration;

                $("#progress-" + id).css("transition", "width " + duration + "s");
                $("#progress-" + id).css("width", "100%");

                this.setTimeoutFor(id, duration);
            }

        }.bind(this));
    }

    setTimeoutFor(id, duration) {
        setTimeout(function () {

            $("#progress-" + id).css("transition", "");
            $("#progress-" + id).css("width", "0%");

            console.log("css width:" + $("#progress-" + id).css("width")); // needed, or width are not correct setted (optimization???)

            if (this.player[id].Loop == true) {

                $("#progress-" + id).css("transition", "width " + duration + "s");
                $("#progress-" + id).css("width", "100%");

                this.setTimeoutFor(id, duration);
            } else {
                this.player[id].stop();
                this.sendPlayerEvent("stop", this.player[id]);
            }

        }.bind(this), duration * 1000);
    }

    setup() {

        // Load board configurations from json
        var request = new XMLHttpRequest();
        request.open('GET', 'boards.json', true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) { // Success!

                console.log("Read JSON");
                this.data = JSON.parse(request.responseText);

                // Read settings
                var activeBoard = this.data.settings.activeboard;
                var broadcast = this.data.settings.broadcast;
                var broadcastUrl = this.data.settings.broadcasturl;

                // Read specified board
                var board = this.data.boards[activeBoard];
                var boardFolder = board.folder;

                for (var i = 0; i < board.sounds.length; i++) {

                    var sound = board.sounds[i];
                    var soundFile = boardFolder + sound.file;

                    console.log("create button for " + soundFile);
                    this.addSoundButton(soundFile, i, sound.description, sound.category);
                }
            } else { // We reached our target server, but it returned an error
                console.log("Something went wrong on our end. Please try again.");
            }

            // connect to websocket server
            if (broadcast) {
                this.connect(broadcastUrl);
            } else {
                $("#connection").html("");
            }

        }.bind(this);

        request.onerror = function () { // There was a connection error of some sort
            console.log("Can't establish connection.");
        };

        request.send();
    }
}