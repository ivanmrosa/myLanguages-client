
app.components.push(function () {
    frango.component('lesson_detail_dictation').
        setPathLocalTemplate('components/lesson_detail_dictation/template/lesson_detail_dictation.html').
        objectGetData(lesson_detail_dictationComponent).
        controller(lesson_detail_dictationComponent.controller).
        register()
});
