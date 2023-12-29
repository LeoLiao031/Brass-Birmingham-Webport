import { Industry } from "./Industry";
import { Board, LocationInit } from "./Board"

export type IndustryCard =
{
    industries : number[];
    cardCountForPlayerCounts : number[];
}

export class GameConfig
{
    industries : Industry[];
    industryCards : IndustryCard[];

    board : Board;

    merchantTiles : number[];

    cardsInEachHand : number;
    numberOfPlayers : number;

    constructor(industries : Industry[],
                industryCards : IndustryCard[],
                boardInit : LocationInit[],
                cardsInEachHand : number,
                numberOfPlayers : number)
    {
        this.industries = industries;
        this.industryCards = industryCards;

        this.board = new Board(boardInit);

        this.merchantTiles = [];

        this.cardsInEachHand = cardsInEachHand;
        this.numberOfPlayers = numberOfPlayers;

        for (let i : number = 0; i < this.board.mineIndexes.length; i++)
        {
            let mine = this.board.GetAsMine(this.board.mineIndexes[i]);
            if (mine == undefined)
            {
                continue;
            }

            const max = this.industries.length - 1;
            const min = -1;

            for (let i : number = 0; i < mine.merchantTilesCount; i++)
            {
                let randomIndex : number = Math.floor(Math.random() * (max - min + 1)) + min;
                this.merchantTiles.push(randomIndex);
            }
        }
    }
}