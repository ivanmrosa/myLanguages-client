
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

