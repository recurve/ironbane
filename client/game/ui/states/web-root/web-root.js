import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

angular
    .module('game.ui.states.web-root', [
		angularMeteor,
		uiRouter
    ])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';

        // currently unused, the purpose of splitting is to allow a non-canvas view
        // (perhaps admin page)

        $stateProvider.state('web-root', {
            templateUrl: 'client/game/ui/states/web-root/web-root.ng.html',
            abstract: true,
            controller: [
                '$meteor',
                '$scope',
                function($meteor, $scope) {
                    $scope.logout = $meteor.logout;
                }
            ]
        });
    }]);
