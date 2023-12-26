import { Industry } from "./Industries";

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

    constructor(industries : Industry[])
    {
        for (let i : number = 0; i < industries.length; i++) 
        {
            let startingAmount : number[] = [];

            for (let level : number = 0; level < industries.length; level++)
            {
                startingAmount.push(
                    industries[i].industryLevels[level].startingAmount);
            }

            this.section.push(new IndustrySection(i, startingAmount));
        }
    }
}

class PublicPlayerData
{
    money : number;
    moneySpentInCurrentRound : number;
    victoryPoints : number;
    income : number;
    playerArea : PlayerArea;

    constructor(money : number, 
                moneySpentInCurrentRound : number, 
                victoryPoints : number,
                income : number,
                playerArea : PlayerArea)
    {
        this.money = money;
        this.moneySpentInCurrentRound = moneySpentInCurrentRound;
        this.victoryPoints = victoryPoints;
        this.income = income;
        this.playerArea = playerArea;
    }
}

class PublicState 
{
    wildLocationCardsLeft : number;
    wildIndustryCardsLeft : number;
    numberOfCardsLeftInDeck : number;

    currentTurnOrder : number[];
    currentTurnIndex : number;

    publicPlayerData : PublicPlayerData[];

    coalMarketCount : number;
    ironMarketCount : number;

    constructor(wildLocationCardsLeft : number,
                wildIndustryCardsLeft : number,
                numberOfCardsLeftInDeck : number,
                currentTurnOrder : number[],
                currentTurnIndex : number,
                publicPlayerData : PublicPlayerData[],
                coalMarketCount : number,
                ironMarketCount : number)
    {
        this.wildLocationCardsLeft = wildLocationCardsLeft;
        this.wildIndustryCardsLeft = wildIndustryCardsLeft;
        this.numberOfCardsLeftInDeck = numberOfCardsLeftInDeck;

        this.currentTurnOrder = currentTurnOrder;
        this.currentTurnIndex = currentTurnIndex;

        this.publicPlayerData = publicPlayerData;

        this.coalMarketCount = coalMarketCount;
        this.ironMarketCount = ironMarketCount;
    }
}