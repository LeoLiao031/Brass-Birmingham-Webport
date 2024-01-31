import { Town, Traverser } from "../State/Board";
import { GameConfig } from "../State/GameConfig";
import { LocalState, PublicState, TileOnBoard } from "../State/GameState";
import { BuildInput, Input, InputType } from "./Input";

export enum ResponseType
{
    Failure,
    Conditional,
    Success
}

class CostResponse
{
    responseType : ResponseType;
    additionalMoneyRequired : number;

    constructor(responseType : ResponseType,
                additionalMoneyRequired : number = 0)
    {
        this.responseType = responseType;
        this.additionalMoneyRequired = additionalMoneyRequired;
    }
}

export interface Cost
{
    CanPayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : CostResponse;
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void;
}

export class CostTemplate implements Cost
{
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : CostResponse 
    {
        return new CostResponse(ResponseType.Success);
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        
    }
}

export class CardCost implements Cost
{
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : CostResponse 
    {
        if (!input.cardUsed)
        {
            return new CostResponse(ResponseType.Failure);
        }

        if (localState.hand.indexOf(input.cardUsed) == -1)
        {
            return new CostResponse(ResponseType.Failure);
        }

        return new CostResponse(ResponseType.Success);
    }

    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        let index : number = localState.hand.indexOf(input.cardUsed);
        localState.hand = localState.hand.splice(index, 1);
        
        publicState.publicPlayerData[input.playerID].discardPile.push(input.cardUsed);
    }
}

export class AppropriateCardCost implements Cost
{
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : CostResponse 
    {
        if (input.inputType != InputType.Build)
        {
            return new CostResponse(ResponseType.Failure);
        }

        let buildInput : BuildInput = input as BuildInput;

        // TODO Oscar: This is unfinished. There's like 10 more conditions.
        if (buildInput.townID.locationIndex >= gameConfig.board.locations.length)
        {
            return new CostResponse(ResponseType.Failure);
        }

        if (buildInput.townID.locationIndex >= gameConfig.board.mineStartIndex)
        {
            return new CostResponse(ResponseType.Failure);
        }

        let town = gameConfig.board.locations[buildInput.townID.locationIndex].location as Town;

        if (town == undefined)
        {
            return new CostResponse(ResponseType.Failure);
        }

        if (buildInput.townID.tileIndex >= town.tiles.length)
        {
            return new CostResponse(ResponseType.Failure);
        }

        if (town.tiles[buildInput.townID.tileIndex].allowedIndustries.indexOf(buildInput.industryIndex) == -1)
        {
            return new CostResponse(ResponseType.Failure);
        }

        if (!publicState.IsTileEmpty(buildInput.townID))
        {
            return new CostResponse(ResponseType.Failure);
        }

        return new CardCost().CanPayCost(input, localState, publicState, gameConfig);
    }
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        new CardCost().PayCost(input, localState, publicState, gameConfig);
    }
}

export class MoneyCost implements Cost
{
    amount : number;
    constructor(amount :number)
    {
        this.amount = amount;
    }

    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : CostResponse 
    {
        return new CostResponse(ResponseType.Conditional, this.amount);
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        publicState.publicPlayerData[input.playerID].money -= this.amount;
    }
}

