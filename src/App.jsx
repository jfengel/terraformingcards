import './App.css';

import { Client } from 'boardgame.io/react';
import game from './game';
import board from './components/Board'
import {Local} from "boardgame.io/multiplayer";
import React from "react";

const multiplayer = Local();
const View = Client({ game, board, multiplayer})

const App = () => <div>
    <View playerID="0"/>
    <View playerID="1"/>
</div>


export default App;
