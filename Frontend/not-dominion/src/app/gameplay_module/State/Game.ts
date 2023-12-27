import { LocalState, PrivateState, PublicPlayerData, PublicState } from "./GameState"
import { GameConfig } from "./GameConfig"

import industries from "../Data/Industries.json"
import industryCards from "../Data/IndustryCards.json"
import board from "../Data/Board.json"


import initGameData from "../Data/InitGameData.json"
import initPlayerData from "../Data/InitPlayerData.json"

let numberOfPlayers : number = 4;

let gameConfig : GameConfig = new GameConfig(industries, industryCards, board);

let privateState : PrivateState = new PrivateState(gameConfig);

let LocalStates : LocalState[] = [];
for (let i : number = 0; i < numberOfPlayers; i++)
{
    LocalStates.push(new LocalState(privateState.DrawMultiple(8)));
}

let publicPlayerData : PublicPlayerData = new PublicPlayerData(gameConfig, initPlayerData.money, initPlayerData.income);
let publicState : PublicState = new PublicState(
    gameConfig, privateState, publicPlayerData, numberOfPlayers, initGameData.coalMarketCount, initGameData.ironMarketCount);

