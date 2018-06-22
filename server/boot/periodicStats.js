angular
    .module('server.boot.periodicStats', [
        'global.constants',
        'models.stats'
    ])
    .run(["IB_CONSTANTS", "StatsCollection", function(IB_CONSTANTS, StatsCollection) {
        'use strict';

        function notifyUserStats(prefix) {
            var messages = [];

            if (prefix) {
                messages.push(prefix);
            }

            var counts = {
                guests: 0,
                user: 0,
                gm: 0,
                total: 0
            };

            Meteor.users.find({
                'status.online': true
            }).forEach(function(user) {
                if (user.profile.guest) {
                    counts.guests++;
                } else if (Roles.userIsInRole(user.userId, ['game-master'])) {
                    counts.gm++;
                } else {
                    counts.user++;
                }

                counts.total++;
            });

            messages.push('[' + Meteor.settings.server.name + '] ' + counts.total + ' players online (' + counts.guests + ' guests, ' + counts.user + ' registered, ' + counts.gm + ' GMs)');

            messages.push('Total registrations: ' + Meteor.users.find({
                'profile.guest': {
                    $exists: false
                }
            }).count());

            var message = messages.join(' | ');
            console.log(message);
        }

        Meteor.methods({
            onlineStats: function(prefixMessage) {
                // this can force it to happen outside of the normal schedule
                if (!this.userId || !Roles.userIsInRole(this.userId, ['game-master'])) {
                    throw new Meteor.Error('not-authorized');
                }

                notifyUserStats(prefixMessage);
            }
        });

        if (!IB_CONSTANTS.isDev) {
            if (Meteor.settings.doPeriodicStats) {
                Meteor.setInterval(notifyUserStats, 3600 * 3 * 1000);
            }
        }
        else if (process.env.VIRTUAL_HOST === 'dev.alabaster.ironbane.com') {

        }
    }]);
