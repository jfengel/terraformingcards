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
}
export type GameState = {tableau : Tableau,
    players : Player[],
    supply: Card[],
}
type Player = {hand : Card[], special : Card[]}

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
        }

        const players : Player[] = [];
        for(let i = 0; i < ctx.numPlayers; i++) {
            players.push({
                hand : supply.splice(0, 4),
                special : []
            })
        }
        return {supply,
            players,
            tableau};
    },

    moves: {
        play: (G : GameState, ctx : Ctx, card : Card) => {
            const player = G.players[ctx.playOrderPos];

            function draw(n : number = 1) {
                const draw = G.supply.splice(0, n);
                player.hand.push(...draw)
            }

            player.hand =
                player.hand.filter(x => !sameCard(x, card))
            const playerCard = {...card, player : ctx.currentPlayer};
            const tableau = G.tableau[card.suit!];
            if(typeof card.value === 'number') {
                tableau.pile.push(playerCard);
                // Draw from that playout deck the lesser of the rank of that card, or the number of cards in that pile.
                const playout = Math.min(card.value, tableau.pile.length);
                const cards = tableau.available.splice(0, playout);
                // If the playout deck runs out, you may complete your draw, if any, from the supply.
                player.hand.push(...cards)
                const extra = playout - cards.length;
                if(extra > 0) {
                    draw(extra);
                }
                // Jacks are played in front of you.
                // Whenever you play a numeric card of that suit, also draw one card from the supply.
                player.special.forEach(special => {
                    if (special.value === 'J' && card.suit === special.suit) {
                        draw(1);
                    }
                })
            } else {
                player.special.push(playerCard)
                // When you play a non-numeric card, draw one card from the supply.
                draw(1);

            }

        },
    },
};
