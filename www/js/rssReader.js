/// <reference path="fileSystem.js" />
/**
 * RJ TW
 */
var rssReader = {
    _objArray: null,
    _channels_array: null,
    _title: "",
    _description: "",
    _imageUrl: "",
    _folderName: "",
    _channelProperties: null,
    success: false,
    errMsg: "",
    init: function (){
        console.log("RSS Reader init");
        this._channels_array = [];
    },
    exit: function()
    {
        var event = document.createEvent('Event');
        event.initEvent('rssReaderReady', true, true);
        document.dispatchEvent(event);
    },
    getRSSFeed: function (feed, result_count)
    {
        console.log("getRSSFeed START");
        rssReader.success = false;
        this._objArray = [];
        var request = new XMLHttpRequest();
        request.open("GET", feed);
        request.onreadystatechange = function ()
        {
            if (request.readyState == 4)
            {
                if (request.status == 200 || request.status == 0)
                {
                    var xmlDoc = request.responseXML;
                    if (xmlDoc)
                    {
                        var title, folderName, image_url, image_path, description;

                        image_path = "file:///img/noImage.png";
                        var pod_link = xmlDoc.getElementsByTagName("link")[0].textContent;
                        var items = xmlDoc.getElementsByTagName("item");
                        image_url = "";
                        
                        var elements = xmlDoc.getElementsByTagName("title");
                        if (elements && elements.length)
                        {
                            title = elements[0].textContent;
                            folderName = title.replace(/[^a-z0-9]/gi, '_');
                        }
                        else
                        {
                            rssReader.errMsg = "RSS channel does not contain a valid Title";
                            console.log(rssReader.errMsg);
                            rssReader.exit();
                        }
                        elements = xmlDoc.getElementsByTagName("description");
                        if (elements && elements.length)
                        {
                            description = elements[0].textContent;
                        }
                        elements = xmlDoc.getElementsByTagName("image");
                        if(elements && elements.length > 0)
                        {
                            elements = elements[0].getElementsByTagName("url");
                            if(elements && elements.length)
                            {
                                image_url = elements[0].textContent;
                            }
                        }
                        var numcasts = items.length;
                        rssReader._channelProperties = {
                            title: title,
                            folderName: folderName,
                            description: description,
                            image_url: image_url,
                            image_path: image_path,
                            pod_link: pod_link,
                            numcasts: numcasts
                        }
                        var Podcasts = [];
                        var Channel = {
                                title: title, folderName: folderName, image_url: image_url,
                                image_path: image_path, description: description, Podcasts: Podcasts,
                                pod_link: pod_link, numcasts: numcasts
                            };

                        if (items && items.length)
                        {
                            var podcast_count = items.length > result_count ? result_count : items.length;
                            for (var i = 0; i < podcast_count; i++)
                            {
                                var title, safeName, description, type, length, url, fileURL, status;
                                fileURL = "";
                                status = "waiting";

                                var elem = items[i].getElementsByTagName("title")[0];
                                title = elem.textContent;
                                safeName = title.replace(/[^a-z0-9]/gi, '_');
                                description = items[i].getElementsByTagName("description")[0].textContent;
                                elements = items[i].getElementsByTagName("enclosure")
                                var ok = false;
                                if(elements && elements.length)
                                {
                                    var enclosure = elements[0];
                                    var attributes = enclosure.attributes;
                                    if (attributes)
                                    {
                                        var url_attr = attributes.url;
                                        if (url_attr)
                                        {
                                            ok = true;
                                            url = url_attr.textContent;
                                            length = attributes.length.textContent;
                                            type = attributes.type.textContent;
                                        }
                                    }
                                }
                                if(!ok)
                                {
                                    rssReader.errMsg = "RSS Podcast does not contain a valid URL";
                                    console.log(rssReader.errMsg);
                                    rssReader.exit();
                                }
                                //TODO check media type to make sure it is supported
                                if ("audio/mpeg" == type)
                                {
                                    //if supported then push onto array
                                    var Podcast = {
                                        title: title,
                                        safeName: safeName,
                                        description: description.textContent,
                                        url: url, length: length, type: type,
                                        fileURL: fileURL, status: status
                                    };
                                    Channel.Podcasts.push(Podcast);
                                    rssReader.updateChannelsList(Channel);
                                }
                            }
                            rssReader.success = true;
                        }
                        else
                        {
                            rssReader.errMsg = "RSS channel does not contain any Items";
                            console.log(rssReader.errMsg);
                        }
                    }
                    console.log("getRSSFeed EXIT");
                    rssReader.exit();
                }
                if (request.status > 300)
                {
                    rssReader.errMsg = "Network ERROR: " + request.status;
                    console.log(rssReader.errMsg);
                    rssReader.exit();
                }
            }
        }
        request.send();
    },
    //If channel exist add podCast to existing else add channel to list
    updateChannelsList: function(new_channel)
    {
        for(var i=0; i < this._channels_array.length; i++)
        {
            if (this._channels_array[i].folderName == new_channel.folderName)
            {
                this._channels_array[i].Podcasts.push(new_channel.Podcasts[0]);
                return;
            }
        }
        this._channels_array.push(new_channel);
    },
    getChannelList: function()
    {
        return this._channels_array;
    },
    getItemList: function(){
        return this._objArray;
    },
    getChannelProperties: function () {
        return this._channelProperties;
    },
    setStatus: function(channel_id, podcast_id, status)
    {
        this._channels_array[channel_id].Podcasts[podcast_id].status = status;
    },
    getChannel: function(folderName)
    {
        for (var i = 0; i < this._channels_array.length; i++)
        {
            if (this._channels_array[i].folderName == folderName)
            {
                return this._channels_array[i];
            }
        }
        return false;
    },
    saveToLocalStorage: function()
    {
        if (typeof (Storage) !== "undefined") {
            var json = JSON.stringify(this._channels_array);
            localStorage.setItem("ChannelList", json);
        } else {
            alert("No Local Storage");
        }
    },
    getFromLocalStorage: function () {
        if (typeof (Storage) !== "undefined") {
            var json = localStorage.getItem("ChannelList");
            if (json)
            {
                //clear existing if any
                this._channels_array = [];
                this._channels_array = JSON.parse(json);
            }
        } else {
            alert("No Local Storage");
        }
    },
    getErrorMsg: function()
    {
        return this.errMsg;
    }
}