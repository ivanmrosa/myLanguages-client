
app.components.push(function () {
    frango.component('list_images').
        setPathLocalTemplate('components/list_images/template/list_images.html').
        objectGetData(list_imagesComponent).
        controller(list_imagesComponent.controller).
        register()
});
