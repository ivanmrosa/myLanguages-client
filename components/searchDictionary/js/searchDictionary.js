searchDictionaryComponent = {

    controller: function(component){
       component.bindData([], true, function(){
           dictionaryComponent.getInstance('dictionary-search-dictionary', function(dictInstance){
               //dictInstance 
               var search = frango.find('.search-dictionay');
               /*btn search */
               search.find('.dict-search-btn').on('click', function(){
                   var words = frango.find('#search-dictionary-words').first().value.trim().split(" ");
                   
                   dictInstance.showDictionary(words, false);
               });
           });
       });
    }
}
