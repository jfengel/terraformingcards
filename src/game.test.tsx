import {Client} from 'boardgame.io/client';
import game, {GameState, Suit} from './game';
import {initials} from "./util/initials";
import {Ctx} from "boardgame.io";
import {Local} from "boardgame.io/multiplayer";

it('should set up the game', () => {
    // set up a specific board scenario
    const scenario = {
        ...game,
        seed: 999,
    };

    // initialize the client with your custom scenario
    const client = Client({
        game: scenario,
    });

    const { G } : { G : GameState } = client.store.getState();

    expect(G.players[1].hand[3].suit).toBeDefined();

    expect(G.tableau.clubs.pile.length).toBe(1);
    expect(G.tableau.clubs.available.length).toBe(9);
    expect(G.tableau.diamonds.available.length).toBe(15);
    expect(G.tableau.hearts.pile[0].value).toBe(10);

    expect(G.supply.length).toBe(35);
    expect(G.supply[0]).toEqual({value: 9, suit: Suit.Diamonds, deck : 2});
});

expect(initials('Joshua', ['Alan', 'Joshua'])).toEqual('J');
expect(initials('Joshua', ['Alan', 'James'])).toEqual('Jo');
expect(initials('Joshua', ['Alan', 'John'])).toEqual('Ja');
expect(initials('Joshua Engel', ['Alan', 'John'])).toEqual('JE');
expect(initials('Joshua Engel', ['Alan', 'John Engel'])).toEqual('Joshua');
expect(initials('John Smith', ['Alan', 'John Smyth'])).toEqual('Smith');

it('should play the game', () => {
    let clubCount = 5;
    // set up a specific board scenario
    const scenario = {
        ...game,
        seed: 999,
        setup: (ctx : Ctx) => {
            const g : GameState = game.setup(ctx);
            g.tableau.clubs.available = g.tableau.clubs.available.splice(0, clubCount);
            g.tableau.diamonds.available = [];
            g.tableau.hearts.available = [];
            g.tableau.spades.available = [];
            return g;
        },
    };

    const multiplayer = Local() as any;
    const client1 = Client({
        game: scenario,
        multiplayer,
        playerID : "0",
    });
    client1.start();
    const client2 = Client({
        game: scenario,
        multiplayer,
        playerID : "1",
    });
    client2.start();


    client1.moves.play(c(7,C))
    const {G, ctx}: { G: GameState, ctx: Ctx } = client1.store.getState()
    expect(G.tableau.clubs.pile[1].value).toBe(7)
    expect(ctx.gameover).not.toBeDefined()
    expect(G.tableau.clubs.available.length).toBe(clubCount -= 2);

    client2.moves.play(c(8,C))
    expect(client2.store.getState().G.tableau.clubs.pile[2].value).toBe(8)
    expect(client2.store.getState().ctx.gameover.winners).toEqual(["1"]);
    expect(client2.store.getState().G.tableau.clubs.available.length).toBe(clubCount -= 3)

})

it('should distribute kings', () => {
    // set up a specific board scenario
    const scenario = {
        ...game,
        seed: 999,
        setup: (ctx : Ctx) => {
            const g : GameState = game.setup(ctx);
            g.tableau.diamonds.available = [];
            g.tableau.hearts.available = [];
            g.tableau.spades.available = [];
            return g;
        },
    };

    const multiplayer = Local() as any;
    const client1 = Client({
        game: scenario,
        multiplayer,
        playerID : "0",
    });
    client1.start();
    const client2 = Client({
        game: scenario,
        multiplayer,
        playerID : "1",
    });
    client2.start();

    let clubCount = client1.store.getState().G.tableau.clubs.available.length;
    let supplyCount = client1.store.getState().G.supply.length;

    client1.moves.play(c(7,C))
    expect(client1.store.getState().G.tableau.clubs.available.length).toBe(clubCount -= 2)

    client2.moves.play(c('K',C))
    expect(client2.store.getState().G.tableau.clubs.available.length).toBe(clubCount)
    expect(client1.store.getState().G.supply.length).toBe(--supplyCount)

    client1.moves.play(c(8,C))
    expect(client2.store.getState().G.tableau.clubs.available.length).toBe(clubCount -= 4)

    client2.moves.play(c(2,C))
    expect(client2.store.getState().G.tableau.clubs.available.length).toBe(clubCount -= 2)

    client1.moves.play(c('K',C,1))
    expect(client1.store.getState().G.tableau.clubs.available.length).toBe(clubCount)
    expect(client2.store.getState().ctx.gameover).toBeFalsy();

    client2.moves.play(c(9,C,1))
    const G = client2.store.getState().G;
    expect(client1.store.getState().ctx.gameover.winners.length).toBe(1);
    expect(client2.store.getState().ctx.gameover.winners[0]).toBe("1");
    expect(client2.store.getState().ctx.gameover.finalScores).toStrictEqual([13, 15]);
    expect(G.supply.length).toBe(27);
    expect(client1.store.getState().G.tableau.clubs.available.length).toBe(0)
})


const C = Suit.Clubs;
// const H = Suit.Hearts;
// const D = Suit.Diamonds;
// const S = Suit.Spades;

const c = (value : string | number, suit : Suit, deck = 0) => ({value, suit, deck});
