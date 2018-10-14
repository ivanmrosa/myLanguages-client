
homeComponent = {
    getData : function(){

    },
    controller: function(component){       
       component.bindData([], true, function(){
           //$('.collapsible').collapsible();
           var firstAccess = frango.getCookie('first-access');
           if(!firstAccess){              
              frango.setCookie('first-access', false);
              homeComponent.showHelp();
           };
       });
    },

    getHelpStepOne : function(){
        var html = '<h5 class="center-align white-text blue">Bem vindo !</h5>';
        html += '<div class="align-justify">';        
        html += 'Aprenda a usar aqui o vocplus. Este tutorial pode ser visto a qualquer ';
        html += 'momento acessando a opção "Ajuda" entrando em "more". ';
        html += '</div>';        
        return html;
    },
    getHelpStepTwo : function(){
        var html = '<h5 class="center-align white-text blue">Lições</h5>';
        html += '<div class="align-justify">';
        html += 'O vocplus possui várias lições para aprendizagem de vocabulário. ';
        html += 'A lição pode ser acessada através do ícone play na tela inicial no menu "Your Actual Lesson". ';
        html += 'O painel no menu apresenta algumas informações como a pontuação mínima e a pontuação alcançada.';
        html += '</div>';
        return html;
    },
    getHelpStepThree : function(){
        var html = '<h5 class="center-align white-text blue">Lições - palavras</h5>';
        html += '<div class="align-justify">';        
        html += 'Ao acessar uma lição, será mostrada uma lista de palavras. ';
        html += 'Elas devem ser lidas e escutadas várias vezes, assim como é importante ler as definições ';
        html += 'e acessar as imagens relacionadas, pois podem ajudar no entendimento. ';
        html += 'Ao selecionar uma palavra ou uma frase, opções extras são apresentadas, como por exemplo: ';
        html += 'definição, audio, e tradução. Em qualquer lugar do aplicativo pode-se utilizar esta ferramenta.';
        html += '</div>';        
        return html;
    },
    getHelpStepFour : function(){
        var html = '<h5 class="center-align white-text blue">Lições - pronúncia e ditado</h5>';
        html += '<div class="align-justify">';        
        html += 'As lições também apresentam ditado e treinamento de pronúncia. ';
        html += 'Para poder acessar a próxima lição é necessário realizar estas tarefas atingindo no mínimo 70 pontos. ';
        html += 'Cada acerto garante dois pontos, seja no ditado ou no treino de prónuncia. ';
        html += 'Quando os 70 pontos forem atingindos, um novo botão será apresentado na tela inicial para que a próxima lição seja iniciada.';        
        html += '</div>';        
        return html;
    },
    getHelpStepFive : function(){
        var html = '<h5 class="center-align white-text blue">Resumo</h5>';        
        html += '<ul class="collection">';
        html += '<li class="collection-item">Ouça, leia e pronunicie as palavras várias vezes.</li>';
        html += '<li class="collection-item">Selecione palavras e frases em qualquer lugar para obter novas opções.</li>';
        html += '<li class="collection-item">Utilize os dicionários para sanar dúvidas. Várias palavras podem digitadas em uma mesma pesquisa.</li>';        
        html += '<li class="collection-item">Utilize os jogos para complementar o aprendizado.</li>';                
        html += '</ul>';        
        return html;
    },

    showHelp : function(){
      /* helpComponent.getInstance('homeHelp',function(help){
           help.addItem(homeComponent.getHelpStepOne());
           help.addItem(homeComponent.getHelpStepTwo());
           help.addItem(homeComponent.getHelpStepThree());
           help.addItem(homeComponent.getHelpStepFour());
           help.addItem(homeComponent.getHelpStepFive());           
           help.start();
       });*/
    }
}
