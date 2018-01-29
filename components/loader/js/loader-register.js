
app.components.push(function () {
    frango.component('loader').
        setPathLocalTemplate('components/loader/template/loader.html').
        objectGetData(loaderComponent).
        controller(loaderComponent.controller).
        register()
});
