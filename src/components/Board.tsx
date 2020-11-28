import React, {useState} from 'react';
import {Card, Cards, GameState, isJoker, PLAYING_ACES, Suit} from "../game";
import {Ctx, LogEntry, PlayerID, Server} from "boardgame.io";
import WinnerOverlay from "./WinnerOverlay";
import { MatchContext } from './matchcontext';
import PlayingCard from "./PlayingCard";

type PlayerMetadata = Server.PlayerMetadata;

const toPlayerId = (x : number) : PlayerID => {
    return "" + x;
}

export const playerName = (id : PlayerID, matchData : PlayerMetadata[]) =>
    matchData.find(p => toPlayerId(p.id) === id)?.name

function logEntry(entry: LogEntry,
                  matchData: PlayerMetadata[],
                  PlayingCard: ({card, onClick}: { card: Card; onClick?: (_: Card) => void }) => JSX.Element) {
    switch (entry.action.payload.type) {
        case "play":
            return <>
                {playerName(entry.action.payload.playerID, matchData)}:
                <PlayingCard card={entry.action.payload.args[0]}/>
            </>;
        case "playJoker":
            return <>
                {playerName(entry.action.payload.playerID, matchData)}:
                <PlayingCard card={entry.action.payload.args[0]}/>
                &nbsp;on&nbsp;
                <PlayingCard card={entry.action.payload.args[1]}/>
            </>;
    }
}

const _ = null;

/** How to lay players out clockwise, with ourselves at the bottom.
 * Line up all of the players in order after you, circularly.
 * So if there are 4 players ("0", "1", "2, "3"), and you are player
 * "2", player "3" will be assigned 0, "0"->1, and "1" -> 2.
 * Pick the Nth row, where N is the number of players.
 * The row represents 2 rows of 3 cells each. The tableau goes in the center
 * of the bottom row.
 * So for 4 players, thw row is [[_,1,_],[0,_,2]], so the positions are:
 *
 * [blank]   [1 : "0"] [blank]
 * [0 : "3"] [Tableau] [2 : "1"]
 *
 * And yes, this was the easiest way I could think of to do it. The
 * use of "1", "2", "3", is ot my fault.
 *
 * The game rules allow for 7 players, and this only supports 6. A new row
 * can be added to support 7.
 */
const playerLayout = [
    null,
    null,
    [[_,0,_],[_,_,_]],
    [[0,_,1],[_,_,_]],
    [[_,1,_],[0,_,2]],
    [[1,2,_],[0,_,3]],
    [[1,2,3],[0,_,4]],
]

const OtherPlayer = ({row, col, G, matchData, playerID} :
                         {row : number, col : number,
                             matchData : PlayerMetadata[],
                             playerID : PlayerID,
                             G : GameState }) => {
    const playerIDs = matchData.map(x => toPlayerId(x.id));
    const circle = [...playerIDs, ...playerIDs];
    const meIx = circle.indexOf(playerID);
    circle.splice(0, meIx+1);

    const layout = playerLayout[matchData.length];
    if(!layout) {
        return null;
    }
    const px = layout[row][col];
    if(px === null) {
         return null;
    }
    const otherPID = circle[px]
    const otherPIx = matchData.findIndex(x => toPlayerId(x.id) === otherPID)!

    return <div className="otherPlayer">
        <span className="playerName">{matchData[otherPIx].name}</span><br/>
        {G.players[otherPIx].hand.length}🂠<br/>
        <div className="otherPlayerJacksAndQueens">
            {G.players[otherPIx].special.map((card, i) =>
                <PlayingCard key={i} {...{card}}/>)}
        </div>
    </div>;
}

export default (props: any) => {
    const {G, moves, ctx, playerID, matchData, log}:
        {
            G: GameState, moves: any, ctx: Ctx, playerID: PlayerID, matchData: PlayerMetadata[],
            log: LogEntry[]
        } = props;

    const [selectedCard, setSelectedCard] = useState<Card>()

    const playerIx = matchData.findIndex(md => ""+md.id === playerID);
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

    const Pile = ({cards, suit}: { cards: Cards, suit: Suit }) =>
        <div>
            {cards.available.length}🂠&nbsp;
            {cards.pile.map((card, i) =>
                <PlayingCard card={card}
                             key={i}
                             matchData={matchData}
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
    classes.push("terraformingmars");

    const playerMD = matchData[playerIx];

    return <div className={classes.join(' ')}>
        <MatchContext.Provider value={matchData}>
        <WinnerOverlay ctx={ctx}/>
        <div className="gameBoard">

            <div>
                <table>
                    <tbody>
                    <tr>
                        <td><OtherPlayer row={0} col={0} {...{G, ctx, matchData, playerID}}/></td>
                        <td><OtherPlayer row={0} col={1} {...{G, ctx, matchData, playerID}}/></td>
                        <td><OtherPlayer row={0} col={2} {...{G, ctx, matchData, playerID}}/></td>
                    </tr>
                    <tr>
                        <td/>
                        <td>
                            <>
                            <Pile suit={Suit.Clubs} cards={G.tableau.clubs}/>
                            <Pile suit={Suit.Diamonds} cards={G.tableau.diamonds}/>
                            <Pile suit={Suit.Hearts} cards={G.tableau.hearts}/>
                            <Pile suit={Suit.Spades} cards={G.tableau.spades}/>
                            <div className='jacksAndQueens' onClick={play(null)}>
                                :
                                {player.special.map((card, i) => <PlayingCard card={card} key={i}/>)}
                            </div>
                                </>
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
                                         selectedCard={selectedCard}
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
                    Now playing: {playerName(ctx.currentPlayer, matchData)}
                </div>
                Past moves:
                {log
                    .filter(entry => entry.action.type === "MAKE_MOVE"
                        && entry.action.payload.type.startsWith("play"))
                    .map((entry, i) =>
                        <div key={i}>
                            {logEntry(entry, matchData, PlayingCard)}
                        </div>)
                    .reverse()
                }
            </div>
            </div>
        </div>



        </MatchContext.Provider>
    </div>
}
