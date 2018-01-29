
app.components.push(function () {
    frango.component('login').
        setPathLocalTemplate('components/login/template/login.html').
        objectGetData(loginComponent).
        controller(loginComponent.controller).
        register()
});
