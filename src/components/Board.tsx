import React from 'react';
import {GameState, Card} from "../game";
import {Ctx} from "boardgame.io";

const suitMap = {
    clubs: <span color='black'>♣</span>,
    diamonds: <span style={{color: 'red'}}>♦</span>,
    hearts: <span style={{color: 'red'}}>♥</span>,
    spades: <span color='black'>♠</span>,
}
const PlayingCard = ({card}: { card: Card }) => <span>
    {card.value}
    {card.suit && suitMap[card.suit]}
</span>
export default ({G, moves, ctx, playerID} : {G : GameState, moves : any, ctx : Ctx, playerID : any}) => {
    return <div>
        <div>
            Cards remaining: {G.supply.length}
            Current player: {ctx.currentPlayer}
            PLayOrderPos : {ctx.playOrderPos}
            ActivePlayers: {ctx.activePlayers}
            PlayOrder : {ctx.playOrder}
        </div>
        <button onClick={moves.play}/>
        <table>
            <tbody>
            <tr>
                <td/>
                <td/>
                <td/>
            </tr>
            <tr>
                <td/>
                <td>
                    <div>
                        <>{G.tableau.clubs.pile.map((card, i) => <PlayingCard card={card} key={i}/>)}</>
                    </div>
                    <div>
                        <>{G.tableau.diamonds.pile.map((card, i) => <PlayingCard card={card} key={i}/>)}</>
                    </div>
                    <div>
                        <>{G.tableau.hearts.pile.map((card, i) => <PlayingCard card={card} key={i}/>)}</>
                    </div>
                    <div>
                        <>{G.tableau.spades.pile.map((card, i) => <PlayingCard card={card} key={i}/>)}</>
                    </div>
                </td>
                <td/>
            </tr>
            </tbody>
        </table>
        <div>
            <p>Me ({playerID})</p>
            <div>
                {G.players[ctx.playOrder.indexOf(playerID)].hand.map((card, i) => <PlayingCard card={card} key={i}/>)}
            </div>
        </div>

    </div>
}
