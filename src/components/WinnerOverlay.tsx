import React from "react";
import {Ctx} from "boardgame.io";

export function winnerText(winners : string[], numPlayers : number) {
    let text;
    if (winners.length === 1) {
        text = winners[0] + " wins!"
    } else if (winners.length === numPlayers) {
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
        {winnerText(ctx.gameover.winners, ctx.playOrder.length)}
    </div>
}
