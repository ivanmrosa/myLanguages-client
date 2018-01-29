
app.components.push(function () {
    frango.component('speech').
        setPathLocalTemplate('components/speech/template/speech.html').
        objectGetData(speechComponent).
        controller(speechComponent.controller).
        register()
});
