
common_lessonComponent = {
    getData: function () {

    },
    checkErrorStatus : function(status){
       if(status == 401){
           loginComponent.logout();
       };
    },
    controller: function (component) {
        //component.bindData();
    },
    getUsername: function () {
        return  frango.getCookie('un'); //JSON.parse(frango.getCookie('mylanguage-username'))['username'];
    },

    getUserLearning: function (methodToSendData) {
        var localUserLearning = frango.getCookie('mylanguage-user-learning');
        if(localUserLearning == "" || localUserLearning == undefined || localUserLearning == null){ 
            frango.ajaxGet({
                url: 'user-learning-language/',
                data: { "user__username": common_lessonComponent.getUsername() },
                onSuccess: function (userLearnig) {
                    
                    userLearnig = JSON.parse(userLearnig)[0];
                    frango.setCookie('mylanguage-user-learning', JSON.stringify(userLearnig));
                    /*save the new score*/                    
                    methodToSendData(userLearnig);

                },
                onFailure(error, status) {                                     
                    frango.warning(error);
                    frango.wait.stop();
                    common_lessonComponent.checkErrorStatus(status);
                }
            });
    
        }else{
          methodToSendData(JSON.parse(localUserLearning)); 
        };
    },

    setLastAccess : function(){
        var doPost = function (updatedData) {
            return
            var id = updatedData["id"];
            
            updatedData.last_access = frango.currentDate(false);

            frango.ajaxPut({
                url: 'user-learning-language/' + id.toString() + '/',
                data: updatedData,
                onSuccess: function(){
                   frango.setCookie('mylanguage-user-learning', JSON.stringify(updatedData));
                },
                onFailure: function (error, status) {
                    frango.wait.stop();                                    
                    console.log(error);
                    common_lessonComponent.checkErrorStatus(status);
                }
            });
        };
        try {
            common_lessonComponent.getUserLearning(doPost);
        } catch (error) {
            console.log(error);
        };        
    },

    incrementUserScore: function (newScore) {
        ///user-learning-language/
        var doPost = function (updatedData) {
            var id = updatedData["id"];
            updatedData.score = newScore + updatedData.score;

            frango.ajaxPut({
                url: 'user-learning-language/' + id.toString() + '/',
                data: updatedData,
                onSuccess: function(){
                   frango.setCookie('mylanguage-user-learning', JSON.stringify(updatedData));
                },
                onFailure: function (error, status) {
                    frango.wait.stop();                                    
                    console.log(error);  
                    common_lessonComponent.checkErrorStatus(status);
                }
            });
        };

        common_lessonComponent.getUserLearning(doPost)
    },

    goToLesson: function (lessonSequence) {
        frango.wait.start();
        var doPost = function (updatedData) {
            var id = updatedData["id"];
            if (lessonSequence){
                var newSequence = lessonSequence;
            }else{
                var newSequence = updatedData["lesson_sequence"] + 1;
            };
            
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
                           frango.setCookie('mylanguage-user-learning', '', -1);
                           frango.setCookie('mylanguage-actual-lesson', '', -1);
                           frango.setCookie('mylanguage-actual-words', '', -1);
                           frango.wait.stop();
                           frango.app.navigate('#lesson/detail/?lesson_id=' + lesson_id);                           
                        },
                        onFailure: function (error, status) {                            
                            frango.wait.stop();                                    
                            console.log(error);
                            alert(error)
                            common_lessonComponent.checkErrorStatus(status);                            
                        }
                    });                    
                }
            });
        };   

        common_lessonComponent.getUserLearning(doPost);
    },

    getActualLesson : function(methodToSendData){
        frango.wait.start();
        
        common_lessonComponent.getUserLearning(function(userLearnig){
            var lesson_id = userLearnig['actual_lesson_id'];
            var score = userLearnig['score'];
            var language_name = userLearnig['language_name'];
            
            var getLesson = function(lesson){
                frango.wait.stop();
                lesson["score"] = score;
                lesson["language_name"] = language_name;
    
                if (score >= 70) {
                    lesson["aproved"] = "true";
                } else {
                    lesson["aproved"] = "false";
                };

                methodToSendData(lesson);                             
            };

            var actualLesson = frango.getCookie('mylanguage-actual-lesson');

            if(actualLesson != ""){
                actualLesson = JSON.parse(actualLesson);
                getLesson(actualLesson);
            }else{
                frango.ajaxGet({
                    url: 'lesson/',
                    data: { "id": lesson_id },
                    onSuccess: function (lesson) {  
                        lesson = JSON.parse(lesson)[0];                                              
                        frango.setCookie('mylanguage-actual-lesson', JSON.stringify(lesson));
                        getLesson(lesson);
                    },
                    onFailure: function (erro, status) {
                        frango.wait.stop();
                        frango.warning(erro);
                        common_lessonComponent.checkErrorStatus(status);
                    }
                });                
            };            
        });

    }

}
