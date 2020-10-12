import React, {useState} from 'react';
import {Card, GameState, Suit, Cards, PLAYING_ACES, isJoker} from "../game";
import {Ctx} from "boardgame.io";

const suitMap = {
    clubs: <span color='black'>♣</span>,
    diamonds: <span style={{color: 'red'}}>♦</span>,
    hearts: <span style={{color: 'red'}}>♥</span>,
    spades: <span color='black'>♠</span>,
}

/* Apply several strategies to come up with a short, unique identifier */
export const initials = (name : string, allNames : string[]) => {
    if(!name)
        return name;
    const others = allNames.filter(x => name !== x);
    const first = (x : string) => x[0];
    const firstName = (x : string) => x.split(' ')[0];
    const initials = (x : string) => x.split(' ').filter(x=>x).map(x => x[0]).join('');
    const firstTwo = (x : string) => x.length < 2 ? x : x[0] + x[1];
    const firstAndLast = (x : string) => x.length < 2 ? x : x[0] + x[x.length-1];
    const isUnique = (x: string, ys : string[], strategy : (a : string) => string) =>
        !ys.find(y => strategy(x) === strategy(y))
    const lastName = (x : string) => x.split(' ').reverse()[0];
    for(const strategy of [first, initials, firstTwo, firstAndLast, firstName, lastName]) {
        if(isUnique(name, others, strategy))
            return strategy(name);
    }
    return name;
}

export default ({G, moves, ctx, playerID} : {G : GameState, moves : any, ctx : Ctx, playerID : any}) => {
    const [selectedCard, setSelectedCard] = useState<Card>()

    const player = G.players[ctx.playOrder.indexOf(playerID)];

    const playingAces = ctx.activePlayers && ctx.activePlayers[playerID] === PLAYING_ACES;

    const play = (suit : Suit | null) => () => {
        moves.play(selectedCard, suit);
        setSelectedCard(undefined);
    }

    const remove = (card : Card) => {
        moves.playJoker(selectedCard, card);
    }

    const pass = () => {
        moves.endTurn();
        setSelectedCard(undefined)
    }

    const PlayingCard = ({card, onClick}: {
        card: Card,
        onClick?: (_: Card) => void
    }) =>
        <span className={"card"
        + (onClick ? " selectable" : "")
        + ((selectedCard && selectedCard === card) ? " selectedCard" : "")}
              onClick={onClick && (_ => onClick(card))}>
            {card.value}
            {card.suit && suitMap[card.suit]}
            {card.value === 'K' ? <sup>{initials((card as any).player, ctx.playOrder)}</sup> : null }
    </span>

    const Pile = ({cards, suit} : {cards : Cards, suit: Suit}) =>
        <div>
            {cards.available.length}🂠&nbsp;
            {cards.pile.map((card, i) =>
                <PlayingCard card={card}
                             key={i}
                             onClick={isJoker(selectedCard) ? remove : undefined}/>)}
            {selectedCard && selectedCard.suit === suit
                ? <span className={"destination"} onClick={play(suit)}>:</span>
                : null}
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
            ActivePlayers: {JSON.stringify(ctx.activePlayers)}
        </div>
        <div>
            Current player: {ctx.currentPlayer}
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
                        {player.special.map((card, i) => <PlayingCard card={card} key={i}/>)}
                    </div>
                </td>
                <td/>
            </tr>
            </tbody>
        </table>
        <div>
            <p>Me ({playerID})</p>
            <div className="hand">
                {player.hand.map((card, i) =>
                    <PlayingCard card={card} key={i}
                            // If the playout deck runs out, you may complete your draw, if any, from the supply.
                            // No more numeric cards of that suite may be played.
                            onClick={
                                (playingAces
                                    ? card.value === 'A'
                                    : (isJoker(card) || G.tableau[card.suit!].available.length > 0))
                                ? setSelectedCard
                                : undefined}/>)}
            </div>
            {playingAces
                ? <button onClick={pass}>Click when done playing aces</button>
                : null
            }
        </div>

    </div>
}
