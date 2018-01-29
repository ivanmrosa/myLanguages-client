
app.components.push(function () {
    frango.component('list_word_images').
        setPathLocalTemplate('components/list_word_images/template/list_word_images.html').
        objectGetData(list_word_imagesComponent).
        controller(list_word_imagesComponent.controller).
        register()
});
