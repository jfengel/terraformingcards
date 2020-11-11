import React from "react";
import {Ctx, PlayerID, Server} from "boardgame.io";
import {MatchContext} from "./matchcontext";
import {playerName} from "./Board";

type PlayerMetadata = Server.PlayerMetadata;

export function winnerText(winnerIds : PlayerID[], matchData : PlayerMetadata[]) {
    const winners = winnerIds.map(x => playerName(x, matchData))
    let text;
    if (winners.length === 1) {
        text = winners[0] + " wins!"
    } else if (winners.length === matchData.length) {
        text = "Everybody ties!"
    } else if (winners.length === 2) {
        text = winners[0] + " and " + winners[1] + " win!"
    } else {
        text = winners.reduce((past, curr, i) =>
                (past
                    + (i > 0 ? (i === winners.length - 1 ? ", and ": ", ") : "")
                    + curr), "")
            +  " win!";
    }
    return text;
}

export default ({ctx} : {ctx : Ctx}) => {

    if(!ctx.gameover) {
        return null;
    }
    return <div className="winnerOverlay">
        <MatchContext.Consumer>{
            (matchData) =>
                winnerText(ctx.gameover.winners, matchData)
        }</MatchContext.Consumer>

    </div>
}
