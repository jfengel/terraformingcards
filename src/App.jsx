import './App.css';

import game from './game';
import board from './components/Board'
import React from "react";

import {Lobby} from 'boardgame.io/react';
import {Client} from "boardgame.io/react";
import {SocketIO} from "boardgame.io/multiplayer";

const {protocol, hostname, port} = window.location;

const gameServer = `${protocol}//${hostname}:${port}`

const urlParams = new URLSearchParams(window.location.search);
const playerID = urlParams.get('playerID');
const matchID = urlParams.get('matchID');
const credentials = urlParams.get('credentials');

const play = () => {
    const multiplayer = SocketIO({server: gameServer});
    const TMClient = Client({game, board, multiplayer})
    return <TMClient {...{playerID, matchID, credentials}}/>
}

export default
() => playerID && matchID ? play() :
    <Lobby

        gameServer={gameServer}
        lobbyServer={gameServer}
        gameComponents={[
            {game, board}
        ]}
    />;
