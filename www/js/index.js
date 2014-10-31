/// <reference path="fileSystem.js" />
/// <reference path="index.js" />
/// <reference path="media.js" />
/// <reference path="podlistReader.js" />
/// <reference path="rssReader.js" />
/// <reference path="view.js" />

/**
 * RJ TW
 */

var controller = {
    _channels: null,
    //Constructor
    init: function () {
        console.log("controller.init");
        this._channels = [];
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function () {
        console.log("controller.bindEvents");
        //model event listeners
        document.addEventListener("podListReaderReady", this.onPodlistReaderReady.bind(this), false);
        document.addEventListener("rssReaderReady", this.onRssReaderReady.bind(this), false);
        //File System listeners
        document.addEventListener("FolderListComplete", this.onFolderListComplete.bind(this), false);
        document.addEventListener("podcastDownloadComplete", this.onPodcastDownloadComplete.bind(this), false);
        //view event listeners
        document.getElementById("folder_list_container").addEventListener('click', this.onFoldersItemClick.bind(this), false);
        document.getElementById("search_channels_button").addEventListener('click', this.onSearchChannelsButtonClick.bind(this), false);
        document.getElementById("channel_list_container").addEventListener('click', this.onSearchChannelItemClick.bind(this), false);
        document.getElementById("item_list_container").addEventListener('click', this.onListItemClick.bind(this), false);
        console.log("controller.bindEvents END");
    },
    //Button Click Events
    onSearchChannelsButtonClick: function () {
        var keywords = document.getElementById("key_words").value;
        var result_count = 7;
        podListReader.makeOutlineList(keywords, result_count);
    },
    onSearchChannelItemClick: function (ev) {
        console.log("controller.onSearchChannelItemClick");
        var outline_list = podListReader.getOutlineList();
        rssReader.getRSSFeed(outline_list[ev.target.id].url, 2);
        console.log("controller.onSearchChannelItemClick END");
    },
    onFoldersItemClick: function(ev)
    {
        ev.preventDefault();
        var type = ev.target.tagName;
        if(type == "LI")
        {
            var url = ev.target.getAttribute("data-url");
            media.playAudio(url);
        }
    },
    onListItemClick: function (ev) {
        console.log("controller.onListItemClick");
        //var item_list = rssReader.getItemList();
        //var item = item_list[ev.target.id];
        alert("Podcast id:" + ev.target.id);
        //fileSys.savePodCast(rssReader.getChannelProperties(), item);
        //fileSys.saveImage(rssReader.getChannelProperties());
        console.log("controller.onListItemClick END");
    },
    //Data Ready Events
    onPodlistReaderReady: function () {
        console.log("controller.onPodlistReaderReady");
        var outline_list = podListReader.getOutlineList();
        view.drawChannelList(outline_list);
        console.log("controller.onPodlistReaderReady END");
    },
    onRssReaderReady: function () {
        console.log("controller.onRssReaderReady");
        if (rssReader.success) {
            var channel_list = rssReader.getChannelList();
            view.drawItemList(channel_list);
        }
        else {
            alert("RSS ERROR: " + rssReader.getErrorMsg());
        }
        console.log("controller.onRssReaderReady END");
    },
    //File System Ready events
    onFolderListComplete: function () {
        console.log("controller.onFolderListComplete");
        view.drawFoldersList(fileSys.getFolders());
        console.log("controller.onFolderListComplete END");
    },
    onPodcastDownloadComplete: function () {
        console.log("controller.onPodcastDownloadComplete");
        //enable buttons now
        console.log("controller.onPodcastDownloadComplete END");
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

        alert("Set Breakpoints Now");
        controller.init();
        fileSys.init();
        view.init("folder_list_container", "channel_list_container", "item_list_container", "download_status");
        podListReader.init();
        rssReader.init();
        media.init("stop_button", "pause_button", "resume_button");
        //controller.onDeviceReady();
    }, false);
})();
