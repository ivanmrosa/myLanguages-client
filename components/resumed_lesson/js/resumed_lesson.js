
resumed_lessonComponent = {
    getData: function () {

    },
    controller: function (component) {
        
        /*get user's actual lesson*/
        /*var username = common_lessonComponent.getUsername();
        frango.ajaxGet({
            url: 'user-learning-language/',
            data: { "user__username": username },
            onSuccess: function (data) {
                frango.wait.stop();
                data = JSON.parse(data)[0];
                var lesson_id = data['actual_lesson_id']
                var score = data['score']
                var language_name = data['language_name']
                resumed_lessonComponent.bindLesson(lesson_id, score, language_name, component);
            },
        });*/
        //frango.wait.start();
        /*common_lessonComponent.getUserLearning(function(data){
            frango.wait.stop();
            var lesson_id = data['actual_lesson_id']
            var score = data['score']
            var language_name = data['language_name']
            resumed_lessonComponent.bindLesson(lesson_id, score, language_name, component);
        });*/
        resumed_lessonComponent.bindLesson(component);

    },

    bindLesson: function (component) {        
        //frango.wait.start();
        common_lessonComponent.getActualLesson(function(lesson){
            /*lesson["score"] = score;
            lesson["language_name"] = language_name;

            if (score >= 70) {
                lesson["aproved"] = "true";
            } else {
                lesson["aproved"] = "false";
            };
            frango.wait.stop();*/
            component.bindData({ "lesson": [lesson]});
        });
        /*frango.ajaxGet({
            'url': 'lesson/',
            data: { "id": lesson_id },
            onSuccess: function (lesson) {
                lesson = JSON.parse(lesson)[0];
                lesson["score"] = score;
                lesson["language_name"] = language_name;

                if (score >= 70) {
                    lesson["aproved"] = "true";
                } else {
                    lesson["aproved"] = "false";
                };
                frango.wait.stop();
                component.bindData({ "lesson": [lesson] });
            },
            onFailure: function (erro) {
                frango.wait.stop();
                frango.warning(erro);
            }
        });*/



    }
}
