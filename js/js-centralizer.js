
/*global objects - do not remove */
appSelector = "#app";
app = {}
app.components = []


frango.app.handleChangingRoute(function () {
    var url = frango.app.getURL();
    if (url != 'login' && url != 'signup') {
        return loginComponent.checkUserIsLogged();
    }
});

frango.app.initialize(function () {
    /*do things on initialize application*/
    var warning = frango.warning.clone();
    frango.warning = function (msg, callback, toast) {
        if (toast == undefined || toast == null) {
            toast = true;
        };
        if (toast) {
            Materialize.toast(msg, 3000, '', callback);
        } else {
            warning(msg, callback);
        };
    };
});

frango.app.afterInitialize(function () {
    /*do things after initialize application*/
    textSelectorComponent.getInstance('mainTextSelector', function (instance) {

    });

    frango.find(document).on('backbutton', function () {
        var modalOpened = false;
        var matModal = $('.modal.open');
        if (matModal.length > 0) {
            modalOpened = true;
            matModal.each(function () {
                $(this).modal('close');
            });
        };
        if (frango.find('.popup.popup-show').elements.length > 0) {
            modalOpened = true;
            frango.popup.closePopup('.popup.popup-show');
        };
        if (!modalOpened) {
            if (frango.app.getURL() == "") {
                navigator.app.exitApp();
            } else {
                window.history.back();
            };
        };
    });
    /*set access data */
    try {
        common_lessonComponent.setLastAccess();    
    } catch (error) {
        alert(error);
    }
    


});

function onDeviceReady() {
    // Now safe to use device APIs
    if (cordova) {
        window.open = cordova.InAppBrowser.open;
        /* adsense */
        try {
            admob.banner.config({
                id: 'ca-app-pub-9005016662261468/5625086764',
            });   
            admob.banner.prepare()
            admob.banner.show()            
        } catch (error) {
           alert(error);
        };
    };
}

document.addEventListener("deviceready", onDeviceReady, false);

