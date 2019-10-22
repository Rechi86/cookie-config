/* 
 * Basic Cookie Setup & Destroy Functionality
 */

/* old Way using config object
var cookieCategories = {
    "system":["./scripts/test/systemScript1.js","./scripts/test/systemScript2.js"],
    "tracking":["./scripts/test/trackingScript1.js","./scripts/test/trackingScript2.js"]    
};*/

var cookieScriptPaths;


// setup some cookies for testing
function setupTestCookies(){
    document.cookie = "username=John Doe; path=/";
    document.cookie = "tester=John Doe; path=/";
    document.cookie = "system1=John Doe; path=/";
    document.cookie = "system2=John Doe; path=/";
    document.cookie = "tracking1=John Doe; path=/";
    document.cookie = "tracking2=John Doe; path=/";
}

// intervall-function which removes cookies wich are not allowed
function checkCookies(){
    var activeCookies = Object.keys(Cookies.get());    
    activeCookies.forEach (function(element) {
        if(allowedCookies.indexOf(element)==-1){
            Cookies.remove(element);
        }
    });   
}

function initCookies(){
    // asign button listeners
    document.getElementById("cookie-setup-allow-all").onclick =allowAllCookies;
    document.getElementById("cookie-setup-save").onclick =setCookieConfig;
    
    let cookieState = Cookies.get("cookie-setup");
    
    // no selection created -> show menu
    if(!cookieState){
        document.getElementById("cookie-setup").classList.add('show');
        cookieInterval =window.setInterval(checkCookies,3000);
    }
    
    // custom setup
    if(cookieState=="custom"){
       activeCookies = Cookies.get("cookie-setup-cookies");
       activeCategories = Cookies.get("cookie-setup-categories");
       
       allowedCookies = allowedCookies.concat(activeCookies.split(','));
       allowedCategeories = allowedCategories.concat(activeCategories.split(',')); 
       console.log(allowedCookies);
       addAllowedScripts();
       cookieInterval= window.setInterval(checkCookies,3000);
    }

    // all cookies allowed
    if(cookieState=="all"){
        window.console.log(cookieInterval);
    }
}

// callback for allowing all cookies
function allowAllCookies(){
    Cookies.set('cookie-setup','all',{path:''});
    location.reload();
}

// callback for setting a custom cookie selection
function setCookieConfig(){
    let activeCookies = "";
    let activeCategories ="";
    let activePaths ="";
    
    let categoryContainer = document.getElementById("cookie-category-container");
    let children = categoryContainer.children;
    for (let i = 0; i < children.length; i++) {
        if(children[i].checked===true && children[i].value){
            activeCookies +=children[i].value+",";
            activeCategories +=children[i].dataset.category+",";
            activePaths += children[i].dataset.url+",";
        }
    }       
    
    Cookies.set('cookie-setup','custom');
    if(activeCookies!=""){
        Cookies.set('cookie-setup-cookies',activeCookies);
        Cookies.set('cookie-setup-categories',activeCategories);
        Cookies.set('cookie-setup-paths',activePaths);
    }
    location.reload();
}

// function for adding external scripts
function addScript(url){
    var script = document.createElement('script');
    script.onload = function () {
        //do stuff with the script
    };
    script.src = url;

    document.head.appendChild(script);
}

function addAllowedScripts(){
    /* Old Way using config object
    for (var category in cookieCategories){
        if(allowedCategories.indexOf(category)!==-1){
            cookieCategories[category].forEach(function (path){
                addScript(path);
            });
        }
    }
    */
   let allowedPaths = Cookies.get("cookie-setup-paths");
   allowedPaths = allowedPaths.split(',');

   for (var i = 0, len = allowedPaths.length; i < len; i++) {
        addScript(allowedPaths[i]);
    }

}

document.addEventListener('DOMContentLoaded', function(){
    setupTestCookies();
    allowedCookies =["cookie-setup", "cookie-setup-cookies","cookie-setup-categories","cookie-setup-paths"];
    allowedCategories = ["system"];
    initCookies();   
}, false);



