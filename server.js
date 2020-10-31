const { Server } = require('boardgame.io/server');
const game = require('./build/game').default;

const server = Server({ games: [game] });

server.run(8000);
