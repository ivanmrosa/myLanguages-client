
function gallowsClass(instanceId) {
    //use htmlComponent.find() to access the child elements  
    var htmlComponent = frango.find('#' + instanceId);
    var thisObject = this;
    var actualWord;
    var dictionaryInstance = undefined;
    var keyboardInstance = undefined;
    var keysCorrectPressed = {};
    var countCorrectKeys = 0;
    var errors = 0;
    var htmlDefinition;
    /*write the component functionalites here*/
    var setImage = function () {
        var src = 'img/gallow-%s.png'
        htmlComponent.find('.gallow-img').attr('src', frango.format(src, [errors]));
    };

    var setHtmlDefinition = function () {
        htmlDefinition = htmlComponent.find('.data-set-definition-container').first().innerHTML;
    };
    var redefineDatasetDefinition = function () {
        htmlComponent.find('.data-set-definition-container').first().innerHTML = htmlDefinition;
    };

    var checkKeyAswer = function (key) {
        var isKeyCorrect = false;

        var check = function (keyCheck) {
            for (var index = 0; index < actualWord.length; index++) {
                var letter = actualWord[index];
                if (letter == keyCheck) {                
                    countCorrectKeys += 1;
                    htmlComponent.find('[data-pos="' + index + '"]').first().innerHTML = letter;                                         
                    isKeyCorrect = true;
                };                
            };
        };

        check(key);
        keyboardInstance.disableKey(key);

        if (!isKeyCorrect) {
            errors += 1;
            setImage();
        };

        if (countCorrectKeys == actualWord.length) {
            //frango.warning('You won!');
            alert('You won!');
            setColorInWord('green');
        } else if (errors == 6) {
            //frango.warning('You lose!');
            alert('You lose');
            setColorInWord('red');
            for (var index = 0; index < actualWord.length; index++) {
                var letter = actualWord[index];
                check(letter);
            };
        };
    };


    var getDefinition = function () {
        dictionaryInstance.getWordDefinition(actualWord, function (definition) {
            definition = JSON.parse(definition);
            if(definition){
                frango.bindDataOnTemplate('definition', definition);
            }else{
                alert('No definition found!');
            };
            
        });
    };

    var __init__ = function () {
        setHtmlDefinition();
        dictionaryInstance = new dictionary(instanceId + 'Dictionary');
        keyboardComponent.getInstance(instanceId + 'Keyboard', function (instance) {
            keyboardInstance = instance;
            instance.setOnKeyPress(checkKeyAswer);            
        });

        htmlComponent.find('.next-word').on('click', thisObject.newRandomGame)
        htmlComponent.find('.bn-definition').on('click', getDefinition);
    };

    var getHtmlWord = function () {
        var htmlLetter = '<div class="gallows-letter" data-pos="%s">%s</div>';
        var html = "";
        for (var index = 0; index < actualWord.length; index++) {
            var letter = actualWord[index];
            if (letter == '-') {
                html += frango.format(htmlLetter, [index, '-']);
            } else {
                html += frango.format(htmlLetter, [index, '__']);
            };
        };
        return html;
    };

    var setColorInWord = function (color) {
        htmlComponent.find('.gallows-letter').adSty('color', color);
    };

    var setWordHTML = function () {
        var containerLetter = htmlComponent.find('.letters');
        containerLetter.find('*').remove();
        containerLetter.first().insertAdjacentHTML('beforeend', getHtmlWord());
    };

    this.newRandomGame = function () {
        dictionaryInstance.getRandomWords(1, 5, 20).onFinish(function (words) {
            thisObject.newGame(words[0].word);
        });
    };

    this.newGame = function (word) {
        actualWord = word.toLowerCase();
        keysCorrectPressed = {};
        countCorrectKeys = 0;
        errors = 0;
        redefineDatasetDefinition();
        setImage();
        setWordHTML();
        
        if(keyboardInstance){
            keyboardInstance.enableAllKeys();
            keyboardInstance.disableKey('-');
        };
        
        setColorInWord('black');
    };

    __init__();
}


gallowsComponent = {

    controller: function (component) {
        //This implementation permites to create component by url route
        var instanceID = component.componentID;
        gallowsComponent.getInitialData(instanceID, function (data) {
            component.bindData(data, true, function () {
                /*on finish*/

                var gallowGame = new gallowsClass(instanceID);
                gallowGame.newRandomGame();

            });
        });

    },

    getInitialData: function (componentID, callBack) {
        var dataTemplate = {
            'gallows': [{
                id: componentID
            }]
        };
        callBack(dataTemplate);

    },

    getInstance: function (componentID, methodToSendInstance) {
        //This implementation permites to create reusable component. The property data-auto-create in the component html must be setted to "no".
        frango.useNestedComponent(componentID, function () {
            var component = frango.getComponent('gallows');
            var instanceID = component.componentID;

            gallowsComponent.getInitialData(instanceID, function (data) {
                component.bindData(data, true, function () {
                    var instance = new gallowsClass(componentID);
                    if (methodToSendInstance) {
                        methodToSendInstance(instance);
                    };
                });
            });
        });
    }
};

