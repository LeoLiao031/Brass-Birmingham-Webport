enum PlayerColours 
{
    Red,
    White,
    Yellow,
    Blue
}

class Industry
{
    name : string = "";
    moneyCosts : number[] = [];
    coalCosts : number[] = [];
    ironCosts : number[] = [];

    beerCostsToFlip : number[] = [];
    victoryPoints : number[] = [];
    linkPoints : number[] = [];
    incomeBonuses : number[] = [];
}

class IndustrySection 
{
    industryID : number = 0;
    counts : number[] = [];
} 

class PlayerArea 
{
    section : IndustrySection[] = [];

    constructor(industries : Industry[])
    {
        industries.forEach(element => {
            this.section.push(new IndustrySection())
        });
    }
}

class PublicPlayerData
{
    money : number = 17;
    moneySpentInCurrentRound : number = 0;
    victoryPoints : number = 0;
    income : number = 0;
}

class PublicState 
{
    wildLocationCardsLeft : number = 4;
    wildIndustryCardsLeft : number = 4;
    numberOfCardsLeftInDeck : number = 30;

    currentTurnOrder : PlayerColours[] = 
    [
        PlayerColours.Red,
        PlayerColours.White,
        PlayerColours.Yellow,
        PlayerColours.Blue
    ];
    currentTurnIndex : number = 0;

    publicPlayerDate : PublicPlayerData[] = 
    [
        new PublicPlayerData(), 
        new PublicPlayerData(), 
        new PublicPlayerData(), 
        new PublicPlayerData()
    ];

    coalMarketCount : number = 0;
    ironMarketCount : number = 0;
    
    playerAreas : PlayerArea[] = [];
}