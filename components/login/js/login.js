
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
