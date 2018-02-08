
app.components.push(function () {
    frango.component('keyboard').
        setPathLocalTemplate('components/keyboard/template/keyboard.html').
        objectGetData(keyboardComponent).
        controller(keyboardComponent.controller).
        register()
});
