
app.components.push(function () {
    frango.component('userconfig').
        setPathLocalTemplate('components/userconfig/template/userconfig.html').
        objectGetData(userconfigComponent).
        controller(userconfigComponent.controller).
        register()
});
