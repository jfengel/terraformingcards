import {Game, Ctx, PlayerID} from "boardgame.io";

type Card = {value : string | number, suit : string}
type PlayedCard = Card & {player : PlayerID | null}
type Tableau = {
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
    setup: (ctx : Ctx) => {
        // Note the missing 10
        const deck : Card[] = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 'J', 'Q', 'K'].flatMap(
            value => ['clubs', 'diamonds', 'hearts', 'spades'].map(
                suit => ({value, suit})
        ));
        Array(4).forEach(
            _ => deck.push({value: 'Joker', suit: ''}))
        const supply = ctx.random?.Shuffle([...deck, ...deck])!;
        const tableau : Tableau = {
            clubs : {pile : [{suit : 'clubs', value:10, player: null}], available : supply.splice(0, 9)},
            diamonds : {pile : [{suit : 'diamonds', value:10, player: null}], available : supply.splice(0, 15)},
            hearts : {pile : [{suit : 'hearts', value:10, player: null}], available : supply.splice(0, 14)},
            spades : {pile : [{suit : 'spades', value:10, player: null}], available : supply.splice(0, 19)},
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
        play: (G : Game<GameState>, ctx : Ctx, card : Card) => {
            console.info('G', G);
            console.info('ctx', ctx);
            console.info('card', card);
            // G.cells[id] = ctx.currentPlayer;
        },
    },
};
