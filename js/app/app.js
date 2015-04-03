/*global $on, Event, JSON, app, document, localStorage, window */
(function () {
    'use strict';
    /* Set application variables, data file to load */
    var appName = 'mvc-sort-table',
        dataFile = 'data.json',
        event = new Event('storageSaved'),
        sortTable;

    /* Application constructor function */
    function App(name) {
        this.storage = new app.Store(name);
        this.model = new app.Model(this.storage);
        this.template = new app.Template();
        this.view = new app.View(this.template);
        this.controller = new app.Controller(this.model, this.view);
    }

    function setView(app) {
        app.controller.setView(document.location.hash);
    }

    /* Initialize app */
    sortTable = new App(appName);

    /* Load data file, dispatch a custom event after loaded */
    window.loadJSONToStore(appName, dataFile, function () {
        window.dispatchEvent(event);
    });

    /* Set application view with loaded data */
    $on(window, 'storageSaved', function () {
        setView(sortTable);
    });

    /* Listen for paginated navigation triggered hash changes */
    $on(window, 'hashchange', function () {
        setView(sortTable);
    });

    /* If the app data is already stored, reset the view on page load */
    if (localStorage[JSON.stringify(appName)]) {
        $on(window, 'load', setView(sortTable));
    }

    /* App tear down, remove data from local storage */
    $on(window, 'unload', function () {
        localStorage.clear();
    });
}());
