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
        document.addEventListener("podCastDeleted", this.onPodcastDeleted.bind(this), false);
        //view event listeners
        document.getElementById("folder_list_container").addEventListener('click', this.onFoldersItemClick.bind(this), false);
        document.getElementById("search_channels_button").addEventListener('click', this.onSearchChannelsButtonClick.bind(this), false);
        document.getElementById("channel_list_container").addEventListener('click', this.onSearchChannelItemClick.bind(this), false);
        document.getElementById("item_list_container").addEventListener('click', this.onListItemClick.bind(this), false);
        //Button Events
		
    
    console.log("controller.bindEvents END");
    
	},
    //Button Click Events
    onShowChannelListClick: function()
    {
        view.showChannelList();
    },
    onHideChannelListClick: function()
    {
        view.hideChannelList();
    },
    onShowItemListClick: function()
    {
        view.showItemList();
    },
    onHideItemListClick: function()
    {
        view.hideItemList();
    },
    onExitPodcastPlayerClick: function()
    {
        view.showFolderList();
    },
    onShowPodcastsClick: function()
    {
        view.showFolderList();
    },
    onHidePodcastsClick: function () {
        view.hideFolderList();
    },
    onSearchChannelsButtonClick: function () {
        var keywords = document.getElementById("key_words").value;
        var result_count = 7;
        podListReader.makeOutlineList(keywords, result_count);
    },
    onSearchChannelItemClick: function (ev) {
        console.log("controller.onSearchChannelItemClick");
        var outline_list = podListReader.getOutlineList();
        view.showRssReaderWaitingMessage();
        rssReader.getRSSFeed(outline_list[ev.target.id].url, 2);
        //Remove selected item from the list
        podListReader.removeItem(ev.target.id);
        console.log("controller.onSearchChannelItemClick END");
    },
    onFoldersItemClick: function(ev)
    {
        ev.preventDefault();
        var type = ev.target.dataset.type;
        if(type == "podcast")
        {
            var url = ev.target.dataset.url;
            media.playAudio(url);
            view.hideAll();
            view.showPodcastPlayer();
        }
        if(type == "button")
        {
            var url = ev.target.dataset.url;
            fileSys.deletePodcast(url);
        }
        if(type == "channel")
        {
            var folderName = ev.target.dataset.folderName;
            var folderPath = ev.target.dataset.folderPath;
            if (confirm("Do you wish to delete the channel" + folderName + "? Path = " + folderPath));
            {
                fileSys.deletePodcast(url);
            }
        }
    },
    onListItemClick: function (ev)
    {
        console.log("controller.onListItemClick");
        ///////////////////////////////////////////  Download Podcast //////////////////////////////////////////
        if (ev.target.dataset.action == "download")
        {
            var arr = ev.target.id.split('_');
            var channel_index = arr[0];
            var pod_index = arr[1];
            var channel_list = rssReader.getChannelList();

            var channel = channel_list[channel_index];
            var podcast = channel.Podcasts[pod_index];

            if(confirm("download Channel: " + channel.title + " Podcast: " + podcast.title))
            {
                fileSys.savePodCast(channel.folderName, podcast.safeName, podcast.url, podcast.title);

                //Set the status of the podcast to downloaded TODO this must be undone if download fails
                rssReader.setStatus(channel_index, pod_index, "downloaded");
                //update the channel list
                channel_list = rssReader.getChannelList();
                view.drawItemList(channel_list);

                //Prepare to download image
                var imgage = channel.image_url;
                if (channel.image_url == "")
                {
                    imgage = channel.image_path; //Default Image
                }
                fileSys.saveImage(channel.folderName, imgage);
            }
        }
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
        //Redraw outline list
        var outline_list = podListReader.getOutlineList();
        view.drawChannelList(outline_list);
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
        fileSys.init();
        console.log("controller.onPodcastDownloadComplete END");
    },
    onPodcastDeleted: function () {
        fileSys.init();
        alert("Podcast Deleted refreshing List");
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

        //alert("Set Breakpoints Now");
        controller.init();
        fileSys.init();
        view.init("folder_list_container", "channel_list_container", "item_list_container", "download_status", "podcast_player");
        podListReader.init();
        rssReader.init();
        media.init("stop_button", "pause_button", "resume_button", "forward_button");
        //controller.onDeviceReady();
    }, false);
})();
