/// <reference path="fileSystem.js" />
/// <reference path="index.js" />
/// <reference path="media.js" />
/// <reference path="podlistReader.js" />
/// <reference path="rssReader.js" />
/// <reference path="view.js" />
/// <reference path="../../plugins/org.apache.cordova.file/www/requestFileSystem.js"

/// <reference path="../../plugins/org.apache.cordova.file/www/resolveLocalFileSystemURL.js"
/// <reference path="../../plugins/org.apache.cordova.file/www/Entry.js"
/// <reference path="../../plugins/org.apache.cordova.file/www/DirectoryReader.js"

/// <reference path="../../plugins/org.apache.cordova.file/www/FileEntry.js"
/// <reference path="../../plugins/org.apache.cordova.file/www/FileSystem.js"
/// <reference path="../../plugins/org.apache.cordova.file/www/FileReader.js"
/// <reference path="../../plugins/org.apache.cordova.file/www/File.js"
/// <reference path="../../plugins/org.apache.cordova.file/www/FileError.js"
/// <reference path="../../plugins/org.apache.cordova.file-transfer/www/FileTransfer.js"
/// <reference path="../../plugins/org.apache.cordova.file-transfer/www/FileTransferError.js"

/**
 * RJ TW
 */
var fileSys =
{
    fileEntry: null,
    _dataDir: null,
    _fs: null,
    _folders: null,
    _count: null,
    init: function ()
    {
        this._count = 0;
        this._fileTransfers = [];
        var pod_id = 1;
        console.log("fileSys init");
        this._folders = [];
        //com.algonquin.mad9135.assign2
        this._dataDir = cordova.file.dataDirectory;
        if (window.resolveLocalFileSystemURL)
        {
            window.resolveLocalFileSystemURL(this._dataDir, function (entry) {
                //entry = new Entry();
                if (entry.isDirectory)
                {
                    // create a directory reader
                    var reader = entry.createReader();
                    //reader = new DirectoryReader()
                    reader.readEntries(function (entries)
                    {
                        var i;
                        for (i = 0; i < entries.length; i++)
                        {
                            var entry = entries[i];
                            if (entry.isDirectory)
                            {
                                var channelFolder = entry.createReader();
                                var folderName = entry.name;
                                console.log("folderName: " + folderName);
                                channelFolder.readEntries(function (podCastFiles)
                                {
                                    fileSys._count++;
                                    console.log("COUNT[" + fileSys._count + "] podCastFiles.length:" + podCastFiles.length);
                                    if (podCastFiles.length)
                                    {
                                        var files = [];
                                        var str;
                                        for (var j = 0; j < podCastFiles.length; j++)
                                        {
                                            var podCastFile = podCastFiles[j];
                                            console.log("     FILE:" + podCastFile.name + " " + podCastFile.nativeURL);
                                            files.push({ id: pod_id++, name: podCastFile.name, url: encodeURI(podCastFile.nativeURL) });
                                            str = podCastFile.nativeURL;
                                        }
                                        //Get Folder name Hack
                                        var path = str.substring(0, str.lastIndexOf('/'));
                                        console.log("path: " + path);
                                        var folder = path.substring(path.lastIndexOf('/') + 1);
                                        console.log("folder: " + folder);
                                        fileSys._folders.push({folderPath: path, folderName: folder, files: files });
                                        console.log("FOLDER FULL");
                                        console.log("entries.length[" + entries.length + "] => I counted[" + fileSys._count + "]");
                                        if (entries.length == fileSys._count)
                                        {
                                            console.log("FINISHED");
                                            var event = document.createEvent('Event');
                                            event.initEvent('FolderListComplete', true, true);
                                            document.dispatchEvent(event);
                                        }
                                    }
                                    else
                                    {
                                        console.log("FOLDER EMPTY");
                                        console.log("entries.length[" + entries.length + "] => I counted[" + fileSys._count + "]");
                                        if (entries.length == fileSys._count) {
                                            console.log("FINISHED");
                                            var event = document.createEvent('Event');
                                            event.initEvent('FolderListComplete', true, true);
                                            document.dispatchEvent(event);
                                        }
                                    }
                                },fileSys.errorHandler); 
                            }
                            else
                            {
                                fileSys._count++;
                                console.log("COUNT[" + fileSys._count + "] at file:" + entry.name + " in Root folder");
                            }
                        }
                    }, fileSys.errorHandler);
                }
                else
                {
                    //fileSys._count++;
                    console.log("COUNT[" + fileSys._count + "] at file entry name:" + entry.name);
                }
            },fileSys.errorHandler);
        }
    },
    errorHandler: function (e)
    {
        console.log(fileSys.fileErrorToString(e.code));
    },
    fileErrorToString: function (code)
    {
        var msg = '';
        switch (e.code)
        {
            case FileError.ABORT_ERR:
                msg = 'DOMException ABORT_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'DOMException NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'DOMException SECURITY_ERR';
                break;
            case FileError.NOT_READABLE_ERR:
                msg = 'NOT_READABLE_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.NO_MODIFICATION_ALLOWED_ERR:
                msg = 'NO_MODIFICATION_ALLOWED_ERR';
                break;
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.ENCODING_ERR:
                msg = 'ENCODING_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            case FileError.SYNTAX_ERR:
                msg = 'SYNTAX_ERR';
                break;
            case FileError.TYPE_MISMATCH_ERR:
                msg = 'TYPE_MISMATCH_ERR';
                break;
            case FileError.PATH_EXISTS_ERR:
                msg = 'PATH_EXISTS_ERR';
                break;
            default:
                msg = 'UNKNOWN';
                break;
        };
        return msg;
    },
    fileTransferErrorToString: function(code)
    {
        var msg = '';
        switch (code)
        {
            case FileTransferError.ABORT_ERR:
                msg = "ABORT ERR";
                break;
            case FileTransferError.CONNECTION_ERR:
                msg = "CONNECTION_ERR";
                break;
            case FileTransferError.FILE_NOT_FOUND_ERR:
                msg = "FILE_NOT_FOUND_ERR";
                break;
            case FileTransferError.INVALID_URL_ERR:
                msg = "INVALID_URL_ERR";
                break;
            case FileTransferError.NOT_MODIFIED_ERR:
                msg = "NOT_MODIFIED_ERR";
                break;
            default:
                msg = "UNKNOWN";
                break;
        }
        return msg;
    },
    savePodCast: function (folderName, safeName, url, title)
    {
        //Save Podcast
        var fileURL = this._dataDir + folderName + "/" + safeName + ".mp3";
        console.log("Save Podcast: " + fileURL);
        var fileTransfer = new FileTransfer();
        //create a unique id to keep track of progress
        var id = new Date().getTime();
        view.addProgressBar(id);
        fileTransfer.onprogress = function (progressEvent) {
            var percent = null;
            if (progressEvent.lengthComputable) {
                percent = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            }
            view.updateProgressBar(id, percent, title);
        };
        var uri = encodeURI(url);
        fileTransfer.download(uri, fileURL, function (entry) {
            console.log("download complete: " + entry.toURL());
            var event = document.createEvent('Event');
            event.initEvent('podcastDownloadComplete', true, true);
            document.dispatchEvent(event);
            view.progressComplete(id);
        }, function (error) {
            console.log("Download error " +  fileSys.fileTransferErrorToString(error));
        }, false); //, { headers: { "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA==" } });
    },
    saveImage: function (folderName, image_url)
    {
        console.log("Download:" + image_url);
        var ext = /[^.]+$/.exec(image_url);
        console.log("File extension[" + ext + "]");

        var imgURL = this._dataDir + folderName + "/image." + ext;
        window.resolveLocalFileSystemURL(imgURL, function (entry)
        {
            console.log("Image File: " + entry.nativeURL + " already EXISTS");
        }, function (error) {
            console.log("Saving File: " + imgURL);
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(image_url);
            fileTransfer.download(uri, imgURL, function (entry) {
                console.log("Image download complete: " + entry.toURL());
            }, function (error) {
                console.log("Download error " + fileSys.fileTransferErrorToString(error));
            }, false);
        });
    },
    deletePodcast: function(url)
    {
        window.resolveLocalFileSystemURL(url, function (entry)
        {
            if (entry.isFile)
            {
                if(confirm("DELETE podcast: " + entry.name))
                {
                    entry.remove(function(){
                        var event = document.createEvent('Event');
                        event.initEvent('podCastDeleted', true, true);
                        document.dispatchEvent(event);
                    }, function (e) {
                        alert(fileSys.fileErrorToString(e.code));
                    });
                }
            }else
            {
                if (confirm("DELETE channel: " + entry.name)) {
                    entry.remove(function () {
                        var event = document.createEvent('Event');
                        event.initEvent('podCastDeleted', true, true);
                        document.dispatchEvent(event);
                    }, function (e) {
                        alert(fileSys.fileErrorToString(e.code));
                    });
                }
            }
        }, function (e) {
            if (e)
            {
                alert(fileSys.fileErrorToString(e.code));
            }
            else {
                alert("UNKNOWN ERROR cordova filesytem error object does not exist");
            }
        });
    },
    getFileEntry: function()
    {
        return this.fileEntry;
    },
    getFolders: function()
    {
        return this._folders;
    },
    getDataDir: function()
    {
        return this._dataDir;
    }

}