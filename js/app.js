/*global objects - do not remove */
appSelector = "#app";
app = {}
app.components = []


frango.app.handleChangingRoute(function () {
    var url = frango.app.getURL();
    if (url != 'login' && url != 'signup') {
        return loginComponent.checkUserIsLogged();
    }
});

frango.app.initialize(function () {
    /*do things on initialize application*/
    var warning = frango.warning.clone();
    frango.warning = function (msg, callback, toast) {
        if (toast == undefined || toast == null) {
            toast = true;
        };
        if (toast) {
            Materialize.toast(msg, 3000, '', callback);
        } else {
            warning(msg, callback);
        };
    };
});

frango.app.afterInitialize(function () {
    /*do things after initialize application*/
    textSelectorComponent.getInstance('mainTextSelector', function (instance) {

    });

    frango.find(document).on('backbutton', function () {
        var modalOpened = false;
        var matModal = $('.modal.open');
        if (matModal.length > 0) {
            modalOpened = true;
            matModal.each(function () {
                $(this).modal('close');
            });
        };
        if (frango.find('.popup.popup-show').elements.length > 0) {
            modalOpened = true;
            frango.popup.closePopup('.popup.popup-show');
        };
        if (!modalOpened) {
            if (frango.app.getURL() == "") {
                navigator.app.exitApp();
            } else {
                window.history.back();
            };
        };
    });


});

function onDeviceReady() {
    // Now safe to use device APIs
    if (cordova) {
        window.open = cordova.InAppBrowser.open;
    };
}

document.addEventListener("deviceready", onDeviceReady, false);