import React from 'react';
import {GameState, Card} from "../game";
import {Ctx, Game} from "boardgame.io";

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
export default (props: any) => {
    const G: GameState = props.G as GameState;
    return <div>
        <button onClick={props.moves.play}/>
        <pre>
            {JSON.stringify(props.moves.play, null, 4)}
        </pre>
        <table>
            <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
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
                <td></td>
            </tr>
            </tbody>
        </table>
        <div>
            <p>Me)</p>
            <div>
                {G.players[0].hand.map((card, i) => <PlayingCard card={card} key={i}/>)}
            </div>
        </div>

    </div>
}
