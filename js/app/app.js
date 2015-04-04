/*global define, Event, JSON, document, localStorage, window */
define(['./helpers', './store', './model', './template', './view', './controller'], function (helpers, store, model, template, view, controller) {
    'use strict';
    /* Set application variables, data file to load, aliases */
    var Store = store.Store,
        Model = model.Model,
        Template = template.Template,
        View = view.View,
        Controller = controller.Controller,
        appName = 'mvc-sort-table',
        dataFile = 'data.json',
        event = new Event('storageSaved'),
        sortTable;

    /* Application constructor function */
    function App(name) {
        this.storage = new Store(name);
        this.model = new Model(this.storage);
        this.template = new Template();
        this.view = new View(this.template);
        this.controller = new Controller(this.model, this.view);
    }

    function setView(app) {
        app.controller.setView(document.location.hash);
    }

    /* Initialize app */
    sortTable = new App(appName);

    /* Load data file, dispatch a custom event after loaded */
    helpers.loadJSONToStore(appName, dataFile, function () {
        window.dispatchEvent(event);
    });

    /* Set application view with loaded data */
    helpers.$on(window, 'storageSaved', function () {
        setView(sortTable);
    });

    /* Listen for paginated navigation triggered hash changes */
    helpers.$on(window, 'hashchange', function () {
        setView(sortTable);
    });

    /* If the app data is already stored, reset the view on page load */
    if (localStorage[JSON.stringify(appName)]) {
        helpers.$on(window, 'load', setView(sortTable));
    }

    /* App tear down, remove data from local storage */
    helpers.$on(window, 'unload', function () {
        localStorage.clear();
    });
});
