
common_lessonComponent = {
    getData: function () {

    },
    controller: function (component) {
        //component.bindData();
    },
    getUsername: function () {
        return JSON.parse(frango.getCookie('mylanguage-username'))['username'];
    },

    getUserLearning: function (methodToSendData) {
        frango.ajaxGet({
            url: 'user-learning-language/',
            data: { "user__username": common_lessonComponent.getUsername() },
            onSuccess: function (userLearnig) {
                userLearnig = JSON.parse(userLearnig)[0];
                /*save the new score*/
                methodToSendData(userLearnig);
            },
            onFailure(error) {
                alert(error);
            }

        });
    },


    incrementUserScore: function (newScore) {
        ///user-learning-language/
        var doPost = function (updatedData) {
            var id = updatedData["id"];
            updatedData.score = newScore + updatedData.score;

            frango.ajaxPut({
                url: 'user-learning-language/' + id.toString() + '/',
                data: updatedData,
                onFailure: function (error) {
                    //alert(error);
                    document.write(error);
                    document.close();
                }
            });
        };

        common_lessonComponent.getUserLearning(doPost)
    },

    goToNextLesson: function () {
        var doPost = function (updatedData) {
            var id = updatedData["id"];
            var newSequence = updatedData["lesson_sequence"] + 1;

            frango.ajaxGet({
                url: 'lesson/',
                data: { 'sequence': newSequence },
                onSuccess: function (lesson) {
                    lesson = JSON.parse(lesson)[0];
                    var lesson_id = lesson.id;

                    updatedData.score = 0;
                    updatedData.actual_lesson = frango.server.host_url + 'lesson/' +  lesson_id + '/';
                    frango.ajaxPut({
                        url: 'user-learning-language/' + id.toString() + '/',
                        data: updatedData,
                        onSuccess: function(){                            
                          frango.app.navigate('#lesson/detail/?lesson_id=' + lesson_id);
                        },
                        onFailure: function (error) {
                            //alert(error);
                            document.write(error);
                            document.close();
                        }
                    });                    
                }
            });


        };

        common_lessonComponent.getUserLearning(doPost);
    }

}
