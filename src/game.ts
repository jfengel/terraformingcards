import {Ctx, PlayerID} from "boardgame.io";

export enum Suit {Clubs='clubs', Diamonds='diamonds', Hearts='hearts', Spades='spades'}
export type Card = {value : string | number, suit : Suit | null}
export type PlayedCard = Card & {player : PlayerID | null}
export type Tableau = {
    clubs: {pile : PlayedCard[], available : Card[]},
    diamonds: {pile : PlayedCard[], available : Card[]},
    hearts: {pile : PlayedCard[], available : Card[]},
    spades: {pile : PlayedCard[], available : Card[]},
    special : PlayedCard[]
}
export type GameState = {tableau : Tableau,
    players : Player[],
    supply: Card[],
}
type Player = {hand : Card[]}

export default {
    turn : {
        moveLimit: 1,
    },
    setup: (ctx : Ctx) => {
        // Note the missing 10
        const deck : Card[] = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 'J', 'Q', 'K'].flatMap(
            value => [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades].map(
                suit => ({value, suit})
        ));
        Array(4).forEach(
            _ => deck.push({value: 'Joker', suit: null}))
        const supply = ctx.random?.Shuffle([...deck, ...deck])!;
        const tableau : Tableau = {
            clubs : {pile : [{suit : Suit.Clubs, value:10, player: null}], available : supply.splice(0, 9)},
            diamonds : {pile : [{suit : Suit.Diamonds, value:10, player: null}], available : supply.splice(0, 15)},
            hearts : {pile : [{suit : Suit.Hearts, value:10, player: null}], available : supply.splice(0, 14)},
            spades : {pile : [{suit : Suit.Spades, value:10, player: null}], available : supply.splice(0, 19)},
            special : []
        }

        const players : Player[] = [];
        for(let i = 0; i < ctx.numPlayers; i++) {
            players.push({
                hand : supply.splice(0, 4)
            })
        }
        return {supply,
            players,
            tableau};
    },

    moves: {
        play: (G : GameState, ctx : Ctx, card : Card) => {
            // console.info('moves', G.moves);
            console.info('tableau', (G).tableau);
            console.info('players', (G).players);
            console.info('ctx', ctx);
            console.info('card', card);
            // G.cells[id] = ctx.currentPlayer;
            G.players[ctx.playOrderPos].hand.pop();
        },
    },
};
