import { Industry } from "./Industry";
import { Board, Location, LinkInit, Mine } from "./Board"
import { Cast } from "../Utils";

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
                locations : Location[],
                links : LinkInit[],
                cardsInEachHand : number,
                numberOfPlayers : number)
    {
        this.industries = industries;
        this.industryCards = industryCards;

        this.board = new Board(locations, links);

        this.merchantTiles = [];

        this.cardsInEachHand = cardsInEachHand;
        this.numberOfPlayers = numberOfPlayers;

        this.board.mineIndexes.forEach(mineIndex => {
            let mine = Cast<Mine>(this.board.locations[mineIndex]);

            if (mine != undefined)
            {
                const max = this.industries.length - 1;
                const min = -1;
    
                for (let i : number = 0; i < mine.merchantTilesCount; i++)
                {
                    let randomIndex : number = Math.floor(Math.random() * (max - min + 1)) + min;
                    this.merchantTiles.push(randomIndex);
                }   
            }
        });

    }
}