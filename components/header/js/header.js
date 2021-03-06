
headerComponent = {
    getData : function(){

    },
    controller: function(component){
        var extra = component.extra_data;
        if(extra){
           extra = JSON.parse(extra);
        };
        var config = {"title": "", "url":"", "display": "", "execute": "window.history.back()", "classDictionary": "visible"};
        var hash = frango.app.getURL();
        if(hash == "#"){
            hash = "";
        };
        switch (hash) {
            case "":
                config["title"] = "home";
                config["display"] = "block"; 
                config["icon"]  = "mdi-menu"
                config["execute"]  = "headerComponent.showMenu()"
                menuComponent.controller(frango.getComponent('menu'));
                break;
            case "login":
                config["title"] = "login";
                config["display"] = "none";    
                config["classDictionary"] = "invisible";
                break;
            case "categories":
                config["title"] = "categories";
                config["display"] = "block";                
                break
            case "lessons":
                config["title"] = "lessons";
                config["display"] = "block";                
                break
            case "lesson/detail/":
                config["title"] = "lesson detail";
                config["display"] = "block";                
                break                    
            case "signup":
                config["title"] = "Sign up";
                config["display"] = "block";                
                break     
            case "search-dictionary":
                config["title"] = "Dictionary";
                config["display"] = "block";                
                break                                     
                
            default:
                config["title"] = extra["title"];
                config["display"] = extra["display_icon"] || "block";
        }
        
        
        component.bindData({"header":[config]});        
    },

    showMenu : function(){
        //$('.top-link-navigate').sideNav('show');         
        frango.find('#button-menu').first().click();
    }
}
