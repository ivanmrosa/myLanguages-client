
app.components.push(function () {
    frango.component('games').
        setPathLocalTemplate('components/games/template/games.html').
        objectGetData(gamesComponent).
        controller(gamesComponent.controller).
        register()
});
