
/*global objects - do not remove */
appSelector = "#app";
app = {}
app.components = []


frango.app.handleChangingRoute(function(){
   var url =  frango.app.getURL();
   if ( url != 'login' && url != 'signup'){
      return loginComponent.checkUserIsLogged();
   }   
});

frango.app.initialize(function () {
    /*do things on initialize application*/
    var warning = frango.warning.clone();
    frango.warning = function(msg, callback, toast){
        if(toast == undefined || toast == null){
            toast = true;
        };
        if(toast){
            Materialize.toast(msg, 3000, '', callback);
        }else{
           warning(msg, callback);
        };        
    };
});

frango.app.afterInitialize(function () {
    /*do things after initialize application*/
    textSelectorComponent.getInstance('mainTextSelector', function(instance){
        
    });
});

function onDeviceReady() {
    // Now safe to use device APIs
    if(cordova){
        window.open = cordova.InAppBrowser.open;
    };
}

document.addEventListener("deviceready", onDeviceReady, false);

frango.app.configureRote(function () {
    /*url : component-name*/

    frango.app.routes = 
        {
    "/signup": "signup",
    "/": "home",
    "/lesson/": "lesson",
    "/lesson/detail/": "lesson_detail",
    "/login": "login"
}
    
});


var registerComponents = function () {
    for (var index = 0; index < app.components.length; index++) {
        app.components[index].call();
    };
    delete app.components;
}


frango.app.registerComponents(registerComponents);


app.components.push(function () {
    frango.component('header').
        setPathLocalTemplate('components/header/template/header.html').
        objectGetData(headerComponent).
        controller(headerComponent.controller).
        register()
});


headerComponent = {
    getData : function(){

    },
    controller: function(component){
        var config = {"title": "", "url":"", "display": "", "execute": "window.history.back()"};
        var hash = frango.app.getURL();
        if(hash == "#"){
            hash = "";
        };
        switch (hash) {
            case "":
                config["title"] = "home";
                config["display"] = "block"; 
                config["icon"]  = "dehaze"
                config["execute"]  = "headerComponent.showMenu()"
                menuComponent.controller(frango.getComponent('menu'));
                break;
            case "login":
                config["title"] = "login";
                config["display"] = "none";                
                break;
            case "categories":
                config["title"] = "categories";
                config["display"] = "block";                
                break
            case "lessons":
                config["title"] = "lessons";
                config["display"] = "block";                
                break
            case "lesson/detail/":
                config["title"] = "lesson detail";
                config["display"] = "block";                
                break                    
            case "signup":
                config["title"] = "Sign up";
                config["display"] = "block";                
                break                    
                
            default:
                break;
        }
        
        
        component.bindData({"header":[config]});        
    },

    showMenu : function(){
        //$('.top-link-navigate').sideNav('show');         
        frango.find('#button-menu').first().click();
    }
}


app.components.push(function () {
    frango.component('login').
        setPathLocalTemplate('components/login/template/login.html').
        objectGetData(loginComponent).
        controller(loginComponent.controller).
        register()
});


