import './App.css';

import game from './game';
import board from './components/Board'
import React from "react";

import { Lobby } from 'boardgame.io/react';

const gameServer = `${window.location.protocol}//${window.location.hostname}:8000`

export default () => <Lobby
    gameServer={gameServer}
    lobbyServer={gameServer}
    gameComponents={[
        { game, board }
    ]}
/>;
