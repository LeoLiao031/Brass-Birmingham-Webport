import { GameConfig } from "./GameConfig"

class IndustrySection 
{
    industryID : number;
    counts : number[];
    
    constructor(industryID : number, counts : number[])
    {
        this.industryID = industryID;
        this.counts = counts;
    }
} 

class PlayerArea 
{
    section : IndustrySection[] = [];

    constructor(gameConfig : GameConfig)
    {
        for (let i : number = 0; i < gameConfig.industries.length; i++) 
        {
            let startingAmount : number[] = [];

            for (let level : number = 0; level < gameConfig.industries.length; level++)
            {
                startingAmount.push(
                    gameConfig.industries[i].industryLevels[level].startingAmount);
            }

            this.section.push(new IndustrySection(i, startingAmount));
        }
    }
}

export class PublicPlayerData
{
    money : number;
    moneySpentInCurrentRound : number;
    victoryPoints : number;
    income : number;
    playerArea : PlayerArea;
    discardPile : Card[];

    constructor(gameConfig : GameConfig,
                money : number,
                income : number)
    {
        this.money = money;
        this.moneySpentInCurrentRound = 0;
        this.victoryPoints = 0;
        this.income = income;
        this.playerArea = new PlayerArea(gameConfig);
        this.discardPile = [];
    }
}

class TileOnBoard
{
    townIndex : number;
    tileIndex : number;
    industryIndex : number;
    industryLevel : number;
    coal : number;
    iron : number;
    beer : number;
    isFlipped : boolean;
    ownerID : number;

    constructor(townIndex : number,
                tileIndex : number,
                industryIndex : number,
                industryLevel : number,
                coal : number,
                iron : number,
                beer : number,
                isFlipped : boolean,
                ownerID : number)
    {
        this.townIndex = townIndex;
        this.tileIndex = tileIndex;
        this.industryIndex = industryIndex;
        this.industryLevel = industryLevel;
        this.coal = coal;
        this.iron = iron;
        this.beer = beer;
        this.isFlipped = isFlipped;
        this.ownerID = ownerID;
    }
}

class Link
{
    locationIndexA : number;
    locationIndexB : number;
    ownerID : number;

    constructor(locationIndexA : number,
            locationIndexB : number,
            ownerID : number)
    {
        this.locationIndexA = locationIndexA;
        this.locationIndexB = locationIndexB;
        this.ownerID = ownerID;
    }
}

export class PublicState 
{
    tilesOnBoard : TileOnBoard[];
    isBeerOnMerchantTiles : boolean[];
    links : Link[];

    numberOfCardsLeftInDeck : number;

    currentTurnOrder : number[];
    currentTurnIndex : number;

    publicPlayerData : PublicPlayerData[];

    coalMarketCount : number;
    ironMarketCount : number;

    actionsRemainingInCurrentTurn : number;

    isRailEra : boolean;

    constructor(gameConfig : GameConfig,
                privateState : PrivateState,
                startingPlayerData : PublicPlayerData,
                numberOfPlayers : number,
                coalMarketCount : number,
                ironMarketCount : number)
    {
        this.tilesOnBoard = [];
        this.isBeerOnMerchantTiles = Array(gameConfig.board.mineIndexes.length).fill(true);
        this.links = [];
        
        this.numberOfCardsLeftInDeck = privateState.deck.length;

        this.currentTurnOrder = Array.from(Array(numberOfPlayers).keys());
        this.currentTurnIndex = 0;

        this.publicPlayerData = Array(numberOfPlayers).fill(startingPlayerData);

        this.coalMarketCount = coalMarketCount;
        this.ironMarketCount = ironMarketCount;

        this.actionsRemainingInCurrentTurn = 2;

        this.isRailEra = false;
    }
}

enum CardType
{
    Location,
    Industry
}

export type Card =
{
    type : CardType;
    indexes : number[];
    isWild : boolean;     
}

export class PrivateState
{
    deck : Card[];

    Shuffle() : void
    {
        this.deck.sort(() => Math.random() - 0.5); 
    }

    Draw() : Card | undefined
    {
        return this.deck.pop();
    }

    DrawMultiple(amount : number) : Card[]
    {
        let cards : Card[] = [];
        for (let i : number = 0; i < amount; i++)
        {
            let card = this.Draw();
            if (card == undefined)
            {
                return cards;
            }
            cards.push(card);
        }

        return cards;
    }

    constructor(gameConfig : GameConfig) 
    {
        this.deck = [];

        for (let i : number = 0; i < gameConfig.board.locationAndConnections.length; i++)
        {
            let Town = gameConfig.board.GetAsTown(i);
            if (Town != undefined && Town.name)
            {
                this.deck.push({type: CardType.Location, indexes: [i], isWild: false})
            }
        }

        for (let i : number = 0; i < gameConfig.industryCards.length; i++)
        {
            this.deck.push({type: CardType.Industry, indexes: gameConfig.industryCards[i], isWild: false})
        }

        this.Shuffle();
    }
}

export class LocalState
{
    hand : Card[];

    constructor(hand : Card[]) 
    {
        this.hand = hand;
    }
}