
menuComponent = {
    getData : function(){

    },
    controller: function(component){
       component.selector_to_bind = "#menu";
       component.bindData([], true, function(){
          $(".button-collapse").sideNav();
       });
    }
}
