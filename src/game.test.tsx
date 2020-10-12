import { Client } from 'boardgame.io/client';
import game, {GameState, Suit} from './game';
import {initials} from "./components/Board";

it('should set up the game', () => {
    // set up a specific board scenario
    const scenario = {
        ...game,
        seed: 999
        // setup: () => ({
        //     cells: ['0', '0', null, '1', '1', null, null, null, null],
        // }),
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

