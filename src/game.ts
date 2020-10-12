import {Ctx, PlayerID} from "boardgame.io";

export enum Suit {Clubs='clubs', Diamonds='diamonds', Hearts='hearts', Spades='spades'}
export type Card = {
    value : string | number,
    suit : Suit | null,
    deck : number}
export type PlayedCard = Card & {player : PlayerID | null}
export type Cards = { pile: PlayedCard[], available: Card[] };
export type Tableau = {
    clubs: Cards,
    diamonds: Cards,
    hearts: Cards,
    spades: Cards,
    special : PlayedCard[]
}
export type GameState = {tableau : Tableau,
    players : Player[],
    supply: Card[],
}
type Player = {hand : Card[]}

function sameCard(x: Card, y: Card) {
    return y.value === x.value && y.suit === x.suit && y.deck === x.deck;
}

export default {
    turn : {
        moveLimit: 1,
    },
    setup: (ctx : Ctx) => {
        const deck = [1, 2].flatMap(deck => {
            // Note the missing 10
            const cards: Card[] = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 'J', 'Q', 'K'].flatMap(
                value => [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades].map(
                    suit => ({value, suit, deck})
                ));
            cards.push({value: '🃏', suit: null, deck})
            cards.push({value: '🃟', suit: null, deck})
            return cards;
        })
        const supply = ctx.random?.Shuffle(deck)!;
        const tableau : Tableau = {
            clubs : {pile : [{suit : Suit.Clubs, value:10, player: null, deck: 1}], available : supply.splice(0, 9)},
            diamonds : {pile : [{suit : Suit.Diamonds, value:10, player: null, deck : 1}], available : supply.splice(0, 15)},
            hearts : {pile : [{suit : Suit.Hearts, value:10, player: null, deck : 1}], available : supply.splice(0, 14)},
            spades : {pile : [{suit : Suit.Spades, value:10, player: null, deck : 1}], available : supply.splice(0, 19)},
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
            G.players[ctx.playOrderPos].hand =
                G.players[ctx.playOrderPos].hand.filter(x => !sameCard(x, card))
            const playerCard = {...card, player : ctx.currentPlayer};
            const tableau = G.tableau[card.suit!];
            if(typeof card.value === 'number') {
                tableau.pile.push(playerCard);
                // Draw from that playout deck the lesser of the rank of that card, or the number of cards in that pile.
                G.players[ctx.playOrderPos].hand.push(...tableau.available.splice(0, card.value))
            } else {
                G.tableau.special.push(playerCard)
            }

        },
    },
};
