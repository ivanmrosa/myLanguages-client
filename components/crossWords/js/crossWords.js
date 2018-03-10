
function crossWordsClass(instanceId) {
   //use htmlComponent.find() to access the child elements  
   var htmlComponent = frango.find('#' + instanceId);

   /*write the component functionalites here*/
}


crossWordsComponent = {

    controller: function (component) {
        //This implementation permites to create component by url route
        var instanceID = component.componentID;
        crossWordsComponent.getInitialData(instanceID, function(data){
           component.bindData(data, true, function () {
               /*on finish*/ 
           });
        });    

    },
    
    getInitialData : function(componentID, callBack){
        var dataTemplate = {
           'crossWords': [{
                id: componentID
            }]
         };
         callBack(dataTemplate);
       
    },
    
    getInstance : function(componentID, methodToSendInstance){
        //This implementation permites to create reusable component. The property data-auto-create in the component html must be setted to "no".
        frango.useNestedComponent(componentID, function(){            
            var component = frango.getComponent('crossWords');
            var instanceID = component.componentID;
            
            crossWordsComponent.getInitialData(instanceID, function(data){
                component.bindData(data, true, function () {
		            var instance = new crossWordsClass(componentID);
                    if(methodToSendInstance){
                       methodToSendInstance(instance);    
                    };		            
                });    
            }); 
        });
    }
};

