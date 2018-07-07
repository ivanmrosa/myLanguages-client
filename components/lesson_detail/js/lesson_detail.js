
lesson_detailComponent = {
    getData: function () {

    },

    controller: function (component) {
        var loadMedia = function () {
            var params = frango.app.getURLParameters();
            params["media_type"] = 'V';
            //frango.wait.start();
            frango.ajaxGet({
                url: 'lesson-media/',
                data: params,
                onSuccess: function (videos) {
                    videos = JSON.parse(videos);
                    videoPlaylistComponent.getInstance('videoPlaylistLesson',
                        videos,
                        function (instance) {
                            var playListVideo = instance;
                        });
                },
                onFailure: function (err) {
                    frango.warnig(err);
                }
            });

        };

        component.bindData([], true, function () {
            frango.tab('.page-control-lesson', true);
            lesson_detail_dictationComponent.hideKeyBoard() ;
            frango.find('.page-control-lesson').on('changeTab', function(){
                var ele = frango.find('[data-body="dictation"]').first();
                if(ele){
                    if (frango.hasClass('active', ele)){
                        lesson_detail_dictationComponent.showKeyBoard() ;
                    }else{
                        lesson_detail_dictationComponent.hideKeyBoard() ;
                    };    
                }
            });
            loadMedia();
        });
    }
}
