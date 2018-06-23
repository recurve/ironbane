/*global Assets*/
angular
    .module('server.services.items', [
        'models.items',
        'global.constants'
    ])
    .run([
        'ItemsCollection',
        '$q',
        '$log',
        'IB_CONSTANTS',
        function(ItemsCollection, $q, $log, IB_CONSTANTS) {
            'use strict';

            var parse = require('csv-parse');
            var request = require('request');

            // we want to seed the item templates from the spreadsheet (csv) every time
            ItemsCollection.remove({});

            function loadData(filename) {
            	console.log("item file.... is: " + filename);      
                function loadCsv(text) {
					var parser = Meteor.wrapAsync(parse);
					var parsedResult = parser(text, {
						delimiter: ',',
						auto_parse: true
					});
					return parsedResult;
                
                
                
                
//                     var parser = parse(text, {
//                         delimiter: ',',
//                         auto_parse: true
//                     }, function(err, data) {
//                         if (err) {
//                             return deferred.reject(err);
//                         }
// 
//                         deferred.resolve(data);
//                     });
// 
//                     return parser;
                }

                // assume if there's an http protocol that we're using remote files,
                // otherwise in the privates
	            var data = null;

                if (filename.search(/http/) >= 0) {
					var requestSync = Meteor.wrapAsync(function(url, callback) {
					  request(url, function(error, response, body) {
						callback(error, {response: response, body: body})
					  })
					});
					var result = requestSync(filename);
					var statusCode = result.response.statusCode;
                
					if (statusCode === 200) {
						data = loadCsv(result.body);
					} else {
						throw "Could not fetch: " + filename + " status code: " + statusCode;
					}
                
                
                
//                     request(filename, function(error, response, body) {
//                         if (!error && response.statusCode === 200) {
//                             loadCsv(body);
//                         } else {
//                             deferred.reject(error);
//                         }
//                     });
                } else {
	            	throw "fixme: Assets.getText item.js";
                
                
//                     Assets.getText(filename, function(err, text) {
//                         if (err) {
//                             return deferred.reject(err);
//                         }
// 
//                         loadCsv(text);
//                     });
                }

                return $q.when(data);
            }

            function getValue(row, headers, header) {
                return row[headers.indexOf(header)];
            }

            var mapping = {
                name: 'Name',
                type: 'Type',
                image: 'Image',
                invImage: 'Inventory Image',
                damage: 'Damage',
                armor: 'Armor',
                rarity: 'Rarity',
                range: 'Range',
                projectileSpeed: 'Projectile Speed',
                attackCooldown: 'Attack Cooldown',
                handedness: 'Handedness',
                price: 'Buy Price',
                dropChance: 'Drop Chance %',
                displayNotes: 'Display Notes',
                devNotes: 'Special Powers & Notes',
                behavior: 'Behavior'
            };

            var contentFile = (Meteor.settings.content && Meteor.settings.content.items) ? Meteor.settings.content.items :
                (IB_CONSTANTS.isDev ? 'https://docs.google.com/spreadsheets/d/1ZC-ydW7if6Ci0TytsSLaio0LMoCntQwaUkXAOwjn7Y8/pub?output=csv' : 'items.csv');

            console.log('Loading items from spreadsheet');

            loadData(contentFile).then(function(data) {
                var headers, rows;

                rows = data;
                headers = rows.shift();

                rows.forEach(function(row) {
                    var item = {};
                    for (var key in mapping) {
                        let value = getValue(row, headers, mapping[key]);

                        if (angular.isString(value)) {
                            value = value.trim();
                        }

                        if (key === 'behavior') {
                            value = value && value.split(',');
                            if (value && value.length > 0) {
                                value = value.map(v => v.trim());
                            }
                        }

                        if (value || value === 0) {
                            item[key] = value;
                        }
                    }

                    item.id = ItemsCollection.insert(item);
                });

                console.log('Loaded ' + rows.length + ' items into Meteor collection');
            }, function(err) {
                console.log('Error loading items! ', err.message);
            });

            Meteor.publish('items', function() {
                return ItemsCollection.find({});
            });
        }
    ]);
