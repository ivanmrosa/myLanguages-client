
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
            '<div style="float:left"><h4 data-datasetname="metadata" data-self="true">[{ (metadata) word }]</h4> ' +
            ' <img class="responsive-img float" data-datasetname="images"  data-self="true" ' +
            '     src="[{ (images) webformatURL }]"> </div> '+            
            '<div data-datasetname-empty="images" style="float:left;width:100%;height:100%" > '+
            '   <div style="float;left;width:100%;text-align:center">No images found</div> '+
            ' <div style="float:left;text-align:center;width:100%">  '+
            '   <i class="mdi mdi-emoticon-sad mdi-48px"></i> '+
            ' </div> '+
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

