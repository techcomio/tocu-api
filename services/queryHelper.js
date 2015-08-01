'use strict';
const models = require('../models');

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
  sequelizeOperator: '$notILike'
}];

module.exports = function(req, res, next) {
    let skip = req.query.skip || 0,
    limit = req.query.limit || 20,
    filters = req.query.filters,
    sort = req.query.sort,
    include = req.query.include;

  // Extract filters
  let whereObj = {};
  if (filters) {
    try {
      whereObj = extractFilters(filters);
    }
    catch (err) {
      console.log(err);
      return res.status(400).json({
        message: 'Định dạng query filters không đúng'
      });
    }
  }
  // Extract sort
  let sortArray = [];
  if (sort) {
    try {
      sortArray = extractSort(sort);
    } catch(err) {
      console.log(err);
      return res.status(400).json({
        message: 'Định dạng query sort không đúng'
      });
    }
  }
  // Extract include
  let includeArray = [];
  if(include) {
    try {
      includeArray = extractInclude(include, models);
    } catch(err) {
      console.log(err);
      return res.status(400).json({
        message: 'Định dạng query include không đúng'
      });      
    }
  }
  
  req.skip = skip;
  req.limit = limit;
  req.filters = whereObj;
  req.sort = sortArray;
  req.include = includeArray;
  
  return next();
};

function extractFilters(query) {
  let whereObj = {};

  let filtersArray = query.split(';');

  for (let i = 0; i < filtersArray.length; i++) {
    // console.log(filtersArray[i]);

    // OR
    // ga:country==United%20States,ga:country==Canada
    let orFilersSplit = filtersArray[i].split(',');
    if (orFilersSplit.length > 1) {

      // Nếu 2 property OR giống nhau
      // if (orFilersSplit[0]);
      whereObj['$or'] = [];
      for (let i1 = 0; i1 < orFilersSplit.length; i1++) {
        // ga:country==Canada
        let buildOrFilter = buildWhereProp(orFilersSplit[i1]);
        whereObj['$or'][i1] = buildOrFilter[1];
      }
    }
    else {
      let buildAFilter = buildWhereProp(filtersArray[i]);
      // console.log(buildAFilter[1][buildAFilter[0]]);
      whereObj[buildAFilter[0]] = buildAFilter[1][buildAFilter[0]];
    }
  }

  return whereObj;

}

function extractSort(sortQuery) {

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
}

function extractInclude(includeQuery, models) {
  let result = [];
  let querySplited = includeQuery.split(',');
  console.log(querySplited);

  for (let i = 0; i < querySplited.length; i++) {
    result[i] = models[querySplited[i]];
  }
  console.log(result);
  return result;
}

function buildWhereProp(splitedFilter) {
  let result = {};
  let operatorSplit = [];
  let prop;
  for (var j = 0; j < operatorArray.length; j++) {
    operatorSplit = splitedFilter.split(operatorArray[j].operator);
    if (operatorSplit.length > 1) {
      // console.log(operatorSplit[0], operatorArray[j].operator, operatorSplit[1]);
      prop = operatorSplit[0];
      // NULL
      if (operatorSplit[1] == 'null') operatorSplit[1] = null;


      let sequelizeOperator = operatorArray[j].sequelizeOperator;

      // ==
      if (operatorArray[j].name == 'equals') {
        result[operatorSplit[0]] = operatorSplit[1];
      }

      // like OR notLike
      else if (operatorArray[j].name == 'containsSubstring' || operatorArray[j].name == 'doesNotContainSubstring') {
        result[operatorSplit[0]] = {};
        result[operatorSplit[0]][sequelizeOperator] = '%' + operatorSplit[1] + '%';
      }
      else {
        result[operatorSplit[0]] = {};
        result[operatorSplit[0]][sequelizeOperator] = operatorSplit[1];

      }
    }
  }
  return [prop, result];
}
