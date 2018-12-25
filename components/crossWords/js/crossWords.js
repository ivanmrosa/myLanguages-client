
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
    var urlToGetGame = 'get-file/';
    var keys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
        "t", "u", "v", "x", "w", "y", "z", "enter"];
    var keyboardCrossWord = undefined;
    var selectedInput = undefined;

    /*write the component functionalites here*/
    var getRowHTML = function (rowCount) {
        return frango.format('<div class="cross-row" data-pos="%s"></div>', [rowCount]);
    };

    var getColHTML = function (rowCount, colCount) {
        return frango.format('<div class="cross-col" data-pos="%s-%s"><div class="sequence">' +
            '</div><input type="text" maxlength="1" readonly data-disableSelector></div>',
            [rowCount, colCount]);
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

    var jumpToNextInput = function (colElement, comeBack = false) {
        var col = frango.find(colElement);
        //var hasHorizontal = colElement.hasAttribute('data-index-h');
        //var hasVertical = colElement.hasAttribute('data-index-v');
        var coordinates = colElement.attr('data-pos').split('-');
        var x = coordinates[0];
        var y = coordinates[1];
        var nextDataPos = "";
        var goTo = GO_RIGHT;
        var found = false;
        var step = 1;
        /*if (!hasHorizontal) {
            goTo = GO_DOWN;
        };*/
        if (selectedWordData.orientation == "V") {
            goTo = GO_DOWN
        };

        if (comeBack) {
            step = -1;
        };

        if (goTo == GO_RIGHT) {
            nextDataPos = x + '-' + (parseInt(y) + step);
        } else if (goTo == GO_DOWN) {
            nextDataPos = (parseInt(x) + step) + '-' + y;
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

    var onKeyPress = function (key) {
        try {
            if (key == "#8") {
                selectedInput.value = "";
                jumpToNextInput(selectedInput.parentElement, true);
            };
            if (keys.indexOf(key) != -1) {
                if (selectedInput) {
                    selectedInput.value = key;
                    jumpToNextInput(selectedInput.parentElement);
                }
            };

        } catch (error) {
            alert(error);
        };
    };

    var configureInput = function () {
        var inputs = htmlComponent.find('.cross-col input');
        inputs.on('contextmenu', function (e) {
            e.preventDefault();
        });

        inputs.on('focus', function (e) {
            this.select();
            selectedInput = this;
            inputs.rmCl('focused');
            frango.find(this).adCl('focused');
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
            keyboardCrossWord.setTextOnPainel(htmlComponent.find('.cross-definitions [data-word-index="' + selectedWordData.index + '"]').first().innerHTML);
            inputAutomaticallyFocused = false;
        });

    };

    var createTemplate = function () {
        var mainBox = htmlComponent.find('.cross-main-box');
        var actualRow = null;
        mainBox.html('');
        for (var index = 1; index <= howManyRows; index++) {
            mainBox.addHTMLBeforeEnd(getRowHTML(index));
            actualRow = mainBox.find('[data-pos="' + index + '"]');
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
        //var eleDefinitionsVertical = htmlComponent.find('.cross-definitions.vertical');        
        //eleDefinitionsHorizontal.html('<li class="collection-header"></li>');
        //eleDefinitionsVertical.html('<li class="collection-header"><h4>Vertical</h4></li>');
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
            var orientation = '';
            for (var indexDef = 0; indexDef < wordsConfig.length; indexDef++) {
                if (wordsConfig[indexDef].orientation == "H") {
                    orientation = 'mdi mdi-arrow-right';
                } else {
                    orientation = 'mdi mdi-arrow-down';
                };
                eleDefinitions.addHTMLBeforeEnd(frango.format('<li class="collection-item" data-word-index="%s">%s - <i class="%s"></i> %s ' +
                    '<div><a href="javascript:void(0)" alt="Try" data-word-index="%s" class="try black-text"><i class="mdi mdi-keyboard"></i></a>&nbsp&nbsp|&nbsp&nbsp' +
                    '<a href="javascript:void(0)" data-word-index="%s" class="reveal black-text"><i class="mdi mdi-eye"></i></a></div></li>',
                    [(indexDef), (indexDef + 1), orientation, frango.replace(definitions[wordsConfig[indexDef].word], wordsConfig[indexDef].word, '____', true), 
                       indexDef, indexDef]));
            };
        };

        var gotToWord = function () {
            htmlComponent.find('.cross-definitions li a.try').on('click', function (e) {
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

        var reveal = function () {
            htmlComponent.find('.cross-definitions li a.reveal').on('click', function (e) {
                var ele = this;
                var indexWord = parseInt(ele.attr('data-word-index'));
                var inputs = htmlComponent.find('[data-index-h="' + indexWord.toString() + '"] input').elements;
                if (inputs.length == 0) {
                    var inputs = htmlComponent.find('[data-index-v="' + indexWord.toString() + '"] input').elements;
                };

                for (var index = 0; index < inputs.length; index++) {
                    var input = inputs[index];
                    input.value = wordsConfig[indexWord].word[index];
                };

                //go to word
                frango.find(ele.parentElement).find('a.try').first().click();

            })
        };


        for (var index = 0; index < wordsConfig.length; index++) {
            setDefinition(wordsConfig[index].word, index);
        };

        var idInter = setInterval(function () {
            if (Object.keys(definitions).length == wordsConfig.length) {
                clearInterval(idInter);
                bindDefinitionsOnTemplate();
                reveal();
                gotToWord();
            };

        }, 1000);

    };

    var revealAllwords = function () {
        htmlComponent.find('.cross-definitions a.reveal').loop(function () {
            this.click();
        });
    };

    var check = function () {
        htmlComponent.find('.cross-col').loop(function () {
            this.rmCl('wrong');
            this.rmCl('correct');
        });
        for (var index = 0; index < wordsConfig.length; index++) {
            var word = wordsConfig[index].word;
            var answer = "";
            var cols = htmlComponent.find('[data-index-' + wordsConfig[index].orientation + '="' + index + '"]');
            cols.find('input').loop(function () {
                answer += this.value;
            });

            if (answer == word.toLowerCase()) {
                cols.adCl('correct');
            } else {
                cols.adCl('wrong');
            };
        };
    };

    var bindMenuEvents = function () {
        htmlComponent.find('.check').on('click', check);
        htmlComponent.find('.prior').on('click', priorGame);
        htmlComponent.find('.next').on('click', nextGame);
        htmlComponent.find('.reveal-all').on('click', revealAllwords);
        htmlComponent.find('.save-game').on('click', saveGame); 
    };

    var saveGame = function () {
        var map = [];
        htmlComponent.find('[data-pos]').loop(function () {
            var ele = this;
            var pos = ele.attr('data-pos');
            var value = ele.find('input').first().value;
            if (pos && value) {
                map.push({ "pos": pos, "value": value });
            };
        });
        if (map.length > 0) {
            frango.setCookie('crossword-saved', JSON.stringify(map));
        };
    };

    var clearSavedGame = function () {
        frango.setCookie('crossword-saved', '', -1);
    };

    var getSavedGame = function () {
        var map = frango.getCookie('crossword-saved');
        if (map) {
            map = JSON.parse(map);
            for (var index = 0; index < map.length; index++) {
                var element = map[index];
                var input = htmlComponent.find('[data-pos="' + element.pos + '"]').find('input').first();
                if (input) {
                    input.value = element.value;
                };
            };
        };
    };

    var initializeAutoSave = function () {
        var id = setInterval(function () {
            if (frango.find('.crossWord').elements.length == 0) {
                clearInterval(id);
            } else {
                saveGame();
            };
        }, 30000);
    };

    var createGame = function () {
        createTemplate();
        bindWordsOnCells();
        showSequence();
        disableUnusedCells();
        configureDefinitions();
    };

    this.newGame = function (game) {
        if (!game) {
            game = getActualGameNumber();
        };
        getGameOnServer(game, function (gameData) {
            wordsConfig = gameData;
            createGame();
            setActualGameNumber(game);
            getSavedGame();            
        });
    };

    var getGameOnServer = function (gameNumber, methodToSend) {
        frango.wait.start();
        frango.ajaxGet({
            url: urlToGetGame,
            data: { "file": 'english/crosswords/' + gameNumber + '-crossword.json' },
            onSuccess: function (data) {
                frango.wait.stop();                
                data = JSON.parse(data);
                if (typeof methodToSend == 'function') {
                    methodToSend(data);
                };                
            },
            onFailure: function (error) {
                frango.wait.stop();                
                frango.warning("Wasn't  possible to get the game. " + error);
            }
        });
    };

    var getActualGameNumber = function () {
        var numGame =  frango.getCookie('crossword-actual-game');
        if(numGame){
            return numGame
        }else{
            return 1;
        };

    };

    var nextGame = function () {
        var game = parseInt(getActualGameNumber()) + 1;
        clearSavedGame();
        thisObject.newGame(game)
    };

    var priorGame = function () {
        var game = parseInt(getActualGameNumber()) - 1;
        if (game > 0) {
            clearSavedGame();
            thisObject.newGame(game);
        };
    };

    var setActualGameNumber = function (game) {
        if (game) {
            frango.setCookie('crossword-actual-game', game);
            htmlComponent.find('.game-number').first().value = game;
        } else {
            game = frango.getCookie('crossword-actual-game');
            if (!game) {
                game = 1;
                frango.setCookie('crossword-actual-game', 1);
                htmlComponent.find('.game-number').first().value = 1;
            };
        };
        htmlComponent.find('.game-number-display').html('Game #' + game);
    };

    var __init__ = function () {
        keyboardComponent.getInstance('keyboardCrossWord', function (instance) {
            bindMenuEvents();
            setActualGameNumber();
            keyboardCrossWord = instance;
            keyboardCrossWord.setOnKeyPress(onKeyPress);
            keyboardCrossWord.show();
            initializeAutoSave();
        });
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

