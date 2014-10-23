var controller = {
    //Constructor
    init: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function () {
        //model event listeners
        document.addEventListener("podListReaderReady", this.onPodlistReaderReady.bind(this), false);
        document.addEventListener("rssReaderReady", this.onRssReaderReady.bind(this), false);
        //view event listeners
        document.getElementById("search_channels_button").addEventListener('click', this.onSearchChannelsButtonClick.bind(this), false);
        document.getElementById("channel_list_container").addEventListener('click', this.onSearchChannelItemClick.bind(this), false);
        document.getElementById("item_list_container").addEventListener('click', this.onListItemClick.bind(this), false);
    },
    //Button Click Events
    onSearchChannelsButtonClick: function()
    {
        var keywords = document.getElementById("key_words").value;
        var result_count = 7;
        podListReader.makeOutlineList(keywords, result_count);
    },
    onSearchChannelItemClick: function(ev)
    {
        var outline_list = podListReader.getOutlineList();
        rssReader.getRSSFeed(outline_list[ev.target.id].url, 2);
    },
    onListItemClick: function(ev)
    {
        var item_list = rssReader.getItemList();
        var item = item_list[ev.target.id];
        if(confirm("Play: " + item.title  + " url: " + item.url + " ?"))
        {
            var fileURL = "file:///sdcard/" + item.title + ".mp3";
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(item.url);
            fileTransfer.download(uri, fileURL, function (entry) {
                console.log("download complete: " + entry.toURL());
                //TODO add entry to file system
                media.playAudio(entry.toURL());
            }, function (error) {
                console.log("download error code" + error.code);
            }, false, { headers: { "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA==" } });
        }
    },
    //Data Ready Events
    onPodlistReaderReady: function()
    {
        var outline_list = podListReader.getOutlineList();
        view.drawChannelList(outline_list);
    },
    onRssReaderReady: function()
    {
        if (rssReader.success)
        {
            var item_list = rssReader.getItemList();
            view.drawItemList(item_list);
        }
        else {
            alert("RSS feed does NOT Conform!");
        }
    },
    //Going Offline
    //onOffline: function () {
    //    model.setOnlineStatus(false);
    //},
    //Coming Online
    //onOnline: function () {
    //    model.setOnlineStatus(true);
    //},
    //onDeviceReady: function () {
    //}
};

//Cannot initialize from online script Contacts plugin restrictions
(function start_up() {
    document.addEventListener('deviceready', function () {
        controller.init();
        view.init("channel_list_container", "item_list_container");
        podListReader.init();
        rssReader.init();
        media.init("stop_button", "pause_button", "resume_button");
        //controller.onDeviceReady();
    }, false);
})();
