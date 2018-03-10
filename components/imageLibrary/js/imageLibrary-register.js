
app.components.push(function () {
    frango.component('imageLibrary').
        setPathLocalTemplate('components/imageLibrary/template/imageLibrary.html').
        objectGetData(imageLibraryComponent).
        controller(imageLibraryComponent.controller).
        register()
});
