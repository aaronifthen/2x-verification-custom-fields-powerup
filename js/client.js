/* global TrelloPowerUp */

console.log('[Custom Fields] Starting Power-Up initialization');

// Initialize the Power-Up with full editing capability
TrelloPowerUp.initialize({
  'card-detail-badges': function(t, options) {
    console.log('[Custom Fields] *** BADGES FUNCTION CALLED ***');
    
    return Promise.all([
      t.card('customFieldItems').catch(() => ({ customFieldItems: [] })),
      t.board('customFields').catch(() => ({ customFields: [] }))
    ]).then(function(results) {
      const card = results[0];
      const board = results[1];
      
      if (!board.customFields || board.customFields.length === 0) {
        return [{
          title: 'No Custom Fields',
          text: 'No custom fields found on this board',
          color: 'red'
        }];
      }
      
      // Get Power-Up stored values for all fields
      const fieldPromises = board.customFields.map(function(field) {
        return t.get('card', 'shared', 'customField-' + field.id, '').then(function(powerUpValue) {
          return { field: field, powerUpValue: powerUpValue };
        });
      });
      
      return Promise.all(fieldPromises).then(function(fieldData) {
        const badges = [];
        
        // Create field values map from Trello
        const trelloFieldValues = {};
        if (card.customFieldItems) {
          card.customFieldItems.forEach(function(item) {
            if (item.value) {
              trelloFieldValues[item.idCustomField] = item.value;
            }
          });
        }
        
        // Process each field
        fieldData.forEach(function(data) {
          const field = data.field;
          const powerUpValue = data.powerUpValue;
          
          let displayValue = '';
          let badgeColor = 'light-gray';
          let valueSource = '';
          
          // Priority: Power-Up value first, then Trello value
          if (powerUpValue) {
            displayValue = powerUpValue;
            badgeColor = field.type === 'list' ? 'blue' : 'green';
            valueSource = 'powerup';
          } else if (trelloFieldValues[field.id]) {
            // Get Trello value
            const trelloValue = trelloFieldValues[field.id];
            
            if (field.type === 'list' && trelloValue.option) {
              displayValue = trelloValue.option.value.text;
              badgeColor = 'blue';
            } else if (field.type === 'text' && trelloValue.text) {
              displayValue = trelloValue.text;
              badgeColor = 'green';
            } else if (field.type === 'number' && trelloValue.number !== undefined) {
              displayValue = trelloValue.number.toString();
              badgeColor = 'green';
            } else if (field.type === 'checkbox') {
              displayValue = trelloValue.checked ? '✓ Yes' : '✗ No';
              badgeColor = 'green';
            }
            valueSource = 'trello';
          } else {
            displayValue = '(click to add)';
            badgeColor = 'light-gray';
            valueSource = 'empty';
          }
          
          // Create badge - with properly sized popup window
          badges.push({
            title: field.name,
            text: displayValue, // Full text, no truncation
            color: badgeColor,
            callback: function(t) {
              return t.popup({
                title: 'Edit ' + field.name,
                url: './edit-field-popup.html?fieldId=' + field.id + '&fieldName=' + encodeURIComponent(field.name) + '&fieldType=' + field.type,
                height: field.type === 'text' ? 450 : 350,
                width: 700  // Increased from 600 to 700 to properly contain 500px textarea + padding
              });
            }
          });
          
          console.log('[Custom Fields] Badge created:', field.name, '=', displayValue.substring(0, 50), `(${badgeColor}, ${valueSource})`);
        });
        
        console.log('[Custom Fields] *** RETURNING', badges.length, 'BADGES (wide popups, no scrollbars) ***');
        return badges;
      });
      
    }).catch(function(error) {
      console.error('[Custom Fields] Error in badges function:', error);
      return [{
        title: 'Error',
        text: 'Failed to load fields: ' + error.message,
        color: 'red'
      }];
    });
  }
});

console.log('[Custom Fields] Power-Up initialization complete');
