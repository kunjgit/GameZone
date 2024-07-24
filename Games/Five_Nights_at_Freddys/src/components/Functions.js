function* Bonnie() {
    yield* [
        "Dinning Area",
        "Backstage",
        "Supply Closet",
        "West Hall",
        "W. Hall Corner",
        "Door",
    ];
}

function* Chica() {
    yield* [
        "Dinning Area",
        "Restrooms",
        "Kitchen",
        "East Hall",
        "E. Hall Corner",
        "Door",
    ];
}

function* Freddy() {
    yield* [
        "Stage",
        "Dinning Area",
        "Restrooms",
        "Kitchen",
        "East Hall",
        "E. Hall Corner",
        "Door",
    ];
}

function* Foxy() {
    yield* ["_1", "_2", "_3"];
}

const changeAnimatronic = (Localization, iterator, setAnimatronics, change) => {
    Localization = iterator.next().value;
    setAnimatronics(change);
};

const checkAnimatronicsPosition = (
    BonnieLocal,
    ChicaLocal,
    FreddyLocal,
    search
) => {
    let res = "";
    if (BonnieLocal == search) {
        res += "-b";
    }
    if (ChicaLocal == search) {
        res += "-c";
    }
    if (FreddyLocal == search) {
        res += "-f";
    }

    return res;
};

const Functions = {
    Freddy,
    Chica,
    Bonnie,
    Foxy,
    changeAnimatronic,
    checkAnimatronicsPosition,
};

export default Functions;
