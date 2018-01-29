
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

