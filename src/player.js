var PlayerStatus = {
    Stop: 1,
    Play: 2
};

class Player {

    constructor(filename) {

        this.mainVolumeValue = 1;
        this.volumeValue = 1;

        this.status = PlayerStatus.Stop;

        this.filename = filename;

        this.sound = new Howl({
            src: [filename]
        });
    }

    play() {
        this.sound.play();
        this.status = PlayerStatus.Play;
    }

    stop() {
        this.sound.stop();
        this.status = PlayerStatus.Stop;
    }

    loop(loop) {
        this.sound.loop(loop);
    }

    mainVolume(mainVolume) {
        this.mainVolumeValue = mainVolume;
        this.volume(this.volumeValue)
    }

    volume(volume) {
        this.volumeValue = volume;
        this.sound.volume(volume * this.mainVolumeValue);
    }

    switch() {
        if (this.status == PlayerStatus.Play) {
            this.stop();
        } else {
            this.play();
        }
    }

    get Filename() {
        return this.filename;
    }

    get Status() {
        return this.status;
    }

    get Duration() {
        return this.sound.duration();
    }

    get Loop() {
        return this.sound.loop();
    }

    get Volume() {
        return this.sound.volume();
    }
}