frango.app.configureRote(function () {
    /*url : component-name*/

    frango.app.routes = 
        {
    "/login": "login",
    "/lesson/detail/": "lesson_detail",
    "/": "home",
    "/signup": "signup",
    "/lesson/": "lesson",
    "/search-dictionary": "searchDictionary",
    "/gallows": "gallows",
    "/games": "games",
    "/cross-words": "crossWords",
    "/image-to-word": "imageLibrary",
    "/topics": "topics",
    "/memory-game": "memoryGame"
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
        var extra = component.extra_data;
        if(extra){
           extra = JSON.parse(extra);
        };
        var config = {"title": "", "url":"", "display": "", "execute": "window.history.back()"};
        var hash = frango.app.getURL();
        if(hash == "#"){
            hash = "";
        };
        switch (hash) {
            case "":
                config["title"] = "home";
                config["display"] = "block"; 
                config["icon"]  = "mdi-menu"
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
            case "search-dictionary":
                config["title"] = "Dictionary";
                config["display"] = "block";                
                break                                     
                
            default:
                config["title"] = extra["title"];
                config["display"] = extra["display_icon"] || "block";
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
    },

    handleLogin: function (user, password) {

            var onSuccess = function (data) {
                frango.wait.stop();
                data = JSON.parse(data);
                token = data["access_token"];
                frango.setCookie("mylanguage-username", '{"username":"' + user + '", "tk":"' + token + '"}', 364);
                loginComponent.UserNameLogged = user;
                loginComponent.enterInSession(token);
            };

            var onFailure = function (data) {
                frango.wait.stop();
                try{
                    var erro = JSON.parse(data)
                }catch(e) {
                    console.log(data);
                    frango.warning(data)
                    return;
                }            
                
                frango.warning(erro["error_description"]);
            };
            frango.wait.start();
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
        frango.setCookie('mylanguage-user-learning', '', -1);
        frango.setCookie('mylanguage-actual-lesson', '', -1);
        frango.setCookie('mylanguage-actual-words', '', -1);        
        frango.app.navigate('/login');
        $('.button-collapse').sideNav('destroy');
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
            var params = frango.app.getURLParameters();
            params["media_type"] = 'V';
            //frango.wait.start();
            frango.ajaxGet({
                url: 'lesson-media/',
                data: params,
                onSuccess: function (videos) {
                    videos = JSON.parse(videos);
                    videoPlaylistComponent.getInstance('videoPlaylistLesson',
                        videos,
                        function (instance) {
                            var playListVideo = instance;
                        });
                },
                onFailure: function (err) {
                    frango.warnig(err);
                }
            });

        };

        component.bindData([], true, function () {
            frango.tab('.page-control-lesson', true);
            lesson_detail_dictationComponent.hideKeyBoard() ;
            frango.find('.page-control-lesson').on('changeTab', function(){
                var ele = frango.find('[data-body="dictation"]').first();
                if(ele){
                    if (frango.hasClass('active', ele)){
                        lesson_detail_dictationComponent.showKeyBoard() ;
                    }else{
                        lesson_detail_dictationComponent.hideKeyBoard() ;
                    };    
                }
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
    checkErrorStatus : function(status){
       if(status == 401){
           loginComponent.logout();
       };
    },
    controller: function (component) {
        //component.bindData();
    },
    getUsername: function () {
        return JSON.parse(frango.getCookie('mylanguage-username'))['username'];
    },

    getUserLearning: function (methodToSendData) {
        var localUserLearning = frango.getCookie('mylanguage-user-learning');
        if(localUserLearning == "" || localUserLearning == undefined || localUserLearning == null){ 
            frango.ajaxGet({
                url: 'user-learning-language/',
                data: { "user__username": common_lessonComponent.getUsername() },
                onSuccess: function (userLearnig) {
                    
                    userLearnig = JSON.parse(userLearnig)[0];
                    frango.setCookie('mylanguage-user-learning', JSON.stringify(userLearnig));
                    /*save the new score*/                    
                    methodToSendData(userLearnig);

                },
                onFailure(error, status) {                                     
                    frango.warning(error);
                    frango.wait.stop();
                    common_lessonComponent.checkErrorStatus(status);
                }
            });
    
        }else{
          methodToSendData(JSON.parse(localUserLearning)); 
        };
    },

    setLastAccess : function(){
        var doPost = function (updatedData) {
            var id = updatedData["id"];
            
            updatedData.last_access = frango.currentDate(false);

            frango.ajaxPut({
                url: 'user-learning-language/' + id.toString() + '/',
                data: updatedData,
                onSuccess: function(){
                   frango.setCookie('mylanguage-user-learning', JSON.stringify(updatedData));
                },
                onFailure: function (error, status) {
                    frango.wait.stop();                                    
                    console.log(error);
                    common_lessonComponent.checkErrorStatus(status);
                }
            });
        };
        try {
            common_lessonComponent.getUserLearning(doPost);
        } catch (error) {
            console.log(error);
        };        
    },

    incrementUserScore: function (newScore) {
        ///user-learning-language/
        var doPost = function (updatedData) {
            var id = updatedData["id"];
            updatedData.score = newScore + updatedData.score;

            frango.ajaxPut({
                url: 'user-learning-language/' + id.toString() + '/',
                data: updatedData,
                onSuccess: function(){
                   frango.setCookie('mylanguage-user-learning', JSON.stringify(updatedData));
                },
                onFailure: function (error, status) {
                    frango.wait.stop();                                    
                    console.log(error);  
                    common_lessonComponent.checkErrorStatus(status);
                }
            });
        };

        common_lessonComponent.getUserLearning(doPost)
    },

    goToLesson: function (lessonSequence) {
        frango.wait.start();
        var doPost = function (updatedData) {
            var id = updatedData["id"];
            if (lessonSequence){
                var newSequence = lessonSequence;
            }else{
                var newSequence = updatedData["lesson_sequence"] + 1;
            };
            
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
                           frango.setCookie('mylanguage-user-learning', '', -1);
                           frango.setCookie('mylanguage-actual-lesson', '', -1);
                           frango.setCookie('mylanguage-actual-words', '', -1);
                           frango.wait.stop();
                           frango.app.navigate('#lesson/detail/?lesson_id=' + lesson_id);                           
                        },
                        onFailure: function (error, status) {                            
                            frango.wait.stop();                                    
                            console.log(error);
                            alert(error)
                            common_lessonComponent.checkErrorStatus(status);                            
                        }
                    });                    
                }
            });
        };   

        common_lessonComponent.getUserLearning(doPost);
    },

    getActualLesson : function(methodToSendData){
        frango.wait.start();
        
        common_lessonComponent.getUserLearning(function(userLearnig){
            var lesson_id = userLearnig['actual_lesson_id'];
            var score = userLearnig['score'];
            var language_name = userLearnig['language_name'];
            
            var getLesson = function(lesson){
                frango.wait.stop();
                lesson["score"] = score;
                lesson["language_name"] = language_name;
    
                if (score >= 70) {
                    lesson["aproved"] = "true";
                } else {
                    lesson["aproved"] = "false";
                };

                methodToSendData(lesson);                             
            };

            var actualLesson = frango.getCookie('mylanguage-actual-lesson');

            if(actualLesson != ""){
                actualLesson = JSON.parse(actualLesson);
                getLesson(actualLesson);
            }else{
                frango.ajaxGet({
                    url: 'lesson/',
                    data: { "id": lesson_id },
                    onSuccess: function (lesson) {  
                        lesson = JSON.parse(lesson)[0];                                              
                        frango.setCookie('mylanguage-actual-lesson', JSON.stringify(lesson));
                        getLesson(lesson);
                    },
                    onFailure: function (erro, status) {
                        frango.wait.stop();
                        frango.warning(erro);
                        common_lessonComponent.checkErrorStatus(status);
                    }
                });                
            };            
        });

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
        var params = frango.app.getURLParameters();
        var actualWords = frango.getCookie('mylanguage-actual-words');

        if(actualWords != "" ){
            actualWords = JSON.parse(actualWords);
            if(actualWords[0].lesson_id == params.lesson_id){
                methodSendTo(actualWords);
                return;
            };
        };

        frango.server.get('lesson-word/', params).
            onSuccess(function (data) {
                frango.setCookie('mylanguage-actual-words', data);
                methodSendTo(JSON.parse(data));
            }).
            onFailure(function (msg) {
                if(componentElement){
                    frango.wait.stop(componentElement);
                };                
                var erro = JSON.parse(msg);
                frango.warning(erro["error_description"]);                
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
           var firstAccess = frango.getCookie('first-access');
           if(!firstAccess){              
              frango.setCookie('first-access', false);
              homeComponent.showHelp();
           };
       });
    },

    getHelpStepOne : function(){
        var html = '<h5 class="center-align white-text blue">Bem vindo !</h5>';
        html += '<div class="align-justify">';        
        html += 'Aprenda a usar aqui o vocplus. Este tutorial pode ser visto a qualquer ';
        html += 'momento acessando a opção "Ajuda" entrando em "more". ';
        html += '</div>';        
        return html;
    },
    getHelpStepTwo : function(){
        var html = '<h5 class="center-align white-text blue">Lições</h5>';
        html += '<div class="align-justify">';
        html += 'O vocplus possui várias lições para aprendizagem de vocabulário. ';
        html += 'A lição pode ser acessada através do ícone play na tela inicial no menu "Your Actual Lesson". ';
        html += 'O painel no menu apresenta algumas informações como a pontuação mínima e a pontuação alcançada.';
        html += '</div>';
        return html;
    },
    getHelpStepThree : function(){
        var html = '<h5 class="center-align white-text blue">Lições - palavras</h5>';
        html += '<div class="align-justify">';        
        html += 'Ao acessar uma lição, será mostrada uma lista de palavras. ';
        html += 'Elas devem ser lidas e escutadas várias vezes, assim como é importante ler as definições ';
        html += 'e acessar as imagens relacionadas, pois podem ajudar no entendimento. ';
        html += 'Ao selecionar uma palavra ou uma frase, opções extras são apresentadas, como por exemplo: ';
        html += 'definição, audio, e tradução. Em qualquer lugar do aplicativo pode-se utilizar esta ferramenta.';
        html += '</div>';        
        return html;
    },
    getHelpStepFour : function(){
        var html = '<h5 class="center-align white-text blue">Lições - pronúncia e ditado</h5>';
        html += '<div class="align-justify">';        
        html += 'As lições também apresentam ditado e treinamento de pronúncia. ';
        html += 'Para poder acessar a próxima lição é necessário realizar estas tarefas atingindo no mínimo 70 pontos. ';
        html += 'Cada acerto garante dois pontos, seja no ditado ou no treino de prónuncia. ';
        html += 'Quando os 70 pontos forem atingindos, um novo botão será apresentado na tela inicial para que a próxima lição seja iniciada.';        
        html += '</div>';        
        return html;
    },
    getHelpStepFive : function(){
        var html = '<h5 class="center-align white-text blue">Resumo</h5>';        
        html += '<ul class="collection">';
        html += '<li class="collection-item">Ouça, leia e pronunicie as palavras várias vezes.</li>';
        html += '<li class="collection-item">Selecione palavras e frases em qualquer lugar para obter novas opções.</li>';
        html += '<li class="collection-item">Utilize os dicionários para sanar dúvidas. Várias palavras podem digitadas em uma mesma pesquisa.</li>';        
        html += '<li class="collection-item">Utilize os jogos para complementar o aprendizado.</li>';                
        html += '</ul>';        
        return html;
    },

    showHelp : function(){
       helpComponent.getInstance('homeHelp',function(help){
           help.addItem(homeComponent.getHelpStepOne());
           help.addItem(homeComponent.getHelpStepTwo());
           help.addItem(homeComponent.getHelpStepThree());
           help.addItem(homeComponent.getHelpStepFour());
           help.addItem(homeComponent.getHelpStepFive());           
           help.start();
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
        frango.wait.start();
        var data =  frango.formParserJson('#form-signup');
        frango.ajaxPost({
            url : 'create-user/',
            data : data,
            onSuccess : function(data){                                                
                frango.warning('User created!' , function(){
                   frango.wait.stop();                   
                   frango.app.navigate('/login');
                });
            },
            onFailure : function(erro){
               frango.wait.stop();
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
        
        resumed_lessonComponent.bindLesson(component);

    },

    bindLesson: function (component) {        
        //frango.wait.start();
        common_lessonComponent.getActualLesson(function(lesson){
            component.bindData({ "lesson": [lesson]});            
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
    player: undefined,
    started: false,
    dictationDictionary: undefined,
    dictationKeyboard: undefined,
    getData: function () {

    },
    controller: function (component) {
        lesson_detail_dictationComponent.started = false;
        component.bindData([], true, function () {
            lesson_detail_dictationComponent.dictationDictionary = new dictionary('dictation-player');
            training_playerComponent.getInstance('dictation-player', function (instance) {
                lesson_detail_dictationComponent.player = instance;
                var playMethod = lesson_detail_dictationComponent.player.playWord;
                lesson_detail_dictationComponent.player.playWord = function () {
                    if (!lesson_detail_dictationComponent.started) {
                        lesson_detail_dictationComponent.start();
                    } else {
                        playMethod();
                    };
                };

                lesson_detail_dictationComponent.player.setControlClass(lesson_detail_dictationComponent.player.btnStart, true);
            });

            keyboardComponent.getInstance('dictation-keyboard', function (instance) {
                lesson_detail_dictationComponent.dictationKeyboard = instance;
                instance.setOnKeyPress(function (key) {
                    var edit = frango.find('#word-anwser').first();
                    switch (key) {
                        case "#8":
                            edit.value = edit.value.substr(0, edit.value.length - 1);
                            break;
                        case "#13":
                            lesson_detail_dictationComponent.checkAnswer();
                            break;
                        default:
                            edit.value = edit.value + key;
                            break;
                    };
                });
            });

        });
    },

    hideKeyBoard : function () {
        var inter = setInterval(function () {
            if (lesson_detail_dictationComponent.dictationKeyboard) {
                lesson_detail_dictationComponent.dictationKeyboard.hide();
                clearInterval(inter);
            };
        }, 1000);
    },
    showKeyBoard : function () {
        var inter = setInterval(function () {
            if (lesson_detail_dictationComponent.dictationKeyboard) {
                lesson_detail_dictationComponent.dictationKeyboard.show();
                clearInterval(inter);
            };
        }, 1000);
    },

    start: function () {
        if (!lesson_detail_dictationComponent.started) {
            lesson_detail_dictationComponent.player.autoPlay = false;
            frango.wait.start();
            lesson_detail_wordsComponent.getLessonWords(function (wordsObject) {
                wordsList = []
                for (var index = 0; index < wordsObject.length; index++) {
                    wordsList.push(wordsObject[index].text);
                };
                lesson_detail_dictationComponent.started = true;
                lesson_detail_dictationComponent.player.setPlaylist(wordsList, false,
                    lesson_detail_dictationComponent.dictationDictionary.getWordAudioURL);
                frango.wait.stop();
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
                frango.warning("Sorry, something is wrong! The data is unavailable.");
            }
        });

    };

    this.getRelatedWords = function(word, type, limit, methodToSendData){
        var key = wordknikKey()
        var request_params = { "useCanonical": true, "limit": limit, "api_key": key,
            "relationshipTypes" : type };
        var url = "http://api.wordnik.com:80/v4/word.json/" + word + "/relatedWords";

        frango.ajaxGet({
            url : url,
            data : request_params,
            useFrangoHost : false,
            useAuthorization: false,
            onSuccess : function(data){
               data = JSON.parse(data);
               if(data.length > 0){
                   methodToSendData(data[0].words);
               }else{
                   methodToSendData([]);
               };
               
            },

            onFailure : function(err){
               console.log(err);
               frango.warning('Sorry, something is wrong. The data is unavailable.');
            }
        })
       
    },

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
            
            htmlComponent.find('#' + word + '_synonym').on('click', function(){
               frango.wait.start(element);
               thisObject.getRelatedWords(word, 'synonym', 10, function(words){
                   if(words.length == 0 ){
                       frango.warning('No synonym found!');
                   };
                   var wordObjectsList = [];
                   for (var index = 0; index < words.length; index++) {
                       wordObjectsList.push({'text': words[index]});
                   };
                   bindData(wordObjectsList, null, word + '_synonym');
                   frango.wait.stop(element);
               });
            });
        };
    };

    this.getRandomWords = function(limit, minLength, maxLength){
        var methodOnFinish = undefined;
        var result = {};
        
        result.onFinish = function(method){
           methodOnFinish = method;
        };
         
        var key = wordknikKey()
        var request_params = {"limit": 1, "api_key": key, "hasDictionaryDef": true, "minCorpusCount":1000,
                              "maxCorpusCount":-1, "minDictionaryCount":1, "maxDictionaryCount":-1,
                              "minLength": minLength, "maxLength": maxLength };
        var url = "http://api.wordnik.com:80/v4/words.json/randomWords";
                
        frango.ajaxGet({
            "url": url,
            "data": request_params,
            "useAuthorization": false,
            "useFrangoHost": false,
            "onSuccess": function (words) {
                var words = JSON.parse(words);                 
                methodOnFinish(words);                
            },
            "onFailure": function () {
                //Materialize.toast("Sorry, that's something wrong! The data was unavailable.", 3000);
                frango.warning("Sorry, something is wrong! The data is unavailable.");
            }
        });

        return result;
    };

    var playFromWeb = function (word, reportError) {
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
    var playFromBrowser = function(text, onFinish){        
        if ('speechSynthesis' in window) {
            var msg = new SpeechSynthesisUtterance(text);                
            msg.voiceURI = 'native';
            msg.volume = 1; // 0 to 1
            msg.rate = 0.9; // 0.1 to 10
            msg.pitch = 1; //0 to 2
            msg.lang = 'en-US';        
            msg.onend = function(e) {
                onFinish(true);
            };        
            window.speechSynthesis.speak(msg);
        }else{
            onFinish(false);
        };     
    };

    this.playWordAudio = function (word, reportError) {
         thisObject.playPhrases(word, reportError);
    };
    
    this.playPhrases = function(phrase, reportError){
        if (reportError == undefined || reportError == null) {
            reportError = true;
        };        
        phrase = phrase.trim();
        var playOnException = function(){
            playFromBrowser(phrase, function(success){
                if(!success){
                   var words = phrase.split(" ");
                   playFromWeb(words[0], reportError);
                   if(words.length > 1){
                      frango.warning('Multiple words not supported.');
                   };
                };                
            });
        };

        if ('plugins' in window) {
            TTS.speak({
                text: phrase,
                locale: 'en-US',
                rate: 0.75
            }, function () {
                                
            }, function (reason) {
                playOnException();
            });
        } else {
            playOnException();
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
        /*var instanceID = component.componentID; 
        
        dictionaryComponent.getInitialData(instanceID, function (data) {
            component.bindData(data, true, function () {

            });
        }); */
        dictionaryComponent.getInstance(component.componentID, function(instance){

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
          "safesearch": true, "lang":"en", "per_page": 5};
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
            '     src="[{ (images) webformatURL }]"> '+            
            '<div data-datasetname-empty="metadata" class="hide" > '+
            '   <div>No images found</div> '+
            '   <i class="mdi mdi-emoticon-sad mdi-48px"></i> '+
            '</div>  ';          
    };

    this.openListImage = function (word) {
        frango.wait.start();
        var modalContainer = frango.find('#' + instanceId + 'modal_list_images');
        resetImages(modalContainer);
        getData(word, function (imagesObject) {            
            imagesObject = JSON.parse(imagesObject);
            frango.bindDataOnTemplate('metadata', [{ "word": word }], htmlComponent.first());
            frango.bindDataOnTemplate('images', imagesObject['hits'], htmlComponent.first());
            //$('#' + modalContainer.attr('id')).modal('open');            
            frango.popup.openPopup('#' + modalContainer.attr('id'));            
            frango.wait.stop();
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



app.components.push(function () {
    frango.component('searchDictionary').
        setPathLocalTemplate('components/searchDictionary/template/searchDictionary.html').
        objectGetData(searchDictionaryComponent).
        controller(searchDictionaryComponent.controller).
        register()
});

searchDictionaryComponent = {

    controller: function(component){
       var idComponent = component.componentID + '-searchDictionary';
       var data = {"searchDictionary":[
           {"id":idComponent}
       ]};
       component.bindData(data, true, function(){
           dictionaryComponent.getInstance(idComponent + '-dictionary', function(dictInstance){
               //dictInstance 
               var search = frango.find('#' + idComponent);
               /*btn search */
               search.find('.dict-search-btn').on('click', function(){
                   var words = search.find('[name="search-dictionary-words"]').first().value.trim().split(" ");
                   
                   dictInstance.showDictionary(words, false);
               });
           });
       });
    }
}


app.components.push(function () {
    frango.component('keyboard').
        setPathLocalTemplate('components/keyboard/template/keyboard.html').
        objectGetData(keyboardComponent).
        controller(keyboardComponent.controller).
        register()
});


function keyboardClass(instanceId) {
    //use htmlComponent.find() to access the child elements  
    var htmlComponent = frango.find('#' + instanceId);
    var thisObject = this;
    var keysFirstLine = [];
    var keysSecondLine = [];
    var keysThirdLine = [];
    var keysFourthLine = [];
    var disabledKeys = []
    var onKeyPress = undefined;

    /*write the component functionalites here*/

    var setNormalKeys = function(){
        keysFirstLine = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
        keysSecondLine = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
        keysThirdLine = ['z', 'x', 'c', 'v', 'b', 'n', 'm']    
    };

    var setSpecialCharactersKeys = function(){
        keysFirstLine = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        keysSecondLine = ['@', '#', '$', '_', '&', '-', '+', '(', ')', '/'];
        keysThirdLine = [ '*', '"', "'", ':', ';', '!', '?', '\\']      
    };

    var getKeyHtml = function (key) {
        return frango.format('<div class="center-align cur-pointer keyboard-key" data-key="%s">%s</div>', 
          [key, key]);
    };

    var addFourthLinhe = function(useNormal){
        var fourthLine = htmlComponent.find('.fourth-line'); 
        fourthLine.first().innerHTML = "";
        fourthLine.first().insertAdjacentHTML('beforeend', '<div class="center-align cur-pointer caps-lock special keyboard-key data-key=""> '+
          '<i class="mdi mdi-apple-keyboard-caps"></i></div>');        
        fourthLine.first().insertAdjacentHTML('beforeend', getKeyHtml(','));
        fourthLine.first().insertAdjacentHTML('beforeend', getKeyHtml('.'));
        fourthLine.first().insertAdjacentHTML('beforeend', '<div class="center-align cur-pointer keyboard-key special special-character" data-key="">?123</div>');
        fourthLine.first().insertAdjacentHTML('beforeend', '<div class="center-align cur-pointer keyboard-key special space" data-key=" ">&nbsp</div>');
        //fourthLine.first().insertAdjacentHTML('beforeend', '<div class="center-align cur-pointer keyboard-key special" data-key="#8"><i class="mdi mdi-keyboard-backspace"></i></div>');
        fourthLine.first().insertAdjacentHTML('beforeend', '<div class="center-align cur-pointer keyboard-key special enter" data-key="#13">Enter</div>');        
        

        fourthLine.find('.caps-lock').on('click', function(){
           var caps = frango.find(this);
           var pressed = caps.attr('data-pressed');
           htmlComponent.find('.keyboard-key:not(.special)').loop(function(){
               var key = this; 
               if (pressed == "yes") {
                   key.innerHTML = key.innerHTML.toLowerCase();                   
                   caps.attr('data-pressed', "no");
               }else{
                   key.innerHTML = key.innerHTML.toUpperCase();
                   caps.attr('data-pressed', "yes");
               };
               key.attr('data-key', key.innerHTML);
           });
        });

        fourthLine.find('.special-character').on('click', function(){
            if(useNormal){
                setSpecialCharactersKeys();
                drawKeys(false);                
            }else{
               setNormalKeys();
               drawKeys(true);               
            };            
        });
    };

    var drawKeys = function (useNormal) {   
        
        if(useNormal == undefined || useNormal == null ){
            useNormal = true;
        };
        useNormal?htmlComponent.rmCl('special-character-active'):htmlComponent.adCl('special-character-active');  

        var firstLine = htmlComponent.find('.first-line');
        firstLine.first().innerHTML = "";
        for (var index = 0; index < keysFirstLine.length; index++) {
            var key = keysFirstLine[index];
            firstLine.first().insertAdjacentHTML('beforeend', getKeyHtml(key));
        };

        var secondLine = htmlComponent.find('.second-line');
        secondLine.first().innerHTML = "";
        for (var index = 0; index < keysSecondLine.length; index++) {
            var key = keysSecondLine[index];
            secondLine.first().insertAdjacentHTML('beforeend', getKeyHtml(key));
        };
        var thirdLine = htmlComponent.find('.third-line');
        thirdLine.first().innerHTML = "";
        for (var index = 0; index < keysThirdLine.length; index++) {
            var key = keysThirdLine[index];
            thirdLine.first().insertAdjacentHTML('beforeend', getKeyHtml(key));
        };

        /*backspace */
        thirdLine.first().insertAdjacentHTML('beforeend', '<div class="center-align backspace cur-pointer keyboard-key special" data-key="#8"><i class="mdi mdi-keyboard-backspace"></i></div>');

        addFourthLinhe(useNormal);

        htmlComponent.find('.keyboard-key').on('click', function () {
            if (onKeyPress) {
                if(this.attr('data-disabled') != "yes" && this.attr('data-key')){
                    onKeyPress(this.attr('data-key'));
                };                   
            } else {
                frango.warning('onKeyPress event not provied');
            };
        });
        thisObject.enableAllKeys();
        thisObject.disableKeys();

    };

    this.setTextOnPainel  = function(text){
       htmlComponent.find('.top-bar .aditional-content').html(text);
    };


    this.disableKey = function(key, permanent){
       if(permanent == undefined || permanent == null){
           permanent = true;
       };
       var ele = htmlComponent.find(frango.format('[data-key="%s"]', [key]));
       ele.attr('data-disabled', "yes");
       ele.rmCl('enabled');
       ele.adCl('disabled');
       if(permanent){
           disabledKeys.push(key);
       };
    };

    this.enableKey = function(key){
        var ele = htmlComponent.find(frango.format('[data-key="%s"]', [key]));
        ele.attr('data-disabled', "no");
        ele.rmCl('disabled');
        ele.adCl('enabled'); 
        var idx = disabledKeys.indexOf(key);
        if(idx > -1){
            disabledKeys.splice(idx, 1);
        };
    };

    this.enableAllKeys = function(){
        htmlComponent.find('.keyboard-key').loop(function(){
            thisObject.enableKey(this.attr('data-key'));
        });
    };

    this.disableAllKeys = function(){
        htmlComponent.find('.keyboard-key').loop(function(){
            thisObject.disableKey(this.attr('data-key'));
        });        
    };

    this.disableKeys = function(){
        for (var index = 0; index < disabledKeys.length; index++) {
            thisObject.disableKey(disabledKeys[index], false);            
        };
    };

    this.setDisabledKeys = function(keys){
       disabledKeys = keys;
    };
     
    this.setOnKeyPress = function (keyPressEvent) {
        onKeyPress = keyPressEvent;
    };

    this.hide = function(){
      htmlComponent.adCl('hide');
    };
 
    this.show = function(){
        htmlComponent.rmCl('hide');
    };
    
    this.minimizeOrMaximize = function(){
        var body = htmlComponent.find('.body-keyboard');
        var minimizeEle = htmlComponent.find('.minimize-keyboard');
        if (frango.hasClass('hide', body.first())){
           body.rmCl('hide')
           minimizeEle.adCl('mdi-keyboard-close');
           minimizeEle.rmCl('mdi-keyboard');
        }else{
           body.adCl('hide');
           minimizeEle.rmCl('mdi-keyboard-close');
           minimizeEle.adCl('mdi-keyboard');
        };
    };
    var configureMinimizeKeyboard = function() {
       htmlComponent.find('.minimize-keyboard').on('click', thisObject.minimizeOrMaximize);
    };
    
    var configurePaddingBody = function(){
        var interval = setInterval(function(){
            var body = frango.find('.keyboard-padding');
            if(body.elements.length ==0){
               frango.find('#app').addHTMLBeforeEnd('<div class="keyboard-padding"></div>');
               body = frango.find('.keyboard-padding');
            };
            if (frango.find('.keyBoardComponent').elements.length > 0){
                if (frango.find('.body-keyboard').hasClass('hide')){
                   body.adCl('keyboard-bottom-panel');
                   body.rmCl('keyboard-body-padding');
                }else{
                    body.rmCl('keyboard-bottom-panel');
                    body.adCl('keyboard-body-padding'); 
                };
            }else{
                body.rmCl('keyboard-bottom-panel');
                body.rmCl('keyboard-body-padding');
                clearInterval(interval);
            };
        });
    };

    var __init__ = function () {
        thisObject.hide();
        setNormalKeys();
        drawKeys(true);
        configureMinimizeKeyboard();
        configurePaddingBody();
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



app.components.push(function () {
    frango.component('gallows').
        setPathLocalTemplate('components/gallows/template/gallows.html').
        objectGetData(gallowsComponent).
        controller(gallowsComponent.controller).
        register()
});


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
            frango.warning('You won!');
            //alert('You won!');
            setColorInWord('green');
        } else if (errors == 6) {
            frango.warning('You lose!');
            //alert('You lose');
            setColorInWord('red');
            for (var index = 0; index < actualWord.length; index++) {
                var letter = actualWord[index];
                check(letter);
            };
        };
    };

    var setDisabledKeys = function() {
        if(keyboardInstance){
            keyboardInstance.enableAllKeys();
            keyboardInstance.setDisabledKeys([' ', '#8', '#13']);        
            keyboardInstance.disableKeys();
        };
    };

    var getDefinition = function () {
        dictionaryInstance.getWordDefinition(actualWord, function (definition) {                        
          frango.bindDataOnTemplate('actualword', [{"actualWord":actualWord}]);            
          frango.bindDataOnTemplate('definition', definition);                        
        });
    };

    var __init__ = function () {
        setHtmlDefinition();
        dictionaryInstance = new dictionary(instanceId + 'Dictionary');
        keyboardComponent.getInstance(instanceId + 'Keyboard', function (instance) {
            keyboardInstance = instance;            
            keyboardInstance.setOnKeyPress(checkKeyAswer);
            setDisabledKeys();
            keyboardInstance.show();
        });

        htmlComponent.find('.next-word').on('click', thisObject.newRandomGame)
        //htmlComponent.find('.bn-definition').on('click', getDefinition);
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
        frango.wait.start();
        dictionaryInstance.getRandomWords(1, 5, 20).onFinish(function (words) {
            thisObject.newGame(words[0].word);
            frango.wait.stop();
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
        getDefinition();
        setDisabledKeys();
        
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



app.components.push(function () {
    frango.component('games').
        setPathLocalTemplate('components/games/template/games.html').
        objectGetData(gamesComponent).
        controller(gamesComponent.controller).
        register()
});


gamesComponent = {
    getData : function(){

    },
    controller: function(component){
       component.bindData();
    }
}


app.components.push(function () {
    frango.component('help').
        setPathLocalTemplate('components/help/template/help.html').
        objectGetData(helpComponent).
        controller(helpComponent.controller).
        register()
});


function helpClass(instanceId) {
   //use htmlComponent.find() to access the child elements  
   var htmlComponent = frango.find('#' + instanceId);
   var thisObject = this;
   var helpItens = [];
   var selectedItem = -1;
   
   /*write the component functionalites here*/
   this.addItem = function(message){
       helpItens.push(message);
   };

   this.clear = function(){
       helpItens.clear();
   };
   
   this.showActual = function(){
       if(!helpItens[selectedItem]){
          frango.popup.closePopup(instanceId + ' .popup');          
       }else{
          htmlComponent.find('.content').first().innerHTML = helpItens[selectedItem];    
       };              
   };

   this.showNext = function(){
       selectedItem += 1;
       thisObject.showActual();
     
   };

   this.showPrior = function(){
       if(selectedItem == 0){
           frango.warning('Nothing before!');
           return;
       };
       selectedItem = selectedItem - 1;
       thisObject.showActual();
   };

   this.start = function(){
     frango.popup.openPopup('#' + htmlComponent.attr('id') + ' .popup');
     thisObject.showNext();
   };

   var __init__ = function(){
       htmlComponent.find('.btn.next').on('click', thisObject.showNext);
       htmlComponent.find('.btn.prior').on('click', thisObject.showPrior);
   };

   __init__();

}


helpComponent = {

    controller: function (component) {
        //This implementation permites to create component by url route
        var instanceID = component.componentID;
        helpComponent.getInitialData(instanceID, function(data){
           component.bindData(data, true, function () {
               /*on finish*/ 
               var help = new helpClass(instanceID);
               help.addItem('<h1>TESTE</h1> <div>Este é um teste com html</div>')
               help.addItem('<h1>TESTE 2</h1> <div>Este é um teste com html 2</div>')
               help.start();
           });
        });    

    },
    
    getInitialData : function(componentID, callBack){
        var dataTemplate = {
           'help': [{
                id: componentID
            }]
         };
         callBack(dataTemplate);
       
    },
    
    getInstance : function(componentID, methodToSendInstance){
        /*allowed to use many times without put a component in html*/
        var component = frango.getComponent('help');
        component.componentID = componentID;
        var instanceID = componentID;
        helpComponent.getInitialData(instanceID, function(data){
            frango.find('#' + instanceID).remove();
            component.bindData(data, false, function () {
                var instance = new helpClass(componentID);
                if(methodToSendInstance){
                   methodToSendInstance(instance);    
                };		            
            });    
        });     
    }
};



app.components.push(function () {
    frango.component('crossWords').
        setPathLocalTemplate('components/crossWords/template/crossWords.html').
        objectGetData(crossWordsComponent).
        controller(crossWordsComponent.controller).
        register()
});


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



app.components.push(function () {
    frango.component('imageLibrary').
        setPathLocalTemplate('components/imageLibrary/template/imageLibrary.html').
        objectGetData(imageLibraryComponent).
        controller(imageLibraryComponent.controller).
        register()
});


imageLibraryComponent = {
    getData : function(){

    }, 
    getImagesData : function(methodToSend){
        var dbimages = frango.getCookie('mylanguage-images-db');
        if(dbimages == ""){
            frango.wait.start();
            frango.ajaxGet({
                url: 'get-file/',
                data : {"file": 'english/images/things-db.json'},
                onSuccess : function(data){  
                    frango.wait.stop();
                    frango.setCookie('mylanguage-images-db', data, 5);
                    data = JSON.parse(data);                
                    methodToSend(data);              
                },
     
                onFailure : function(data){
                   frango.wait.stop();
                   frango.warning(data);
                }
            });    
        }else{
            methodToSend(JSON.parse(dbimages));
        }
    },
    controller: function(component){
        imageLibraryComponent.getImagesData(function(data){
            component.bindData({"images":data});
        });               
    }
}


app.components.push(function () {
    frango.component('topics').
        setPathLocalTemplate('components/topics/template/topics.html').
        objectGetData(topicsComponent).
        controller(topicsComponent.controller).
        register()
});


topicsComponent = {
    getData : function(){

    },
    controller: function(component){
       component.bindData();
    }
}


app.components.push(function () {
    frango.component('memoryGame').
        setPathLocalTemplate('components/memoryGame/template/memoryGame.html').
        objectGetData(memoryGameComponent).
        controller(memoryGameComponent.controller).
        register()
});

var memoryGameClass = function (component) {
    var htmlComponent = frango.find("#memoryGame");
    var howManyImagesInGame = 20;
    var template = "";
    var howManyCardsAreClicked = 0;
    var interrogationImagePath = "img/interrogation.png";
    var memoryDictionary = null;

    var cardClick = function () {
        var card = frango.find(this);
        var clicked = card.attr("data-clicked");
        if (clicked == 'clicked' || clicked == "locked") {
            return;
        };

    
        if (howManyCardsAreClicked < 2) {            
            howManyCardsAreClicked += 1;
            var img = card.find('img');
            var src = img.attr('data-src');
            var description = img.attr('alt')
            card.attr('data-clicked', 'clicked');
            card.find('img').attr('src', src);
            frango.find('#header .brand-logo').first().innerHTML = description;

            
            //card.find('.card-description').first().innerHTML = card.find('figcaption').attr('data-title');
            if (howManyCardsAreClicked == 2) {                
                var clickeds = []
                htmlComponent.find('[data-clicked="clicked"]').loop(function () {
                    clickeds.push(this.find('img').attr("alt"));                    
                });

                if (clickeds[0] != clickeds[1]) {                    
                    var timeout = setTimeout(function () {
                        frango.find('#header .brand-logo').first().innerHTML = "Memory game";
                        htmlComponent.find('[data-clicked="clicked"]').loop(function () {                                                        
                            this.find('img').attr('src', interrogationImagePath);
                            //this.find('.card-description').first().innerHTML = "";
                            this.attr('data-clicked', "unclicked");
                            howManyCardsAreClicked = 0;                            
                        });                                            
                        clearTimeout(timeout);
                    }, 2000);
                }else{
                    memoryDictionary.playPhrases(description, false);
                    htmlComponent.find('[data-clicked="clicked"]').attr("data-clicked", "locked");
                    howManyCardsAreClicked = 0;
                    if(frango.find('.memory-game:not([data-clicked="locked"])').elements.length == 0){
                        frango.warning('You won!'); 
                    };
                };
                
            };
        };
    };
    
    var getRandomArbitrary  = function(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    };

    var randomizeArray = function(array){
        var maxIndex = array.length;
        var newArray = [];
        var randomIndexes = []
        var random = 0;
        for (var index = 0; index < array.length; index++) {
            random = getRandomArbitrary(0, maxIndex);
            while (randomIndexes.indexOf(random) != -1) {
                random = getRandomArbitrary(0, maxIndex);
            };
            randomIndexes.push(random);
            newArray.push(array[random]);
        };
        return newArray;
    }

    var newGame = function () {
        imageLibraryComponent.getImagesData(function (images) {
            howManyCardsAreClicked = 0;
            htmlComponent.find('.template').first().innerHTML = template;
            var randomIndexes = []
            var random = 0;
            var maxIndex = images.length;
            var imagesToGame = [];

            if (maxIndex <= howManyImagesInGame) {
                howManyImagesInGame = maxIndex;
                frango.warning('The limit for pairs is ' + maxIndex);
            };

            for (var index = 0; index < howManyImagesInGame; index++) {
                random = getRandomArbitrary(0, maxIndex);
                while (randomIndexes.indexOf(random) != -1) {
                    random = getRandomArbitrary(0, maxIndex);
                };
                randomIndexes.push(random);
                imagesToGame.push(images[random]);
                imagesToGame.push(images[random]);
            };

            imagesToGame = randomizeArray(imagesToGame);

            frango.bindDataOnTemplate('memorycards', imagesToGame, htmlComponent.find('.template').first());
            htmlComponent.find('.memory-game').on('click', cardClick);
            
        });
    };

    var __init__ = function () {
        template = htmlComponent.find('.template').first().innerHTML;
        htmlComponent.find('.refresh').on('click', function(){
            howManyImagesInGame = parseInt(htmlComponent.find('.pairs').first().value);
            newGame();
            frango.warning('Refreshed');
        });
        htmlComponent.find('.pairs').loop(function(){            
           this.value = howManyImagesInGame; 
        });

        memoryDictionary = new dictionary('memoryGameDictionary');
    
        newGame();
        
    };

    __init__();

}


memoryGameComponent = {
    getData: function () {

    },
    controller: function (component) {
        component.bindData([], true, function () {
            var game = new memoryGameClass(component);
        });
    }
}
