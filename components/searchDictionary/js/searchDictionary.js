searchDictionaryComponent = {

    controller: function(component){
       var idComponent = component.componentID + '-searchDictionary';
       var data = {"searchDictionary":[
           {"id":idComponent}
       ]};
       component.bindData(data, true, function(){
           dictionaryComponent.getInstance(idComponent + '-dictionary', function(dictInstance){
               //dictInstance 
               var search = frango.find('#' + idComponent);
               /*btn search */
               search.find('.dict-search-btn').on('click', function(){
                   var words = search.find('[name="search-dictionary-words"]').first().value.trim().split(" ");
                   
                   dictInstance.showDictionary(words, false);
               });
           });
       });
    }
}
