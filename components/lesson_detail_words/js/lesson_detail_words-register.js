
app.components.push(function () {
    frango.component('lesson_detail_words').
        setPathLocalTemplate('components/lesson_detail_words/template/lesson_detail_words.html').
        objectGetData(lesson_detail_wordsComponent).
        controller(lesson_detail_wordsComponent.controller).
        register()
});
