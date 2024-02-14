import { PublicState } from "./GameState";

/* 
Represents a tile in a town where a building of 
a specified industry/industries can be built
*/
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

/* 
Represents a town or a mine 
*/
export class Location 
{
    name : string;

    constructor(name : string) 
    {
        this.name = name;
    }
}

/* 
Represents a town that has tiles
There are cards that let you build on a town
cardCountForPlayerCounts = [<number of cards for 2 players>, <3 players>, <4>]
*/
export class Town extends Location
{
    tiles : Tile[];
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

/*
Once a beer on a mine is used, a type of reward is given
*/
enum MineRewardType 
{
    Develop,
    Income,
    VictoryPoints,
    Money
}

/*
Specifies the eras where a link can be built
*/
enum LinkType
{
    Canal,
    Rail,
    Both
}

/*
Represents a coal mine that grants access to the coal market
*/
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

/*
Represents the a connection between multiple locations
*/
export class Link
{
    connectionType : LinkType;
    connections : number[];

    constructor(connectionType : LinkType,
                connections : number[])
    {
        this.connectionType = connectionType;
        this.connections = connections;
    }

}

/*
Used to initialize a link
Used to convert names (strings) to indexes (ints)
*/
export type LinkInit = 
{
    connectionType : LinkType;
    locationNames : string[];
}

/*
Has locations, links and a mineStartIndex
The locations store the location data and an index for a link
A links store the indexes of the connected locations
The locations from 0 to mineStartIndex-1 are towns
The locations from mineStartIndex to length-1 are mines
*/
export class Board 
{
    locations : { location : Location, connections: number[] }[];
    links : Link[];
    mineStartIndex : number;
    
    constructor(towns : Town[],
                mines : Mine[],
                linkInits : LinkInit[]) 
    {
        // Initialize locations
        this.locations = [];

        towns.forEach(town => 
        {
            this.locations.push({ location: town, connections : <number[]>[]});
        });

        mines.forEach(mine => 
        {
            this.locations.push({ location: mine, connections : <number[]>[]});
        });
        
        this.links = [];
        this.mineStartIndex = towns.length;

        // Initialize links
        linkInits.forEach(linkInit => 
        {
            let foundConnections : number[] = [];

            linkInit.locationNames.forEach(locationName => 
            {
                let found : boolean = false;

                for (let i = 0; i < this.locations.length; i++) 
                {
                    if (this.locations[i].location.name == locationName)
                    {
                        foundConnections.push(i);
                        found = true;
                        break;
                    }
                }
                
                if (!found)
                {
                    console.log(locationName + " couldn't be found!");
                }
            });

            let newLinkIndex : number = 
                this.links.push(new Link(linkInit.connectionType, foundConnections)) - 1;

            foundConnections.forEach(foundConnection => 
            {
                this.locations[foundConnection].connections.push(newLinkIndex);
            });
        });
    }

    GetTowns() : Town[]
    {
        let towns : Town[] = [];

        for (let i : number = 0; i < this.mineStartIndex; i++)
        {
            towns.push(this.locations[i].location as Town);
        }

        return towns;
    }

    GetMines() : Mine[]
    {
        let mines : Mine[] = [];

        for (let i : number = this.mineStartIndex; i < this.locations.length; i++)
        {
            mines.push(this.locations[i].location as Mine);
        }

        return mines;
    }

    AreLocationsConnected(locationIndex : number, locationToReach : string, publicState : PublicState) : boolean
    {
        let traverser : Traverser = new Traverser(this, [locationIndex], publicState);

        let currentLocation : number | undefined = traverser.GetNextLocationIndex();
        while (currentLocation != undefined)
        {
            if (this.locations[currentLocation].location.name == locationToReach)
            {
                return true;
            }
            currentLocation = traverser.GetNextLocationIndex();
        }

        return false;
    }

    IsLocationConnectedToAMine(locationIndexes : number[], publicState : PublicState)
    {
        let traverser : Traverser = new Traverser(this, locationIndexes, publicState);

        let currentLocation : number | undefined = traverser.GetNextLocationIndex();
        while (currentLocation != undefined)
        {
            if (currentLocation >= this.mineStartIndex)
            {
                return true;
            }
            currentLocation = traverser.GetNextLocationIndex();
        }

        return false;
    }
}

export class Traverser
{
    board : Board;
    toDoList : number[];
    alreadyDoneList : number[];
    publicState : PublicState | undefined;
    
    constructor(board : Board,
                startingLocationIndexes : number[],
                publicState : PublicState | undefined = undefined)
    {
        this.board = board;
        this.toDoList = [];
        this.toDoList = startingLocationIndexes;
        this.alreadyDoneList = [];
        this.publicState = publicState; 
    }

    GetNextLocationIndex() : number | undefined 
    {
        let locationIndex = this.toDoList.shift();

        if (locationIndex == undefined)
        {
            return undefined;
        }

        this.alreadyDoneList.push(locationIndex);

        this.board.locations[locationIndex].connections.forEach(connection => 
        {
            if (this.publicState == undefined ||
                this.publicState.DoesLinkExist(connection))
            {
                this.board.links[connection].connections.forEach(link => 
                {
                    if (link != locationIndex &&
                        !this.alreadyDoneList.includes(link))
                    {
                        this.toDoList.push(link);    
                    }
                });
            }
        });

        return locationIndex;
    };
}