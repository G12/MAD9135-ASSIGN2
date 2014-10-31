/// <reference path="rssReader.js" />

/**
 * RJ TW
 */
var view = {
    //Input elements
    folder_list_container: null,
    channel_list_container: null,
    item_list_container: null,
    download_status: null,
    _progress_bars: null,
    init: function (folder_list_container_id, channel_list_container_id, item_list_container_id, download_status_id)
    {
        this.folder_list_container = document.getElementById(folder_list_container_id);
        this.channel_list_container = document.getElementById(channel_list_container_id);
        this.item_list_container = document.getElementById(item_list_container_id);
        this.download_status = document.getElementById(download_status_id);
        this._progress_bars = [];
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
    drawItemList: function (channel_list) {
        //Clear the div first
        this.item_list_container.innerHTML = "";
        var html = "";
        for (var i = 0; i < channel_list.length; i++) {
            var channel = channel_list[i];
            for (var j = 0; j < channel.Podcasts.length; j++)
            {
                var podcast = channel.Podcasts[j];
                html += '<div id="' + i + '_' + j + '" class="list_item">' + podcast.title + '</div>';
            }
        }
        this.item_list_container.innerHTML = html;
    },
    drawFoldersList: function(folders)
    {
        this.folder_list_container.innerHTML = "";
        var html = "";
        for (var i = 0; i < folders.length; i++) {
            var img = "<p>NO IMAGE</p>";
            var folder = folders[i];
            console.log(folder.folderName);
            var temp = "";
            files = folder.files;
            for (var j = 0; j < files.length; j++) {
                var file = files[j];
                console.log("    " + file.name + " " + file.url);
                //TODO check for other possible extensions
                if ("image.jpg" == file.name || "image.png" == file.name)
                {
                    img = '<div><img class="thumb" src="' + file.url + '" alt="' + folder.folderName +
                        '" title="' + folder.folderName + '"/><p>' + folder.folderName + '</p></div>';
                }
                else
                {
                    temp += '<li id="' + file.id + '" data-url="' + file.url + '">' + file.name + '</li>';
                }
            }
            //"<li>" + folder.folderName + "<ul>";
            html += img + '<ul>' + temp + '</ul>';
        }
        this.folder_list_container.innerHTML = html;
    },
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
    }
};