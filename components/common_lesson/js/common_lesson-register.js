
app.components.push(function () {
    frango.component('common_lesson').
        setPathLocalTemplate('components/common_lesson/template/common_lesson.html').
        objectGetData(common_lessonComponent).
        controller(common_lessonComponent.controller).
        register()
});
