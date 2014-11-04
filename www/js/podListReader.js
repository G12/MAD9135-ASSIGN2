/**
 * RJ TW
 */
var podListReader = {
    _objArray:null,
    success: false,
    init: function (){
        console.log("Podcast List Reader init");
    },
    makeOutlineList: function (keywords, result_count)
    {
        var service_url = "http://api.digitalpodcast.com/v2r/search/?appid=6c1d75fa88d7ef5fbb05b54044c3d244";
        service_url += "&keywords=" + keywords + "&format=opml&sort=rating&searchsource=title&contentfilter=noadult&start=1&results=" + result_count;

        this._objArray = [];
        var request = new XMLHttpRequest();
        request.open("GET", service_url);
        request.onreadystatechange = function()
        {
            if (request.readyState == 4)
            {
                if (request.status == 200 || request.status == 0)
                {
                    var xmlDoc = request.responseXML;
                    var outlines = xmlDoc.getElementsByTagName("outline");
                    for (i = 0; i < outlines.length; i++)
                    {
                        var outline = outlines[i];
                        var text = outline.attributes.text.textContent;
                        var type = outline.attributes.type.textContent;
                        var url = outline.attributes.url.textContent;
                        podListReader._objArray.push({
                            text: text,
                            type: type,
                            url: url
                        });
                    }
                    var event = document.createEvent('Event');
                    event.initEvent('podListReaderReady', true, true);
                    document.dispatchEvent(event);
                    podListReader.success = true;
                }
            }
        }
        request.send();
    },
    removeItem: function(id)
    {
        this._objArray.splice(id, 1);
    },
    getOutlineList: function () {
        return this._objArray;
    }
}