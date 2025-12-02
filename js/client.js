/* global TrelloPowerUp */

console.log('[Custom Fields] *** VERSION 8 - 7 POWER-UP + 2 NATIVE FIELDS ***');

// Power-Up storage fields (7 fields)
const POWERUP_FIELDS = [
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

// Native Trello custom field names to look for (2 new overflow fields)
const NATIVE_FIELD_NAMES = [
  'Overflow Active Disp',
  'Overflow Pending Disp'
];

// Initialize the Power-Up
TrelloPowerUp.initialize({
  'card-detail-badges': function(t, options) {
    console.log('[Custom Fields] *** V8 LOADING 9 TOTAL FIELDS (7 POWER-UP + 2 NATIVE) ***');
    
    return Promise.all([
      // Get Power-Up storage values (7 fields)
      Promise.all(POWERUP_FIELDS.map(function(field) {
        return t.get('card', 'shared', field.id, '').then(function(value) {
          return { field: field, value: value, source: 'powerup' };
        });
      })),
      // Get Trello native custom fields
      t.card('customFieldItems'),
      t.board('customFields')
    ]).then(function(results) {
      const powerUpData = results[0];
      const cardCustomFields = results[1];
      const boardCustomFields = results[2];
      
      const badges = [];
      
      // Add Power-Up storage field badges (7 fields)
      powerUpData.forEach(function(data) {
        const field = data.field;
        const value = data.value;
        
        let displayValue = value || '(click to add)';
        let badgeColor = value ? (field.type === 'list' ? 'blue' : 'green') : 'light-gray';
        
        let popupWidth = 450;  
        let popupHeight = field.id === 'buffers' ? 400 : 350; 
        
        badges.push({
          title: field.name,
          text: displayValue,
          color: badgeColor,
          callback: function(t) {
            return t.popup({
              title: 'Edit ' + field.name,
              url: './edit-v5-field.html?fieldId=' + field.id + '&fieldName=' + encodeURIComponent(field.name) + '&fieldType=' + field.type + '&v=8',
              height: popupHeight,
              width: popupWidth
            });
          }
        });
        
        console.log('[Custom Fields] V8 Power-Up badge:', field.name);
      });
      
      // Add Trello native custom field badges (2 overflow fields)
      NATIVE_FIELD_NAMES.forEach(function(fieldName) {
        // Find the field definition on the board
        const fieldDef = boardCustomFields.customFields.find(function(f) {
          return f.name === fieldName;
        });
        
        if (fieldDef) {
          // Find the current value on this card
          const fieldItem = cardCustomFields.customFieldItems.find(function(item) {
            return item.idCustomField === fieldDef.id;
          });
          
          let displayValue = '(click to add)';
          let badgeColor = 'light-gray';
          
          if (fieldItem && fieldItem.value && fieldItem.value.text) {
            displayValue = fieldItem.value.text;
            badgeColor = 'purple'; // Different color for native fields
          }
          
          badges.push({
            title: fieldName,
            text: displayValue,
            color: badgeColor,
            callback: function(t) {
              return t.popup({
                title: 'Edit ' + fieldName,
                url: './edit-native-field.html?fieldId=' + fieldDef.id + '&fieldName=' + encodeURIComponent(fieldName) + '&fieldType=' + fieldDef.type + '&v=8',
                height: 350,
                width: 450
              });
            }
          });
          
          console.log('[Custom Fields] V8 Native field badge:', fieldName);
        } else {
          console.warn('[Custom Fields] V8 Native field not found on board:', fieldName);
          // Show a warning badge if field doesn't exist
          badges.push({
            title: fieldName,
            text: 'Field not found - create in Trello',
            color: 'red',
            callback: function(t) {
              return t.alert({
                message: 'Please create a text custom field named "' + fieldName + '" in Trello\'s Custom Fields Power-Up.',
                duration: 8
              });
            }
          });
        }
      });
      
      console.log('[Custom Fields] *** V8 RETURNING', badges.length, 'TOTAL BADGES (7 POWER-UP + 2 NATIVE) ***');
      return badges;
      
    }).catch(function(error) {
      console.error('[Custom Fields] V8 Error:', error);
      return [{
        title: 'V8 Error',
        text: 'Failed to load: ' + error.message,
        color: 'red'
      }];
    });
  },
  
  'show-settings': function(t, options) {
    console.log('[Custom Fields] Opening settings');
    return t.popup({
      title: 'Custom Fields Settings',
      url: './settings.html',
      height: 500
    });
  }
});

console.log('[Custom Fields] *** VERSION 8 COMPLETE - 9 TOTAL FIELDS ***');
