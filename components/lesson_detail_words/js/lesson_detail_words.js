
lesson_detail_wordsComponent = {
    getLessonWords: function (methodSendTo, componentElement) {
        var params = frango.app.getURLParameters();
        var actualWords = frango.getCookie('mylanguage-actual-words');

        if(actualWords != "" ){
            actualWords = JSON.parse(actualWords);
            if(actualWords[0].lesson_id == params.lesson_id){
                methodSendTo(actualWords);
                return;
            };
        };

        frango.server.get('lesson-word/', params).
            onSuccess(function (data) {
                frango.setCookie('mylanguage-actual-words', data);
                methodSendTo(JSON.parse(data));
            }).
            onFailure(function (msg) {
                if(componentElement){
                    frango.wait.stop(componentElement);
                };                
                var erro = JSON.parse(msg);
                frango.warning(erro["error_description"]);                
            });
    },
        
    
    controller: function (component) {
        componentElement = frango.find(component.selector_to_bind).first();
        frango.wait.start(componentElement);
        component.objectGetData.getLessonWords(function (data, componentElement) {            
            var onFinish = function () {                
                dictionaryComponent.getInstance('dictionaryLessonDetailWords', function(instance){
                  instance.showDictionary(data, true);
                });
            };
            component.bindData([], true, onFinish);
        });
    },
}
