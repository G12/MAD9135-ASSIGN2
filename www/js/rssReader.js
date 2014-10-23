/**
 * RSS Reader
 */
var rssReader = {
    _objArray:null,
    success: false,
    init: function (){
        console.log("RSS Reader init");
    },
    getRSSFeed: function (feed, result_count)
    {
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
                        var items = xmlDoc.getElementsByTagName("item");
                        if (items)
                        {
                            result_count = items.length > result_count ? result_count : items.length;
                            for (i = 0; i < result_count; i++)
                            {
                                var title = items[i].getElementsByTagName("title")[0];
                                var description = items[i].getElementsByTagName("description")[0];
                                var enclosure = items[i].getElementsByTagName("enclosure")[0];
                                var url = enclosure.attributes.url.textContent;
                                var length = enclosure.attributes.length.textContent;
                                var type = enclosure.attributes.type.textContent;
                                //TODO check media type to make sure it is supported
                                //if supported then push onto array
                                rssReader._objArray.push({
                                    title: title.textContent,
                                    description: description.textContent,
                                    url: url, length: length, type: type
                                });
                            }
                            rssReader.success = true;
                        }
                    }
                    var event = document.createEvent('Event');
                    event.initEvent('rssReaderReady', true, true);
                    document.dispatchEvent(event);
                }
            }
        }
        request.send();
    },
    getItemList: function(){
        return this._objArray;
    }
}