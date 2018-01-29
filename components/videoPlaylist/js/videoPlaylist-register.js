
app.components.push(function () {
    frango.component('videoPlaylist').
        setPathLocalTemplate('components/videoPlaylist/template/videoPlaylist.html').
        objectGetData(videoPlaylistComponent).
        controller(videoPlaylistComponent.controller).
        register()
});
