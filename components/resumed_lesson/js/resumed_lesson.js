
resumed_lessonComponent = {
    getData: function () {

    },
    controller: function (component) {
        frango.wait.start();
        /*get user's actual lesson*/
        var username = common_lessonComponent.getUsername();
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
        });

    },

    bindLesson: function (lesson_id, score, language_name, component) {
        componentEle = frango.find(component.selector_to_bind).first();
        frango.wait.start(componentEle);
        frango.ajaxGet({
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
                frango.wait.stop(componentEle);
                component.bindData({ "lesson": [lesson] });
            },
            onFailure: function (erro) {
                frango.wait.stop(componentEle);
                alert(erro)
            }
        });

    }
}
