import { Industry } from "./Industries";
import industriesData from './Industries.json';

import { Board } from "./Board"
import boardData from "./Board.json"

import industryCardData from "./IndustryCards.json"

export class GameConfig
{
    industries : Industry[] = industriesData;
    industryCards : number[][] = industryCardData;

    board : Board = new Board(boardData);
}