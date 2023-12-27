class Tile 
{
    // 1 = House
    // 2 = Coal
    // 3 = Iron
    // 4 = Crate
    // 5 = Brewery
    // 6 = Pottery
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
    // Yellow, Purple, Red = At least 2 players
    // Blue = At least 3 players
    // Green = At least 4 players
    playersRequiredForCard : number;

    constructor(name : string,
                tiles : Tile[], 
                playersRequiredForCard : number) 
    {
        super(name);
        this.tiles = tiles
        this.playersRequiredForCard = playersRequiredForCard
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

type Connection = 
{
    connectionType : ConnectionType;
    locationName : string;
}

type IndexConnection = 
{
    connectionType : ConnectionType;
    index : number;
}

type LocationAndConnections =
{
    location : Location;
    connectionIndexes : IndexConnection[];
}

export class Board 
{
    locationAndConnections : LocationAndConnections[];
    mineIndexes : number[];

    GetAsTown(index : number) : Town | undefined
    {
        if (this.locationAndConnections[index].location instanceof Town)
        {
            this.locationAndConnections[index].location as Town
        }
        
        return undefined;
    }

    GetAsMine(index : number) : Mine | undefined
    {
        if (this.locationAndConnections[index].location instanceof Mine)
        {
            this.locationAndConnections[index].location as Mine
        }
        
        return undefined;
    }
    
    constructor(newLocationsAndConnections: { location : Location, connections : Connection[] }[]) 
    {
        this.locationAndConnections = [];
        this.mineIndexes = [];

        let nameArray : string[] = this.locationAndConnections.map(
            locationAndConnections => locationAndConnections.location.name);

        for (let i : number = 0; i < newLocationsAndConnections.length; i++) 
        {
            if (newLocationsAndConnections[i].location instanceof Mine)
            {
                this.mineIndexes.push(i);
            }

            let connectionIndexes : IndexConnection[] = [];
            for (let j : number = 0; j < newLocationsAndConnections[i].connections.length; j++) 
            {
                let connectionIndex : number = nameArray.indexOf(newLocationsAndConnections[i].connections[i].locationName);
                if (connectionIndex != -1) 
                {
                    connectionIndexes.push({
                        connectionType: newLocationsAndConnections[i].connections[i].connectionType,
                        index: connectionIndex});
                }
            }

            this.locationAndConnections[i].connectionIndexes = connectionIndexes;
        }
    }
}