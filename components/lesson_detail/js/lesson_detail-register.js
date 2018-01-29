
app.components.push(function () {
    frango.component('lesson_detail').
        setPathLocalTemplate('components/lesson_detail/template/lesson_detail.html').
        objectGetData(lesson_detailComponent).
        controller(lesson_detailComponent.controller).
        register()
});
