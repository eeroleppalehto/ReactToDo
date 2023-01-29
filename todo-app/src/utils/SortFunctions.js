const az_sort = (itemA, itemB) => {
    const nameA = itemA.name.toUpperCase();
    const nameB = itemB.name.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    return 0;
};

const za_sort = (itemAr, itemBr) => {
    const nameA = itemAr.name.toUpperCase();
    const nameB = itemBr.name.toUpperCase();
    if (nameA < nameB) {
        return 1;
    }
    if (nameA > nameB) {
        return -1;
    }

    return 0;
};

const oldest_sort = (a, b) => {
    return new Date(a.created).valueOf() - new Date(b.created).valueOf();
};

const newest_sort = (a, b) => {
    return new Date(b.created).valueOf() - new Date(a.created).valueOf();
};


export default {
    "az": az_sort,
    "za": za_sort,
    "oldest": oldest_sort,
    "newest": newest_sort
}