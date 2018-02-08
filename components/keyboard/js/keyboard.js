
function keyboardClass(instanceId) {
    //use htmlComponent.find() to access the child elements  
    var htmlComponent = frango.find('#' + instanceId);
    var thisObject = this;
    var keysFirstLine = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
    var keysSecondLine = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
    var keysThirdLine = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    var keysFourthLine = ['-']
    var onKeyPress = undefined;

    /*write the component functionalites here*/
    var getKeyHtml = function (key) {
        return frango.format('<div class="orange  white-text center-align cur-pointer keyboard-key" data-key="%s">%s</div>', 
          [key, key]);
    };

    var drawKeys = function () {
        var firstLine = htmlComponent.find('.first-line');
        for (var index = 0; index < keysFirstLine.length; index++) {
            var key = keysFirstLine[index];
            firstLine.first().insertAdjacentHTML('beforeend', getKeyHtml(key));
        };

        var secondLine = htmlComponent.find('.second-line');
        for (var index = 0; index < keysSecondLine.length; index++) {
            var key = keysSecondLine[index];
            secondLine.first().insertAdjacentHTML('beforeend', getKeyHtml(key));
        };
        var thirdLine = htmlComponent.find('.third-line');
        for (var index = 0; index < keysThirdLine.length; index++) {
            var key = keysThirdLine[index];
            thirdLine.first().insertAdjacentHTML('beforeend', getKeyHtml(key));
        };

        var fourthLine = htmlComponent.find('.fourth-line');
        for (var index = 0; index < keysFourthLine.length; index++) {
            var key = keysFourthLine[index];
            fourthLine.first().insertAdjacentHTML('beforeend', getKeyHtml(key));
        };

        htmlComponent.find('.keyboard-key').on('click', function () {
            if (onKeyPress) {
                if(this.getAttribute('data-disabled') != "yes")
                   onKeyPress(this.innerHTML);
            } else {
                franggetKeyHtmlo.warning('onKeyPress event not provied');
            };
        });

    };

    this.disableKey = function(key){
       var ele = htmlComponent.find(frango.format('[data-key="%s"]', [key]));
       ele.attr('data-disabled', "yes");
       ele.rmCl('orange');
       ele.adCl('grey');
    };

    this.enableKey = function(key){
        var ele = htmlComponent.find(frango.format('[data-key="%s"]', [key]));
        ele.attr('data-disabled', "no");
        ele.rmCl('grey');
        ele.adCl('orange'); 
    };

    this.enableAllKeys = function(){

        htmlComponent.find('.keyboard-key').loop(function(){
            ele = frango.find(this);
            ele.attr('data-disabled', "no");
            ele.rmCl('grey');
            ele.adCl('orange');     
        });
    };
     
    this.setOnKeyPress = function (keyPressEvent) {
        onKeyPress = keyPressEvent;
    };

    var __init__ = function () {
        drawKeys();
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

