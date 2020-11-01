import React, {useState} from 'react';
import {Card, Cards, GameState, isJoker, PLAYING_ACES, Suit} from "../game";
import {Ctx, LogEntry, PlayerID, Server} from "boardgame.io";
import {initials} from "../util/initials";
import WinnerOverlay from "./WinnerOverlay";

type PlayerMetadata = Server.PlayerMetadata;

const suitMap = {
    clubs: <span color='black'>♣</span>,
    diamonds: <span style={{color: 'red'}}>♦</span>,
    hearts: <span style={{color: 'red'}}>♥</span>,
    spades: <span color='black'>♠</span>,
}

export default (props: any) => {
    const {G, moves, ctx, playerID, matchData, log}:
        {
            G: GameState, moves: any, ctx: Ctx, playerID: any, matchData: PlayerMetadata[],
            log: LogEntry[]
        } = props;
    const [selectedCard, setSelectedCard] = useState<Card>()

    const playerIx = ctx.playOrder.indexOf(playerID);
    const player = G.players[playerIx];

    const playingAces = ctx.activePlayers && ctx.activePlayers[playerID] === PLAYING_ACES;

    const play = (suit: Suit | null) => () => {
        moves.play(selectedCard, suit);
        setSelectedCard(undefined);
    }

    const remove = (card: Card) => {
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
            {card.value === 'K' ? <sup>{initials((card as any).player, ctx.playOrder)}</sup> : null}
    </span>

    const Pile = ({cards, suit}: { cards: Cards, suit: Suit }) =>
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
    if (!selectedCard)
        classes.push('noCardSelected');
    else if (selectedCard.value === 'J' || selectedCard.value === 'Q')
        classes.push('jackOrQueenSelected noCardSelected')
    else
        classes.push('cardSelected');

    const playerMD = matchData[playerIx];

    const playerName = (id : PlayerID) =>
        matchData[ctx.playOrder.indexOf(id)].name

    return <div className={classes.join(' ')}>
        <WinnerOverlay ctx={ctx}/>
        <div className="gameBoard">

            <div>
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
                    <p>Me ({playerMD.name})</p>
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
            <div className="lastMove">
            <div>
                <div>
                    Cards remaining: {G.supply.length}
                </div>
                <div>
                    Now playing: {playerName(ctx.currentPlayer)}
                </div>
                Past moves:
                {log
                    .filter(entry => entry.action.type === "MAKE_MOVE"
                        && entry.action.payload.type === "play")
                    .map((entry, i) => <div key={i}>
                        {playerName(entry.action.payload.playerID)}:
                        <PlayingCard card={entry.action.payload.args[0]}/>
                    </div>)
                }
            </div>
            </div>
        </div>




    </div>
}
