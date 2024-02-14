import { LocalState, PrivateState, PublicPlayerData, PublicState } from "./GameState"
import { GameConfig } from "./GameConfig"

import industries from "./Data/Industries.json"
import industryCards from "./Data/IndustryCards.json"
import towns from "./Data/Board/Towns.json"
import mines from "./Data/Board/Mines.json"
import linkInits from "./Data/Board/LinkInits.json"

import initGameData from "./Data/InitGameData.json"
import initPlayerData from "./Data/InitPlayerData.json"

class Game {
    gameConfig : GameConfig;
    privateState : PrivateState;
    localStates : LocalState[];
    publicPlayerData : PublicPlayerData;
    publicState : PublicState;

    constructor(playerCount : number)
    {
        this.gameConfig = new GameConfig(industries, industryCards, towns, mines, linkInits, 8, playerCount);
        this.privateState = new PrivateState(this.gameConfig);

        this.localStates = []; 
        for (let i : number = 0; i < this.gameConfig.numberOfPlayers; i++)
        {
            this.localStates.push(new LocalState(this.privateState.DrawMultiple(this.gameConfig.cardsInEachHand)));
        }

        this.publicPlayerData = new PublicPlayerData(this.gameConfig, initPlayerData.money, initPlayerData.income);
        this.publicState = new PublicState(this.gameConfig, this.privateState, this.publicPlayerData, initGameData.coalMarketCount, initGameData.ironMarketCount);
    }
}

export function StartGame(playerCount : number) : Game
{
    return new Game(playerCount);
}