loginComponent = {
    getData: function () {

    },
    controller: function (component) {
        component.bindData();
    },

    getClientId: function () {
        return "XbTDHY3LxgjtBTnQp6OMIofIJo3xepNJXm59YHdg";
    },

    getSecret: function () {
        return "jJmEHxAPxrYbj7H0YRUrTWI5wPvtuoVi5FrgfmM9FTnm9Mvn8PajXgx5VwKi2EjsVNA3cnQ4vAxzdPIz5OcAZmFyRnqa3yHFtWmlHEG0IAvbrHQLXEpLKvxB9aCHVLNF";
    },

    UserNameLogged : "",

    enterInSession: function (token_key, redirect) {
        if(redirect == undefined || redirect == null){
            redirect = true;
        };
        if (token_key != "") {
            frango.server.authorization = " Bearer " + token_key;
            if(redirect==true){
                frango.app.navigate('/');
            };
            
        }
    },

    getSavedToken: function (user) {
        var app_cookie = frango.getCookie('mylanguage-username');
        if(app_cookie){
            app_cookie = JSON.parse(app_cookie);        
            loginComponent.enterInSession(app_cookie['tk']);
            return app_cookie['tk'];
        }else{                        
            return ""
        };        
        
    },

    getParamsForRequestToken: function (user, password) {
        return {
            "grant_type": "password",
            "username": user,
            "password": password,
            "client": loginComponent.getClientId(),
            "secret": loginComponent.getSecret()
        };
    },

    checkUserIsLogged : function(){
      if(!loginComponent.UserNameLogged){
        var app_cookie = frango.getCookie('mylanguage-username');
        if(app_cookie){
            app_cookie = JSON.parse(app_cookie);
            loginComponent.UserNameLogged = app_cookie["username"];
            loginComponent.enterInSession(app_cookie['tk'], false);
            return true;
        }else{            
            frango.app.navigate('/login');
            return false
        };        
      };
    },

    handleLogin: function (user, password) {

            var onSuccess = function (data) {
                data = JSON.parse(data);
                token = data["access_token"];
                frango.setCookie("mylanguage-username", '{"username":"' + user + '", "tk":"' + token + '"}', 364);
                loginComponent.UserNameLogged = user;
                loginComponent.enterInSession(token);
            };

            var onFailure = function (data) {
                try{
                    var erro = JSON.parse(data)
                }catch(e) {
                    console.log(data);
                    frango.warning(data)
                    return;
                }            
                
                frango.warning(erro["error_description"]);
            };
            frango.ajaxPost(
                {
                    "url": 'get-token/',
                    "data": loginComponent.getParamsForRequestToken(user, password),
                    "onSuccess": onSuccess,
                    "onFailure": onFailure
                }
            );
    },
    logout : function(){
        frango.setCookie('mylanguage-username', '', -1);
        frango.app.navigate('/login');
    }
}


app.components.push(function () {
    frango.component('lesson_detail').
        setPathLocalTemplate('components/lesson_detail/template/lesson_detail.html').
        objectGetData(lesson_detailComponent).
        controller(lesson_detailComponent.controller).
        register()
});


lesson_detailComponent = {
    getData: function () {

    },

    controller: function (component) {
        var loadMedia = function () {
            frango.find('#tab-media').on('click', function () {
                var element = frango.find(this).first();
                var loaded = element.attr('data-loaded');
                if (loaded == "true") {
                    return;
                };
                var params = frango.app.getURLParameters();
                params["media_type"] = 'V';
                frango.wait.start(component.selector_to_bid);
                frango.ajaxGet({
                    url: 'lesson-media/',
                    data : params,
                    onSuccess: function (videos) {
                        videos = JSON.parse(videos);
                        videoPlaylistComponent.getInstance('videoPlaylistLesson',
                            videos,
                            function (instance) {
                                var playListVideo = instance;
                                element.attr('data-loaded', "true");
                                frango.wait.stop();
                            });
                    },
                    onFailure: function (err) {
                        frango.wait.stop();
                        frango.warnig(err);
                    }
                });            
            });
        };

        component.bindData([], true, function () {
            //frango.tab();
            $(document).ready(function () {
                $('ul.tabs').tabs();
            });
            loadMedia();


        });
    }
}


app.components.push(function () {
    frango.component('common_lesson').
        setPathLocalTemplate('components/common_lesson/template/common_lesson.html').
        objectGetData(common_lessonComponent).
        controller(common_lessonComponent.controller).
        register()
});


