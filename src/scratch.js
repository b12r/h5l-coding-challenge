function searchForProp(propPath, jsonObj) {
    return searchForPropWithSplittedPath(propPath.split('/'), jsonObj);
}

function searchForPropWithSplittedPath(propPath, jsonObj) {
    const propName = propPath.shift();
    if (propPath.length > 0) {
        if (jsonObj[propName] !== undefined || jsonObj[propName] !== null) {
            return searchForPropWithSplittedPath(propPath, jsonObj[propName]);
        } else {
            return undefined;
        }
    } else {
        return jsonObj[propName];
    }
}