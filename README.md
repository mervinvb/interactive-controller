# interactive-controller

A simple system custom designed to be used in a theatre show. During the show, the audience uses their phone to vote on what should happen in the story. The system consists of four elements:

1. The Node.js server
The Node.js server is the central point of the system, it authenticates connections and routes the data.

2. The Screen (built in Godot)
The Screen is the screen that the audience sees during the show. On the screen are the voting results for example. This was done in Godot because it's amazing for UI work.

3. The Controller
The Controller is a simple website which controls what happens on the screen. It has two buttons, for page up and page down. A password must be filled in and checked externally by the Node.js server before the controller works.

4. The Client 
The Client is the website that the audience visits to vote on what happens in the story, as well as to see an image that corresponds to what's happening in the show.

All these components use WebSockets to communicate.



Disclaimer: This is my first project using JavaScript, and I basically have no idea what I'm doing.
