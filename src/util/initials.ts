/* Apply several strategies to come up with a short, unique identifier */
export const initials = (name: string, allNames?: string[]) => {
    if (!name)
        return name;
    if(!allNames)
        return name;
    const others = allNames.filter(x => name !== x);
    const first = (x: string) => x[0];
    const firstName = (x: string) => x.split(' ')[0];
    const initials = (x: string) => x.split(' ').filter(x => x).map(x => x[0]).join('');
    const firstTwo = (x: string) => x.length < 2 ? x : x[0] + x[1];
    const firstAndLast = (x: string) => x.length < 2 ? x : x[0] + x[x.length - 1];
    const isUnique = (x: string, ys: string[], strategy: (a: string) => string) =>
        !ys.find(y => strategy(x) === strategy(y))
    const lastName = (x: string) => x.split(' ').reverse()[0];
    for (const strategy of [first, initials, firstTwo, firstAndLast, firstName, lastName]) {
        if (isUnique(name, others, strategy))
            return strategy(name);
    }
    return name;
}
