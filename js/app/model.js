/*global define */
define(['./helpers'], function (helpers) {
    'use strict';
    
    var sortByIndex = helpers.sortByIndex;

    /* Model constructor, connect to storage, expects model of type {"fields";[],"values:[]} */
    function Model(storage) {
        this.storage = storage;
    }

    /* Add a new value to storage */
    Model.prototype.create = function (item, callback) {
        item = item || [];
        callback = callback || function () {return undefined; };

        this.storage.saveValue(item, callback);
    };

    /* Read all fields in storage */
    Model.prototype.readFields = function (callback) {
        callback = callback || function () {return undefined; };
        this.storage.findAllFields(callback);
    };

    /* Read all values in storage */
    Model.prototype.readValues = function (callback) {
        callback = callback || function () {return undefined; };
        this.storage.findAllValues(callback);
    };

    /* Read all data in storage */
    Model.prototype.read = function (callback) {
        callback = callback || function () {return undefined; };
        this.storage.findAll(callback);
    };

    /* Update all values in storage */
    Model.prototype.update = function (data, callback) {
        this.storage.updateAllValues(data, callback);
    };

    /* Sort values in storage by index given, ascending by default, descending if sorted ascending */
    Model.prototype.sort = function (index, dir, callback) {
        var temp, inter;

        callback = callback || function () {return undefined; };

        this.readValues(function (data) {
            temp = data;
        });

        if (dir === "desc") {
            inter = sortByIndex(temp, index);
            this.update(inter.reverse(), callback);
        } else {
            inter = sortByIndex(temp, index);
            this.update(inter, callback);
        }
    };

    /* Drop all values in storage */
    Model.prototype.removeAll = function (callback) {
        this.storage.drop(callback);
    };

    /* Return fields count */
    Model.prototype.getFieldCount = function (callback) {
        var fieldCount = 0;

        this.storage.findAllFields(function (data) {
            fieldCount = data.length;
            callback(fieldCount);
        });
    };

    // Return values count */
    Model.prototype.getValuesCount = function (callback) {
        var valuesCount = 0;

        this.storage.findAllValues(function (data) {
            valuesCount = data.length;
            callback(valuesCount);
        });
    };

    // Export to Require JS
    return {
        Model: Model
    };
});
