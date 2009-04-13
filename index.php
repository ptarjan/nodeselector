<?php print '<?xml version="1.0" encoding="UTF-8"?>' ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <title>Node Selector Bookmarklet</title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.7.0/build/reset/reset-min.css" />
    <link rel="stylesheet" href="/style.css" type='text/css' />  
    
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />

  </head>
  <body>

    <div id='main'>

    <h1>NodeSelector Bookmarklet</h1>

    <div class='content'>

<ol><li>
Right click and bookmark this: <a href='
javascript:(
   function() { 
      var s=document.createElement("script");
          s.charset="UTF-8";
          s.src="http://paul.slowgeek.com/nodeSelector/ns.js";
      document.body.appendChild(s)
   })();
'>nodeSelector bookmarklet</a>
</li><li>
Visit any webpage.
</li><li>
Click your newly created bookmark (should be named <b>nodeSelector bookmarklet</b>).
</li><li>
Find the interesting item on the page and click it.
</li><li>
See the xpath to that node.
</li><li>
Press <b>ESC</b> anytime to stop selecting nodes.
</li><li>
...
</li><li>
Profit.
</li></ol>

<ul><ol>
<a href='http://github.com/ptarjan/nodeselector/'>Open Source (github)</a>
</ol><ol>
<a href='test.html'>See it in action</a>
</ol><ol>
<a href='ns.js'>Read the source</a>
</ol></ul>

      </div>
    </div>
  </body>
</html>
