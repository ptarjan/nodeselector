

if (typeof nodeselector == "undefined") { nodeselector = {}; }
if (typeof nodeselector.ns == "undefined") { nodeselector.ns = {}; }

// disallow multiple instances
if (typeof nodeselector.ns.addLibs == "undefined") {

if (typeof nodeselector.ns.caseSensitive == "undefined") { nodeselector.ns.caseSensitive = false; }

nodeselector.ns.addLibs = function () {
    var node = document.createElement("script");
    node.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js";
    document.body.appendChild(node);
    nodeselector.ns.nodeSelector();
};

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
                                "outline-style": e.css("outline-style")});

        // Draw the red outline
        e.css("outline", "3px solid rgba(255,0,0, 0.7)");
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
        jQuery.removeData(e, "saved");
        for (var i in save) {
            console.log("restored: " + i + ", " + save[i]);
            e.css(i, save[i]);
        }
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
            .css("position", "absolute")
            .css("display", "inline")
            .css('border', '1px solid black')
            .css('backgroundColor', 'white')
            .css('padding', '2px')
            .css('width', 'auto') 
            .css("zIndex", 255)
            .click(function(ev) { ev.stopPropagation(); });
        }
       
        node.html(xpath); 
        node.animate({
            'top' : (e.offset().top) + "px",
            'left': (e.offset().left) + "px"
        }, 250);
    };
    // $(document).ready(function () {
        $("*").each(function() {
            $(this)
            .mouseover(mouseover)
            .mouseout(mouseout)
            .click(click);
        });
    // });
    
    var keydown = function(e) {
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
    $(document).keydown(keydown);

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
};

// When all the DOM elements can be manipulated, run the functions.
$(document).ready(
    function() {
        nodeselector.ns.addLibs();
    });

}
