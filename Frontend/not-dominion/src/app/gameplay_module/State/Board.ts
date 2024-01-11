import { Cast } from "../Utils";
import { PublicState } from "./GameState";

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

export class Location 
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

export class Link
{
    connectionType : ConnectionType;
    connections : number[];

    constructor(connectionType : ConnectionType,
                connections : number[])
    {
        this.connectionType = connectionType;
        this.connections = connections;
    }

}

export type LinkInit = 
{
    connectionType : ConnectionType;
    locationNames : string[];
}

export class Board 
{
    locations : { location : Location, connections: number[] }[];
    links : Link[];
    mineIndexes : number[];

    AreLocationsConnected(locationIndex : number, locationToReach : string) : boolean
    {
        let traverser : Traverser = new Traverser(this, locationIndex);

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
    
    constructor(locations : Location[],
                linkInits : LinkInit[]) 
    {
        this.locations = locations.map(location => ({ location: location, connections : <number[]>[]}));
        this.links = [];
        this.mineIndexes = [];

        // Initialize mines
        locations.forEach((location : Location, index : number) => 
        {
            if (Cast<Mine>(location) != undefined)
            {
                this.mineIndexes.push(index);
            }
        });

        // Initialize links
        linkInits.forEach(linkInit => 
        {
            let foundConnections : number[] = [];

            linkInit.locationNames.forEach(locationName => 
            {
                for (let i = 0; i < locations.length; i++) 
                {
                    if (locations[i].name == locationName)
                    {
                        foundConnections.push(i);
                        break;
                    }

                    console.log(locationName + " couldn't be found!");
                }
            });

            let newLinkIndex : number = 
                this.links.push(new Link(linkInit.connectionType, foundConnections)) - 1;

            foundConnections.forEach(foundConnection => {
                this.locations[foundConnection].connections.push(newLinkIndex);
            });
        });
    }
}

export enum TraversalType
{
    BreadthFirst,
    DepthFirst
} 

export class Traverser
{
    board : Board;
    toDoList : number[];
    alreadyDoneList : number[];

    GetNextLocationIndex() : number | undefined 
    {
        return undefined
    };

    constructor(board : Board, startingLocationIndex : number, traversalType : TraversalType = TraversalType.BreadthFirst)
    {
        this.board = board;
        this.toDoList = [];
        this.toDoList.push(startingLocationIndex);
        this.alreadyDoneList = [];

        if (traversalType = TraversalType.BreadthFirst)
        {
            this.GetNextLocationIndex = this.BreadthFirstTraversal;
        } else if (traversalType = TraversalType.DepthFirst) 
        {
            this.GetNextLocationIndex = this.DepthFirstTraversal;
        }
    }

    BreadthFirstTraversal() : number | undefined
    {
        let currentLocation = this.toDoList.shift();
        this.Traverse(currentLocation);
        return currentLocation;
    }

    DepthFirstTraversal() : number | undefined
    {
        let currentLocation = this.toDoList.pop();
        this.Traverse(currentLocation);
        return currentLocation;
    }

    Traverse(locationIndex : number | undefined) : void
    {
        if (locationIndex == undefined)
        {
            return;
        }

        this.alreadyDoneList.push(locationIndex);

        this.board.locations[locationIndex].connections.forEach(connection => 
        {
            this.board.links[connection].connections.forEach(link => 
            {
                if (!this.toDoList.includes(link) &&
                    !this.alreadyDoneList.includes(link))
                {
                    this.toDoList.push(link);    
                }
            });
        });
    }
}

export class ConnectedTraverser extends Traverser
{
    publicState : PublicState;

    constructor(board : Board, 
                startingLocationIndex : number, 
                publicState : PublicState, 
                traversalType : TraversalType = TraversalType.BreadthFirst)
    {
        super(board, startingLocationIndex, traversalType);
        this.publicState = publicState; 
    }

    override Traverse(locationIndex: number | undefined) : void
    {
        if (locationIndex == undefined)
        {
            return;
        }

        this.alreadyDoneList.push(locationIndex);

        this.board.locations[locationIndex].connections.forEach(connection => 
        {
            if (this.publicState.DoesLinkExist(connection))
            {
                this.board.links[connection].connections.forEach(link => 
                {
                    if (!this.toDoList.includes(link) &&
                        !this.alreadyDoneList.includes(link))
                    {
                        this.toDoList.push(link);    
                    }
                });
            }
        });
    }
}