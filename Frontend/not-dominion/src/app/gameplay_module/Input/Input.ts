import { GameConfig } from "../State/GameConfig";
import { Card, Link, LocalState, PublicState, TileOnBoard, TownID } from "../State/GameState";
import { AppropriateCardCost, Cost, MoneyCost, CoalCost, IronCost, ResponseType } from "./Costs";

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

    constructor(cardUsed : Card,
                inputType : InputType,
                playerID : number)
    {
        this.cardUsed = cardUsed;
        this.inputType = inputType;
        this.playerID = playerID;
    }

    GetCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : Cost[]
    {
        return [];
    }

    IsValidInput(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : boolean
    {
        let costs : Cost[] = this.GetCosts(localState, publicState, gameConfig);
        let moneyCost : number = 0; 

        for (let i : number = 0; i < costs.length; i++)
        {
            let response = costs[i].CanPayCost(this, localState, publicState, gameConfig);

            if (response.responseType == ResponseType.Failure)
            {
                return false;
            }
            else if (response.responseType == ResponseType.Conditional)
            {
                moneyCost += response.additionalMoneyRequired;
            }
        }

        if (publicState.publicPlayerData[this.playerID].money < moneyCost)
        {
            return false;
        }

        return true;
    }

    PayAllCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : void
    {
        let costs : Cost[] = this.GetCosts(localState, publicState, gameConfig);

        for (let i : number = 0; i < costs.length; i++)
        {
            costs[i].PayCost(this, localState, publicState, gameConfig);
        }
    }

    Execute(localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        
    }
}

export class BuildInput extends Input
{
    townID : TownID;
    industryIndex : number;

    constructor(cardUsed : Card,
                playerID : number,
                townID : TownID,
                industryIndex : number)
    {
        super(cardUsed, InputType.Build, playerID);

        this.townID = townID;
        this.industryIndex = industryIndex;
    }

    GetPrice(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : number
    {
        let nextSectionIndex : number = 
        publicState.publicPlayerData[this.playerID].playerArea.section[this.industryIndex].GetNextSectionIndex();

        if (nextSectionIndex > 0)
        {
            return gameConfig.industries[this.industryIndex].industryLevels[nextSectionIndex].moneyCost;
        }

        return 0;
    }

    GetCoalCost(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : number
    {
        let nextIndustrySection : number = publicState.publicPlayerData[this.playerID].
            playerArea.section[this.industryIndex].GetNextSectionIndex();
        let amount : number = gameConfig.industries[this.industryIndex].industryLevels[nextIndustrySection].coalCost;
        return amount;
    }

    GetIronCost(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : number
    {
        let nextIndustrySection : number = publicState.publicPlayerData[this.playerID].
            playerArea.section[this.industryIndex].GetNextSectionIndex();
        let amount : number = gameConfig.industries[this.industryIndex].industryLevels[nextIndustrySection].ironCost;
        return amount;
    }
    
    override GetCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): Cost[] 
    {
        let costs : Cost[] = 
        [
            new AppropriateCardCost(), 
            new MoneyCost(this.GetPrice(localState, publicState, gameConfig)),
            new CoalCost(this.GetCoalCost(localState, publicState, gameConfig),
                this.townID.locationIndex),
            new IronCost(this.GetIronCost(localState, publicState, gameConfig), 
                this.townID.locationIndex)
        ];

        return costs;
    }

    override IsValidInput(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): boolean 
    {
        if (publicState.publicPlayerData[this.playerID].playerArea.section[this.industryIndex].GetNextSectionIndex() == -1)
        {
            return false;
        }
        
        return super.IsValidInput(localState, publicState, gameConfig);
    }

    override Execute(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): void 
    {
        let industryLevel : number = publicState.publicPlayerData[this.playerID].playerArea.section[this.industryIndex].GetNextSectionIndex();
        publicState.publicPlayerData[this.playerID].playerArea.section[this.industryIndex].counts[industryLevel]--;

        publicState.tilesOnBoard.push(new TileOnBoard
        (
            this.townID,
            this.industryIndex, 
            industryLevel, 
            gameConfig.industries[this.industryIndex].industryLevels[industryLevel].coalGenerated,
            gameConfig.industries[this.industryIndex].industryLevels[industryLevel].ironGenerated,
            publicState.isRailEra ?
                gameConfig.industries[this.industryIndex].industryLevels[industryLevel].beerGeneratedRail :
                gameConfig.industries[this.industryIndex].industryLevels[industryLevel].beerGeneratedCanal,
            false,
            this.playerID
        ));
    }
}

export class NetworkInput extends Input
{
    linkLocation : number;

    constructor(cardUsed : Card,
                playerID : number,
                linkLocation : number)
    {
        super(cardUsed, InputType.Build, playerID);

        this.linkLocation = linkLocation;
    }

    override GetCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): Cost[] 
    {
        return [];    
    }

    Execute(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): void 
    {
        publicState.links.push(new Link(this.linkLocation, this.playerID));
    }
}

export class FlipInput extends Input
{
    tileLocation : TownID;

    constructor(cardUsed : Card,
                playerID : number,
                tileLocation : TownID)
    {
        super(cardUsed, InputType.Build, playerID);

        this.tileLocation = tileLocation;
    }

    override GetCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): Cost[] 
    {
        return [];    
    }

    Execute(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): void 
    {
        for(let i : number = 0; i < publicState.tilesOnBoard.length; i++)
        {
            if (this.tileLocation = publicState.tilesOnBoard[i].townID)
            {
                publicState.tilesOnBoard[i].isFlipped = true;
                break;
            }
        }
    }
}