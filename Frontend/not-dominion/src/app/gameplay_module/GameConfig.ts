import { Industry } from "./Industries";
import industriesData from './Data/Industries.json';

import { Board } from "./Board"
import boardData from "./Data/Board.json"

import industryCardData from "./Data/IndustryCards.json"

export class GameConfig
{
    industries : Industry[] = industriesData;
    industryCards : number[][] = industryCardData;

    board : Board = new Board(boardData);
}