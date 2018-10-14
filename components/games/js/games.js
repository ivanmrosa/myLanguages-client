
gamesComponent = {
    getData : function(){

    },
    controller: function(component){
       component.bindData([], false, function(){          
        frango.horizontalScroll(false, '.games');
       });
    }
}
