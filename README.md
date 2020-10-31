An online card game, Terraforming Cards

Compile: npx tsc (You may have to set noEmit to false in tsconfig.json)

Run server: node -r esm server.js

## Rules
A 10-15 minute TM game for 2-7 players designed by me!

Use two standard decks of playing cards including the jokers.
Lay out one 10 of each suit to seed the parameter piles. Shuffle the rest of the cards.
Next to each 10 deal out the playout deck of nine cards for clubs/water, fourteen for hearts/oxygen, fifteen for diamonds/venus, nineteen for spades/heat.
Deal four cards to each player. The remaining cards are the supply.
On your turn, play one card and then draw accordingly.

Numeric cards are 2-10.
Play them on the matching suit pile such that the number of cards in that pile can be easily counted.
Draw from that playout deck the lesser of the rank of that card, or the number of cards in that pile. The number of cards in that pile includes the seed 10, aces, kings, and the card just played.
If the playout deck runs out, you may complete your draw, if any, from the supply. No more numeric cards of that suite may be played.
When the last playout deck runs out, finish the draw, if any, from the supply and the game ends. Whoever has the most cards in hand wins.
In the rare circumstances if any player cannot play a card on their turn, they may show their hand to prove it, and the game ends then. Whoever has the most cards in hand wins.

Non-numerics cards are jacks, queens, kings, aces, jokers.
When you play a non-numeric card, draw one card from the supply.

Jacks are played in front of you. Whenever you play a numeric card of that suit, also draw one card from the supply.

Queens are played in front of you. Whenever anyone else (not you) plays a numeric card of that suit, draw one card from the supply.

Kings are played on their matching suits. Play them such that they are offset and oriented toward their player to show ownership. At the end of the game, any previous cards between the king and the seed 10 (or a previous king) go into the king's owner's hand. (Leave the seed 10s out so you can quickly start another game.)

Aces are played on their matching suits. They may be played as a numeric card on your turn. You may also play any number of aces as non-numeric cards after you have drawn cards. (Draw one card from supply per ace and they do not trigger jacks or queens.)

Jokers when played are removed from the game along with one other card.

