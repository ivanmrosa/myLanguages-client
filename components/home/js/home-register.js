
app.components.push(function () {
    frango.component('home').
        setPathLocalTemplate('components/home/template/home.html').
        objectGetData(homeComponent).
        controller(homeComponent.controller).
        register()
});
