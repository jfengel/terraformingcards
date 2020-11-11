import React from "react";
import {Server} from "boardgame.io";
type PlayerMetadata = Server.PlayerMetadata;

export const MatchContext = React.createContext<PlayerMetadata[]>(  []);
