
function textSelector(instanceId) {
    //use htmlComponent.find() to access the child elements  
    var htmlComponent = frango.find('#' + instanceId);
    /*write the component functionalites here*/
    var thisObject = this;
    var isSelecting = false;
    var isOpened = false;
    var dictionaryInstance = undefined;

    this.selectedText = "";

    var setSelectingFalse = function (idInterval) {
        if (thisObject.isSelecting == true) {
            thisObject.isSelecting = false;
        } else {
            clearInterval(idInterval);
        };
    };
    var openTextSelectedOption = function (idInterval) {
        if (thisObject.isSelecting == false && isOpened == false) {
            clearInterval(idInterval);
            if (!document.activeElement.hasAttribute('data-disableSelector')){
                var text = window.getSelection().toString();
                if (text) {
                    openPopup(text);
                };    
            };
        };
    };
    var openPopup = function (text) {
        isOpened = true;
        thisObject.selectedText = text;
        htmlComponent.find('.text-selected').first().innerHTML = thisObject.selectedText;
        $('#' + instanceId + 'Modal').modal({ complete: closePopup });
        htmlComponent.find('.open').first().click();
    };
    var closePopup = function () {
        isOpened = false;
        thisObject.selectedText = "";
    };

    var openGoogleTranslation = function () {
        //https://translate.google.com/m/translate?hl=pt-BR#pt/en/dimens%C3%A3o        
        var userLanguage = 'pt-BR';
        var userLanguageSufix = 'pt';
        var learningLanguage = 'en';
        var url = frango.format('https://translate.google.com/translate?hl=%s#%s/%s/%s',
            [userLanguage, learningLanguage, userLanguageSufix, thisObject.selectedText]);
        window.open(url, '_blank', 'location=yes');

    };

    var copySelectedText = function () {
        document.execCommand('copy');
        frango.warning('Copied!');
    };

    var audio = function () {
        dictionaryInstance.playPhrases(thisObject.selectedText);
    };

    var openDictionary = function () {
        dictionaryInstance.showDictionary(thisObject.selectedText.split(" "));
        $('#' + instanceId + 'Dictionary').modal({ complete: closeDictionary });
        //htmlComponent.find('#' + instanceId + 'Dictionary').first().click();
        $('#' + instanceId + 'Dictionary').modal('open');
    };

    var closeDictionary = function () {
        dictionaryInstance.removeDictionary();
    };

    var __init__ = function () {
        document.addEventListener('contextmenu', function (e) {
            if (frango.isMobileDevice()) {
                var nodeName = e.target.nodeName;
                var ignoredElements = ['INPUT', 'TEXTAREA'];
                if (ignoredElements.indexOf(nodeName) == -1) {
                    e.preventDefault();
                };
            };
        }, false);
        document.addEventListener("selectstart", function () {

            var idResetSelecting = setInterval(function () {
                setSelectingFalse(idResetSelecting)
            }, 500);

            var idOptions = setInterval(function () {
                openTextSelectedOption(idOptions);
            }, 700)
        });
        document.addEventListener("selectionchange", function () {
            thisObject.isSelecting = true;
        });

        dictionaryInstance = new dictionary(instanceId + 'selectTextDictionary');

        //htmlComponent.find('.modal-close').on('click', closePopup);
        htmlComponent.find('.googleTranslate').on('click', openGoogleTranslation);
        htmlComponent.find('.copyText').on('click', copySelectedText);
        htmlComponent.find('.definition').on('click', openDictionary);
        htmlComponent.find('.audio').on('click', audio);
    };

    __init__();
}


textSelectorComponent = {

    controller: function (component) {
        //This implementation permites to create component by url route
        var instanceID = component.componentID;
        textSelectorComponent.getInitialData(instanceID, function (data) {
            component.bindData(data, true, function () {
                /*on finish*/
            });
        });

    },

    getInitialData: function (componentID, callBack) {
        var dataTemplate = {
            'textSelector': [{
                id: componentID
            }]
        };
        callBack(dataTemplate);

    },

    getInstance: function (componentID, methodToSendInstance) {
        //This implementation permites to create reusable component. The property data-auto-create in the component html must be setted to "no".
        frango.useNestedComponent(componentID, function () {
            var component = frango.getComponent('textSelector');
            var instanceID = component.componentID;

            textSelectorComponent.getInitialData(instanceID, function (data) {
                component.bindData(data, true, function () {
                    var instance = new textSelector(componentID);
                    if (methodToSendInstance) {
                        methodToSendInstance(instance);
                    };
                });
            });
        });
    }
};

