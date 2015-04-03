/*global NodeList, console, window, document, localStorage, XMLHttpRequest */
(function (window) {
    'use strict';

    // Helper functions borrowed from TodoMVC
    // Get element(s) by CSS selector:
    window.qs = function (selector, scope) {
        return (scope || document).querySelector(selector);
    };
    window.qsa = function (selector, scope) {
        return (scope || document).querySelectorAll(selector);
    };

    // addEventListener wrapper:
    window.$on = function (target, type, callback, useCapture) {
        target.addEventListener(type, callback, !!useCapture);
    };

    // Register events on elements that may or may not exist yet:
    // $live('div a', 'click', function (event) {});
    window.$live = (function () {
        var eventRegistry = {};

        function dispatchEvent(event) {
            var targetElement = event.target;

            eventRegistry[event.type].forEach(function (entry) {
                var potentialElements = window.qsa(entry.selector),
                    hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

                if (hasMatch) {
                    entry.handler.call(targetElement, event);
                }
            });
        }

        return function (selector, event, handler) {
            if (!eventRegistry[event]) {
                eventRegistry[event] = [];
                window.$on(document.documentElement, event, dispatchEvent, true);
            }

            eventRegistry[event].push({
                selector: selector,
                handler: handler
            });
        };
    }());

    // Find the element's parent with the given tag name:
    // $parent(qs('a'), 'div');
    window.$parent = function (element, tagName) {
        if (!element.parentNode) {
            return;
        }
        if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
            return element.parentNode;
        }
        return window.$parent(element.parentNode, tagName);
    };

    // Function to sort a set of arrays by a selected index
    window.sortByIndex = function (array, index) {
        return array.sort(function (a, b) {
            a = a[index];
            b = b[index];
            if (a === b) {
                return 0;
            }
            if (a < b) {
                return -1;
            }
            return 1;
        });
    };

    // Find root URL to load data file
    function findRoot() {
        if (document.location.origin === 'undefined') {
            document.location.origin = document.location.protocol + '//' + document.location.host;
        }
        return document.location.origin;
    }

    // Vanilla JS to load data from json file on server, update view on load or reload attempt
    window.loadJSONToStore = function (name, fileURL, callback) {
        var data,
            root = findRoot(),
            request = new XMLHttpRequest();

        callback = callback || function () {return undefined; };
        fileURL = root + '/' + fileURL;

        if (localStorage[JSON.stringify(name)]) {
            console.log("Local storage already contains item " + name);
        } else {
            request.open('GET', fileURL, true);

            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    data = request.responseText;
                    localStorage.setItem(JSON.stringify(name), data);
                    callback();
                } else {
                    console.log("Server returned an error for request");
                }
            };

            request.onerror = function () {
                console.log("Error loading " + fileURL);
            };

            request.send();
        }
    };

    // Allow for looping on nodes by chaining:
    // qsa('.foo').forEach(function () {})
    NodeList.prototype.forEach = Array.prototype.forEach;
}(window));
