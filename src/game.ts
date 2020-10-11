import {Game, Ctx} from "boardgame.io";

type Card = {value : string | number, suit : string}
type Tableau = {[p: string]: Card[]}
type GameState = {tableau : Tableau,
    supply: Card[],
}
type Player = {hand : Card[]}

export default {
    setup: (ctx : Ctx) => {
        // Note the missing 10
        const deck : Card[] = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 'J', 'Q', 'K'].flatMap(
            value => ['♣', '♦', '♥', '♠'].map(
                suit => ({value, suit})
        ));
        Array(4).forEach(
            _ => deck.push({value: 'Joker', suit: ''}))
        const supply = ctx.random?.Shuffle([...deck, ...deck])!;
        const board : Tableau = Object.fromEntries(
            ['♣', '♦', '♥', '♠'].map(suit =>
            [suit, [{suit, value:10}]])
        )
        // nine cards for clubs/water, fourteen for hearts/oxygen, fifteen for diamonds/venus, nineteen for spades/heat
        Array(9).fill(0).forEach(_ => board['♣'].push(supply.pop()!));
        Array(14).fill(0).forEach(_ => board['♥'].push(supply.pop()!));
        Array(15).fill(0).forEach(_ => board['♦'].push(supply.pop()!));
        Array(19).fill(0).forEach(_ => board['♠'].push(supply.pop()!));

        const players : Player[] = [];
        for(let i = 0; i < ctx.numPlayers; i++) {
            players.push({
                hand : supply.splice(0, 4)
            })
        }
        return {supply,
            players,
            board};
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
