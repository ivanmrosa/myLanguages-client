/*global objects - do not remove */
appSelector = "#app";
app = {}
app.components = []


frango.app.handleChangingRoute(function(){
   var url =  frango.app.getURL();
   if ( url != 'login' && url != 'signup'){
      return loginComponent.checkUserIsLogged();
   }   
});

frango.app.initialize(function () {
    /*do things on initialize application*/
    var warning = frango.warning.clone();
    frango.warning = function(msg, callback, toast){
        if(toast == undefined || toast == null){
            toast = true;
        };
        if(toast){
            Materialize.toast(msg, 3000, '', callback);
        }else{
           warning(msg, callback);
        };        
    };
});

frango.app.afterInitialize(function () {
    /*do things after initialize application*/
    textSelectorComponent.getInstance('mainTextSelector', function(instance){
        
    });
});

function onDeviceReady() {
    // Now safe to use device APIs
    if(cordova){
        window.open = cordova.InAppBrowser.open;
    };
}

document.addEventListener("deviceready", onDeviceReady, false);