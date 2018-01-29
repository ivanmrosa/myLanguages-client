
function dictionary(instanceId) {
    //use htmlComponent.find() to access the child elements  
    var htmlComponent = frango.find('#' + instanceId);
    var thisObject = this;

    /*write the component functionalites here*/
    var wordknikKey = function () {
        return "74d02049e2c1de8d0e70306b21d093caef2043f2eefc80964";
    };
    this.getWordDefinition = function (word, methodToSendData) {
        var key = wordknikKey()
        var request_params = { "limit": 200, "includeRelated": true, "useCanonical": true, "includeTags": false, "api_key": key };
        var url = "http://api.wordnik.com:80/v4/word.json/" + word + "/definitions";

        frango.ajaxGet({
            "url": url,
            "data": request_params,
            "useAuthorization": false,
            "useFrangoHost": false,
            "onSuccess": methodToSendData,
            "onFailure": methodToSendData
        });

    };
    this.getWordExample = function (word, methodToSendData) {
        var key = wordknikKey()
        var request_params = { "useCanonical": true, "api_key": key };
        var url = "http://api.wordnik.com:80/v4/word.json/" + word + "/topExample";

        frango.ajaxGet({
            "url": url,
            "data": request_params,
            "useAuthorization": false,
            "useFrangoHost": false,
            "onSuccess": methodToSendData,
            "onFailure": methodToSendData
        });
    };

    this.getWordAudioURL = function (word, methodToSendData) {
        var key = wordknikKey()
        var request_params = { "useCanonical": true, "limit": 1, "api_key": key };
        var url = "http://api.wordnik.com:80/v4/word.json/" + word + "/audio";

        frango.ajaxGet({
            "url": url,
            "data": request_params,
            "useAuthorization": false,
            "useFrangoHost": false,
            "onSuccess": function (data) {
                data = JSON.parse(data);
                if (data.length > 0) {
                    methodToSendData(data[0].fileUrl);
                };
            },
            "onFailure": function () {
                //Materialize.toast("Sorry, that's something wrong! The data was unavailable.", 3000);
                frango.warning("Sorry, something is wrong! The data was unavailable.");
            }
        });

    };
    this.setWordDefinition = function (word, element) {

        if (element.getAttribute('data-defined') != "yes") {
            var bindData = function (data, status, datasetName) {
                frango.bindDataOnTemplate(datasetName, data, element);
                element.setAttribute('data-defined', "yes");
            };
            frango.wait.start(element);
            thisObject.getWordDefinition(word, function (data, status) {
                bindData(JSON.parse(data), status, word);
                frango.wait.stop(element);
            });

            thisObject.getWordExample(word, function (data, status) {
                var preparedData = [JSON.parse(data)];
                bindData(preparedData, status, word + "_example");
                frango.wait.stop(element);
            });

        };

    };

    this.playWordAudio = function (word, reportError) {

        if (reportError == undefined || reportError == null) {
            reportError = true;
        };

        var playFromWeb = function () {
            thisObject.getWordAudioURL(word, function (url) {
                try {
                    if (url) {
                        var audio = frango.find('#word-list-audio-play').first();
                        audio.setAttribute('src', url);
                        audio.play();

                    } else {

                        if (reportError == true) {
                            frango.warning('Sorry, audio not found.')
                        };
                    };
                } catch (e) {
                    frango.warning(e);
                };
            });
        };

        if ('plugins' in window) {
            TTS.speak({
                text: word,
                locale: 'en-US',
                rate: 0.75
            }, function () {
                played = true;


            }, function (reason) {
                //frango.warning(reason);
                playFromWeb();
            });
        } else {
            playFromWeb();
        };
    };
    this.removeDictionary = function () {
        var dic = frango.find('#' + instanceId);
        if (dic.elements.length > 0) {
            dic.remove();
        };
    };

    var bindEvents = function (listImages) {
        htmlComponent.find('.header-word').on('click', function () {
            thisObject.setWordDefinition(this.find('.word-identification').first().innerHTML, this);
        });

        htmlComponent.find('.hearing').on('click', function () {
            thisObject.playWordAudio(this.attr('data-hearing'));
        });

        htmlComponent.find('.word-images').on('click',function(){
           listImages.openListImage(this.attr('data-image'));
        });
    };

    this.showDictionary = function (listWords, formated) {
        thisObject.removeDictionary();        
        frango.useNestedComponent(instanceId, function () {
            var component = frango.getComponent('dictionary');
            dictionaryComponent.getInitialData(instanceId, function (data) {
                if (formated == undefined || formated == null) {
                    formated = false;
                };
                var wordsObjects = []
                if (formated == true) {
                    wordsObjects = listWords;
                } else {
                    for (var index = 0; index < listWords.length; index++) {
                        var word = listWords[index];
                        wordsObjects.push({ text: word.trim() });
                    };
                };
                data["words"] = wordsObjects;
                component.bindData(data, true, function () {
                    htmlComponent = frango.find('#' + instanceId);
                    
                    $('.collapsible.dictionary').collapsible({ accordion: true });

                    training_playerComponent.getInstance(instanceId + 'word-playlist', function (player) {
                        var wordsToPlay = []
                        if (formated == true) {
                            for (var index = 0; index < listWords.length; index++) {
                                var word = listWords[index].text;
                                wordsToPlay.push(word);
                            };
                        } else {
                            wordsToPlay = listWords;
                        };
                        player.autoPlay = true;
                        player.setPlaylist(wordsToPlay, true, thisObject.getWordAudioURL);
                        frango.wait.stop(lesson_detail_wordsComponent.componentElement);
                    });
                    
                    list_imagesComponent.getInstance(instanceId + 'list_images', function(listImage){
                        
                        bindEvents(listImage);
                    });


                });
            });
        });
    };
};


dictionaryComponent = {

    controller: function (component) {
        //This implementation permites to create component by url route
        var instanceID = component.componentID;
        dictionaryComponent.getInitialData(instanceID, function (data) {
            component.bindData(data, true, function () {
                /*on finish*/
            });
        });

    },

    getInitialData: function (componentID, callBack) {
        var dataTemplate = {
            'dictionary': [{
                id: componentID
            }]
        };
        callBack(dataTemplate);

    },

    getInstance: function (componentID, methodToSendInstance) {
        //This implementation permites to create reusable component. The property data-auto-create in the component html must be setted to "no".
        var instance = new dictionary(componentID);
        if (methodToSendInstance) {
            methodToSendInstance(instance);
        };

    }
};

