if (typeof nodeselector == "undefined") { nodeselector = {}; }
if (typeof nodeselector.ns == "undefined") { nodeselector.ns = {}; }

// disallow multiple instances
if (typeof nodeselector.ns.addLibs == "undefined") {

if (typeof nodeselector.ns.caseSensitive == "undefined") { nodeselector.ns.caseSensitive = false; }

//source: http://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

nodeselector.ns.addLibs = function () {
    if (typeof jQuery == 'undefined') {
        loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js", function() {
            $(document).ready( function() {
                nodeselector.ns.nodeSelector();
            });
        });
    }
    else {
        $(document).ready( function() {
            nodeselector.ns.nodeSelector();
        });
    }
};

nodeselector.ns.addShades = function() {
    nodeselector.ns.shade = document.createElement("div");
    nodeselector.ns.shade.setAttribute("id", "nodeselector_shade_helper");
    nodeselector.ns.shade.style.background = "rgba(0, 0, 0, 0.5)";
    nodeselector.ns.shade.style.position = "absolute";
    nodeselector.ns.shade.style.top = "0px";
    nodeselector.ns.shade.style.left = "0px";
    nodeselector.ns.shade.style.width = "100%";
    nodeselector.ns.shade.style.height = "100%";
    nodeselector.ns.shade.style.visibility = "hidden";
    nodeselector.ns.shade.style.zIndex = "-1";
    document.body.appendChild(nodeselector.ns.shade);
}

nodeselector.ns.nodeSelector = function () {
    // In case Firebug isn't installed
    if (window.console === undefined) { window.console = {log:function(){}}; }

    var mouseover = function(ev) {
        if(ev.target != this){
            return true;
        }
        // Prevent usual event handlers from functioning
        ev.stopPropagation();
        var e = $(ev.target);

        // We're overwriting any outline information for the element, so save it first.
        e.data("saved", {"outline-width": e.css("outline-width"),
                                "outline-color": e.css("outline-color"),
                                "outline-style": e.css("outline-style"),
                                "z-index"      : e.css("z-index"),
                                "background-color": e.css("background-color")
                            });
        //e.css("z-index", "9999");

        /*console.log(e.css("background-color"));
        if (e.css("background-color") == "rgba(0, 0, 0, 0)") {
            e.css("background-color", "rgba(255, 255, 255, 0.8)");
        }*/
        // Draw the red outline
        e.css("outline", "3px solid rgba(255,0,0, 0.7)");
        //nodeselector.ns.shade.style.visibility = "visible";
    };

    var mouseout = function(ev) {
        // fix for live (added after page creation) elements
        if(ev.target != this){
            return true;
        }
        ev.stopPropagation();
        var e = $(ev.target);
        save = e.data("saved");
        if (typeof(save) == "undefined") { return; }
        e.removeData("saved");
        for (var i in save) {
            //console.log("restored: " + i + ", " + save[i]);
            e.css(i, save[i]);
        }
        //nodeselector.ns.shade.style.visibility = "hidden";
    };

    var click =  function (ev) {
        if(ev.target != this){
            return true;
        }
        ev.preventDefault(); ev.stopPropagation();
        var e = $(ev.target);
        var xpath = getXpath(ev.target);
        console.log(xpath);

        if (typeof(nodeselector.ns.doneURL) != "undefined") {
            if (nodeselector.ns.doneURL.indexOf("?") == -1) { nodeselector.ns.doneURL += "?"; }
            else { nodeselector.ns.doneURL += "&"; }
            var params = {
                "xpath" : xpath, 
                "referer" : window.location.href
            };
            if (typeof nodeselector.ns.params != "undefined") { params['params'] = nodeselector.ns.params; }

            var url = $.param(params);
            url = nodeselector.ns.doneURL + url;
            console.log(url);
            window.location = url;
            return false;
        }

        var node = $("#hover");
        if (node.size() === 0)  {
            $(document.body).append("<div id='hover'></div>");
            node = $("#hover");
            node
            .css({"position": "absolute",
                    "display": "inline",
                    "border": "1px solid black",
                    "backgroundColor": "white",
                    "padding": "2px",
                    "width": "auto", 
                    "z-index": "255"}).fadeOut(0)
            .click(function(ev) { ev.stopPropagation(); });
        }

        node.html(xpath);
        node.animate({
            "top" : (e.offset().top) + "px",
            "left": (e.offset().left) + "px"
        }, 250)
        .fadeIn(250);
    }; // click

    $("*").each(function() {
        $(this)
        .mouseover(mouseover)
        .mouseout(mouseout)
        .click(click);
    });

    /*var keydown = function(e) {
        if (e.keyCode === undefined && e.charCode !== undefined) { e.keyCode = e.charCode; }
        // Escape key
        if (e.keyCode == 27) {
            $("*").each(function(i) {
                $(this)
                .mouseout()
                .unbind("mouseover", mouseover)
                .unbind("mouseout", mouseout)
                .unbind("click", click)
                .mouseout();
            });
            $("#hover").remove();
            $(document).unbind("keydown", keydown);
            // Kill the namespace
            delete nodeselector.ns;
        }
    };
    $(document).keydown(keydown);*/

    function getXpath(e) {
        var xpath = "";
        var oldE = e;
        while (e.nodeName.toLowerCase() != "html") {
            var node = e.nodeName;
            if (nodeselector.ns.caseSensitive === false) { node = node.toLowerCase(); }
            var id = e.id;
            if (id !== undefined && id !== null && id !== "") {
                xpath = "//" + node + "[@id='" + id + "']" + xpath;
                break;
            }
            var parent = e.parentNode;
            var children = $(parent).children(node);
            if (children.size() > 1) {
                var good = false;
                children.each(function(i) {
                    if (this == e) {
                        node = node + "[" + (i+1) + "]";
                        good = true;
                        return false;
                    }
                });
                if (! good) {
                    console.log("Can't find child, something is wrong with your dom : " + node);
                    return FALSE;
                }
            }
            xpath = "/" + node + xpath;
            e = parent;
        }
        if (xpath.substring(0, 2) != "//") { xpath = "/html" + xpath; }
        if (typeof nodeselector.ns.getXpath == "function") {
            xpath = nodeselector.ns.getXpath(oldE, xpath);
        }
        return xpath;
    }
/*  //source: http://snippets.dzone.com/posts/show/4349
    // simpler version than original getXpath
    function getXpath(elt) {
    var path = '';
        for (; elt && elt.nodeType==1; elt=elt.parentNode) {
            var idx=$(elt.parentNode).children(elt.tagName).index(elt)+1;
            idx>1 ? (idx='['+idx+']') : (idx='');
            path='/'+elt.tagName.toLowerCase()+idx+path;
        }
        return path;
    }
*/
};

// When all the DOM elements can be manipulated, run the functions.
nodeselector.ns.addLibs();

}
