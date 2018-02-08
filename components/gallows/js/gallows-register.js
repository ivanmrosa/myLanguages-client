
app.components.push(function () {
    frango.component('gallows').
        setPathLocalTemplate('components/gallows/template/gallows.html').
        objectGetData(gallowsComponent).
        controller(gallowsComponent.controller).
        register()
});
