
app.components.push(function () {
    frango.component('lesson').
        setPathLocalTemplate('components/lesson/template/lesson.html').
        objectGetData(lessonComponent).
        controller(lessonComponent.controller).
        register()
});
