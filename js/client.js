/* global TrelloPowerUp */ 

// IMPORTANT: Replace with your actual Trello API key from https://trello.com/power-ups/admin
const API_KEY = '301da7855ed6ae5810670bb9ea548f8e';
const APP_NAME = 'power-up-2x-verification-custom-fields';
var VERSION = '8.7';

// Power-Up storage fields (7 fields)
var POWERUP_FIELDS = [
  { id: 'buffers', name: 'Buffers', type: 'text' },
  { id: 'buffer-approach', name: 'Buffer Approach', type: 'list', options: [
    'property-center-to-property-center',
    'parcel-to-parcel', 
    'natural-path',
    'other-approach',
    'not-applicable'
  ]},
  { id: 'buffer-definition', name: 'Buffer Definition', type: 'text' },
  { id: 'zones', name: 'Zones', type: 'text' },
  { id: 'zone-definition', name: 'Zone Definition', type: 'text' },
  { id: 'active-dispensaries', name: 'Active Dispensaries', type: 'text' },
  { id: 'pending-dispensaries', name: 'Pending Dispensaries', type: 'text' }
];

// Native Trello custom field names (2 overflow fields)
var NATIVE_FIELD_NAMES = [
  'Overflow Active Disp',
  'Overflow Pending Disp'
];

console.log('[Custom Fields] VERSION 8.7 STARTING');

TrelloPowerUp.initialize({
  'card-detail-badges': function(t, options) {
    console.log('[Custom Fields] Loading badges V8.7');
    
    return Promise.all([
      Promise.all(POWERUP_FIELDS.map(function(field) {
        return t.get('card', 'shared', field.id, '').then(function(value) {
          return { field: field, value: value };
        });
      })),
      t.card('customFieldItems'),
      t.board('customFields')
    ]).then(function(results) {
      var powerUpData = results[0];
      var cardCustomFields = results[1];
      var boardCustomFields = results[2];
      var badges = [];
      
      // Add Power-Up storage field badges
      powerUpData.forEach(function(data) {
        var field = data.field;
        var value = data.value;
        var displayValue = value || '(click to add)';
        var badgeColor = value ? (field.type === 'list' ? 'blue' : 'green') : 'light-gray';
        var popupWidth = 450;  
        var popupHeight = field.id === 'buffers' ? 400 : 350; 
        
        badges.push({
          title: field.name,
          text: displayValue,
          color: badgeColor,
          callback: function(t) {
            return t.popup({
              title: 'Edit ' + field.name,
              url: './edit-v5-field.html?fieldId=' + field.id + '&fieldName=' + encodeURIComponent(field.name) + '&fieldType=' + field.type + '&v=' + VERSION,
              height: popupHeight,
              width: popupWidth
            });
          }
        });
      });
      
      // Add native custom field badges
      NATIVE_FIELD_NAMES.forEach(function(fieldName) {
        var fieldDef = boardCustomFields.customFields.find(function(f) {
          return f.name === fieldName;
        });
        
        if (fieldDef) {
          var fieldItem = cardCustomFields.customFieldItems.find(function(item) {
            return item.idCustomField === fieldDef.id;
          });
          
          var displayValue = '(click to add)';
          var badgeColor = 'light-gray';
          
          if (fieldItem && fieldItem.value && fieldItem.value.text) {
            displayValue = fieldItem.value.text;
            badgeColor = 'purple';
          }
          
          badges.push({
            title: fieldName,
            text: displayValue,
            color: badgeColor,
            callback: function(t) {
              return t.popup({
                title: 'Edit ' + fieldName,
                url: './edit-native-field.html?fieldId=' + fieldDef.id + '&fieldName=' + encodeURIComponent(fieldName) + '&fieldType=' + fieldDef.type + '&apiKey=' + API_KEY + '&v=' + VERSION + '&cache=' + Date.now(),
                height: 400,
                width: 450
              });
            }
          });
        } else {
          badges.push({
            title: fieldName,
            text: 'Field not found',
            color: 'red',
            callback: function(t) {
              return t.alert({
                message: 'Create a text field named "' + fieldName + '" in Trello Custom Fields',
                duration: 8
              });
            }
          });
        }
      });
      
      console.log('[Custom Fields] Returning badges:', badges.length);
      return badges;
      
    }).catch(function(error) {
      console.error('[Custom Fields] Error:', error);
      return [{
        title: 'Error',
        text: error.message,
        color: 'red'
      }];
    });
  },
  
  'show-settings': function(t, options) {
    return t.popup({
      title: 'Settings',
      url: './settings.html?v=' + VERSION,
      height: 500
    });
  }
}, {
  appKey: API_KEY,
  appName: APP_NAME
});

console.log('[Custom Fields] VERSION 8.7 INITIALIZED');
