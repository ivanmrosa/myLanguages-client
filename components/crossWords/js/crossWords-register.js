
app.components.push(function () {
    frango.component('crossWords').
        setPathLocalTemplate('components/crossWords/template/crossWords.html').
        objectGetData(crossWordsComponent).
        controller(crossWordsComponent.controller).
        register()
});
