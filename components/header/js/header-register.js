
app.components.push(function () {
    frango.component('header').
        setPathLocalTemplate('components/header/template/header.html').
        objectGetData(headerComponent).
        controller(headerComponent.controller).
        register()
});