common_lessonComponent = {
    getData: function () {

    },
    controller: function (component) {
        //component.bindData();
    },
    getUsername: function () {
        return JSON.parse(frango.getCookie('mylanguage-username'))['username'];
    },

    getUserLearning: function (methodToSendData) {
        frango.ajaxGet({
            url: 'user-learning-language/',
            data: { "user__username": common_lessonComponent.getUsername() },
            onSuccess: function (userLearnig) {
                userLearnig = JSON.parse(userLearnig)[0];
                /*save the new score*/
                methodToSendData(userLearnig);
            },
            onFailure(error) {
                alert(error);
            }

        });
    },


    incrementUserScore: function (newScore) {
        ///user-learning-language/
        var doPost = function (updatedData) {
            var id = updatedData["id"];
            updatedData.score = newScore + updatedData.score;

            frango.ajaxPut({
                url: 'user-learning-language/' + id.toString() + '/',
                data: updatedData,
                onFailure: function (error) {
                    //alert(error);
                    document.write(error);
                    document.close();
                }
            });
        };

        common_lessonComponent.getUserLearning(doPost)
    },

    goToNextLesson: function () {
        var doPost = function (updatedData) {
            var id = updatedData["id"];
            var newSequence = updatedData["lesson_sequence"] + 1;

            frango.ajaxGet({
                url: 'lesson/',
                data: { 'sequence': newSequence },
                onSuccess: function (lesson) {
                    lesson = JSON.parse(lesson)[0];
                    var lesson_id = lesson.id;

                    updatedData.score = 0;
                    updatedData.actual_lesson = frango.server.host_url + 'lesson/' +  lesson_id + '/';
                    frango.ajaxPut({
                        url: 'user-learning-language/' + id.toString() + '/',
                        data: updatedData,
                        onSuccess: function(){                            
                          frango.app.navigate('#lesson/detail/?lesson_id=' + lesson_id);
                        },
                        onFailure: function (error) {
                            //alert(error);
                            document.write(error);
                            document.close();
                        }
                    });                    
                }
            });


        };

        common_lessonComponent.getUserLearning(doPost);
    }

}


app.components.push(function () {
    frango.component('lesson_detail_words').
        setPathLocalTemplate('components/lesson_detail_words/template/lesson_detail_words.html').
        objectGetData(lesson_detail_wordsComponent).
        controller(lesson_detail_wordsComponent.controller).
        register()
});


lesson_detail_wordsComponent = {
    getLessonWords: function (methodSendTo, componentElement) {
        var params = frango.app.getURLParameters()
        frango.server.get('lesson-word/', params).
            onSuccess(function (data) {
                methodSendTo(JSON.parse(data));
            }).
            onFailure(function (msg) {
                if(componentElement){
                    frango.wait.stop(componentElement);
                };                
                var erro = JSON.parse(msg);
                alert(erro["error_description"]);                
            });
    },
        
    
    controller: function (component) {
        componentElement = frango.find(component.selector_to_bind).first();
        frango.wait.start(componentElement);
        component.objectGetData.getLessonWords(function (data, componentElement) {            
            var onFinish = function () {                
                dictionaryComponent.getInstance('dictionaryLessonDetailWords', function(instance){
                  instance.showDictionary(data, true);
                });
            };
            component.bindData([], true, onFinish);
        });
    },
}


app.components.push(function () {
    frango.component('list_word_images').
        setPathLocalTemplate('components/list_word_images/template/list_word_images.html').
        objectGetData(list_word_imagesComponent).
        controller(list_word_imagesComponent.controller).
        register()
});


list_word_imagesComponent = {
    getKey: function () {
        return "7504667-62e4222bd016b8037990064a7";
    },

    getBaseURL: function () {
        return "https://pixabay.com/api/"
    },



    getData: function (word, methodToSendData) {
        params = { "key": list_word_imagesComponent.getKey(), "image_type": "all", "q": word,
          "safesearch": true, "lang":"en"};
        frango.ajaxGet({
            "url": list_word_imagesComponent.getBaseURL(),
            "data": params,
            "onSuccess": methodToSendData,
            "onFailure": methodToSendData,
            "useAuthorization": false,
            "useFrangoHost": false
        });
    },

    resetImages: function () {
        frango.find('#modal_list_images').first().innerHTML =
            '<h4 data-datasetname="metadata" data-self="true">[{ (metadata) word }]</h4> ' +
            ' <img class="responsive-img" data-datasetname="images"  data-self="true" ' +
            '     src="[{ (images) webformatURL }]"> ';

    },

    openListImage: function (word, ) {
        list_word_imagesComponent.resetImages();
        list_word_imagesComponent.getData(word, function (imagesObject) {
            imagesObject = JSON.parse(imagesObject);
            frango.bindDataOnTemplate('metadata', [{ "word": word }]);
            frango.bindDataOnTemplate('images', imagesObject['hits'])
            $('#modal_list_images').modal('open');
        });
    },

    controller: function (component) {
        component.bindData([], true, function () {
            $('.modal').modal();
        });
    }
}


