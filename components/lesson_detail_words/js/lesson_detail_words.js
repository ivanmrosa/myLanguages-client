
lesson_detail_wordsComponent = {
    getLessonWords: function (methodSendTo, componentElement) {
        var params = frango.app.getURLParameters()
        frango.server.get('lesson-word/', params).
            onSuccess(function (data) {
                methodSendTo(JSON.parse(data));
            }).
            onFailure(function (msg) {
                if(componentElement){
                    frango.wait.stop(componentElement);
                };                
                var erro = JSON.parse(msg);
                alert(erro["error_description"]);                
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
