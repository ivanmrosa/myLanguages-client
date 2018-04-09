var crossData = [
    { "x": 1, "y": 2, "orientation": "H", "word": "mother" },
    { "x": 1, "y": 3, "orientation": "V", "word": "other" },
    { "x": 12, "y": 5, "orientation": "H", "word": "homeland" },
    { "x": 1, "y": 2, "orientation": "V", "word": "miracle" },
    { "x": 6, "y": 12, "orientation": "V", "word": "command" },
    { "x": 4, "y": 1, "orientation": "H", "word": "taekwondo" },
    { "x": 7, "y": 5, "orientation": "H", "word": "santiago" },
    { "x": 12, "y": 1, "orientation": "H", "word": "top" },
    { "x": 5, "y": 2, "orientation": "H", "word": "crown" },
    { "x": 7, "y": 5, "orientation": "V", "word": "soft" },
    { "x": 1, "y": 9, "orientation": "H", "word": "send" },
    { "x": 10, "y": 3, "orientation": "V", "word": "tap" },
    { "x": 1, "y": 12, "orientation": "V", "word": "duck" },
    { "x": 9, "y": 5, "orientation": "H", "word": "form" }
]




function crossWordsClass(instanceId) {
    /*CONST */
    var GO_DOWN = 'down';
    var GO_RIGHT = 'right';
    var GO_LEFT = 'left';
    var GO_UP = 'up';
    //use htmlComponent.find() to access the child elements  

    var htmlComponent = frango.find('#' + instanceId);
    var thisObject = this;
    var howManyRows = 12;
    var howManyCols = 12;
    var crossWordDictionary = new dictionary(instanceId + "Dictionary");
    var selectedWordData = { index: null, orientation: null }
    var inputAutomaticallyFocused = false;
    var wordsConfig = null;

    /*write the component functionalites here*/
    var getRowHTML = function (rowCount) {
        return frango.format('<div class="cross-row" data-pos="%s"></div>', [rowCount]);
    };

    var getColHTML = function (rowCount, colCount) {
        return frango.format('<div class="cross-col" data-pos="%s-%s"><div class="sequence"></div><input type="text" maxlength=1></div>', [rowCount, colCount]);
    };

    var configureSize = function () {
        var config = function () {
            var width = (htmlComponent.first().offsetWidth / howManyCols) - 1 /*border*/;

            if (width > 100) {
                width = 100;
            };

            htmlComponent.find('.cross-col').loop(function () {
                this.adSty('width', width + "px");
                this.adSty('height', width + "px");

            });
            htmlComponent.find('.cross-col input').loop(function () {
                this.adSty('width', width + "px");
                this.adSty('height', width + "px");

            });

            htmlComponent.find('.cross-row').adSty('width', (width * howManyCols) + "px");

        };

        frango.find(window).on('resize', config);
        config();
    };

    var jumpToNextInput = function (colElement) {        
        var col = frango.find(colElement);
        //var hasHorizontal = colElement.hasAttribute('data-index-h');
        //var hasVertical = colElement.hasAttribute('data-index-v');
        var coordinates = colElement.attr('data-pos').split('-');
        var x = coordinates[0];
        var y = coordinates[1];
        var nextDataPos = "";
        var goTo = GO_RIGHT;
        var found = false;
        /*if (!hasHorizontal) {
            goTo = GO_DOWN;
        };*/
        if (selectedWordData.orientation == "V") {
            goTo = GO_DOWN
        };

        if (goTo == GO_RIGHT) {
            nextDataPos = x + '-' + (parseInt(y) + 1);
        } else if (goTo == GO_DOWN) {
            nextDataPos = (parseInt(x) + 1) + '-' + y;
        };

        frango.find('[data-pos="' + nextDataPos + '"].used input').loop(function () {
            inputAutomaticallyFocused = true;
            found = true;
            this.focus();

        });

        if (!found) {
            inputAutomaticallyFocused = false;
        };

    };
    var markSelectedWord = function (WordIndex) {
        htmlComponent.find('.cross-col').rmCl('selected');
        htmlComponent.find('.cross-definitions > li').rmCl('selected');

        var putMark = function () {
            var ele = this;
            ele.adCl('selected');
        };
        htmlComponent.find('[data-index-h="' + WordIndex + '"]').loop(putMark);
        htmlComponent.find('[data-index-v="' + WordIndex + '"]').loop(putMark);
        htmlComponent.find('.cross-definitions [data-word-index="' + WordIndex + '"]').loop(putMark);

    };

    var configureInput = function () {
        var inputs = htmlComponent.find('.cross-col input');
        inputs.on('keyup', function (e) {
            try {
                var keys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
                    "t", "u", "v", "x", "w", "y", "z", "enter"];
                //not working on android 
                //var key = e.key.toLowerCase();
                
                var key = this.value.substr(this.value.length-1, 1).toLowerCase();
                /*max length not working on android */
                this.value = key;
                if (keys.indexOf(key) != -1) {
                    jumpToNextInput(this.parentElement);
                };

            } catch (error) {
                alert(error);
            };
        });

        inputs.on('focus', function (e) {            
            var col = frango.find(this.parentElement);
            if (!inputAutomaticallyFocused) {
                if (col.first().hasAttribute('data-first-h') || col.first().hasAttribute('data-first-v')) {
                    if (col.first().hasAttribute('data-first-h')) {
                        selectedWordData.index = col.attr('data-index-h');
                        selectedWordData.orientation = "H";
                    } else if (col.first().hasAttribute('data-first-v')) {
                        selectedWordData.index = col.attr('data-index-v');
                        selectedWordData.orientation = "V";
                    };
                } else if (col.first().hasAttribute('data-index-h')) {
                    selectedWordData.index = col.attr('data-index-h');
                    selectedWordData.orientation = "H";
                } else {
                    selectedWordData.index = col.attr('data-index-v');
                    selectedWordData.orientation = "V";
                };
            };
            markSelectedWord(selectedWordData.index);
            inputAutomaticallyFocused = false;
        });

    };

    var createTemplate = function () {
        var mainBox = htmlComponent.find('.cross-main-box');
        var actualRow = null;
        mainBox.html('');
        for (var index = 1; index <= howManyRows; index++) {
            mainBox.addHTMLBeforeEnd(getRowHTML(index));
            actualRow = mainBox.find('[data-pos="' + index + '"');
            for (var indexCol = 1; indexCol <= howManyCols; indexCol++) {
                actualRow.addHTMLBeforeEnd(getColHTML(index, indexCol));
            };
        };

        configureSize();
        configureInput();
    };

    var showSequence = function () {

        htmlComponent.find('[data-first-h] > .sequence').loop(function () {
            var ele = frango.find(this);
            var parent = frango.find(this.parentElement);
            ele.addHTMLBeforeEnd(frango.format('<div class="h">%s</div>', [parseInt(parent.attr('data-index-h')) + 1]));
        });
        htmlComponent.find('[data-first-v] > .sequence').loop(function () {
            var ele = frango.find(this);
            var parent = frango.find(this.parentElement);
            ele.addHTMLBeforeEnd(frango.format('<div class="v">%s</div>', [parseInt(parent.attr('data-index-v')) + 1]));
        });

    };

    var bindWordsOnCells = function () {
        var config = null;
        var y = 0;
        var x = 0;
        var selectedCell = null;

        for (var index = 0; index < wordsConfig.length; index++) {
            config = wordsConfig[index];
            y = config.y;
            x = config.x;

            for (var indexWord = 0; indexWord < config.word.length; indexWord++) {
                selectedCell = htmlComponent.find(frango.format('[data-pos="%s-%s"]', [x, y]));
                selectedCell.attr('data-index-' + config.orientation, index);
                //selectedCell.find('input').first().value = config.word[indexWord]
                selectedCell.adCl('used')

                if (indexWord == 0) {
                    selectedCell.attr('data-first-' + config.orientation, true);
                };

                if (config.orientation == "V") {
                    x += 1;
                } else {
                    y += 1;
                };
            };
        };
    };

    var disableUnusedCells = function () {
        htmlComponent.find('.cross-col:not(.used)').find('input').loop(function () {
            this.adSty('background-color', 'black');
            this.disabled = true;
        });
    };

    var configureDefinitions = function () {
        var eleDefinitions = htmlComponent.find('.cross-definitions');
        eleDefinitions.html('');
        var definitions = {};
        var setDefinition = function (word, index) {
            frango.wait.start();
            crossWordDictionary.getWordDefinition(word, function (def) {
                def = JSON.parse(def);
                if (def.length > 0) {
                    definitions[word] = def[0].text;
                } else {
                    definitions[word] = "";
                };
                frango.wait.stop();
            });
        };

        var bindDefinitionsOnTemplate = function () {
            for (var indexDef = 0; indexDef < wordsConfig.length; indexDef++) {
                eleDefinitions.addHTMLBeforeEnd(frango.format('<li data-word-index="%s" class="collection-item">%s - %s</li>',
                    [indexDef, (indexDef + 1), definitions[wordsConfig[indexDef].word]]));
            };
        };

        for (var index = 0; index < wordsConfig.length; index++) {
            setDefinition(wordsConfig[index].word, index);
        };

        var idInter = setInterval(function () {
            if (Object.keys(definitions).length == wordsConfig.length) {
                clearInterval(idInter);
                bindDefinitionsOnTemplate();
                htmlComponent.find('.cross-definitions li').on('click', function (e) {
                    var ele = this;
                    var inputs = htmlComponent.find('[data-index-h="' + ele.attr('data-word-index') + '"] input').elements;
                    if (inputs.length > 0) {
                        inputs[0].focus();
                    } else {
                        inputs = htmlComponent.find('[data-index-v="' + ele.attr('data-word-index') + '"] input').first();

                        if (inputs.parentElement.hasAttribute('data-first-h')) {                            
                            selectedWordData.index = ele.attr('data-word-index');
                            selectedWordData.orientation = wordsConfig[selectedWordData.index].orientation;
                            inputAutomaticallyFocused = true;
                            htmlComponent.find('[data-index-v="' + ele.attr('data-word-index') + '"] input').elements[0].focus();
                        } else {
                            
                            inputs.focus();
                        };
                    };
                });
            };
        }, 1000);

    };

    var check = function(){
        htmlComponent.find('.cross-col').loop(function(){
           this.rmCl('wrong');
           this.rmCl('correct');
        });
        for (var index = 0; index < wordsConfig.length; index++) {
            var word = wordsConfig[index].word;
            var answer = "";
            var cols = htmlComponent.find('[data-index-' + wordsConfig[index].orientation + '="' + index +  '"]');
            cols.find('input').loop(function(){
                answer += this.value;
            });
            
            if(answer == word){
                cols.adCl('correct');
            }else{
                cols.adCl('wrong');
            };
        };
    };

    var bindMenuEvents = function(){
        htmlComponent.find('.refresh').on('click', thisObject.newGame);
        htmlComponent.find('.check').on('click', check);
    };
    
    this.newGame = function(){
        wordsConfig = crossData;
        //teste ---buildado4
        createGame();
    };

    var createGame = function () {
        createTemplate();
        bindWordsOnCells();
        showSequence();
        disableUnusedCells();
        configureDefinitions();
    };

    __init__ = function () {
        bindMenuEvents();
    };

    __init__();
}


crossWordsComponent = {

    controller: function (component) {
        //This implementation permites to create component by url route
        var instanceID = component.componentID;
        crossWordsComponent.getInitialData(instanceID, function (data) {
            component.bindData(data, true, function () {
                var game = new crossWordsClass(instanceID)
                game.newGame();
            });
        });
    },

    getInitialData: function (componentID, callBack) {
        var dataTemplate = {
            'crossWords': [{
                id: componentID
            }]
        };
        callBack(dataTemplate);

    },

    getInstance: function (componentID, methodToSendInstance) {
        //This implementation permites to create reusable component. The property data-auto-create in the component html must be setted to "no".
        frango.useNestedComponent(componentID, function () {
            var component = frango.getComponent('crossWords');
            var instanceID = component.componentID;

            crossWordsComponent.getInitialData(instanceID, function (data) {
                component.bindData(data, true, function () {
                    var instance = new crossWordsClass(componentID);
                    if (methodToSendInstance) {
                        methodToSendInstance(instance);
                    };
                });
            });
        });
    }
};

