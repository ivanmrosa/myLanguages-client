
app.components.push(function () {
    frango.component('resumed_lesson').
        setPathLocalTemplate('components/resumed_lesson/template/resumed_lesson.html').
        objectGetData(resumed_lessonComponent).
        controller(resumed_lessonComponent.controller).
        register()
});
