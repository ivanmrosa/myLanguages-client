
app.components.push(function () {
    frango.component('dictionary').
        setPathLocalTemplate('components/dictionary/template/dictionary.html').
        objectGetData(dictionaryComponent).
        controller(dictionaryComponent.controller).
        register()
});
