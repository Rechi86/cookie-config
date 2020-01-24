/* 
 * Basic Cookie Setup & Destroy Functionality
 */

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
    document.getElementById("cookie-setup-allow-all").onclick =function(){setCookieConfig(true)};
    document.getElementById("cookie-setup-save").onclick =function(){setCookieConfig(false)};
    
    let cookieState = Cookies.get("cookie-setup");
    
    // no selection created -> show menu
    if(!cookieState){
        document.getElementById("cookie-setup").classList.add('show');
        cookieInterval =window.setInterval(checkCookies,3000);
        //wrapAllIframes();
        addAllowedIframes();
    }
    
    // custom setup
    if(cookieState=="custom"){
       activeCookies = Cookies.get("cookie-setup-cookies");
       activeCategories = Cookies.get("cookie-setup-categories");
       
       allowedCookies = allowedCookies.concat(activeCookies.split(','));
       allowedCategeories = allowedCategories.concat(activeCategories.split(',')); 

       addAllowedScripts();
       addAllowedIframes();
       
        // Check & Delete Cookies per interval
        cookieInterval= window.setInterval(checkCookies,3000);
    }

    // all cookies allowed
    if(cookieState=="all"){
        //window.console.log(cookieInterval);
    }
}


// callback for setting a custom cookie selection
function setCookieConfig(all){
    let activeCookies = "";
    let activeCategories ="";
    let activePaths ="";
    let activeIframes ="";
    
    let categoryContainer = document.getElementById("cookie-category-container");
    let children = categoryContainer.children;
    for (let i = 0; i < children.length; i++) {
        if((children[i].checked===true || all) && children[i].value){
            activeCookies +=children[i].value+",";
            activeCategories +=children[i].dataset.category+",";
            
            if(children[i].dataset.url){
                activePaths += children[i].dataset.url+",";
            }
            
            if(children[i].dataset.iframe){
                activeIframes += children[i].dataset.iframe+",";
            }
        }
    }       

    Cookies.set('cookie-setup','custom');
    if(activeCookies!=""){
        Cookies.set('cookie-setup-cookies',activeCookies);
        Cookies.set('cookie-setup-categories',activeCategories);
        Cookies.set('cookie-setup-paths',activePaths);
        Cookies.set('cookie-setup-iframes',activeIframes);
    }
    location.reload();
}

// helper-function for adding external scripts
function addScript(url){
    var script = document.createElement('script');
    script.onload = function () {
        //do stuff with the script
    };
    script.src = url;

    document.head.appendChild(script);
}

function addAllowedScripts(){

   let allowedPaths = Cookies.get("cookie-setup-paths");
   allowedPaths = allowedPaths.split(',');

   for (var i = 0, len = allowedPaths.length; i < len; i++) {
        addScript(allowedPaths[i]);
    }

}

function addAllowedIframes(){
    let allowedIframes = Cookies.get("cookie-setup-iframes");
    if(allowedIframes){
        
        allowedIframes = allowedIframes.split(',');

        var i, frames;
        frames = document.getElementsByTagName("iframe");
        for (i = 0; i < frames.length; ++i)
        {
            let hit = false;
            for (j = 0; j <allowedIframes.length;j++){
                if(frames[i].dataset.iframe == allowedIframes[j]){
                    hit=true;
                }
            }
            // The iFrame
            if(hit){
                // Version using sandbox-Attribute
                //frames[i].setAttribute("sandbox", "allow-same-origin allow-scripts");
                
                // Version using data-src 
                frames[i].src = frames[i].dataset.src;
            }
            else {
                wrapBlocked(frames[i]);
            }
        }
    } else {
        wrapAllIframes();
    }
};

// Wrapp all Iframes with Blocked Info
function wrapAllIframes(){
    frames = document.getElementsByTagName("iframe");
    for (i = 0; i < frames.length; ++i){
        wrapBlocked(frames[i]);
    }
}

// Activate Iframe e.g. with Element Button
function activateIframeCategory(category){
    activeCategories =Cookies.get('cookie-setup-iframes');
    Cookies.set('cookie-setup-iframes',activeCategories+","+category);
    frames = document.getElementsByTagName("iframe");
    for (i = 0; i < frames.length; ++i)
    {
        if(frames[i].dataset.iframe == category){
            
            frames[i].src = frames[i].dataset.src;
            
            parentElement = frames[i].parentNode.parentNode;
            blockedElement = frames[i].parentNode;
            
            parentElement.insertBefore(frames[i],frames[i].parentNode);
            parentElement.removeChild(blockedElement);
        }
    }
}


// Helper Function for adding blocked Info
function wrapBlocked(el) {
    var wrapper = document.createElement('div');
    
    var iframeCategory = el.dataset.iframe;
    var categoryReadable = iframeCategory[0].toUpperCase() + iframeCategory.slice(1);
    wrapper.classList.add("cookie-setup-blocked");

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    wrapper.innerHTML += "<div class='cookie-setup-blocked-info'>"+
            "<p>Inhalt von "+ categoryReadable + " blockiert</p>" +
            "<button class='btn' >Cookies von "+ categoryReadable + " erlauben</button></div>";
    button = wrapper.getElementsByTagName("button");
    button[0].addEventListener("click",function(){activateIframeCategory(iframeCategory);});
}

function removeAllCookies(){
    Object.keys(Cookies.get()).forEach(function(cookieName) {       
        Cookies.remove(cookieName);
    });
}


document.addEventListener('DOMContentLoaded', function(){
    setupTestCookies();
    allowedCookies =["cookie-setup", "cookie-setup-cookies","cookie-setup-categories","cookie-setup-paths", "cookie-setup-iframes"];
    allowedCategories = ["system"];
    initCookies();   
}, false);





