/* global TrelloPowerUp */

console.log('[Custom Fields] Starting Power-Up initialization');

// Initialize the Power-Up with clickable badges
TrelloPowerUp.initialize({
  'card-detail-badges': function(t, options) {
    console.log('[Custom Fields] *** BADGES FUNCTION CALLED ***');
    
    return Promise.all([
      t.card('customFieldItems').catch(() => ({ customFieldItems: [] })),
      t.board('customFields').catch(() => ({ customFields: [] }))
    ]).then(function(results) {
      const card = results[0];
      const board = results[1];
      
      const badges = [];
      
      console.log('[Custom Fields] Board custom fields:', board.customFields ? board.customFields.length : 0);
      console.log('[Custom Fields] Card field items:', card.customFieldItems ? card.customFieldItems.length : 0);
      
      if (board.customFields) {
        // Create field values map first
        const fieldValues = {};
        if (card.customFieldItems) {
          card.customFieldItems.forEach(function(item) {
            if (item.value) {
              fieldValues[item.idCustomField] = item.value;
            }
          });
        }
        
        // Process ALL custom fields with click handlers
        board.customFields.forEach(function(field) {
          let displayValue = '';
          let badgeColor = 'light-gray';
          
          if (fieldValues[field.id]) {
            // Field has a value
            const value = fieldValues[field.id];
            badgeColor = 'green';
            
            if (field.type === 'list' && value.option) {
              displayValue = value.option.value.text;
              badgeColor = 'blue';
            } else if (field.type === 'text' && value.text) {
              displayValue = value.text.substring(0, 30) + (value.text.length > 30 ? '...' : '');
            } else if (field.type === 'number' && value.number !== undefined) {
              displayValue = value.number.toString();
            } else if (field.type === 'checkbox') {
              displayValue = value.checked ? '✓ Yes' : '✗ No';
            }
          } else {
            // Field is empty
            displayValue = '(click to edit)';
            badgeColor = 'light-gray';
          }
          
          badges.push({
            title: field.name,
            text: displayValue,
            color: badgeColor,
            callback: function(t) {
              return t.popup({
                title: field.name + ' - Field Info',
                url: './field-info.html?fieldId=' + field.id + '&fieldName=' + encodeURIComponent(field.name) + '&fieldType=' + field.type,
                height: 250
              });
            }
          });
          
          console.log('[Custom Fields] Added clickable badge:', field.name, '=', displayValue, `(${badgeColor})`);
        });
      }
      
      // Add info badge
      badges.push({
        title: 'Custom Fields',
        text: 'Enhanced View',
        color: 'green',
        callback: function(t) {
          return t.popup({
            title: 'Custom Fields Power-Up',
            url: './info.html',
            height: 300
          });
        }
      });
      
      console.log('[Custom Fields] *** RETURNING', badges.length, 'BADGES ***');
      return badges;
      
    }).catch(function(error) {
      console.error('[Custom Fields] Error in badges function:', error);
      return [{
        title: 'Error',
        text: 'Failed to load',
        color: 'red'
      }];
    });
  }
});

console.log('[Custom Fields] Power-Up initialization complete');
