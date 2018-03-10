
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
