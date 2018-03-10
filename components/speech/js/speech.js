
speechComponent = {
    getData: function () {

    },

    speechPlayer: undefined,
    speechDictionary : undefined,

    controller: function (component) {
        speechComponent.started = false;
        speechComponent.speechPlayer = undefined;
        speechComponent.speechDictionary = new dictionary('speech-player');      
        component.bindData([], true, function () {      
            training_playerComponent.getInstance('speech-player', function (instance) {                          
                speechComponent.speechPlayer = instance;
                var playMethod = speechComponent.speechPlayer.playWord;
                speechComponent.speechPlayer.playWord = function(){
                   if(!speechComponent.started){
                    speechComponent.start();
                   }else{
                     playMethod();
                   };
                };

                speechComponent.speechPlayer.setControlClass(speechComponent.speechPlayer.btnStart, true);
                
            });

        });
    },

    started: false,

    start: function () {
        if (!speechComponent.started) {
            speechComponent.speechPlayer.autoPlay = false;
            frango.wait.start();
            lesson_detail_wordsComponent.getLessonWords(function (wordsObject) {
                wordsList = []
                for (var index = 0; index < wordsObject.length; index++) {
                    wordsList.push(wordsObject[index].text);
                };
                frango.find('#btn-speech-start').adCl('disabled');
                frango.find('#btn-speech-pronounce').rmCl('disabled');
                speechComponent.started = true;
                speechComponent.speechPlayer.setPlaylist(wordsList, true,
                    speechComponent.speechDictionary.getWordAudioURL);
                frango.wait.stop();    
                speechComponent.speechPlayer.playWord();
            });
        };
    },
    pronounce: function () {
        if (speechComponent.started) {
            speechComponent.speechPlayer.captureVoice(function (listText) {
                var msgEle = frango.find('#pronounce-answer');
                var selectedText = speechComponent.speechPlayer.getSelectedWord();
                var correct = false;
                var index = 0;
                for (index = 0; index < listText.length; index++) {                    
                    if(listText[index].toUpperCase() == selectedText.toUpperCase()){
                       correct = true;
                       break;
                    };
                };

                if (correct) {
                    msgEle.first().innerHTML = "Corret: " + listText[index];
                    common_lessonComponent.incrementUserScore(2);
                    setTimeout(function () {
                        msgEle.innerHTML = "";
                        speechComponent.speechPlayer.nextWord();

                    }, 1000);
                } else {
                    msgEle.first().innerHTML = "Incorrect: " + listText[0];
                };
            });
        };
    }
}
