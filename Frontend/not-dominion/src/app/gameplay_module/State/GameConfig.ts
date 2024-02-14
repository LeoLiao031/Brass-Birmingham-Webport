import { Industry } from "./Industry";
import { Board, LinkInit, Mine, Town } from "./Board"

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

    coalMarketPrices : number[] = [8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1]
    ironMarketPrices : number[] = [6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1]

    constructor(industries : Industry[],
                industryCards : IndustryCard[],
                towns : Town[],
                mines : Mine[],
                linkInits : LinkInit[],
                cardsInEachHand : number,
                numberOfPlayers : number)
    {
        this.industries = industries;
        this.industryCards = industryCards;

        this.board = new Board(towns, mines, linkInits);

        this.merchantTiles = [];

        this.cardsInEachHand = cardsInEachHand;
        this.numberOfPlayers = numberOfPlayers;

        mines.forEach(mine => 
        {
            const max = this.industries.length - 1;
            const min = -1;

            for (let i : number = 0; i < mine.merchantTilesCount; i++)
            {
                let randomIndex : number = Math.floor(Math.random() * (max - min + 1)) + min;
                this.merchantTiles.push(randomIndex);
            }   
        });
    }

    GetCoalMarketCost(amountInMarket : number, count : number) : number
    {
        let currentAmountInMarket : number = amountInMarket;
        let currentCount : number = count;
        let currentCost : number = 0;

        while (count > 0)
        {
            currentCost += this.coalMarketPrices[currentAmountInMarket];
            currentAmountInMarket--;
            currentCount--;
        }

        return currentCost;
    }

    GetIronMarketCost(amountInMarket : number, count : number) : number
    {
        let currentAmountInMarket : number = amountInMarket;
        let currentCount : number = count;
        let currentCost : number = 0;

        while (count > 0)
        {
            currentCost += this.coalMarketPrices[currentAmountInMarket];
            currentAmountInMarket--;
            currentCount--;
        }

        return currentCost;
    }
}