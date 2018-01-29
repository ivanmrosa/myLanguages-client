
list_word_imagesComponent = {
    getKey: function () {
        return "7504667-62e4222bd016b8037990064a7";
    },

    getBaseURL: function () {
        return "https://pixabay.com/api/"
    },



    getData: function (word, methodToSendData) {
        params = { "key": list_word_imagesComponent.getKey(), "image_type": "all", "q": word,
          "safesearch": true, "lang":"en"};
        frango.ajaxGet({
            "url": list_word_imagesComponent.getBaseURL(),
            "data": params,
            "onSuccess": methodToSendData,
            "onFailure": methodToSendData,
            "useAuthorization": false,
            "useFrangoHost": false
        });
    },

    resetImages: function () {
        frango.find('#modal_list_images').first().innerHTML =
            '<h4 data-datasetname="metadata" data-self="true">[{ (metadata) word }]</h4> ' +
            ' <img class="responsive-img" data-datasetname="images"  data-self="true" ' +
            '     src="[{ (images) webformatURL }]"> ';

    },

    openListImage: function (word, ) {
        list_word_imagesComponent.resetImages();
        list_word_imagesComponent.getData(word, function (imagesObject) {
            imagesObject = JSON.parse(imagesObject);
            frango.bindDataOnTemplate('metadata', [{ "word": word }]);
            frango.bindDataOnTemplate('images', imagesObject['hits'])
            $('#modal_list_images').modal('open');
        });
    },

    controller: function (component) {
        component.bindData([], true, function () {
            $('.modal').modal();
        });
    }
}