app.components.push(function () {
    frango.component('home').
        setPathLocalTemplate('components/home/template/home.html').
        objectGetData(homeComponent).
        controller(homeComponent.controller).
        register()
});


homeComponent = {
    getData : function(){

    },
    controller: function(component){       
       component.bindData([], true, function(){
           $('.collapsible').collapsible();
       });
    }
}


app.components.push(function () {
    frango.component('menu').
        setPathLocalTemplate('components/menu/template/menu.html').
        objectGetData(menuComponent).
        controller(menuComponent.controller).
        register()
});


menuComponent = {
    getData : function(){

    },
    controller: function(component){
       component.selector_to_bind = "#menu";
       component.bindData([], true, function(){
          $(".button-collapse").sideNav();
       });
    }
}


app.components.push(function () {
    frango.component('signup').
        setPathLocalTemplate('components/signup/template/signup.html').
        objectGetData(signupComponent).
        controller(signupComponent.controller).
        register()
});


signupComponent = {
    getData : function(){

    },
    controller: function(component){
       component.bindData();
    },

    registerUser: function(){
        var data =  frango.formParserJson('#form-signup');
        frango.ajaxPost({
            url : 'create-user/',
            data : data,
            onSuccess : function(data){                                
                
                frango.warning('User created!' , function(){
                   frango.app.navigate('/login');
                });
            },
            onFailure : function(erro){
               erro = JSON.parse(erro);
               frango.bindValidations('#form-signup', erro);              
            }
        })
    }
}


app.components.push(function () {
    frango.component('userconfig').
        setPathLocalTemplate('components/userconfig/template/userconfig.html').
        objectGetData(userconfigComponent).
        controller(userconfigComponent.controller).
        register()
});


userconfigComponent = {
    getData : function(){

    },
    controller: function(component){
       component.bindData();
    },

}


app.components.push(function () {
    frango.component('resumed_lesson').
        setPathLocalTemplate('components/resumed_lesson/template/resumed_lesson.html').
        objectGetData(resumed_lessonComponent).
        controller(resumed_lessonComponent.controller).
        register()
});


resumed_lessonComponent = {
    getData: function () {

    },
    controller: function (component) {
        frango.wait.start();
        /*get user's actual lesson*/
        var username = common_lessonComponent.getUsername();
        frango.ajaxGet({
            url: 'user-learning-language/',
            data: { "user__username": username },
            onSuccess: function (data) {
                frango.wait.stop();
                data = JSON.parse(data)[0];
                var lesson_id = data['actual_lesson_id']
                var score = data['score']
                var language_name = data['language_name']
                resumed_lessonComponent.bindLesson(lesson_id, score, language_name, component);
            },
        });

    },

    bindLesson: function (lesson_id, score, language_name, component) {
        componentEle = frango.find(component.selector_to_bind).first();
        frango.wait.start(componentEle);
        frango.ajaxGet({
            'url': 'lesson/',
            data: { "id": lesson_id },
            onSuccess: function (lesson) {
                lesson = JSON.parse(lesson)[0];
                lesson["score"] = score;
                lesson["language_name"] = language_name;

                if (score >= 70) {
                    lesson["aproved"] = "true";
                } else {
                    lesson["aproved"] = "false";
                };
                frango.wait.stop(componentEle);
                component.bindData({ "lesson": [lesson] });
            },
            onFailure: function (erro) {
                frango.wait.stop(componentEle);
                alert(erro)
            }
        });

    }
}


