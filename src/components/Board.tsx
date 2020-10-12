import React, {useState} from 'react';
import {Card, GameState, Suit, Cards} from "../game";
import {Ctx} from "boardgame.io";

const suitMap = {
    clubs: <span color='black'>♣</span>,
    diamonds: <span style={{color: 'red'}}>♦</span>,
    hearts: <span style={{color: 'red'}}>♥</span>,
    spades: <span color='black'>♠</span>,
}
export default ({G, moves, ctx, playerID} : {G : GameState, moves : any, ctx : Ctx, playerID : any}) => {
    const [selectedCard, setSelectedCard] = useState<Card>()

    const play = (suit : Suit | null) => () => {
        moves.play(selectedCard, suit);
        setSelectedCard(undefined);
    }

    const PlayingCard = ({card, onClick}:
                         { card: Card,
                             onClick? : (_ : Card ) => void }) =>
        <span className={"card" + ((selectedCard && selectedCard === card) ? " selectedCard" : "")}
              onClick={onClick && (_ => onClick(card))}>
            {card.value}
            {card.suit && suitMap[card.suit]}
    </span>

    const Pile = ({cards, suit} : {cards : Cards, suit: Suit}) =>
        <div>
            {cards.available.length}🂠&nbsp;
            {cards.pile.map((card, i) => <PlayingCard card={card} key={i}/>)}
            <span className="destination" onClick={play(suit)}>:</span>
        </div>

    const classes = [ctx.currentPlayer === playerID ? "activePlayer" : "waitingPlayer"]
    if(!selectedCard)
        classes.push('noCardSelected');
    else if(selectedCard.value === 'J' || selectedCard.value === 'Q')
            classes.push('jackOrQueenSelected noCardSelected')
    else
        classes.push('cardSelected');

    return <div className={classes.join(' ')}>
        <div>
            Cards remaining: {G.supply.length}
            Current player: {ctx.currentPlayer}
            PLayOrderPos : {ctx.playOrderPos}
            ActivePlayers: {ctx.activePlayers}
            PlayOrder : {ctx.playOrder}
        </div>
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
                    <Pile suit={Suit.Clubs} cards={G.tableau.clubs}/>
                    <Pile suit={Suit.Diamonds} cards={G.tableau.diamonds}/>
                    <Pile suit={Suit.Hearts} cards={G.tableau.hearts}/>
                    <Pile suit={Suit.Spades} cards={G.tableau.spades}/>
                    <div className='jacksAndQueens' onClick={play(null)}>
                        :
                        {G.tableau.special.map((card, i) => <PlayingCard card={card} key={i}/>)}
                    </div>
                </td>
                <td/>
            </tr>
            </tbody>
        </table>
        <div>
            <p>Me ({playerID})</p>
            <div className="hand">
                {G.players[ctx.playOrder.indexOf(playerID)].hand.map((card, i) =>
                    <PlayingCard card={card} key={i} onClick={setSelectedCard}/>)}
            </div>
        </div>

    </div>
}
