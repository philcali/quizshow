# How To Build

1. Install Node.JS
1. `cd website && npm start` to startup a dev server that auto-refreshes your browser.

# How To Install

This uses AWS as the server (AppSync specifically) and stores data in Dynamo DB.  This means you'll need an AWS account and have basic knowledge on how to administer cloud resources.  It's a good skill to have, cloud computing is the new normal.  This assumes you're familiar with Dynamo DB, AppSync, CloudFormation, CloudWatch, S3, CloudFront, and so on.

## Install the Dynamo tables, AppSync stuff, AWS resources

```bash
% cd server
npm install
cdk deploy
```

__Note__: If you run into other issues, make sure you have followed the [CDK getting started guide][1].

## Install sample data to play with

```bash
cd samplegames
npm install
npm run convert
npm run load
```


# How to Prepare for Production

* Clear out the Cognito User Pool
* Change IOPS on the Dynamo tables to support a bunch of users at once
* Clear out the Dynamo tables


# Dynamo Table Structure

An easy way to understand what's happening with the AppSync GraphQL API and how the clients work is to envision what data looks like in the Dynamo tables.  Overall, the tables match the GraphQL schema directly, nearly 1:1 for convenience sake.  Warning: this isn't a good model for using Dynamo DB with large data!  Dynamo is a NOSQL data store, which means you don't model your data into tables like this.  Dynamo DB isn't SQL and it doesn't support joins.  This is a good thing.  This is a tiny "play" database, so we're cheating here and mis-using Dynamo because it makes AppSync and the whole Quiz Show product simpler.

**A note on AppSync structure:**  *A better way of designing this for a production system is to have everything in a single table, or at least look for places to combine things, such as including all categories in the QuizGames table, instead of breaking them out separately.  The purpose of this demo program is to show how a bunch of Resolvers for different tables work together to assemble return structures for clients, and not necessarily how to design efficient data storage.*


## QuizGames

Holds one Item for each game.  A Game has an owner, tied to the ID from Cognito.  Items contain all the meta-data about a game and the key in QuizGame is used as a "foreign key" in the other tables where needed.

| gameId | emcee    | title              |
|-------:|----------|--------------------|
|     56 | joeuser  | Spelling Bee       |
|    109 | hchen    | Networking         |
|   7006 | asultan  | Driver's Test Prep |

Indexes:

* **Primary:** gameId (HASH), *used as typical, artificial key for assembling URLs, and for others to reach a QuizGame from another device*
* **GSI OwnerByGameId:** emcee (HASH) + gameId (RANGE), *search by owner and get a list of IDs*


## QuizCategories

Separate table with just Category names.  This also has a separate, unique ID for every Category, which you'll need to match-up questions from QuizQuestions below.

| gameId  | catgId | categoryName     |
|--------:|-------:|------------------|
|     109 |     10 | OSI Stack        |
|     109 |     11 | "Be The Packet"  |
|     109 |     12 | Unix Commands    |
|    7006 |     77 | Street Signs     |
|    7006 |     78 | Road Safety      |

Indexes:

* **Primary:** gameId (HASH) + catgId (RANGE), *usual way in is to start from a QuizGames Item and use it's ID to find all categories here*


## QuizQuestions

Each Item is a single question for a QuizGame.  Foreign Key to QuizCategories for the category name.

| gameId | catgId | quesId | prize | question             | answer    |
|-------:|-------:|-------:|------:|----------------------|-----------|
|    109 |     12 |      1 |    50 | Show net interfaces? | ifconfig  |
|    109 |     10 |      2 |   100 | Layer 4 protocols?   | TCP, UDP  |
|    109 |     12 |      3 |   325 | Open sockets?        | netstat   |
|   7006 |     77 |      4 |   200 | Red octagon?         | Stop sign |
|   7006 |     78 |      5 |   300 | Safe distance?       | 2 seconds |

Indexes:

* **Primary:** gameId (HASH) + quesId (RANGE), *to get all question Items for a gameId*
* **GSI QuesId:** quesId (HASH), *during game play for people to retrieve individual questions*


# TO DO

## Join, Login, Start

1. QR code to join the game
1. Add other providers to Cognito User Pool


## Quiz Host Screen

1. Main board shows leader board with the order in which people buzzed in
1. When subscription shows someone joining, do a quick pop-up!


## Emcee Interface

1. As the MC, I'm a separate web connection from a mobile device, laptop + screen is the Main Board with no user interaction possible.
1. MC mobile app: click buttons to make the game progress.  It's more of an intelligent TV remote: it doesn't display the whole board all the time, no animations, setup to allow MC to easily run the game.
1. MC app shows the ANSWER too for reference.
1. MC clicks a question, main board shows it and unlocks the players buzzers
1. From top down, the head person has "Correct!" And "Nope" buttons.  MC clicks one.  If correct, clears people on the leaderboard and awards prize money.  MC clicks "Nope" pops the top person and moves to next person.
1. Mobile version too!
1. Create Quiz Game screen: Paste YAML description of the questions, answers, and categories.
1. MC has a "clear the board" button that removes all answered people on the leader board


## Contestants

1. Attendees connect
1. Each player's browser shows the question and has a "Bzzz!" Button
1. When people join, they can include a short “tweet”-like intro message that gets displayed along with their chosen Player Handle.


## AppSync Features

1. Showcase features of AppSync, like subscriptions: read appsync docs, decide which can be shown here
1. Websockets and AppSync subscribe
1. All based on creating/logging-in as a user.  If lose admin connection, just launch browser/phone, login, and it shows the other games you created that are still running.  Connect to one and control it.
1. Handle offline automatically via appsync
1. Conflict resolution?
1. Security: only the owner of a quiz show can see the answer field.
1. How can this call more than one data source to demonstrate field-level different sources?


## Way in the future

1. "Final Jeopardy": asks a question, people write their answer on their screens, emcee steps through each once they are all submitted.  Awards money based on their wager.


[1]: https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html
