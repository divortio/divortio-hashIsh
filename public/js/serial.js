// This function deterministically serializes any JavaScript value to a string.
// It ensures that object keys are sorted to produce a stable, consistent output.
/**
 * Deterministically serializes any JavaScript value to a string for hashing.
 * Ensures that object keys are sorted to produce a stable, consistent output.
 * @private
 * @param {*} val - The value to serialize (string, number, object, array, etc.).
 * @returns {string} A stable, stringified representation of the value.
 */
function serialize(val) {
    if (val === null || val === undefined) return 'null';
    if (typeof val !== 'object') return JSON.stringify(val);
    if (Array.isArray(val)) return '[' + val.map(serialize).join(',') + ']';

    return '{' + Object.keys(val).sort().map(key => {
        return JSON.stringify(key) + ':' + serialize(val[key]);
    }).join(',') + '}';
}

export default serialize;