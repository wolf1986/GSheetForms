var MyPlatform = {
    FileCreateWrite: function(path, str_contents) {
        var dfd = jQuery.Deferred();

        function fail(error) {
            dfd.reject(error);
        }

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

        function gotFS(fileSystem) {
            fileSystem.root.getFile(path, {create: true, exclusive: false}, gotFileEntry, fail);
        }

        function gotFileEntry(fileEntry) {
            fileEntry.createWriter(gotFileWriter, fail);
        }

        function gotFileWriter(writer) {
            writer.onwriteend = function(evt) {
                writer.truncate(str_contents.length);
                dfd.resolve('success')
            };

            writer.write(str_contents);
        }

        return dfd.promise()
    }
};

$.holdReady(true);
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady() {
    $.holdReady(false);
    console.log('onDeviceReady() fired!');
}

//onDeviceReady();