
topicsComponent = {
    getData : function(){

    },
    controller: function(component){
       component.bindData([], true, function(){
          frango.horizontalScroll(false, '.topics');           
       });
    }
}
