
app.components.push(function () {
    frango.component('textSelector').
        setPathLocalTemplate('components/textSelector/template/textSelector.html').
        objectGetData(textSelectorComponent).
        controller(textSelectorComponent.controller).
        register()
});
