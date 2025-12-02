/* global TrelloPowerUp */

var VERSION = '9.1';

// Power-Up storage fields (7 fields - up to 4K chars each)
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

// Native custom field names (2 overflow fields - up to 16K chars, READ-ONLY from Power-Up)
var NATIVE_FIELD_NAMES = [
  'Overflow Active Disp',
  'Overflow Pending Disp'
];

console.log('[Custom Fields] VERSION 9.1 - Native fields display only');

TrelloPowerUp.initialize({
  'card-detail-badges': function(t, options) {
    console.log('[Custom Fields] Loading badges V9.1');
    
    return Promise.all([
      Promise.all(POWERUP_FIELDS.map(function(field) {
        return t.get('card', 'shared', field.id, '').then(function(value) {
          return { field: field, value: value };
        }).catch(function(err) {
          console.error('[Custom Fields] Error getting field:', field.id, err);
          return { field: field, value: '' };
        });
      })),
      t.card('customFieldItems').catch(function(err) {
        console.error('[Custom Fields] Error getting customFieldItems:', err);
        return { customFieldItems: [] };
      }),
      t.board('customFields').catch(function(err) {
        console.error('[Custom Fields] Error getting board customFields:', err);
        return { customFields: [] };
      })
    ]).then(function(results) {
      var powerUpData = results[0];
      var cardData = results[1];
      var boardData = results[2];
      
      var cardCustomFields = cardData.customFieldItems || [];
      var boardCustomFields = boardData.customFields || [];
      
      var badges = [];
      
      // Add Power-Up storage field badges (editable via Power-Up)
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
      
      // Add native custom field badges (display only - edit via Trello's Custom Fields)
      NATIVE_FIELD_NAMES.forEach(function(fieldName) {
        try {
          var fieldDef = null;
          
          if (boardCustomFields && boardCustomFields.length > 0) {
            for (var i = 0; i < boardCustomFields.length; i++) {
              if (boardCustomFields[i].name === fieldName) {
                fieldDef = boardCustomFields[i];
                break;
              }
            }
          }
          
          if (fieldDef) {
            var fieldItem = null;
            
            if (cardCustomFields && cardCustomFields.length > 0) {
              for (var j = 0; j < cardCustomFields.length; j++) {
                if (cardCustomFields[j].idCustomField === fieldDef.id) {
                  fieldItem = cardCustomFields[j];
                  break;
                }
              }
            }
            
            var displayValue = '(not set - edit below)';
            var badgeColor = 'light-gray';
            
            if (fieldItem && fieldItem.value && fieldItem.value.text) {
              var text = fieldItem.value.text;
              var charCount = text.length;
              // Show character count instead of content preview
              displayValue = charCount.toLocaleString() + ' chars';
              badgeColor = 'purple';
            }
            
            badges.push({
              title: fieldName + ' (16K)',
              text: displayValue,
              color: badgeColor,
              callback: function(t) {
                return t.popup({
                  title: 'View ' + fieldName,
                  url: './view-native-field.html?fieldId=' + fieldDef.id + '&fieldName=' + encodeURIComponent(fieldName) + '&v=' + VERSION,
                  height: 600,
                  width: 800
                });
              }
            });
            
            console.log('[Custom Fields] Added native field badge (read-only):', fieldName);
          } else {
            console.warn('[Custom Fields] Native field not found:', fieldName);
            badges.push({
              title: fieldName,
              text: 'Create in Custom Fields below',
              color: 'red',
              callback: function(t) {
                return t.alert({
                  message: 'Create a text field named "' + fieldName + '" using Trello\'s Custom Fields Power-Up.',
                  duration: 8
                });
              }
            });
          }
        } catch (err) {
          console.error('[Custom Fields] Error processing native field:', fieldName, err);
        }
      });
      
      console.log('[Custom Fields] Returning', badges.length, 'badges');
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
});

console.log('[Custom Fields] VERSION 9.1 INITIALIZED');
