
app.components.push(function () {
    frango.component('topics').
        setPathLocalTemplate('components/topics/template/topics.html').
        objectGetData(topicsComponent).
        controller(topicsComponent.controller).
        register()
});
