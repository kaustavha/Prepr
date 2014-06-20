angelhackto2013
===============

Team repo for angel hack toronto spring 2013

install reqirements
===================

install node, then run

npm install

This should satisfy all the dependencies.

TODO
====

tv browser will connect to 
/tv/:id

videos will be played by going to links of the form
/tv/:tv_id/item/:item_id
visiting these links will trigger the tv to play the relevant video

what's needed
-------------
frontend for the tv
needs to open a websocket, listen for signals about what video / image to launch

server
runs on node js.  Listens for URLs, handles the websockets.