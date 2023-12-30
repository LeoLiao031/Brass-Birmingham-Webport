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

export class Mine extends Location
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

enum LocationType
{
    Town,
    Mine,
    Link
}

type Connection = 
{
    locationType : LocationType;
    index : number;
}

export class Link extends Location
{
    connectionType : ConnectionType;
    connectionA : Connection;
    connectionB : Connection;

    GetConnectionFromIndex(index : number) : Connection | undefined
    {
        if (this.connectionA.index == index)
        {
            return this.connectionB;
        }
        else if (this.connectionB.index == index)
        {
            return this.connectionA;
        }

        return undefined;
    }

    constructor(name : string,
                connectionType : ConnectionType,
                connectionA : Connection,
                connectionB : Connection)
    {
        super(name);
        this.connectionType = connectionType;
        this.connectionA = connectionA;
        this.connectionB = connectionB;
    }

}

export type LinkInit = 
{
    name : string;
    connectionType : ConnectionType;
    connectionNameA : string;
    connectionNameB : string;
}

export class Board 
{
    towns : { location : Town, connections: number[] }[];
    mines : { location : Mine, connections: number[] }[];
    links : { location : Link, connections: number[] }[];
    
    constructor(towns : Town[],
                mines : Mine[],
                linkInits : LinkInit[]) 
    {
        // Initialize towns, mines, and links without any connections
        this.towns = towns.map(town => ({ location: town, connections : <number[]>[]}));
        this.mines = mines.map(mine => ({ location: mine, connections : <number[]>[]}));
        // Initialize empty links
        let tempLinks : Location[] = linkInits.map(linkInit => new Location(linkInit.name));
        this.links = tempLinks.map(tempLink => ({location: tempLink as Link, connections: <number[]>[]}));

        // Loop through linkInits and find the indexes and arrays that are referenced with strings
        for (let linkIndex : number = 0; linkIndex < linkInits.length; linkIndex++)
        {
            let connections : {connectionA : Connection, connectionB : Connection} | undefined 
                = this.InitializeLinkForLocations(
                [
                    {locations: towns, locationType: LocationType.Town},
                    {locations: mines, locationType: LocationType.Mine},
                    {locations: tempLinks, locationType: LocationType.Link}
                ],
                linkInits[linkIndex]
            );

            if (connections == undefined)
            {
                continue;
            }
            
            // Create the link object and create the connection in the other array(s)
            let newLink : Link = new Link(linkInits[linkIndex].name, linkInits[linkIndex].connectionType, connections.connectionA, connections.connectionB);
            this.links[linkIndex] = {location : newLink, connections : <number[]>[]};
            this.PushNewConnection(connections.connectionA, linkIndex);
            this.PushNewConnection(connections.connectionB, linkIndex);
        }
    }

    private InitializeLinkForLocations(locationArrays : {locations : Location[], locationType : LocationType}[], linkInit : LinkInit) : 
        {connectionA : Connection, connectionB : Connection} | undefined
    {
        let connectionA : Connection | undefined = undefined;
        let connectionB : Connection | undefined = undefined;

        for (let i : number = 0; i < locationArrays.length; i++)
        {
            let locationArray : Location[] = locationArrays[i].locations;

            for (let locationIndex : number = 0; locationIndex < locationArray.length; locationIndex++)
            {
                if (linkInit.connectionNameA == locationArray[locationIndex].name)
                {
                    connectionA = { locationType : locationArrays[i].locationType, index : locationIndex };
                }
                else if (linkInit.connectionNameB == locationArray[locationIndex].name)
                {
                    connectionB = { locationType : locationArrays[i].locationType, index : locationIndex };
                }

                if (connectionA != null && connectionB != null)
                {
                    return {connectionA: connectionA, connectionB : connectionB};
                }
            }
        }

        return undefined;
    }

    private PushNewConnection(connection : Connection, index : number)
    {
        switch (connection.locationType) {
            case LocationType.Town:
                this.towns[connection.index].connections.push(index);
                break;
            case LocationType.Mine:
                this.mines[connection.index].connections.push(index);
                break;
            case LocationType.Link:
                this.towns[connection.index].connections.push(index);
                break;
        }
    }
}