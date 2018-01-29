
app.components.push(function () {
    frango.component('training_player').
        setPathLocalTemplate('components/training_player/template/training_player.html').
        objectGetData(training_playerComponent).
        controller(training_playerComponent.controller).
        register()
});
