import game from './game'
const { Server } = require('boardgame.io/server');

const server = Server({ games: [game] });

server.run(8000);
