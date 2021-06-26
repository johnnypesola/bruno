# Bruno

A cardgame similar to Uno with multiplayer support.

## About

This is a hobby project of mine. The goal has been to make a fully working clone of the card game 'Uno' but with some added functionality.

As time passes it may be forked into a different card game. Time will tell.

### Some techy details

#### Backend

- Runs a node server with socket.io for coms between the frontend clients and the backend.
- There is currently no current limit for number of connected clients.
- Holds all the state for the game and listens for `ClientEvent`s sent by connected clients and transforms the state accordingly.

#### Frontend

- Built in React
- Emits different `ClientEvent`s to the backend depending on user action (Pick up card, play card, etc.)
- Receives real-time events through Socket.io and dispatch them directly into game state reducer.

## Available Scripts

### Backend

#### `npm start`

Starts the node server on port 8080<br />

#### `npm run dev `

Run the server in dev/watch mode, will run with latest files.

### Frontend

Using `react-scripts` at the moment.

#### `npm start`

Starts the dev server on port 3000<br />

#### `npm run build`

Builds the app for production to the `build` folder.<br />

#### `npm run eject`

Eject from react-scripts. Just don't run it.

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
