export function IsValidObject(object : Object) : boolean
{
    for (const [key, value] of Object.entries(object)) 
    {
        if (value == undefined)
        {
            return false;
        }
    }

    return true;
}

export function Cast<NewType extends Object>(object : Object) : NewType | undefined
{
    let newObject : NewType = object as NewType;
    if (IsValidObject(newObject))
    {
        return newObject;
    }
    return undefined;
} 