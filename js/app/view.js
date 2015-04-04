/*global define */
define(['./helpers'], function (helpers) {
    'use strict';
    
    var qs = helpers.qs, qsa = helpers.qsa, $on = helpers.$on; 

    function View(template) {
        this.template = template;
        this.$tableDiv = qs('#sort-table');
    }

    View.prototype.render = function (parameter) {
        this.$tableDiv.innerHTML = this.template.show(parameter);
        this.$table = qs('#tableContent');
        this.$prevPage = qs('#prevPage');
        this.$nextPage = qs('#nextPage');
        this.$pageCount = qs('#pageCount');
        this.$submitButton = qs('#submitButton');
        this.$addValueForm = qs('#addValueForm');
        this.$tableHeaders = qs('#tableHeaders');
        this.$headerFields = qsa('[data-sort]');
        this.$values = qsa('[data-value]');
    };

    View.prototype.bind = function (event, handler) {
        var temp = [], i, j,
            that = this;

        function makeClickHandler(index) {
            return function () {
                handler(index);
            };
        }

        if (event === 'addValue') {
            $on(that.$addValueForm, 'submit', function (event) {
                for (i = 0; i < this.length - 1; i += 1) {
                    temp.push(this[i].value);
                }
                handler(temp);
                event.preventDefault();
            });
        } else if (event === 'sortValues') {
            for (j = 0; j < that.$tableHeaders.children.length; j += 1) {
                $on(that.$tableHeaders.children[j], 'click', makeClickHandler(j));
            }
        }
    };
    
    // Export to Require JS
    return {
        View: View
    };
});
