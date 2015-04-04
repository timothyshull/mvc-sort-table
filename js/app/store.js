/*global define, localStorage */
define(function () {
    'use strict';

    // Helper function to avoid syntax error with unexpected tokens
    function checkJSON(data) {
        if (data === null || data === undefined) {
            return data;
        }
        return JSON.parse(data);
    }

    /* Set up store from values loaded on app initialization */
    function Store(name, callback) {
        callback = callback || function () {return undefined; };
        this._dbName = name;
        callback.call(this, checkJSON(localStorage[JSON.stringify[name]]));
    }
    
    /* Find all data in related storage database */
    Store.prototype.findAll = function (callback) {
        var temp = checkJSON(localStorage[JSON.stringify(this._dbName)]);
        callback = callback || function () {return undefined; };
        callback.call(this, temp);
    };
    
    /* Find all fields in storage */
    Store.prototype.findAllFields = function (callback) {
        var temp = checkJSON(localStorage[JSON.stringify(this._dbName)]);
        callback = callback || function () {return undefined; };
        callback.call(this, temp.fields);
    };
    
    /* Find all values in storage */
    Store.prototype.findAllValues = function (callback) {
        var temp = checkJSON(localStorage[JSON.stringify(this._dbName)]);
        callback = callback || function () {return undefined; };
        callback.call(this, temp.values);
    };
    
    /* Update all values in storage */
    Store.prototype.updateAllValues = function (updateData, callback) {
        var data = checkJSON(localStorage[JSON.stringify(this._dbName)]);
        data.values = updateData;

        callback = callback || function () {return undefined; };

        localStorage[JSON.stringify(this._dbName)] = JSON.stringify(data);
        callback.call(this, checkJSON(localStorage[JSON.stringify(this._dbName)]));
    };
    
    /* Ad a single value to storage */
    Store.prototype.saveValue = function (updateData, callback) {
        var data = checkJSON(localStorage[JSON.stringify(this._dbName)]);
        data.values.push(updateData);

        callback = callback || function () {return undefined; };

        localStorage[JSON.stringify(this._dbName)] = JSON.stringify(data);
        callback.call(this, checkJSON(localStorage[JSON.stringify(this._dbName)]));
    };
    
    /* Reset storage to desired format */
    Store.prototype.drop = function (callback) {
        callback = callback || function () {return undefined; };
        localStorage[JSON.stringify(this._dbName)] = JSON.stringify({fields: [], values: []});
        callback.call(this, checkJSON(localStorage[JSON.stringify(this._dbName)]));
    };

    // Export to Require JS
    return {
        Store: Store
    };
});
