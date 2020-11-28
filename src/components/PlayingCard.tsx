import {Card} from "../game";
import {initials} from "../util/initials";
import React from "react";
import {Server} from "boardgame.io";

type PlayerMetadata = Server.PlayerMetadata;


const suitMap = {
    clubs: <span color='black'>♣</span>,
    diamonds: <span style={{color: 'red'}}>♦</span>,
    hearts: <span style={{color: 'red'}}>♥</span>,
    spades: <span color='black'>♠</span>,
}


const PlayingCard = ({card, onClick, selectedCard, matchData}: {
    card: Card,
    matchData? : PlayerMetadata[],
    selectedCard?: Card,
    onClick?: (_: Card) => void
}) =>
    <span className={"card"
    + (onClick ? " selectable" : "")
    + ((selectedCard && selectedCard === card) ? " selectedCard" : "")}
          onClick={onClick && (_ => onClick(card))}>
            {card.value}
        {card.suit && suitMap[card.suit]}
        {card.value === 'K'
            ? <sup>
                {initials((card as any).player,
                    matchData && matchData.map((md, i) => md.name || "" + i))}
            </sup>
            : null}
    </span>

export default PlayingCard;
