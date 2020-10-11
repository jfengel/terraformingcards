import { Client } from 'boardgame.io/client';
import game from './game';

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

    const { G , ctx } = client.store.getState();

    expect(G.players[1].hand[3].suit).toBeDefined();

    expect(G.board['♣'].length).toBe(10);
    expect(G.board['♦'].length).toBe(16);
    expect(G.board['♥'][0].value).toBe(10);

    expect(G.supply.length).toBe(31);
    expect(G.supply[0]).toEqual({value: 'K', suit: '♣'});
});
