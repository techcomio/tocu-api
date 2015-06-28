var fs = require('fs');

var counter = {};

var __fileName__ = '/config/autoIncrement.json';


function parseFileContent() {
    var current = getCurrentDir();
    
    var content = fs.readFileSync(current, 'utf-8');
    var fileContent = JSON.parse(content);

    return fileContent;
}

function getCurrentDir() {
    var current = process.cwd() + __fileName__;
    return current;
}

function isInt(value) {
    return !isNaN(value) && parseInt(value) == value;
}

module.exports = function(fieldName) {


    var fileContent = parseFileContent();

    if (!fileContent[fieldName]) {
        return false;
    }

    if (!isInt(fileContent[fieldName])) {
        return false;
    }

    fileContent[fieldName]++;

    fs.writeFileSync(getCurrentDir(), JSON.stringify(fileContent), 'utf-8');
    return fileContent[fieldName];

};