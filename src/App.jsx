import './App.css';

import game from './game';
import board from './components/Board'
import React from "react";

import { Lobby } from 'boardgame.io/react';

const {protocol, hostname, port} = window.location;

const gameServer = `${protocol}//${hostname}:${port}`

export default () => <Lobby
    gameServer={gameServer}
    lobbyServer={gameServer}
    gameComponents={[
        { game, board }
    ]}
/>;
