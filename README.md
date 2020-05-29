
# Wandering

An experimental web app of a college final project that recommends songs to users based on their musical preferences, with the help of Spotify's API.

> Honestly I might come back to this after the semester ends because I'm surprised by the results I found. As much as I'd like to make this public now, it's connected to a database and I wouldn't trust myself with one, haha.

## What the heck is Wandering?

I'll be real with you, I'm what some people call *uncultured swine*. I don't have a ton of cultural knowledge, so it's very common for me to just not know what actor or artist you're talking about. But I still like listening and hearing to stuff, it's just a matter of finding a starting point. And once I discovered that Spotify had some special endpoints in their API, I decided to give this a try...

Wandering is a web app that uses Spotify's Web API endpoints, specifically their *Audio Features* and *Related Artist* endpoints, to narrow down on what you're musical tastes are like and recommend you songs that you'll potentially like. It runs on *React*, *Mongo*, and *Vercel Now*'s Serverless functions (as a supplement to Express and Node as originally planned, 'cause I was also curious on how Now worked).

## The gist of it
The pipeline to finding those potential tracks for a listener is as follows:
- First receive a selection of tracks from the user, using one of the given methods, anywhere between 1 to hundreds of songs.
- Use k-means clustering to find "groups" that represents the tastes of the user, from the songs given.
- With the input songs, find every "related artist" and prioritize on the most repeated artists in this step. Grab the most referred artists for the next step.
- For each "recommended artist", grab their top tracks as our potential pool of tracks.
- Compare the audio features of our pool tracks with each of our "taste group" and run them through a scoring formula.
- Sort by whichever score matches closest to the user's tastes
- Profit! I think!

## A little deeper into the endpoints

> since it's a requirement for my grade, but ah well

The database keeps 4 collections: `users`, `tracks`, `usertracks`, & `comments`.
`users` and `tracks` are simply a record of every user & track registered in the system, with relevant data such as the track's metadata and such. `usertracks` holds the relation of each user with each track, 1-to-1 to avoid complications (yes I know this isn't efficient, but I'm new at this). And the `comments` collection holds every comment record between a user and a track.

> It bears mentioning that while `usertracks` and `comments` serve similar purposes, they are separated for a reason. `usertracks` helps to make a "global" taste graph, & `comments` simply hold the comments. Not every combination of track & user in `usertracks` is always in `comments` and vice versa

The backend is serving the following endpoints, primarily to communicate with Mongo:
- `/api/createUser`: Creates a user and its relevant data in the DB
- `/api/deleteUser`: Deletes a user and all related data to said user (including comments & track relations) from the DB
- `/api/getComment`: Gets a comment (if it exists) from a user on a particular track
- `/api/getTastes`: Grabs every track relating to the user in order to calculate a "global" tastes chart in the web app.
- `/api/getUser`: A simple GET to receive relevant data of the user. Usually as a helper for other endpoints.
- `/api/postComment`: Adds a comment to a track by the user
- `/api/registerTrack`: Registers a track into the database if it doesn't exist already and relate it to the user.

> Will I publish the site to this one day? Who knows? Time will tell...
