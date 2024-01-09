import { Industry } from "./Industry";
import { Board, Town, Mine, LinkInit } from "./Board"

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
                towns : Town[],
                mines : Mine[],
                links : LinkInit[],
                cardsInEachHand : number,
                numberOfPlayers : number)
    {
        this.industries = industries;
        this.industryCards = industryCards;

        this.board = new Board(towns, mines, links);

        this.merchantTiles = [];

        this.cardsInEachHand = cardsInEachHand;
        this.numberOfPlayers = numberOfPlayers;

        for (let i : number = 0; i < this.board.mines.length; i++)
        {
            let mine = this.board.mines[i];

            const max = this.industries.length - 1;
            const min = -1;

            for (let i : number = 0; i < mine.location.merchantTilesCount; i++)
            {
                let randomIndex : number = Math.floor(Math.random() * (max - min + 1)) + min;
                this.merchantTiles.push(randomIndex);
            }
        }
    }
}