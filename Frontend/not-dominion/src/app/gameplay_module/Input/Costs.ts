import { Town, Traverser } from "../State/Board";
import { GameConfig } from "../State/GameConfig";
import { LocalState, PublicState, TileOnBoard } from "../State/GameState";
import { BuildInput, Input, InputType } from "./Input";

export interface Cost
{
    CanPayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean;
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void;
}

export class CostTemplate implements Cost
{
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        return true;
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        
    }
}

export class CardCost implements Cost
{
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        if (!input.cardUsed)
        {
            return false;
        }

        if (localState.hand.indexOf(input.cardUsed) == -1)
        {
            return false;
        }

        return true;
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
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        if (input.inputType != InputType.Build)
        {
            return false;
        }

        let buildInput : BuildInput = input as BuildInput;

        // TODO Oscar: This is unfinished. There's like 10 more conditions.
        if (buildInput.townID.locationIndex >= gameConfig.board.locations.length)
        {
            return false;
        }

        if (buildInput.townID.locationIndex >= gameConfig.board.mineStartIndex)
        {
            return false;
        }

        let town = gameConfig.board.locations[buildInput.townID.locationIndex].location as Town;

        if (town == undefined)
        {
            return false;
        }

        if (buildInput.townID.tileIndex >= town.tiles.length)
        {
            return false
        }

        if (town.tiles[buildInput.townID.tileIndex].allowedIndustries.indexOf(buildInput.industryIndex) == -1)
        {
            return false;
        }

        if (!publicState.IsTileEmpty(buildInput.townID))
        {
            return false;
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

    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        if (publicState.publicPlayerData[input.playerID].money < this.amount)
        {
            return false;
        }

        return true;
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

    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
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
                        return true;
                    }
                }
            })

            currentLocation = traverser.GetNextLocationIndex();
        }

        return false;
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

    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
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
                        return true;
                    }
                }
            })

            currentLocation = traverser.GetNextLocationIndex();
        }

        return false;
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
    }
}