
app.components.push(function () {
    frango.component('memoryGame').
        setPathLocalTemplate('components/memoryGame/template/memoryGame.html').
        objectGetData(memoryGameComponent).
        controller(memoryGameComponent.controller).
        register()
});
