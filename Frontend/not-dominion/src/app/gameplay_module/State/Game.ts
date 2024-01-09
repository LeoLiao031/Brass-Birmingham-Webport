import { LocalState, PrivateState, PublicPlayerData, PublicState } from "./GameState"
import { GameConfig } from "./GameConfig"

import industries from "./Data/Industries.json"
import industryCards from "./Data/IndustryCards.json"
import towns from "./Data/Board/Towns.json"
import mines from "./Data/Board/Mines.json"
import linkInits from "./Data/Board/LinkInits.json"


import initGameData from "./Data/InitGameData.json"
import initPlayerData from "./Data/InitPlayerData.json"

export function StartGame()
{
    let gameConfig : GameConfig = new GameConfig(industries, industryCards, towns, mines, linkInits, 8, 4);

    let privateState : PrivateState = new PrivateState(gameConfig);

    let LocalStates : LocalState[] = [];
    for (let i : number = 0; i < gameConfig.numberOfPlayers; i++)
    {
        LocalStates.push(new LocalState(privateState.DrawMultiple(gameConfig.cardsInEachHand)));
    }

    let publicPlayerData : PublicPlayerData = new PublicPlayerData(gameConfig, initPlayerData.money, initPlayerData.income);
    let publicState : PublicState = new PublicState(
        gameConfig, privateState, publicPlayerData, initGameData.coalMarketCount, initGameData.ironMarketCount);
    
    console.log(gameConfig);
    console.log(privateState);
    console.log(LocalStates);
    console.log(publicState);
}

