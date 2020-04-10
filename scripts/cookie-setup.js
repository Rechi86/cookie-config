/* 
 * Basic Cookie Setup & Destroy Functionality
 */
document.addEventListener('DOMContentLoaded', function(){
    initCookies();   
}, false);

function initCookies(paths) {
    // asign button listeners
    document.getElementById("cookie-setup-allow-all").onclick = function () { setCookieConfig(true); };
    document.getElementById("cookie-setup-allow-functional").onclick = function () { setCookieConfig(false); };

    let cookieState = Cookies.get("cookie-setup");

    // inital state -> show menu
    if (!cookieState) {
        document.getElementById("cookie-setup-overlay").classList.add('show');
        wrapAllExternal();
    }

    // only functional cookies -> show blocked iframe info
    if (cookieState === "functional") {
        wrapAllExternal();
    }

    // all cookies allowed -> activate iframes, add additional scripts
    if (cookieState === "all") {
        addScripts(paths);
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
                    console.log(scripts[i][prop]);
                    script[prop] = scripts[i][prop];
                }
            }

            document.head.appendChild(script);
        }
    }
}

// Wrapp all Externala content like Iframes and scripts with Blocked Info
function wrapAllExternal() {
    var frames = document.getElementsByTagName("iframe");
    while(frames.length > 0){
        wrapBlocked(frames[0]);
        frames[0].remove();
    }

    var scripts = document.body.getElementsByTagName('script');
    var extscripts = [];
    //collect scripts loaded via src attribute
    for(var i=0; i < scripts.length; i++){
        //this could check for allowed scripts
        if(scripts[i].src){
            extscripts.push(scripts[i]);
        }
    }
    //add wrapper and then delete script element
    for(var i=0; i < extscripts.length; i++){
        wrapBlocked(extscripts[i]);
        extscripts[i].remove();
    }
}

// Helper Function for adding blocked Info
function wrapBlocked(el) {
    var wrapper = document.createElement('div');

    wrapper.classList.add("cookie-setup-blocked-wrapper");

    wrapper.innerHTML += "<div class='cookie-setup-blocked-info'>" +
        "<p>Inhalt von von Drittanbieter blockiert</p>" +
        "<button class='btn' >Alle Cookies erlauben</button></div>";

    el.parentNode.appendChild(wrapper);

    var button = wrapper.getElementsByTagName("button");
    
    button[0].addEventListener("click", function () { 
        setCookieConfig(true); 
    });
}
