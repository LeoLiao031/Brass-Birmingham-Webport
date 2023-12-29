class Tile 
{
    // 0 = House
    // 1 = Coal
    // 2 = Iron
    // 3 = Crate
    // 4 = Brewery
    // 5 = Pottery
    allowedIndustries : number[];

    constructor(allowedIndustries : number[]) 
    {
        this.allowedIndustries = allowedIndustries;
    }
}

class Location 
{
    name : string;

    constructor(name : string) 
    {
        this.name = name;
    }
}

export class Town extends Location
{
    tiles : Tile[];
    // Starting from 2 players
    cardCountForPlayerCounts : number[];

    constructor(name : string,
                tiles : Tile[], 
                cardCountForPlayerCounts : number[]) 
    {
        super(name);
        this.tiles = tiles
        this.cardCountForPlayerCounts = cardCountForPlayerCounts
    }
}

enum MineRewardType 
{
    Develop,
    Income,
    VictoryPoints,
    Money
}

enum ConnectionType
{
    Canal,
    Rail,
    Both
}

class Mine extends Location
{
    linkPoints : number;
    rewardType : MineRewardType;
    rewardValue : number;
    merchantTilesCount : number;

    constructor(name : string,
                linkPoints : number,
                rewardType : MineRewardType,
                rewardValue : number,
                merchantTilesCount : number)
    {
        super(name);
        this.linkPoints = linkPoints;
        this.rewardType = rewardType;
        this.rewardValue = rewardValue;
        this.merchantTilesCount = merchantTilesCount;
    }
}

type IndexConnection = 
{
    connectionType : ConnectionType;
    index : number;
}

type LocationAndConnections =
{
    location : Town | Mine;
    connectionIndexes : IndexConnection[];
}

export type LocationInit = 
{
    location : Mine | Town;
    connections : 
    { 
        connectionType : ConnectionType;
        locationName : string;
    }[] 
}

export class Board 
{
    locationAndConnections : LocationAndConnections[];
    mineIndexes : number[];

    GetAsTown(index : number) : Town | undefined
    {
        if ("tiles" in this.locationAndConnections[index].location)
        {
            return this.locationAndConnections[index].location as Town
        }
        
        return undefined;
    }

    GetAsMine(index : number) : Mine | undefined
    {
        if ("linkPoints" in this.locationAndConnections[index].location)
        {
            return this.locationAndConnections[index].location as Mine
        }
        
        return undefined;
    }
    
    constructor(boardInit : LocationInit[]) 
    {
        this.locationAndConnections = [];
        this.mineIndexes = [];

        let nameArray : string[] = boardInit.map(
            locationAndConnections => locationAndConnections.location.name);

        for (let i : number = 0; i < boardInit.length; i++) 
        {
            // Checking if it's a mine. Can't find a cleaner way to do this :(
            if ("linkPoints" in boardInit[i].location)
            {
                this.mineIndexes.push(i);
            }

            let connectionIndexes : IndexConnection[] = [];
            for (let j : number = 0; j < boardInit[i].connections.length; j++) 
            {
                let connectionIndex : number = nameArray.indexOf(boardInit[i].connections[j].locationName);
                if (connectionIndex == -1)
                {
                    console.log("Error: " + boardInit[i].connections[j].locationName + 
                    " does not exist. It was entered as a connection to " + boardInit[i].location.name)
                }
                connectionIndexes.push({
                    connectionType: boardInit[i].connections[j].connectionType,
                    index: connectionIndex});
            }

            this.locationAndConnections.push({ location: boardInit[i].location, connectionIndexes: connectionIndexes});
        }
    }
}