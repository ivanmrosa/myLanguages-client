
app.components.push(function () {
    frango.component('menu').
        setPathLocalTemplate('components/menu/template/menu.html').
        objectGetData(menuComponent).
        controller(menuComponent.controller).
        register()
});
