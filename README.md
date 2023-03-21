# ArtiDuel
***A drawing app + social network*** which is still in development - [full description](#description).

I'm currently working on this project with [Vicky Polatov](https://github.com/vicky-polatov "Vicky's profile link"), who is also an instructor at Coding Academy. 
***It is not finished yet***, read about it [here](#current-status).
<!-- [Take a look, it's on render.com](https://oribenamram.github.io/Bitcoin-Vue "Render link") -->

![Drawing image](src/assets/imgs/drawing-butterfly.avif "Drawing image")
___

### Table of Contents
- [Description](#description)
- [Features](#features)
- [Getting started](#getting-started)
- [Status](#current-status)

## Description
This app is kind of a social network, based on drawing battles. 
A user that wants to play can click on the Start Game button from anywhere in the app, and choose the level of difficulty (easy, meduim or hard).
After that, he would be passed to the waiting room, in which he would wait until an opponent that choosed the same level would appear. 
Then, the two would have a minute to draw a word that the App displays, and to see the other's drawing in real time through out the game (!).
When the game ends, both of the drawings are uploaded to the common feed, where everyone can scroll, see drawings and like the drawings they liked. For example, if Vicky and I just played and drew some word, you could see it in the feed and like each one of our drawings that are displayed next to each other. 
In addition, you are able to go to your profile and watch all of the drawings you created in all of your games.

Are you curious to know what technologies we used to create this? Read about it [here](#features)

## Features
Brief summary? Down below you'll find the technologies we used in dots by names. 
If you want understand how we implemented each technology in our project, **You are in the right place!**

First of all, our entire app is written with hooks and typescript, using the latest version of react (18) and react-router (6).
The drawings that are displayed in the feed we store using Redux Toolkit, so we would be able to show part of them in the profile page.
As always, we used Sass. But, this time we have tried to take advantage of the mixins and other functionalities it provides. In one of our components I even implemented the BEM method (draw-preview).

**The game field:**
Canvas (HTML5) is one of the most powerful tools we got since HTML last version.
In our project, the user draw freely on the canvas for a minute, and then can't edit the drawing any more.
He can draw with different colors, widthes, earasers and other tools we are currently working to add.
If you'll refresh the page while drawing, the data would be saved and you could continue from the point you stopped.
While you are drawing, you can see your opponent's drawing as well (each and every step he is making!).
This, of course, we created using Sockets. Every time the you or your opponent lift up the mouse / finger from the canvas, the new data is sent to our backend. There we identify who is your opponent and send them the data.
Our socket service is full of complex and intersting functionality we built to create this effect, such as others like the waiting room, game-over modals when one is quitting the game, a different modal when a user suddenly disconnect and more!
Please fill free to contact me If you need any explanation about those technologies.

Our list of technologies:

- React.js & TS (latest versions)
- Redux Toolkit
- Canvas
- E2E (BE - Node.js & MongoDB) 
- WebSockets

- Tests (jest)
- PWA

## Getting started
From the back to the front!
Clone the next line or Head to the next [repository](https://github.com/vicky-polatov/artiduel-backend "Backend repo link") and clone the project (or download the files).

```
git clone https://github.com/vicky-polatov/artiduel-backend.git
```

Enter the backend folder and make sure you have node_modules installed. After that we will initiate the server with 'npm start':

```
cd backend
npm i 
npm start
```

You shuold get a console ouput that the server is up and running at port 3030.

Now, clone the frontend using the line of code below. You can also download the files or clone the code in this link ([on top](https://github.com/OriBenAmram/artiduel-frontend "Frontend repo link")).

```
git clone https://github.com/OriBenAmram/artiduel-frontend.git
```

Next step - run the frontned project:

```
cd frontned
npm i 
npm start
```

You shuold get a console ouput that the server is up and running at localhost:3000.

That's it! The App should be opened automatically, enjoy!

## Current status
85% of our work is done! 
We are close to end this project and upload it, but we still have some work to do. 
Our next steps are:
- Fix a few important features, such as drawing options through out the game and more.
- Upload the first version to Render.com (which is a bit problematic with supporting sockets)
- Finishing designing and adding a few more features.
- Uploading the app using AWS and even make it PWA(!).

This project was supposed to be short and basic, and it's only goal was to make us learn new skills.
Nonetheless, we are investing a lot of effort to make it looks good enough for people to play with! 