app.components.push(function () {
    frango.component('lesson').
        setPathLocalTemplate('components/lesson/template/lesson.html').
        objectGetData(lessonComponent).
        controller(lessonComponent.controller).
        register()
});


lessonComponent = {
    getData : function(){

    },
    controller: function(component){
       component.bindData();
    }
}


app.components.push(function () {
    frango.component('lesson_detail_dictation').
        setPathLocalTemplate('components/lesson_detail_dictation/template/lesson_detail_dictation.html').
        objectGetData(lesson_detail_dictationComponent).
        controller(lesson_detail_dictationComponent.controller).
        register()
});


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


app.components.push(function () {
    frango.component('speech').
        setPathLocalTemplate('components/speech/template/speech.html').
        objectGetData(speechComponent).
        controller(speechComponent.controller).
        register()
});


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
            });

        });
    },

    started: false,

    start: function () {
        if (!speechComponent.started) {
            speechComponent.speechPlayer.autoPlay = false;
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
                    if(listText[index] == selectedText){
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


app.components.push(function () {
    frango.component('training_player').
        setPathLocalTemplate('components/training_player/template/training_player.html').
        objectGetData(training_playerComponent).
        controller(training_playerComponent.controller).
        register()
});

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
    this.autoPlay = false;


    this.btnStart = thisComponent.find('.start');
    this.btnNext = thisComponent.find('.next-word');
    this.btnPrior = thisComponent.find('.prior-word');
    this.btnPause = thisComponent.find('.pause-word');
    this.btnStop = thisComponent.find('.stop-word');
    this.btnRepeat = thisComponent.find('.repeat-word');

    var setControlClass = function (btn, active) {
        var activeColor = 'blue-text';
        var inactiveColor = 'grey-text';
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

            setControlClass(thisObject.btnStart, false);
            setControlClass(thisObject.btnNext, false);
            setControlClass(thisObject.btnPrior, false);
            setControlClass(thisObject.btnPause, false);
            setControlClass(thisObject.btnStop), false;
            setControlClass(thisObject.btnRepeat, false);
        } else {
            setControlClass(thisObject.btnStart, true);
            setControlClass(thisObject.btnNext, true);
            setControlClass(thisObject.btnPrior, true);
            setControlClass(thisObject.btnPause, false);
            setControlClass(thisObject.btnStop, false);

            if (thisObject.autoPlay) {
                setControlClass(thisObject.btnRepeat, true);
            } else {
                setControlClass(thisObject.btnRepeat, false);
            };
        };
    };


    var controlButtonActions = function (action) {



        if (thisObject.autoPlay) {

            switch (action) {
                case 'play':
                    setControlClass(thisObject.btnStart, false);
                    setControlClass(thisObject.btnPause, true);
                    setControlClass(thisObject.btnStop, true);
                    break;
                case 'stop':
                    setControlClass(thisObject.btnStart, true);
                    setControlClass(thisObject.btnPause, false);
                    setControlClass(thisObject.btnStop, false);
                    break;
                case 'pause':
                    setControlClass(thisObject.btnStart, true);
                    setControlClass(thisObject.btnPause, false);
                    setControlClass(thisObject.btnStop, true);
                default:
                    break;
            };
        };

    };
    var isBtnEnabled = function (btn) {
        return frango.hasClass('blue-text', btn.first());
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

        if ('plugins' in window) {

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
                        frango.alert(err);
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


app.components.push(function () {
    frango.component('videoPlaylist').
        setPathLocalTemplate('components/videoPlaylist/template/videoPlaylist.html').
        objectGetData(videoPlaylistComponent).
        controller(videoPlaylistComponent.controller).
        register()
});


function videoPlaylist(instanceId) {
   //use htmlComponent.find() to access the child elements  
   var htmlComponent = frango.find('#' + instanceId);
   
   var __init__ = function(){
      htmlComponent.find('[data-remove]').loop(function(){
        var remove = this.attr('data-remove');
        if(remove == "true"){           
           frango.removeElement(this);
        }else{
              var eleSrc = this.find('*').loop(function(){
              this.attr('src', this.attr('data-src'));              
           });
        };
      });
   };

   __init__();

   /*write the component functionalites here*/
}


videoPlaylistComponent = {

    controller: function (component) {
        //This implementation permites to create component by url route
        var instanceID = component.componentID;
        videoPlaylistComponent.getInitialData(instanceID, function(data){
           component.bindData(data, true, function () {
               /*on finish*/ 
           });
        });    

    },
    
    getInitialData : function(componentID, callBack){
        var dataTemplate = {
           'videoPlaylist': [{
                id: componentID
            }]
         };
         callBack(dataTemplate);
       
    },
    
    checkEmbed : function(videos){
       var tempArray  = []
       for (var index = 0; index < videos.length; index++) {
           var video = videos[index];
           var tempLink = video.link.toUpperCase();
           if(tempLink.indexOf('/EMBED/') > -1){
              video["embed"] = 'yes';
           }else{
              video["embed"] = 'no';
           };
           tempArray.push(video);
       }
       return tempArray
    },

    getInstance : function(componentID, listOfVideosObject,  methodToSendInstance){
        //This implementation permites to create reusable component. The property data-auto-create in the component html must be setted to "no".
        frango.useNestedComponent(componentID, function(){            
            var component = frango.getComponent('videoPlaylist');
            var instanceID = component.componentID;
            
            videoPlaylistComponent.getInitialData(instanceID, function(data){
                                              
                data["videos"] = videoPlaylistComponent.checkEmbed(listOfVideosObject);
                
                component.bindData(data, true, function () {
		            var instance = new videoPlaylist(componentID);
		            methodToSendInstance(instance);    
                });    
            }); 
        });
    }
};



app.components.push(function () {
    frango.component('loader').
        setPathLocalTemplate('components/loader/template/loader.html').
        objectGetData(loaderComponent).
        controller(loaderComponent.controller).
        register()
});


function loader(instanceId) {
   //use htmlComponent.find() to access the child elements  
   var htmlComponent = frango.find('#' + instanceId);
   this.start = function(){
      htmlComponent.find('.progress-component').adCl('progress');
   };
   this.stop = function(){
       htmlComponent.find('.progress-component').rmCl('progress');
   };

   /*write the component functionalites here*/
}


loaderComponent = {

    controller: function (component) {
        //This implementation permites to create component by url route
        var instanceID = component.componentID;
        loaderComponent.getInitialData(instanceID, function(data){
           component.bindData(data, true, function () {
               /*on finish*/ 
           });
        });    

    },
    
    getInitialData : function(componentID, callBack){
        var dataTemplate = {
           'loader': [{
                id: componentID
            }]
         };
         callBack(dataTemplate);
       
    },
    
    getInstance : function(componentID, methodToSendInstance){
        //This implementation permites to create reusable component. The property data-auto-create in the component html must be setted to "no".
        frango.useNestedComponent(componentID, function(){            
            var component = frango.getComponent('loader');
            var instanceID = component.componentID;
            
            loaderComponent.getInitialData(instanceID, function(data){
                component.bindData(data, true, function () {
		            var instance = new loader(componentID);
		            methodToSendInstance(instance);    
                });    
            }); 
        });
    }
};



app.components.push(function () {
    frango.component('textSelector').
        setPathLocalTemplate('components/textSelector/template/textSelector.html').
        objectGetData(textSelectorComponent).
        controller(textSelectorComponent.controller).
        register()
});


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
            var text = window.getSelection().toString();
            if (text) {                
                openPopup(text);
            };
        };
    };
    var openPopup = function (text) {
        isOpened = true;
        thisObject.selectedText = text;                        
        htmlComponent.find('.text-selected').first().innerHTML = thisObject.selectedText;
        $('#' + instanceId + 'Modal').modal({complete:closePopup});                
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
        window.open(url, '_blank', 'location=no');                
            
    };

    var copySelectedText = function(){
        document.execCommand('copy');
        Materialize.toast('Copied!', 2000);
    };

    var openDictionary = function(){        
        dictionaryInstance.showDictionary(thisObject.selectedText.split(" "));
        $('#' + instanceId + 'Dictionary').modal({complete:closeDictionary});
        //htmlComponent.find('#' + instanceId + 'Dictionary').first().click();
        $('#' + instanceId + 'Dictionary').modal('open');
    };
    
    var closeDictionary = function(){
        dictionaryInstance.removeDictionary();
    };

    var __init__ = function () {
        document.addEventListener('contextmenu', function(e){
          e.preventDefault();
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



app.components.push(function () {
    frango.component('dictionary').
        setPathLocalTemplate('components/dictionary/template/dictionary.html').
        objectGetData(dictionaryComponent).
        controller(dictionaryComponent.controller).
        register()
});


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



app.components.push(function () {
    frango.component('list_images').
        setPathLocalTemplate('components/list_images/template/list_images.html').
        objectGetData(list_imagesComponent).
        controller(list_imagesComponent.controller).
        register()
});


function list_imagesClass(instanceId) {
   //use htmlComponent.find() to access the child elements  
   var htmlComponent = frango.find('#' + instanceId);
   var thisObject = this;

   /*write the component functionalites here*/

    var getKey = function () {
        return "7504667-62e4222bd016b8037990064a7";
    };

    var getBaseURL = function () {
        return "https://pixabay.com/api/"
    };



    var getData = function (word, methodToSendData) {
        params = { "key": getKey(), "image_type": "all", "q": word,
          "safesearch": true, "lang":"en"};
        frango.ajaxGet({
            "url": getBaseURL(),
            "data": params,
            "onSuccess": methodToSendData,
            "onFailure": methodToSendData,
            "useAuthorization": false,
            "useFrangoHost": false
        });
    };

    var resetImages = function (modalContainer) {
        modalContainer.find('.popup-body').first().innerHTML =  
            '<h4 data-datasetname="metadata" data-self="true">[{ (metadata) word }]</h4> ' +
            ' <img class="responsive-img" data-datasetname="images"  data-self="true" ' +
            '     src="[{ (images) webformatURL }]"> ';
    };

    this.openListImage = function (word) {
        var modalContainer = frango.find('#' + instanceId + 'modal_list_images');
        resetImages(modalContainer);
        getData(word, function (imagesObject) {            
            imagesObject = JSON.parse(imagesObject);
            frango.bindDataOnTemplate('metadata', [{ "word": word }], htmlComponent.first());
            frango.bindDataOnTemplate('images', imagesObject['hits'], htmlComponent.first());
            //$('#' + modalContainer.attr('id')).modal('open');
            frango.popup.openPopup('#' + modalContainer.attr('id'));

        });
    };
    
   
}


list_imagesComponent = {

    controller: function (component) {
        //This implementation permites to create component by url route
        var instanceID = component.componentID;
        list_imagesComponent.getInitialData(instanceID, function(data){
           component.bindData(data, true, function () {
               /*on finish*/ 
           });
        });    

    },
    
    getInitialData : function(componentID, callBack){
        var dataTemplate = {
           'list_images': [{
                id: componentID
            }]
         };
         callBack(dataTemplate);
       
    },
    
    getInstance : function(componentID, methodToSendInstance){
        //This implementation permites to create reusable component. The property data-auto-create in the component html must be setted to "no".
        frango.useNestedComponent(componentID, function(){            
            var component = frango.getComponent('list_images');
            var instanceID = component.componentID;
            
            list_imagesComponent.getInitialData(instanceID, function(data){
                component.bindData(data, true, function () {
		            var instance = new list_imagesClass(componentID);
                    if(methodToSendInstance){
                       methodToSendInstance(instance);    
                    };		            
                });    
            }); 
        });
    }
};

