
resumed_lessonComponent = {
    getData: function () {

    },
    controller: function (component) {
        
        resumed_lessonComponent.bindLesson(component);

    },

    bindLesson: function (component) {        
        //frango.wait.start();
        common_lessonComponent.getActualLesson(function(lesson){
            component.bindData({ "lesson": [lesson]});            
        });
    }
}
