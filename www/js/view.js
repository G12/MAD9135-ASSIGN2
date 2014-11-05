/// <reference path="rssReader.js" />
/// <reference path="candidateList.json" />

/**
 * RJ TW
 */
var view = {
    //Input elements
    folder_list_container: null,
    channel_list_container: null,
    item_list_container: null,
    podcast_player: null,
    download_status: null,
    _progress_bars: null,
    init: function (folder_list_container_id, channel_list_container_id, item_list_container_id,
        download_status_id, podcast_player_id)
    {
        this.folder_list_container = document.getElementById(folder_list_container_id);
        this.channel_list_container = document.getElementById(channel_list_container_id);
        this.item_list_container = document.getElementById(item_list_container_id);
        this.podcast_player = document.getElementById(podcast_player_id);
        this.download_status = document.getElementById(download_status_id);
        this._progress_bars = [];
    },
    //Utiliy
    hideAll: function()
    {
        this.folder_list_container.className = "hide";
        this.channel_list_container.className = "hide";
        this.item_list_container.className = "hide";
        this.podcast_player.className = "hide";
    },
    //List of channels from search
    hideChannelList: function () {
        this.channel_list_container.className = "hide";
    },
    showChannelList: function () {
        this.channel_list_container.className = "show";
    },
    drawChannelList: function (pod_list) {
        //Clear the div first
        this.channel_list_container.innerHTML = "";
        var html = "";
        for (var i = 0; i < pod_list.length; i++) {
            var outline = pod_list[i];
            html += '<div id="' + i + '" class="list_item">' + outline.text + '</div>';
        }
        this.channel_list_container.innerHTML = html;
    },
    showRssReaderWaitingMessage: function () {
        this.channel_list_container.innerHTML = "<p>Download in Progress ...</p>";
    },
    //List of channels in Candidate List
    hideItemList: function () {
        this.item_list_container.className = "hide";
    },
    showItemList: function () {
        this.item_list_container.className = "show";
    },
    drawItemList: function (channel_list) {
        //Clear the div first
        this.item_list_container.innerHTML = "";
        var html = "";
        for (var i = 0; i < channel_list.length; i++) {
            var channel = channel_list[i];
            html += '<fieldset><legend>' + channel.title + '</legend>';
            for (var j = 0; j < channel.Podcasts.length; j++)
            {
                var podcast = channel.Podcasts[j];
                html += '<div class="channel_item"><div id="' + i + '_' + j + '" class="list_item" data-action="show_information">' + podcast.title + '</div>';
                if(podcast.status === "waiting")
                {
                    html += '<div id="' + i + '_' + j + '" class="waiting_item" data-action="download">Download</div>';
                }
                if(podcast.status === "staged")
                {
                    html += '<div id="' + i + '_' + j + '" class="staged_item" data-action="download">Wating to Download</div>';
                }
                if(podcast.status === "downloaded")
                {
                    html += '<div id="' + i + '_' + j + '" class="downloaded_item" data-action="delete">Delete</div>';
                }
                html += "</div>";
            }
            html += "</fieldset>";
        }
        this.item_list_container.innerHTML = html;
    },
    //List of podcasts stored on machine
    hideFolderList: function () {
        this.folder_list_container.className = "hide";
    },
    showFolderList: function () {
        this.folder_list_container.className = "show";
    },
    drawFoldersList: function (folders)
    {
        this.folder_list_container.innerHTML = "";
        var html = "";
        for (var i = 0; i < folders.length; i++) {
            var folder = folders[i];
            console.log(folder.folderName);
            var img = "<p>" + folder.folderName + "</p>";
            var temp = "";
            files = folder.files;
            for (var j = 0; j < files.length; j++) {
                var file = files[j];
                console.log("    " + file.name + " " + file.url);
                //TODO check for other possible extensions
                if ("image.jpg" == file.name || "image.png" == file.name)
                {
                    if (files.length == 1)
                    {
                        img = '<div data-type="channel" " data-folderName="' + folder.folderName + '" data-folderPath="' + file.url + '">Delete ' + folder.folderName + '</div>';
                    }
                    else
                    {
                        img = '<div><img class="thumb" src="' + file.url + '" alt="' + folder.folderName +
                            '" title="' + folder.folderName + '"/><p>' + folder.folderName + '</p></div>';
                    }
                }
                else
                {
                    temp += '<div data-type="podcast" class="waiting_item" id="' + file.id + '" data-url="' + file.url + '">' + file.name + '</div>';
                    temp += '<div data-type="button" class="downloaded_item" data-url="' + file.url + '">Delete</div>';
                }
            }
            html += img + '<ul>' + temp + '</ul>';
        }
        this.folder_list_container.innerHTML = html;
    },
    //Podcast
    showPodcastPlayer:function()
    {
        this.podcast_player.className = "show";
    },
    //download Podcast Progress Bar
    addProgressBar: function(id)
    {
        var div = document.createElement("div");
        //div.setAttribute("id", id);
        //Add custom html here
        //div.innerHTML = '';
        this.download_status.appendChild(div);
        var obj = { id: id, div: div };
        this._progress_bars.push(obj);
    },
    updateProgressBar: function(id, percent, title)
    {
        //Get the div containing progress bar
        for(var i=0; i < this._progress_bars.length; i++)
        {
            var obj = this._progress_bars[i];
            if(obj.id == id)
            {
                var html = "Podcast: " + title + "Loading";
                if (percent)
                {
                    html = title + ": " + percent + "% loaded...";
                }
                obj.div.innerHTML = html;
            }
        }
    },
    progressComplete: function(id)
    {
        //Get the div containing progress bar
        for (var i = 0; i < this._progress_bars.length; i++) {
            var obj = this._progress_bars[i];
            if (obj.id == id) {
                this.download_status.removeChild(obj.div);
            }
        }
    },
    drawMediaSlider: function(max)
    {
        var html = '<input type="range" min="0" max="100" value="50" id="position_slider" step="1" >';
        html += '<output for="position_slider" id="position">50</output>';
    }
};