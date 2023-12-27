import { Industry } from "./Industries";
import industriesData from './Industries.json';

import { Board } from "./Board"
import boardData from "./Board.json"

export class GameConfig
{
    industries : Industry[] = industriesData;
    board : Board = new Board(boardData);
}