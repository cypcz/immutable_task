const Immutable = require("immutable");

// Concatenates a List by reducing it to a single value
const concatenateList = list =>
  list
    .reduce((acc, val) => {
      // Handles recurring strings (errors)
      if (acc.includes(val)) return acc;
      else return (acc += `${val}. `);
    }, "")
    .trim();

const traverseIterable = object => {
  if (Immutable.isCollection(object)) {
    return object.map(value => {
      // Checks if the Collection is a List consisted of strings
      if (Immutable.List.isList(value) && value.every(val => ["string"].includes(typeof val))) {
        // If yes, we concatenate them
        return concatenateList(value);
      }

      // If no, we go recursively one level deeper
      return traverseIterable(value);
    });
  } else return object;
};

module.exports = (errors, ...args) =>
  errors.map((value, key) =>
    //	If function arguments include the key, we don't want to flatten this particular Collection
    //	Instead, we go through that Collection and just concatenate the last List made of strings
    //	Else (arguments don't include the key) we flatten the Collection and concatenate the strings
    args.includes(key) ? traverseIterable(value) : concatenateList(value.flatten())
  );
