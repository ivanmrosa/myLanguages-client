
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
