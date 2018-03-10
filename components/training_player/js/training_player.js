function TrainingPlayer(instanceId) {
    var thisObject = this;
    var selecteId = instanceId;
    var thisComponent = frango.find('#' + selecteId);
    var words = [];
    var wordIndexSelected = 0;
    var audio = undefined;
    var showSelectedWord = true;
    var paused = false;
    var stopped = false;
    var repeateActive = false;
    var methodToGetURLAudio = undefined;
    var activeColor = 'teal-text darken-4 darken-4';
    var inactiveColor = 'grey-text';

    this.autoPlay = false;


    this.btnStart = thisComponent.find('.start');
    this.btnNext = thisComponent.find('.next-word');
    this.btnPrior = thisComponent.find('.prior-word');
    this.btnPause = thisComponent.find('.pause-word');
    this.btnStop = thisComponent.find('.stop-word');
    this.btnRepeat = thisComponent.find('.repeat-word');

    this.setControlClass = function (btn, active) {
        if (active == true) {
            btn.rmCl(inactiveColor);
            btn.adCl(activeColor);
        } else {
            btn.adCl(inactiveColor);
            btn.rmCl(activeColor);
        };
    };

    var controlButtons = function (enabled) {

        if (!enabled) {

            thisObject.setControlClass(thisObject.btnStart, false);
            thisObject.setControlClass(thisObject.btnNext, false);
            thisObject.setControlClass(thisObject.btnPrior, false);
            thisObject.setControlClass(thisObject.btnPause, false);
            thisObject.setControlClass(thisObject.btnStop), false;
            thisObject.setControlClass(thisObject.btnRepeat, false);
        } else {
            thisObject.setControlClass(thisObject.btnStart, true);
            thisObject.setControlClass(thisObject.btnNext, true);
            thisObject.setControlClass(thisObject.btnPrior, true);
            thisObject.setControlClass(thisObject.btnPause, false);
            thisObject.setControlClass(thisObject.btnStop, false);

            if (thisObject.autoPlay) {
                thisObject.setControlClass(thisObject.btnRepeat, true);
            } else {
                thisObject.setControlClass(thisObject.btnRepeat, false);
            };
        };
    };


    var controlButtonActions = function (action) {



        if (thisObject.autoPlay) {

            switch (action) {
                case 'play':
                    thisObject.setControlClass(thisObject.btnStart, false);
                    thisObject.setControlClass(thisObject.btnPause, true);
                    thisObject.setControlClass(thisObject.btnStop, true);
                    break;
                case 'stop':
                    thisObject.setControlClass(thisObject.btnStart, true);
                    thisObject.setControlClass(thisObject.btnPause, false);
                    thisObject.setControlClass(thisObject.btnStop, false);
                    break;
                case 'pause':
                    thisObject.setControlClass(thisObject.btnStart, true);
                    thisObject.setControlClass(thisObject.btnPause, false);
                    thisObject.setControlClass(thisObject.btnStop, true);
                default:
                    break;
            };
        };

    };
    var isBtnEnabled = function (btn) {
        return frango.hasClass(activeColor, btn.first());
    };

    var nextWordOnEndPlay = function(){
        if (thisObject.autoPlay && !paused && !stopped) {
            thisObject.nextWord();
        };
    };

    var configurePlayer = function () {
        audio = thisComponent.find('.training-player').first();
        thisObject.btnStart.on('click', function () {
            if (!isBtnEnabled(thisObject.btnStart)) {
                return;
            };
            thisObject.playWord();
        });
        thisObject.btnNext.on('click', function () {
            if (!isBtnEnabled(thisObject.btnNext)) {
                return;
            };
            thisObject.nextWord();
        });
        thisObject.btnPrior.on('click', function () {
            if (!isBtnEnabled(thisObject.btnPrior)) {
                return;
            };
            thisObject.priorWord();
        });
        thisObject.btnPause.on('click', function () {
            if (!isBtnEnabled(thisObject.btnPause)) {
                return;
            };
            thisObject.pauseWord();
        });
        thisObject.btnStop.on('click', function () {
            if (!isBtnEnabled(thisObject.btnStop)) {
                return;
            };
            thisObject.stopWord();
        });
        thisObject.btnRepeat.on('click', function () {
            if (!isBtnEnabled(thisObject.btnRepeat)) {
                return;
            };
            thisObject.setRepeat()
        });
        controlButtons(false);
        frango.find(audio).on('ended', nextWordOnEndPlay);
    };


    var __init__ = function () {
        configurePlayer();
    };


    this.nextWord = function () {
        wordIndexSelected += 1;
        if (wordIndexSelected > words.length - 1) {
            wordIndexSelected = 0;
            if (repeateActive) {
                thisObject.playWord();
            } else {
                frango.warning('The list ended.');
                controlButtonActions('stop');
            };
        } else {
            thisObject.playWord();
        };

    };

    this.priorWord = function () {
        if (wordIndexSelected > 0) {
            wordIndexSelected += -2;
            thisObject.nextWord();
        };
    };


    this.playWord = function () {
        stopped = false;
        var playFromWeb = function(worToPlay){
            methodToGetURLAudio(worToPlay, function (url) {
                if (url) {
                    //var url = data[0]["fileUrl"];
                    audio.setAttribute('src', url);
                    audio.play();                    
                } else {
                    if (thisObject.autoPlay) {
                        thisObject.nextWord();
                    };
                };
            }); 
        };
        var playFromPlatform = function(worToPlay){
            if ('plugins' in window) {
                TTS.speak({
                    text: worToPlay,
                    locale: 'en-US',
                    rate: 1
                }, function () {
                    nextWordOnEndPlay();
                }, function (reason) {
                    //frango.warning(reason);                
                    playFromWeb(worToPlay);
                });
            }else{
              playFromWeb(worToPlay)
            };    
        };     
        controlButtonActions('play');

     
        var word = thisObject.getSelectedWord();

        if (paused) {
            paused = false;
            //audio.play();
            playFromPlatform(word);
            return;
        };


        if (showSelectedWord) {
            thisComponent.find('.text-selected').first().innerHTML = word;
        };
        playFromPlatform(word);
    };

    this.stopWord = function () {
        audio.pause();
        stopped = true;
        wordIndexSelected = 0;
        controlButtonActions('stop');


    };

    this.pauseWord = function () {

        paused = true;
        controlButtonActions('pause');
        audio.pause()


    };

    this.getSelectedWord = function () {
        return words[wordIndexSelected];
    };

    this.setPlaylist = function (listWords, showText, methodToGetURL) {
        words = listWords;
        showSelectedWord = showText;

        /*methodToGetURLAudio -
           method with this parameters word | callback returning the url
        */
        methodToGetURLAudio = methodToGetURL;
        if (words.length === 0) {
            controlButtons(false);
        } else {
            controlButtons(true);
        };
    };

    this.setRepeat = function () {

        repeateActive = !repeateActive;
        if (repeateActive) {
            thisObject.btnRepeat.find('i').rmCl('mdi-repeat');
            thisObject.btnRepeat.find('i').adCl('mdi-repeat-off');
        } else {
            thisObject.btnRepeat.find('i').adCl('mdi-repeat');
            thisObject.btnRepeat.find('i').rmCl('mdi-repeat-off');
        };

    };

    this.captureVoice = function (methodReceiveText) {

        var notAvailable = function () {
            frango.warning('This option is not available. Try to update your browse');
        };

        if (window.plugins) {

            try {
                var recognition = window.plugins.speechRecognition;
                var listen = function () {
                    var options = {
                        language: 'en-US',
                        matches: 1,
                        showPopup: true,
                        showPartial: false
                    };
                    recognition.startListening(function (matches) {
                        methodReceiveText(matches);
                    }, function (err) {
                        frango.warning(err);
                    }, options)
                };

                recognition.isRecognitionAvailable(function (available) {
                    if (available) {
                        recognition.hasPermission(function (permited) {
                            if (permited) {
                                listen();
                            } else {
                                recognition.requestPermission(function () {
                                    //permited.  
                                    listen();
                                },
                                    function (err) {
                                        frango.warning(err);
                                    });
                            }
                        }, function (err) {
                            frango.warning(err);
                        });
                    } else {
                        notAvailable();
                    };
                }, function (err) {
                    //notAvailable();
                    frango.warning(err);
                });
            } catch (e) {
                frango.warning(e);
            };
        } else {
            /*for web*/
            if (!'webkitSpeechRecognition' in window || !'SpeechRecognition' in window) {
                notAvailable();
            } else {
                try {
                    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    var recognition = new SpeechRecognition();
                    recognition.lang = 'en-us';/*get the learnig language */
                    recognition.onresult = function (event) {
                        //frango.warning(event);
                        var text = event.results[0][0].transcript;
                        methodReceiveText([text]);
                    };
                    recognition.start();

                } catch (e) {
                    frango.warning(e);
                };
            };
        };
    };

    __init__();
}



training_playerComponent = {

    controller: function (component) {


    },

    getInstance: function (componentID, methodToSendInstance) {
        frango.useNestedComponent(componentID, function () {
            var component = frango.getComponent('training_player');
            var instanceId = component.componentID;
            var dataToTemplate = {
                'training_player': [{
                    id: instanceId
                }]
            };

            component.bindData(dataToTemplate, true, function () {
                var instance = new TrainingPlayer(componentID);
                methodToSendInstance(instance);
            });
        });
    }

};
