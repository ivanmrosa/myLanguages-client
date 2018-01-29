
app.components.push(function () {
    frango.component('signup').
        setPathLocalTemplate('components/signup/template/signup.html').
        objectGetData(signupComponent).
        controller(signupComponent.controller).
        register()
});
