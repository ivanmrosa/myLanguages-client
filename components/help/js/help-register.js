
app.components.push(function () {
    frango.component('help').
        setPathLocalTemplate('components/help/template/help.html').
        objectGetData(helpComponent).
        controller(helpComponent.controller).
        register()
});
