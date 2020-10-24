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

export const isJoker = (card? : Card) => card && !card.suit

function sameCard(x: Card, y: Card) {
    return y.value === x.value && y.suit === x.suit && y.deck === x.deck;
}

export const PLAYING_ACES = 'PlayingAces';

const playJoker = (G : GameState, ctx : Ctx, joker : Card, card : Card) => {
    const player = G.players[ctx.playOrderPos];
    player.hand = player.hand.filter(x => !sameCard(x, joker))
    G.tableau[card.suit!].pile =
        G.tableau[card.suit!].pile.filter(x => !sameCard(x, card));
    ctx.events?.endTurn!()
}

export const playCard = (G : GameState, ctx : Ctx, card : Card) => {
    const player = G.players[ctx.playOrderPos];

    function draw(player : Player, n : number = 1) {
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
        if (extra > 0) {
            draw(player, extra);
        }
        // Jacks are played in front of you.
        // Whenever you play a numeric card of that suit, also draw one card from the supply.
        player.special.forEach(special => {
            if (special.value === 'J' && card.suit === special.suit) {
                draw(player, 1);
            }
        })
        // Queens are played in front of you.
        // Whenever anyone else (not you) plays a numeric card of that suit, draw one card from the supply.
        G.players
            .filter((_, i) => i !== ctx.playOrderPos)
            .forEach((player => {
                player.special.forEach(c => {
                    if (c.value === 'Q' && c.suit === card.suit) {
                        draw(player, 1);
                    }
                })
            }))
    } else if(card.value === 'A' || card.value === 'K') {
        // Aces are played on their matching suits. They may be played as a numeric card on your turn.
        tableau.pile.push(playerCard);
        // Draw one card from supply per ace and they do not trigger jacks or queens.
        draw(player, 1);
    } else {
        player.special.push(playerCard)
        // When you play a non-numeric card, draw one card from the supply.
        draw(player, 1);
    }
    if(player.hand.find(card => card.value === 'A') && !gameOver(G)) {
        // I don't think there's any reason to play aces at the end of the game, so this saves an action.
        ctx.events?.setStage!(PLAYING_ACES)
    } else {
        ctx.events?.endTurn!()
    }
};

export function distributeKings(t:
                                    Tableau, ctx: Ctx, G: GameState) {
    // At the end of the game, any previous cards between the king and the seed 10 (or a previous king)
    // go into the king's owner's hand.
    for (const suit of [t.clubs, t.diamonds, t.hearts, t.spades]) {
        const firstKing = suit.pile.findIndex(card => card.value === 'K');
        if (firstKing > 0) {
            const secondKing = suit.pile.findIndex((card, i) => i > firstKing && card.value === 'K');
            if (secondKing > 0) {
                const player = suit.pile[secondKing].player;
                const i = ctx.playOrder.indexOf(player!);
                const betweenKings2 = suit.pile.filter((_,i) => i > firstKing && i < secondKing)
                G.players[i].hand.push(...betweenKings2);
            }
            const player = suit.pile[firstKing].player;
            const i = ctx.playOrder.indexOf(player!);
            const betweenKings1 = suit.pile.filter((_,i) => i > 0 && i < firstKing)
            G.players[i].hand.push(...betweenKings1);
            // For some reason splice wasn't working on suit.pile
            // This doesn't work either. I can modify the players but not the suits. Weird.
            // It's not important to the final state of the game but it's odd.
            // suit.pile = suit.pile.filter((_,i) => i === 0 || i === firstKing || (secondKing > 0 && i >= secondKing ))
        }
    }
}

function gameOver(G: GameState) {
    return G.tableau.clubs.available.length === 0
        && G.tableau.hearts.available.length === 0
        && G.tableau.diamonds.available.length === 0
        && G.tableau.spades.available.length === 0;
}

export default {
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
    endIf: (G : GameState, ctx : Ctx) => {
        const t = G.tableau;
        // When the last playout deck runs out, finish the draw, if any, from the supply and the game ends.
        if(gameOver(G)) {
            distributeKings(t, ctx, G);
            const topScore = Math.max(...G.players.map(x => x.hand.length));
            const winners = G.players
                .map((p,i) => p.hand.length === topScore
                    ? ctx.playOrder[i]
                    : undefined)
                .filter(x => x)

            return {
                winners
            }
        }
    },
    turn: {
        stages: {
            discard: {
                moves: { playCard },
            },
        },
    },

    moves: {
        endTurn: (G : GameState, ctx : Ctx) => {
            ctx.events?.endStage!()
            ctx.events?.endTurn!();
        },
        play: playCard,
        playJoker,
    },
};
