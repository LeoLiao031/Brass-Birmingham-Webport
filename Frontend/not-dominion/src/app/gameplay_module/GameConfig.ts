import { Industry } from "./Industry";
import industriesData from './Data/Industries.json';

import { Board } from "./Board"
import boardData from "./Data/Board.json"

import industryCardData from "./Data/IndustryCards.json"

export class GameConfig
{
    industries : Industry[];
    industryCards : number[][];

    board : Board;

    merchantTiles : number[];

    constructor()
    {
        this.industries = industriesData;
        this.industryCards = industryCardData;

        this.board = new Board(boardData);

        this.merchantTiles = [];

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