import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

angular
    .module('game.ui.states.three-root.main-menu.login', [
		angularMeteor,
		uiRouter,
        'game.ui.dialog'
    ])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';

        $stateProvider.state('three-root.main-menu.login', {
            templateUrl: 'client/game/ui/states/three-root/main-menu/login/login.ng.html',
            controller: [
                '$scope',
                '$state',
                '$meteor',
                'dialogService',
                function($scope, $state, $meteor, dialogService) {
                    $scope.login = function() {
                        $meteor.loginWithPassword($scope.username, $scope.password)
                            .then(function() {
                                $state.go('^.enter-world');
                            }, function(err) {
                                if (err) {
                                    dialogService.alert(err.reason);
                                }
                            });
                    };

                    $scope.cancel = function() {
                        $state.go('^.enter-world');
                    };
                }
            ]
        });
    }]);
