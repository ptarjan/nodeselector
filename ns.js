if (typeof paulisageek == "undefined") { paulisageek = {}; }
if (typeof paulisageek.ns == "undefined") { paulisageek.ns = {}; }

// Don't let 2 instances run
if (typeof paulisageek.ns.addLibs == "undefined") {

paulisageek.ns.addLibs = function () {
    if (typeof(document.body) == "undefined" || document.body === null) {
        setTimeout(paulisageek.ns.addLibs, 100);
        return;
    }

    var node = document.createElement("script");
    node.src = "http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js";
    document.body.appendChild(node);
    paulisageek.ns.nodeSelector();
};

paulisageek.ns.nodeSelector = function () {  
    if (typeof($) == "undefined" || $("*") === null) {
        setTimeout(paulisageek.ns.nodeSelector, 100);
        return;
    }

    // Incase Firebug isn't installed
    if (window.console === undefined) { window.console = {log:function(){}}; }

    var mouseover = function(ev) {
        ev.stopPropagation();
        var e = $(ev.target);
        if (typeof e.css("outline") != "undefined") {
            e.data("saved", {"outline" : e.css("outline")});
            e.css("outline", "red solid medium");
        } else {
            e.data("saved", {"backgroundColor" : e.css("backgroundColor")});
            e.css("backgroundColor", "#0cf");
        }
    };
    var mouseout = function(ev) {
        ev.stopPropagation();
        var e = $(ev.target);
        save = e.data("saved");
        if (typeof(save) == "undefined") { return; }
        e.removeData("saved");
        for (var i in save) {
            e.css(i, save[i]);
        }
    };
    var click =  function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        var e = $(ev.target);
        var xpath = getXpath(ev.target);
        if (typeof paulisageek.ns.clickCallback == "function") {
            xpath = paulisageek.ns.clickCallback(xpath);
        }
        console.log(xpath);

        if (typeof(paulisageek.ns.doneURL) != "undefined") {
            if (paulisageek.ns.doneURL.indexOf("?") == -1) { paulisageek.ns.doneURL += "?"; }
            else { paulisageek.ns.doneURL += "&"; }

            var url = $.param({
                "xpath" : xpath, 
                "referer" : window.location.href
            });
            url = paulisageek.ns.doneURL + url;
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
            delete paulisageek.ns;
        }
    };
    $(document).keydown(keydown);

    function getXpath(e) {
        var xpath = "";
    
        while (e.nodeName.toLowerCase() != "html") {
            var node = e.nodeName.toLowerCase();
            var id = e.id;
            if (id !== undefined && id !== null && id !== "") {
                xpath = "//" + node + "[@id='" + id + "']" + xpath;
                return xpath;
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
        xpath = "/html" + xpath;
        return xpath;
    }
};

paulisageek.ns.addLibs();

}
