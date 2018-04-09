var memoryGameClass = function (component) {
    var htmlComponent = frango.find("#memoryGame");
    var howManyImagesInGame = 20;
    var template = "";
    var howManyCardsAreClicked = 0;
    var interrogationImagePath = "img/interrogation.png";
    var memoryDictionary = null;

    var cardClick = function () {
        var card = frango.find(this);
        var clicked = card.attr("data-clicked");
        if (clicked == 'clicked' || clicked == "locked") {
            return;
        };

        

        if (howManyCardsAreClicked < 2) {            
            howManyCardsAreClicked += 1;
            var img = card.find('img');
            var src = img.attr('data-src');
            var description = img.attr('alt')
            card.attr('data-clicked', 'clicked');
            card.find('img').attr('src', src);
            frango.find('#header .brand-logo').first().innerHTML = description;

            
            //card.find('.card-description').first().innerHTML = card.find('figcaption').attr('data-title');
            if (howManyCardsAreClicked == 2) {                
                var clickeds = []
                htmlComponent.find('[data-clicked="clicked"]').loop(function () {
                    clickeds.push(this.find('img').attr("alt"));                    
                });

                if (clickeds[0] != clickeds[1]) {                    
                    var timeout = setTimeout(function () {
                        frango.find('#header .brand-logo').first().innerHTML = "Memory game";
                        htmlComponent.find('[data-clicked="clicked"]').loop(function () {                                                        
                            this.find('img').attr('src', interrogationImagePath);
                            //this.find('.card-description').first().innerHTML = "";
                            this.attr('data-clicked', "unclicked");
                            howManyCardsAreClicked = 0;                            
                        });                                            
                        clearTimeout(timeout);
                    }, 2000);
                }else{
                    memoryDictionary.playPhrases(description, false);
                    htmlComponent.find('[data-clicked="clicked"]').attr("data-clicked", "locked");
                    howManyCardsAreClicked = 0;
                    if(frango.find('.memory-game:not([data-clicked="locked"])').elements.length == 0){
                        frango.warning('You won!'); 
                    };
                };
                
            };
        };
    };
    
    var getRandomArbitrary  = function(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    };

    var randomizeArray = function(array){
        var maxIndex = array.length;
        var newArray = [];
        var randomIndexes = []
        var random = 0;
        for (var index = 0; index < array.length; index++) {
            random = getRandomArbitrary(0, maxIndex);
            while (randomIndexes.indexOf(random) != -1) {
                random = getRandomArbitrary(0, maxIndex);
            };
            randomIndexes.push(random);
            newArray.push(array[random]);
        };
        return newArray;
    }

    var newGame = function () {
        imageLibraryComponent.getImagesData(function (images) {
            howManyCardsAreClicked = 0;
            htmlComponent.find('.template').first().innerHTML = template;
            var randomIndexes = []
            var random = 0;
            var maxIndex = images.length;
            var imagesToGame = [];

            if (maxIndex <= howManyImagesInGame) {
                howManyImagesInGame = maxIndex;
                frango.warning('The limit for pairs is ' + maxIndex);
            };

            for (var index = 0; index < howManyImagesInGame; index++) {
                random = getRandomArbitrary(0, maxIndex);
                while (randomIndexes.indexOf(random) != -1) {
                    random = getRandomArbitrary(0, maxIndex);
                };
                randomIndexes.push(random);
                imagesToGame.push(images[random]);
                imagesToGame.push(images[random]);
            };

            imagesToGame = randomizeArray(imagesToGame);

            frango.bindDataOnTemplate('memorycards', imagesToGame, htmlComponent.find('.template').first());
            htmlComponent.find('.memory-game').on('click', cardClick);
            
        });
    };

    var __init__ = function () {
        template = htmlComponent.find('.template').first().innerHTML;
        htmlComponent.find('.refresh').on('click', function(){
            howManyImagesInGame = parseInt(htmlComponent.find('.pairs').first().value);
            newGame();
            frango.warning('Refreshed');
        });
        htmlComponent.find('.pairs').loop(function(){            
           this.value = howManyImagesInGame; 
        });

        memoryDictionary = new dictionary('memoryGameDictionary');
    
        newGame();
        
    };

    __init__();

}


memoryGameComponent = {
    getData: function () {

    },
    controller: function (component) {
        component.bindData([], true, function () {
            var game = new memoryGameClass(component);
        });
    }
}
