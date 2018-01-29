
homeComponent = {
    getData : function(){

    },
    controller: function(component){       
       component.bindData([], true, function(){
           $('.collapsible').collapsible();
       });
    }
}
