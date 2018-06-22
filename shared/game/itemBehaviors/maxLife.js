angular
    .module('game.itemBehaviors.maxLife', [
        'game.itemBehaviors.baseItemBehavior'
    ])
    .factory('MaxLifeItemBehavior', [
        'BaseItemBehavior',
        function(BaseItemBehavior) {
            'use strict';

            class MaxLifeItemBehavior extends BaseItemBehavior {

                constructor(strength) {
                    super();

                    this._modifier = 1;

                    if (!strength) {
                        strength = 'normal';
                    }

                    if (strength[0] === '-') {
                        this._modifier = -1;
                        strength = strength.substr(1);
                    }

                    this._strength = strength;

                    this._amount = 0;

					var toLowerCaseFunction = function(text) {
						if (text) {
							text = text.toLowerCase();
						}
						return text;
					}                            

                    if (toLowerCaseFunction(strength) === 'weak') {
                        this._amount = 0.25;
                    }

                    if (toLowerCaseFunction(strength) === 'normal') {
                        this._amount = 0.5;
                    }

                    if (toLowerCaseFunction(strength) === 'strong') {
                        this._amount = 1;
                    }

                    if (toLowerCaseFunction(strength) === 'epic') {
                        this._amount = 1.5;
                    }

                    if (toLowerCaseFunction(strength) === 'legendary') {
                        this._amount = 2;
                    }
                }

                onUse(item, entity) {
                    var health = entity.getComponent('health');
                    if (health) {
                        health.max += (this._amount * this._modifier);
                    }

                    // do not let them be killed
                    if (health.max < 0.25) {
                        health.max = 0.25;
                    }

                    return true;
                }

                onEquip(item, entity) {
                    var health = entity.getComponent('health');
                    if (health) {
                        health.max += (this._amount * this._modifier);
                    }

                    // do not let them be killed
                    if (health.max < 0.25) {
                        health.max = 0.25;
                    }

                    return true;
                }

                onUnEquip(item, entity) {
                    var health = entity.getComponent('health');
                    if (health) {
                        health.max -= (this._amount * this._modifier);
                    }

                    // do not let them be killed
                    if (health.max < 0.25) {
                        health.max = 0.25;
                    }

                    return true;
                }
            }

            return MaxLifeItemBehavior;
        }
    ]);
