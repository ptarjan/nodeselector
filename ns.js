function addYUI() {
    if (typeof(document.body) == "undefined" || document.body == null) {
        setTimeout(addYUI, 100);
        return;
    }

    node = document.createElement("script");
    node.src = "http://yui.yahooapis.com/3.0.0pr2/build/yui/yui-min.js";
    document.body.appendChild(node);
    nodeSelector();
} 
addYUI();

function nodeSelector() {  
    if (typeof(YUI) == "undefined") {
        setTimeout(nodeSelector, 100);
        return;
    }

    YUI().use("node", "json", function(Y) {
        var saved = {};

        elements = Y.all("*");
        elements.each(function(e) {
            e.on("mouseover", function(ev) {
                if (ev && ev.halt) ev.halt();
                saved[e] = {"border" : e.getStyle("border"), "margin" : e.getStyle("margin")};
                var names = [
                             ["borderTopWidth", "marginTop"],
                             ["borderRightWidth", "marginRight"],
                             ["borderBottomWidth", "marginBottom"],
                             ["borderLeftWidth", "marginLeft"],
                            ];
                var old = [0, 0, 0, 0];
                for (var i in names) {
                    for (var j in names[i]) {
                        old[i] += parseInt(e.getStyle(names[i][j]).replace("px", ""));
                    }
                }
                e.setStyle("border", "2px solid red");
                var margin = "";
                for (var i in old) {
                    margin += (old[i] - 2) + "px ";
                }
                e.setStyle("margin", margin);
            });
            e.on("mouseout", function(ev) {
                if (ev && ev.halt) ev.halt();
                var save = saved[e];
                if (typeof(save) == "undefined") return;

                e.setStyle("border", save["border"]);
                e.setStyle("margin", save["margin"]);
            });
            e.on("click", function (ev) {
                if (ev && ev.halt) ev.halt();
                var xpath = getXpath(e);
                /*
                var nodes = document.evaluate( xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
                if (nodes.snapshotLength != 1) {
                    Y.log("Error, xpath didn't return 1 node : count(" + xpath + ") == " + nodes.snapshotLength);
                } else {
                */
                
                    var node = Y.get("#hover");
                    if (! node)  {
                        var node = Y.Node.create("<div id='hover' style='position:absolute'></div>");
                        node.setStyle("position", "absolute");
                        node.setStyle('border', '1px solid black');
                        node.setStyle('backgroundColor', 'white');
                        node.setStyle('padding', '2px'); 
                        node.setStyle('width', 'auto'); 
                        node.setStyle("zIndex", 255);
                        node.on("click", function(ev) { ev.halt() });
                        Y.get("body").appendChild(node);
                    }
                   
                    node.set("innerHTML", xpath); 
                    node.setStyle('top', (ev.pageY + 5) + "px");
                    node.setStyle('left', (ev.pageX + 5) + "px");
                /*
                }
                */

            });
        });

        function getXpath(e) {
                var xpath = "";
                while (e.get("nodeName").toUpperCase() != "HTML") {
                    var node = e.get("nodeName");
                    var id = e.getAttribute("id");
                    if (typeof(id) != "undefined" && id != null) {
                        xpath = "//" + node + "[@id='" + id + "']" + xpath;
                        return xpath;
                    }
                    var parent = e.get("parentNode");
                    var children = parent.queryAll(node);
                    if (children.size() > 1) {
                        good = false;
                        for (var i=0; i < children.size(); i++) {
                            c = children.item(i);
                            if (c == e) {
                                node += "[" + (i+1) + "]";
                                good = true;
                                break;
                            }
                        };
                        if (! good) {
                            Y.log("Can't find child, something is wrong with your dom : " + node);
                        }
                    }
                    xpath = "/" + node + xpath;
                    e = parent;
                }
                xpath = "/HTML" + xpath;
                return xpath;
        }
    });
}
