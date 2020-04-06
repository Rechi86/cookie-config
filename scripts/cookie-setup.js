/* 
 * Basic Cookie Setup & Destroy Functionality
 */

function initCookies(paths) {
    // asign button listeners
    document.getElementById("cookie-setup-allow-all").onclick = function () { setCookieConfig(true) };
    document.getElementById("cookie-setup-allow-functional").onclick = function () { setCookieConfig(false) };

    let cookieState = Cookies.get("cookie-setup");

    // inital state -> show menu
    if (!cookieState) {
        document.getElementById("cookie-setup-overlay").classList.add('show');
        wrapAllIframes();
    }

    // only functional cookies -> show bocked iframe info
    if (cookieState == "functional") {
        wrapAllIframes();
    }

    // all cookies allowed -> activate iframes, add additional scripts
    if (cookieState == "all") {
        activateIframes();
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
    for (var i = 0, len = scripts.length; i < len; i++) {

        var script = document.createElement('script');

        // map all script properies to the newly created element
        for (var prop in scripts[i]) {
            if (scripts[i].hasOwnProperty(prop)) {
                console.log(scripts[i].prop);
                script[prop] = scripts[i][prop];
            }
        }

        document.head.appendChild(script);
    }
}

// Wrapp all Iframes with Blocked Info
function wrapAllIframes() {
    frames = document.getElementsByTagName("iframe");
    for (i = 0; i < frames.length; ++i) {

        // save src in data-Attribute and remove it to prevent loading
        frames[i].dataset.src = frames[i].src;
        frames[i].src = "";
        frames[i].classList.add("cookie-setup-blocked");

        wrapBlocked(frames[i]);
    }
}


// Activate Iframe e.g. with Element Button
function activateIframes() {
    frames = document.getElementsByTagName("iframe");
    for (i = 0; i < frames.length; i++) {
        //frames[i].src = frames[i].dataset.src;
        frames[i].classList.remove("cookie-setup-blocked");
        blockedElement = frames[i].parentNode;
        

        if (blockedElement.classList.contains("cookie-setup-blocked-wrapper")) {
            parentElement.removeChild(blockedElement);
            
        }
    }
}

// Helper Function for adding blocked Info
function wrapBlocked(el) {
    var wrapper = document.createElement('div');

    wrapper.classList.add("cookie-setup-blocked-wrapper");

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    wrapper.innerHTML += "<div class='cookie-setup-blocked-info'>" +
        "<p>Inhalt von von Drittanbieter blockiert</p>" +
        "<button class='btn' >Alle Cookies erlauben</button></div>";
    button = wrapper.getElementsByTagName("button");
    button[0].addEventListener("click", function () { setCookieConfig(true); });
}

function removeAllCookies() {
    Object.keys(Cookies.get()).forEach(function (cookieName) {
        Cookies.remove(cookieName);
    });
}