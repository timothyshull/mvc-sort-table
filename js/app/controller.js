/*global document, define */
define(function () {
    'use strict';

    /* Controller constructor, initialize with properties for navigation control */
    function Controller(model, view) {
        var that = this;
        that.model = model;
        that.view = view;
        that._pageCount = [];
        that._displayBounds = [0, 49];
        that._currentSort = {"sort?": false, "col": undefined, "ascDesc": undefined};
    }

    /* Load controller view based on current hashed location */
    Controller.prototype.setView = function (locationHash) {
        var route = locationHash.substring(1),
            page = route || '';
        this._updateFilterState(page);
    };

    // Controller.prototype.showAll = function () {
    //     var that = this;
    //     that.model.read(function (data) {
    //         that.view.render('showAll', data);
    //     });
    // };

    /* Method to add a value to storage when submitted from form */
    Controller.prototype.addValue = function (data) {
        var that = this;

        that.model.create(data, function () {
            that.setView(document.location.hash);
        });
    };

    /* Initial column sort logic, routed to model for save then view update */
    Controller.prototype._sort = function (data) {
        var that = this;
        if (that._currentSort.col === undefined || that._currentSort.col !== data) {
            that._currentSort.col = data;
            that._currentSort.ascDesc = "asc";
            that.model.sort(data, that._currentSort.ascDesc);
        } else {
            if (that._currentSort.ascDesc === "asc") {
                that._currentSort.ascDesc = "desc";
                that.model.sort(data, that._currentSort.ascDesc);
            } else {
                that._currentSort.ascDesc = "asc";
                that.model.sort(data, that._currentSort.ascDesc);
            }
        }
        that._currentSort["sort?"] = true;
        that.setView(document.location.hash);
    };

    /* Bind view actions to controller actions */
    Controller.prototype._initializeBindings = function () {
        var that = this;

        that.view.bind('addValue', function (data) {
            that.addValue(data);
        });
        that.view.bind('sortValues', function (data) {
            that._sort(data);
        });
    };


    /* Update the values bounds for display dependent on current page */
    Controller.prototype._updateBounds = function () {
        var temp,
            that = this;
        that._displayBounds[0] = (that._activeRoute - 1) * 50;
        that._displayBounds[1] = ((that._activeRoute - 1) * 50) + 49;

        that.model.read(function (data) {temp = data; });
        temp.values = temp.values.slice(that._displayBounds[0], (that._displayBounds[1] + 1));
        temp.pageCount = that._pageCount;
        that.view.render(temp);
        that._initializeBindings();
    };

    /* Determine page navigation maximum page and update display and display bounds */
    Controller.prototype._filter = function () {
        var prev, next, valuesCount, tempCount, redirect,
            activeRoute = this._activeRoute;

        this.model.getValuesCount(function (data) {valuesCount = data; });
        tempCount = (function () {
            if (valuesCount % 50 === 0) {
                return (valuesCount / 50);
            }
            return Math.floor(valuesCount / 50) + 1;
        }());

        this._pageCount = (function () {
            var temp = [], i;
            for (i = 0; i < tempCount; i += 1) {
                temp[i] = i + 1;
            }
            return temp;
        }());

        this._updateBounds();

        this._routeBound = this._pageCount.length;
        if (Number(document.location.hash.substring(1)) > this._routeBound) {
            redirect = document.location.href;
            redirect = redirect.substring(0, redirect.indexOf("#"));
            redirect = redirect + "#" + this._routeBound;
            window.location.replace(redirect);
        }
        if (activeRoute === 1) {
            prev = activeRoute;
            next = activeRoute + 1;
            this.view.$prevPage.href = "#" + String(prev);
            this.view.$nextPage.href = "#" + String(next);
            this.view.$prevPage.style.pointerEvents = "none";
            this.view.$nextPage.style.pointerEvents = "auto";
        } else if (activeRoute === this._routeBound) {
            prev = activeRoute - 1;
            next = activeRoute;
            this.view.$prevPage.href = "#" + String(prev);
            this.view.$nextPage.href = "#" + String(next);
            this.view.$nextPage.style.pointerEvents = "none";
            this.view.$prevPage.style.pointerEvents = "auto";
        } else {
            prev = activeRoute - 1;
            next = activeRoute + 1;
            this.view.$prevPage.href = "#" + String(prev);
            this.view.$nextPage.href = "#" + String(next);
            this.view.$nextPage.style.pointerEvents = "auto";
            this.view.$prevPage.style.pointerEvents = "auto";
        }

        this._lastActiveRoute = activeRoute;
    };

    /* Set the current page/active route on hash change */
    Controller.prototype._updateFilterState = function (currentPage) {
        this._activeRoute = Number(currentPage);

        if (currentPage === '') {
            this._activeRoute = 1;
        }

        this._filter();
    };

    // Export to Require JS
    return {
        Controller: Controller
    };
});
