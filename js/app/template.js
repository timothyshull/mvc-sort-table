/*jshint laxbreak: true */
/*jslint white: true */
/*global window */
(function (window) {
    'use strict';

    /* Template constructor */
    function Template() {
        this.defaultTemplate
        =   '<div class="table-container">'
        +       '<table class="table table-bordered table-responsive" id="tableContent">'
        +           '<tr id="tableHeaders">'
        +               '{{fieldsTemplate}}'
        +           '</tr>'
        +           '{{valuesTemplate}}'
        +       '</table>'
        +       '{{formTemplate}}'
        +       '<nav class="page-nav">'
        +           '<ul class="pagination" id="pagination">'
        +               '<li>'
        +                   '<a href="#" aria-label="Previous" id="prevPage">'
        +                       '<span aria-hidden="true">&laquo;</span>'
        +                   '</a>'
        +               '</li>'
        +               '{{pageCountTemplate}}'
        +               '<li>'
        +                   '<a href="#" aria-label="Next" id="nextPage">'
        +                       '<span aria-hidden="true">&raquo;</span>'
        +                   '</a>'
        +               '</li>'
        +           '</ul>'
        +       '</nav>'
        +   '</div>';

        this.fieldsTemplate
        =   '<th id="{{id}}" data-sort="{{i}}">{{label}}</th>';

        this.valueItemsTemplate
        =   '<td>{{i}}</td>';

        this.valuesTemplate
        =   '<tr data-value="{{i}}">'
        +       '{{valueItemsTemplate}}'
        +   '</tr>';

        this.formInputTemplate
        =   '<input type="text" form="addValueForm" value="{{field.id}}">';

        this.formTemplate
        =   '<div class="add-val">'
        +       '<form class="addval-form" id="addValueForm">'
        +           '{{formInputTemplate}}'
        +           '<span><input type="submit" form="addValueForm" id="submitButton"></span>'
        +       '</form>'
        +   '</div>';

        this.pageCountTemplate
        =   '<li><a href="#{{count}}">{{count}}</a></li>';
    }

    /**
     * Creates an <li> HTML string and returns it for placement in your app.
     *
     * NOTE: In real life you should be using a templating engine such as Mustache
     * or Handlebars, however, this is a vanilla JS example.
     *
     * @param {object} data The object containing keys you want to find in the
     *                      template to replace.
     * @returns {string} HTML String of an <li> element
     *
     * @example
     * view.show({
     *    id: 1,
     *    title: "Hello World",
     *    completed: 0,
     * });
     */
    Template.prototype.showFieldsTemplate = function (data) {
        var i, template,
            l = data.length,
            view = '';

        for (i = 0; i < l; i += 1) {
            template = this.fieldsTemplate;

            template = template.replace('{{id}}', data[i].id);
            template = template.replace('{{i}}', i);
            template = template.replace('{{label}}', data[i].label);

            view = view + template;
        }

        return view;
    };

    Template.prototype.showValueItemsTemplate = function (data) {
        var i, template,
            l = data.length,
            view = '';

        for (i = 0; i < l; i += 1) {
            template = this.valueItemsTemplate;

            template = template.replace('{{i}}', data[i]);

            view = view + template;
        }

        return view;
    };

    Template.prototype.showValuesTemplate = function (data) {
        var i, template,
            l = data.length,
            view = '';

        for (i = 0; i < l; i += 1) {
            template = this.valuesTemplate;

            template = template.replace('{{i}}', i);
            template = template.replace('{{valueItemsTemplate}}', this.showValueItemsTemplate(data[i]));

            view = view + template;
        }

        return view;
    };

    Template.prototype.showFormInputTemplate = function (data) {
        var i, template,
            l = data.length,
            view = '';

        for (i = 0; i < l; i += 1) {
            template = this.formInputTemplate;

            template = template.replace('{{field.id}}', data[i].id);

            view = view + template;
        }

        return view;
    };

    Template.prototype.showFormTemplate = function (data) {
        var view = '',
            template = this.formTemplate;

        template = template.replace('{{formInputTemplate}}', this.showFormInputTemplate(data));

        view = view + template;

        return view;
    };

    Template.prototype.showPageCountTemplate = function (data) {
        var i, template,
            l = data.length,
            view = '';

        for (i = 0; i < l; i += 1) {
            template = this.pageCountTemplate;

            template = template.replace('{{count}}', data[i]);

            template = template.replace('{{count}}', data[i]);

            view = view + template;
        }

        return view;
    };

    Template.prototype.show = function (data) {
        var view = '',
            template = this.defaultTemplate;

        template = template.replace('{{fieldsTemplate}}', this.showFieldsTemplate(data.fields));
        template = template.replace('{{valuesTemplate}}', this.showValuesTemplate(data.values));
        template = template.replace('{{formTemplate}}', this.showFormTemplate(data.fields));
        template = template.replace('{{pageCountTemplate}}', this.showPageCountTemplate(data.pageCount));

        view = view + template;

        return view;
    };

    // Export to window
    window.app = window.app || {};
    window.app.Template = Template;
}(window));
