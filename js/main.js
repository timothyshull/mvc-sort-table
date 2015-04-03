/*global require */
require.config({
    baseUrl: 'js/vendor',
    paths: {
        app: '../app'
    }
});
require(['app/helpers', 'app/store', 'app/model', 'app/template', 'app/view', 'app/controller', 'app/app']);