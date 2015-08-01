'use strict';

exports.extractFilters = function(query) {
  let whereObj = {};

  // let filtersQuery = 'salesPrice!%3Dnull;status%3D%3Davailable';

  let operatorArray = [{
    name: 'equals',
    operator: '==',
    urlEncoded: '%3D%3D',
    sequelizeOperator: '=='

  }, {
    name: 'doesNotEqual',
    operator: '!=',
    urlEncoded: '!%3D',
    sequelizeOperator: '$ne'
  }, {
    name: 'greaterThan',
    operator: '>',
    urlEncoded: '%3E',
    sequelizeOperator: '$gt'
  }, {
    name: 'lessThan',
    operator: '<',
    urlEncoded: '%3C',
    sequelizeOperator: '$lt'
  }, {
    name: 'greaterThanOrEqualTo',
    operator: '>=',
    urlEncoded: '%3E%3D',
    sequelizeOperator: '$gte'
  }, {
    name: 'lessThanOrEqualTo',
    operator: '<=',
    urlEncoded: '%3C%3D',
    sequelizeOperator: '$lte'
  }, {
    name: 'containsSubstring',
    operator: '=@',
    urlEncoded: '%3D@',
    sequelizeOperator: '$iLike'
  }, {
    name: 'doesNotContainSubstring',
    operator: '!@',
    urlEncoded: '!@',
    sequelizeOperator: '$notLike'
  }];

  let filtersArray = query.split(';');
  console.log(filtersArray.length);

  for (let i = 0; i < filtersArray.length; i++) {
    console.log(filtersArray[i]);

    // OR
    if (filtersArray[i].split(',').length > 1) {

    }
    for (var j = 0; j < operatorArray.length; j++) {
      let operatorSplit = filtersArray[i].split(operatorArray[j].operator);
      if (operatorSplit.length > 1) {
        // console.log(operatorSplit[0], operatorArray[j].operator, operatorSplit[1]);

        // NULL
        if (operatorSplit[1] == 'null') operatorSplit[1] = null;
        let sequelizeOperator = operatorArray[j].sequelizeOperator;
        
        // ==
        if (operatorArray[j].name == 'equals') {
          whereObj[operatorSplit[0]] = operatorSplit[1];
        }
        
        // like OR notLike
        else if (operatorArray[j].name == 'containsSubstring' || operatorArray[j].name == 'doesNotContainSubstring') {
          whereObj[operatorSplit[0]] = {};
          whereObj[operatorSplit[0]][sequelizeOperator] = '%' + operatorSplit[1] + '%';          
        }
        else {
          whereObj[operatorSplit[0]] = {};
          whereObj[operatorSplit[0]][sequelizeOperator] = operatorSplit[1];

        }
      }
    }
  }

  return whereObj;

};

exports.extractSort = function(sortQuery) {

  let sortQuerySplit = sortQuery.split(',');
  let sortArray = [];

  for (let i = 0; i < sortQuerySplit.length; i++) {
    let sort = sortQuerySplit[i];

    if (sort.charAt(0) === '-') {
      sortArray[i] = [sort.substr(1), 'DESC'];
    }
    else {
      sortArray[i] = [sort, 'ASC'];
    }
  }

  return sortArray;
};

exports.extractInclude = function (includeQuery, models) {
  
}