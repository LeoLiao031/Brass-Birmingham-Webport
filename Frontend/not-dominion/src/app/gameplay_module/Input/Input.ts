import { GameConfig } from "../State/GameConfig";
import { Card, LocalState, PublicState, TownID } from "../State/GameState";
import { AppropriateCardCost, Cost, BuildMoneyCost } from "./Costs";

export enum InputType
{
    Build,
    Network,
    Develop,
    Sell,
    Loan,
    Scout
}

export class Input
{
    cardUsed : Card;
    inputType : InputType;
    playerID : number;

    costs : Cost[];

    constructor(cardUsed : Card,
                inputType : InputType,
                playerID : number,
                costs : Cost[])
    {
        this.cardUsed = cardUsed;
        this.inputType = inputType;
        this.playerID = playerID;
        this.costs = costs;
    }

    IsValidInput(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : boolean
    {
        for (let i : number = 0; i < this.costs.length; i++)
        {
            if (!this.costs[i].CanPayCost(this, localState, publicState, gameConfig))
            {
                return false;
            }
        }

        return true;
    }

    PayAllCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : void
    {
        for (let i : number = 0; i < this.costs.length; i++)
        {
            this.costs[i].PayCost(this, localState, publicState, gameConfig);
        }
    }
}

export class BuildInput extends Input
{
    townID : TownID;

    industryIndex : number;

    coalSelectionTownID : TownID;
    ironSelectionTownID : TownID;

    constructor(cardUsed : Card,
                playerID : number,
                townID : TownID,
                industryIndex : number,
                coalSelectionTownID : TownID,
                ironSelectionTownID : TownID)
    {
        let costs : Cost[] = [
            new AppropriateCardCost(), 
            new BuildMoneyCost() 
        ];
        super(cardUsed, InputType.Build, playerID, costs);

        this.townID = townID;
        this.industryIndex = industryIndex;
        this.coalSelectionTownID = coalSelectionTownID;
        this.ironSelectionTownID = ironSelectionTownID;
    }

}