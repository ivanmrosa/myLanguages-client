
lesson_detail_dictationComponent = {
    getData: function () {

    },
    controller: function (component) {
        lesson_detail_dictationComponent.started = false;
        component.bindData([], true, function () {
            lesson_detail_dictationComponent.dictationDictionary = new dictionary('dictation-player');
            training_playerComponent.getInstance('dictation-player', function (instance) {                
                lesson_detail_dictationComponent.player = instance
            });

        });
    },
    player: undefined,
    started: false,
    dictationDictionary : undefined,
    start: function () {
        if (!lesson_detail_dictationComponent.started) {

            lesson_detail_dictationComponent.player.autoPlay = false;
            lesson_detail_wordsComponent.getLessonWords(function (wordsObject) {
                wordsList = []
                for (var index = 0; index < wordsObject.length; index++) {
                    wordsList.push(wordsObject[index].text);
                };
                frango.find('#btn-dictation-start').adCl('disabled');
                frango.find('#btn-dictation-confirm').rmCl('disabled');
                lesson_detail_dictationComponent.started = true;
                lesson_detail_dictationComponent.player.setPlaylist(wordsList, false,
                    lesson_detail_dictationComponent.dictationDictionary.getWordAudioURL);
                lesson_detail_dictationComponent.player.playWord();
            });

        };
    },
    checkAnswer: function () {
        if (lesson_detail_dictationComponent.started == false) {
            return;
        };

        var answerEle = frango.find('#word-anwser').first();
        var answer = frango.find('#word-anwser').first().value.trim();

        if (answer == '') {
            return;
        };
        var word = lesson_detail_dictationComponent.player.getSelectedWord();
        var answer_msg = frango.find('#answer-msg');

        if (answer == word) {
            answer_msg.rmCl('red-text');
            answer_msg.adCl('green-text');
            answer_msg.first().innerHTML = "Correct! - " + word;
            common_lessonComponent.incrementUserScore(2)
            setTimeout(lesson_detail_dictationComponent.player.nextWord, 1000)
        } else {
            answer_msg.rmCl('green-text');
            answer_msg.adCl('red-text');
            answer_msg.first().innerHTML = "Wrong! Try again!";            
        };
        answerEle.value = '';
    },

}
