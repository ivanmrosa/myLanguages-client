
app.components.push(function () {
    frango.component('searchDictionary').
        setPathLocalTemplate('components/searchDictionary/template/searchDictionary.html').
        objectGetData(searchDictionaryComponent).
        controller(searchDictionaryComponent.controller).
        register()
});