export class CoalCost implements Cost
{
    amount : number;
    startingLocationIndex : number;
    constructor(amount : number,
                startingLocationIndex : number)
    {
        this.amount = amount;
        this.startingLocationIndex = startingLocationIndex;
    }

    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : CostResponse 
    {
        let amountRemaining : number = this.amount;

        let traverser : Traverser = new Traverser(
            gameConfig.board, this.startingLocationIndex, publicState);

        let currentLocation = traverser.GetNextLocationIndex();
        while (currentLocation != undefined)
        {
            publicState.tilesOnBoard.forEach((tileOnBoard : TileOnBoard) => 
            {
                if (tileOnBoard.townID.locationIndex == currentLocation &&
                    tileOnBoard.coal > amountRemaining)
                {
                    amountRemaining -= tileOnBoard.coal;

                    if (amountRemaining <= 0)
                    {
                        return new CostResponse(ResponseType.Success);
                    }
                }
            })

            currentLocation = traverser.GetNextLocationIndex();
        }

        if (amountRemaining > publicState.coalMarketCount)
        {
            return new CostResponse(ResponseType.Failure);
        }

        let additionalCost : number = gameConfig.GetCoalMarketCost(publicState.coalMarketCount, amountRemaining);
        return new CostResponse(ResponseType.Conditional, additionalCost);
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        let amountRemaining : number = this.amount;

        let traverser : Traverser = new Traverser(
            gameConfig.board, this.startingLocationIndex, publicState);
        
        let currentLocation = traverser.GetNextLocationIndex();
        while (currentLocation != undefined)
        {
            publicState.tilesOnBoard.forEach((tileOnBoard : TileOnBoard) => 
            {
                if (tileOnBoard.townID.locationIndex == currentLocation &&
                    tileOnBoard.coal > amountRemaining)
                {
                    let amountToConsume : number = Math.min(tileOnBoard.coal, amountRemaining)
                    amountRemaining -= amountToConsume
                    tileOnBoard.coal -= amountToConsume;

                    if (amountRemaining <= 0)
                    {
                        return;
                    }
                }
            })

            currentLocation = traverser.GetNextLocationIndex();
        }

        let additionalCost : number = gameConfig.GetCoalMarketCost(publicState.coalMarketCount, amountRemaining);
        publicState.publicPlayerData[input.playerID].money -= additionalCost;
        publicState.coalMarketCount -= amountRemaining;
    }
}

export class IronCost implements Cost
{
    amount : number;
    startingLocationIndex : number;
    constructor(amount : number,
                startingLocationIndex : number)
    {
        this.amount = amount;
        this.startingLocationIndex = startingLocationIndex;
    }

    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : CostResponse 
    {
        let amountRemaining : number = this.amount;

        let traverser : Traverser = new Traverser(
            gameConfig.board, this.startingLocationIndex);

        let currentLocation = traverser.GetNextLocationIndex();
        while (currentLocation != undefined)
        {
            publicState.tilesOnBoard.forEach((tileOnBoard : TileOnBoard) => 
            {
                if (tileOnBoard.townID.locationIndex == currentLocation &&
                    tileOnBoard.iron > amountRemaining)
                {
                    amountRemaining -= tileOnBoard.iron;

                    if (amountRemaining <= 0)
                    {
                        return new CostResponse(ResponseType.Success);
                    }
                }
            })

            currentLocation = traverser.GetNextLocationIndex();
        }

        if (amountRemaining > publicState.ironMarketCount)
        {
            return new CostResponse(ResponseType.Failure);
        }

        let additionalCost : number = gameConfig.GetIronMarketCost(publicState.ironMarketCount, amountRemaining);
        return new CostResponse(ResponseType.Conditional, additionalCost);
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        let amountRemaining : number = this.amount;

        let traverser : Traverser = new Traverser(
            gameConfig.board, this.startingLocationIndex, publicState);
        
        let currentLocation = traverser.GetNextLocationIndex();
        while (currentLocation != undefined)
        {
            publicState.tilesOnBoard.forEach((tileOnBoard : TileOnBoard) => 
            {
                if (tileOnBoard.townID.locationIndex == currentLocation &&
                    tileOnBoard.iron > amountRemaining)
                {
                    let amountToConsume : number = Math.min(tileOnBoard.iron, amountRemaining)
                    amountRemaining -= amountToConsume
                    tileOnBoard.iron -= amountToConsume;

                    if (amountRemaining <= 0)
                    {
                        return;
                    }
                }
            })

            currentLocation = traverser.GetNextLocationIndex();
        }

        
        let additionalCost : number = gameConfig.GetIronMarketCost(publicState.coalMarketCount, amountRemaining);
        publicState.publicPlayerData[input.playerID].money -= additionalCost;
        publicState.coalMarketCount -= amountRemaining;
    }
}