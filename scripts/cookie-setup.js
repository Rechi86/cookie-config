/* 
 * Basic Cookie Setup & Destroy Functionality
 */

function resetCookies() {
    Object.keys(Cookies.get()).forEach(function(cookieName) {
        var neededAttributes = {
          // Here you pass the same attributes that were used when the cookie was created
          // and are required when removing the cookie
        };
        Cookies.remove(cookieName, neededAttributes);
      });
}


function initCookies(paths, config) {

    let cookieState = Cookies.get("cookie-setup");
    
    // list of individually activted providers
    let cookieProviders = Cookies.get("cookie-providers");

    // inital state
    if (!cookieState) {
        //show menu if configured
        if(config.showPopup){
            if(!document.getElementById("cookie-setup-overlay")){


                let overlayDiv = document.createElement("div");
                overlayDiv.id = "cookie-setup-overlay";
                
                let overlayHtml =
                    '<div id="cookie-setup">'+
                        '<div id="cookie-setup-container">'+
                            '<h3>'+ config.popupTitle+'</h3>'+
                            '<p>'+ config.popupDescription+'<a href="'+ config.termsLink+'">Weitere Infos</a>'+
                        '</p>'+
                        
                        '<button id="cookie-setup-allow-functional" class="btn">Funktionscookies erlauben</button>'+
                        '<button id="cookie-setup-allow-all" class="btn">Alle Cookies erlauben</button>'+
                        
                        '</div>'+
                    '</div>';

                overlayDiv.innerHTML = overlayHtml;
                let body = document.querySelector('body');
                body.appendChild(overlayDiv);  
                  
            }

            document.getElementById("cookie-setup-overlay").classList.add('show');
            
            // asign button listeners
            document.getElementById("cookie-setup-allow-all").onclick = function () { setCookieConfig(true); };
            document.getElementById("cookie-setup-allow-functional").onclick = function () { setCookieConfig(false); };
        }
        wrapIframes();
    }

    // only functional cookies -> show blocked iframe info
    if (cookieState === "functional") {

        wrapIframes();
    }

    // all cookies allowed -> activate iframes, add additional scripts
    if (cookieState === "all") {
        addScripts(paths);
        addIframes();
    }
}


// callback for setting a cookie selection
function setCookieConfig(all) {

    if (all) {
        Cookies.set('cookie-setup', 'all');
    } else {
        Cookies.set('cookie-setup', 'functional');
    }

    location.reload();
}


// Add additional scripts based on array of script-objects
function addScripts(scripts) {
    if(scripts){
        for (var i = 0, len = scripts.length; i < len; i++) {

            var script = document.createElement('script');

            // map all script properies to the newly created element
            for (var prop in scripts[i]) {
                if (scripts[i].hasOwnProperty(prop)) {
                    script[prop] = scripts[i][prop];
                }
            }

            document.head.appendChild(script);
        }
    }
}

// Activate all iframes
function addIframes() {
    var frames = document.getElementsByTagName("iframe");
    
    // run over all iframes
    Array.from(frames).forEach(element => {

        if(element.hasAttribute("data-src")){
               
                info = element.nextElementSibling;
                if(info){
                    info.remove();
                }
                element.src = element.dataset.src;
            } 

        });
} 


// Wrapp all Externala content like Iframes and scripts with Blocked Info
function wrapIframes() {
    var frames = document.getElementsByTagName("iframe");
    
    // run over all iframes
    Array.from(frames).forEach(element => {

        if(element.hasAttribute("data-src")){
            if(Cookies.get("cookie-provider-" + element.dataset.cookieId)){
               
                info = element.nextElementSibling;
                if(info){
                    info.remove();
                }
                element.src = element.dataset.src;
            } else {
                wrapBlocked(element);
            }
        } else {
            element.remove();
        } 
    });
}

// Helper Function for adding blocked Info
// automatically turn iframes into blocked Elements
function wrapBlocked(el) {
    if(!el.nextElementSibling){
        var wrapper = document.createElement('div');

        wrapper.classList.add("cookie-setup-blocked-wrapper");


        wrapper.innerHTML += "<div class='cookie-setup-blocked-info'>" +
            "<p>Dieser Inhalt liegt bei einem Drittanbieter (" +  el.dataset.cookieProvider + ").<br>"+
            " Um den Inhalt abzurufen, musst du den <a href='"+ el.dataset.cookieDataprotection +"' target='_blank'>Datenschutzrichtlinien von "+el.dataset.cookieProvider+"</a>" + " zustimmen.</p>"+
            "<button class='cookie-allow-provider' data-cookie-id='"+ el.dataset.cookieId +"' >Zustimmen und Inhalt anzeigen</button></div>";

        el.parentNode.appendChild(wrapper);

        var allowAllButton = wrapper.getElementsByClassName("cookie-allow-all"); 
        if(allowAllButton[0]){
            allowAllButton[0].addEventListener("click", function () { 
                setCookieConfig(true); 
            });
        }

        var allowProviderButton = wrapper.getElementsByClassName("cookie-allow-provider"); 
        if(allowProviderButton[0]){
            allowProviderButton[0].addEventListener("click", function (event) { 
                Cookies.set("cookie-provider-"+ event.target.dataset.cookieId, 'allowed');
                wrapIframes();
            });
        }
    }
}
/* ----------------   Init of Script  ------------------*/
// Set additional scripts to be loaded after allowing the cookies -> like google analytics
// Info:  Some html-properties need camelcase js-Properties, e.g. crossorign -> crossOrigin

let scripts = [
    {
        "src":"./scripts/test/evilTrackingScript.js"
    },
    {
        "src":"https://code.jquery.com/jquery-3.4.1.min.js",
        "integrity":"sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=",
        "crossOrigin":"anonymous"
    }
];

document.addEventListener('DOMContentLoaded', function(){
    initCookies(scripts, {
        showPopup:true,

        popupTitle:"Diese Seite verwendet Cookies",
        popupDescription:
            "Wir verwenden Cookies, um erweiterte Seitenfunktionen zu ermöglichen und die Zugriffe auf diese Website zu analysieren."+
            "Sie können Ihre Einstellungen jederzeit auf der Datenschutz-Seite zurücksetzen.",
        termsLink:"/datenschutz",
    });   
}, false);

// example for iframe
//<iframe data-cookie-id="youtube" data-cookie-provider="Youtube" data-cookie-dataprotection="http://www.pundr.at" data-src="https://www.youtube.com/embed/k8v_l5iGJZM" src="about:blank" ></iframe>
        
// example for reset button
// <a href="" onclick="resetCookies()">Cookie Einstellungen zurücksetzen</a>