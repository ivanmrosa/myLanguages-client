
function keyboardClass(instanceId) {
    //use htmlComponent.find() to access the child elements  
    var htmlComponent = frango.find('#' + instanceId);
    var thisObject = this;
    var keysFirstLine = [];
    var keysSecondLine = [];
    var keysThirdLine = [];
    var keysFourthLine = [];
    var disabledKeys = []
    var onKeyPress = undefined;

    /*write the component functionalites here*/

    var setNormalKeys = function(){
        keysFirstLine = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
        keysSecondLine = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
        keysThirdLine = ['z', 'x', 'c', 'v', 'b', 'n', 'm']    
    };

    var setSpecialCharactersKeys = function(){
        keysFirstLine = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        keysSecondLine = ['@', '#', '$', '_', '&', '-', '+', '(', ')', '/'];
        keysThirdLine = [ '*', '"', "'", ':', ';', '!', '?', '\\']      
    };

    var getKeyHtml = function (key) {
        return frango.format('<div class="center-align cur-pointer keyboard-key" data-key="%s">%s</div>', 
          [key, key]);
    };

    var addFourthLinhe = function(useNormal){
        var fourthLine = htmlComponent.find('.fourth-line'); 
        fourthLine.first().innerHTML = "";
        fourthLine.first().insertAdjacentHTML('beforeend', '<div class="center-align cur-pointer caps-lock special keyboard-key data-key=""> '+
          '<i class="mdi mdi-apple-keyboard-caps"></i></div>');        
        fourthLine.first().insertAdjacentHTML('beforeend', getKeyHtml(','));
        fourthLine.first().insertAdjacentHTML('beforeend', getKeyHtml('.'));
        fourthLine.first().insertAdjacentHTML('beforeend', '<div class="center-align cur-pointer keyboard-key special special-character" data-key="">?123</div>');
        fourthLine.first().insertAdjacentHTML('beforeend', '<div class="center-align cur-pointer keyboard-key special space" data-key=" ">&nbsp</div>');
        //fourthLine.first().insertAdjacentHTML('beforeend', '<div class="center-align cur-pointer keyboard-key special" data-key="#8"><i class="mdi mdi-keyboard-backspace"></i></div>');
        fourthLine.first().insertAdjacentHTML('beforeend', '<div class="center-align cur-pointer keyboard-key special enter" data-key="#13">Enter</div>');        
        

        fourthLine.find('.caps-lock').on('click', function(){
           var caps = frango.find(this);
           var pressed = caps.attr('data-pressed');
           htmlComponent.find('.keyboard-key:not(.special)').loop(function(){
               var key = this; 
               if (pressed == "yes") {
                   key.innerHTML = key.innerHTML.toLowerCase();                   
                   caps.attr('data-pressed', "no");
               }else{
                   key.innerHTML = key.innerHTML.toUpperCase();
                   caps.attr('data-pressed', "yes");
               };
               key.attr('data-key', key.innerHTML);
           });
        });

        fourthLine.find('.special-character').on('click', function(){
            if(useNormal){
                setSpecialCharactersKeys();
                drawKeys(false);                
            }else{
               setNormalKeys();
               drawKeys(true);               
            };            
        });
    };

    var drawKeys = function (useNormal) {   
        
        if(useNormal == undefined || useNormal == null ){
            useNormal = true;
        };
        useNormal?htmlComponent.rmCl('special-character-active'):htmlComponent.adCl('special-character-active');  

        var firstLine = htmlComponent.find('.first-line');
        firstLine.first().innerHTML = "";
        for (var index = 0; index < keysFirstLine.length; index++) {
            var key = keysFirstLine[index];
            firstLine.first().insertAdjacentHTML('beforeend', getKeyHtml(key));
        };

        var secondLine = htmlComponent.find('.second-line');
        secondLine.first().innerHTML = "";
        for (var index = 0; index < keysSecondLine.length; index++) {
            var key = keysSecondLine[index];
            secondLine.first().insertAdjacentHTML('beforeend', getKeyHtml(key));
        };
        var thirdLine = htmlComponent.find('.third-line');
        thirdLine.first().innerHTML = "";
        for (var index = 0; index < keysThirdLine.length; index++) {
            var key = keysThirdLine[index];
            thirdLine.first().insertAdjacentHTML('beforeend', getKeyHtml(key));
        };

        /*backspace */
        thirdLine.first().insertAdjacentHTML('beforeend', '<div class="center-align backspace cur-pointer keyboard-key special" data-key="#8"><i class="mdi mdi-keyboard-backspace"></i></div>');

        addFourthLinhe(useNormal);

        htmlComponent.find('.keyboard-key').on('click', function () {
            if (onKeyPress) {
                if(this.attr('data-disabled') != "yes" && this.attr('data-key')){
                    onKeyPress(this.attr('data-key'));
                };                   
            } else {
                frango.warning('onKeyPress event not provied');
            };
        });
        thisObject.enableAllKeys();
        thisObject.disableKeys();

    };

    this.setTextOnPainel  = function(text){
       htmlComponent.find('.top-bar .aditional-content').html(text);
    };


    this.disableKey = function(key, permanent){
       if(permanent == undefined || permanent == null){
           permanent = true;
       };
       var ele = htmlComponent.find(frango.format('[data-key="%s"]', [key]));
       ele.attr('data-disabled', "yes");
       ele.rmCl('enabled');
       ele.adCl('disabled');
       if(permanent){
           disabledKeys.push(key);
       };
    };

    this.enableKey = function(key){
        var ele = htmlComponent.find(frango.format('[data-key="%s"]', [key]));
        ele.attr('data-disabled', "no");
        ele.rmCl('disabled');
        ele.adCl('enabled'); 
        var idx = disabledKeys.indexOf(key);
        if(idx > -1){
            disabledKeys.splice(idx, 1);
        };
    };

    this.enableAllKeys = function(){
        htmlComponent.find('.keyboard-key').loop(function(){
            thisObject.enableKey(this.attr('data-key'));
        });
    };

    this.disableAllKeys = function(){
        htmlComponent.find('.keyboard-key').loop(function(){
            thisObject.disableKey(this.attr('data-key'));
        });        
    };

    this.disableKeys = function(){
        for (var index = 0; index < disabledKeys.length; index++) {
            thisObject.disableKey(disabledKeys[index], false);            
        };
    };

    this.setDisabledKeys = function(keys){
       disabledKeys = keys;
    };
     
    this.setOnKeyPress = function (keyPressEvent) {
        onKeyPress = keyPressEvent;
    };

    this.hide = function(){
      htmlComponent.adCl('hide');
    };
 
    this.show = function(){
        htmlComponent.rmCl('hide');
    };
    
    this.minimizeOrMaximize = function(){
        var body = htmlComponent.find('.body-keyboard');
        var minimizeEle = htmlComponent.find('.minimize-keyboard');
        if (frango.hasClass('hide', body.first())){
           body.rmCl('hide')
           minimizeEle.adCl('mdi-keyboard-close');
           minimizeEle.rmCl('mdi-keyboard');
        }else{
           body.adCl('hide');
           minimizeEle.rmCl('mdi-keyboard-close');
           minimizeEle.adCl('mdi-keyboard');
        };
    };
    var configureMinimizeKeyboard = function() {
       htmlComponent.find('.minimize-keyboard').on('click', thisObject.minimizeOrMaximize);
    };
    
    var configurePaddingBody = function(){
        var interval = setInterval(function(){
            var body = frango.find('.keyboard-padding');
            if(body.elements.length ==0){
               frango.find('#app').addHTMLBeforeEnd('<div class="keyboard-padding"></div>');
               body = frango.find('.keyboard-padding');
            };
            if (frango.find('.keyBoardComponent').elements.length > 0){
                if (frango.find('.body-keyboard').hasClass('hide')){
                   body.adCl('keyboard-bottom-panel');
                   body.rmCl('keyboard-body-padding');
                }else{
                    body.rmCl('keyboard-bottom-panel');
                    body.adCl('keyboard-body-padding'); 
                };
            }else{
                body.rmCl('keyboard-bottom-panel');
                body.rmCl('keyboard-body-padding');
                clearInterval(interval);
            };
        });
    };

    var __init__ = function () {
        thisObject.hide();
        setNormalKeys();
        drawKeys(true);
        configureMinimizeKeyboard();
        configurePaddingBody();
    };

    __init__();
}


keyboardComponent = {

    controller: function (component) {
        //This implementation permites to create component by url route

    },

    getInitialData: function (componentID, callBack) {
        var dataTemplate = {
            'keyboard': [{
                id: componentID
            }]
        };
        callBack(dataTemplate);

    },

    getInstance: function (componentID, methodToSendInstance) {
        //This implementation permites to create reusable component. The property data-auto-create in the component html must be setted to "no".
        frango.useNestedComponent(componentID, function () {
            var component = frango.getComponent('keyboard');
            var instanceID = component.componentID;

            keyboardComponent.getInitialData(instanceID, function (data) {
                component.bindData(data, true, function () {
                    var instance = new keyboardClass(componentID);
                    if (methodToSendInstance) {
                        methodToSendInstance(instance);
                    };
                });
            });
        });
    }
};

