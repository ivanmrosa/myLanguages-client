
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

