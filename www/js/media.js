/**
 * RJ TW
 */

var media = {
    //Input elements
    my_media: null,
    stop_button: null,
    pause_button: null,
    resume_button: null,
	 player: null,
    init: function (stop_button_id, pause_button_id, resume_button_id) {
		
		 player = document.getElementById("podcast_player");
        stop_button = document.getElementById(stop_button_id);
        stop_button.addEventListener('click', this.onStopClicked.bind(this), false);

        pause_button = document.getElementById(pause_button_id);
        pause_button.addEventListener('click', this.onPauseClicked.bind(this), false);

        resume_button = document.getElementById(resume_button_id);
        resume_button.addEventListener('click', this.onResumeClicked.bind(this), false);
    },
    playAudio: function (url) {
        // Play the audio file at url
        this.my_media = new Media(url,
            // success callback
            function () {
                console.log("playAudio():Audio Success");
                media.my_media.release();
                fileSys.deletePodcast(url);
                console.log("RELEASED!");
            },
            // error callback
            function (err) {
                console.log("playAudio():Audio Error: " + err);
                media.my_media.release();
                console.log("RELEASED!");
            },
            function (status) {
                console.log("Media Status: " + Media.MEDIA_MSG[status]);
                switch (status) {
                    case Media.MEDIA_NONE:
                        break;
                    case Media.MEDIA_STARTING:
                        break;
                    case Media.MEDIA_RUNNING:
                        break;
                    case Media.MEDIA_PAUSED:
                        break;
                    case Media.MEDIA_STOPPED:
                        media.my_media.release();
                        break
                }
            }
        );
        // Play audio
		 player.style.display = "block";
        this.my_media.play();
    },
    onStopClicked: function () {
        this.my_media.stop();
		player.style.display = "none";
		
    },
    onPauseClicked: function () {
        this.my_media.pause();
    },
    onResumeClicked: function () {
        this.my_media.play();
		
    },

};