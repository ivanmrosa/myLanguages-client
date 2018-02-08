
lesson_detailComponent = {
    getData: function () {

    },

    controller: function (component) {
        var loadMedia = function () {
            /*frango.find('#tab-media').on('click', function () {
                var element = frango.find(this).first();
                var loaded = element.attr('data-loaded');
                if (loaded == "true") {
                    return;
                };*/
                var params = frango.app.getURLParameters();
                params["media_type"] = 'V';
                //frango.wait.start();
                frango.ajaxGet({
                    url: 'lesson-media/',
                    data : params,
                    onSuccess: function (videos) {
                        videos = JSON.parse(videos);
                        videoPlaylistComponent.getInstance('videoPlaylistLesson',
                            videos,
                            function (instance) {
                                var playListVideo = instance;
                                //element.attr('data-loaded', "true");
                                //frango.wait.stop();
                            });
                    },
                    onFailure: function (err) {
                        //frango.wait.stop();
                        frango.warnig(err);
                    }
                });            
            //});
        };

        component.bindData([], true, function () {
            frango.tab('.page-control-lesson', true);
            //$('ul.tabs').tabs();                
            /*$(document).ready(function () {
                
            });*/
            loadMedia();


        });
    }
}
