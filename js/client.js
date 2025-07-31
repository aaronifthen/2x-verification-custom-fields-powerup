/* global TrelloPowerUp */

console.log('[Custom Fields] Starting Power-Up initialization');

// Initialize the Power-Up with minimal, working functionality
TrelloPowerUp.initialize({
  'card-detail-badges': function(t, options) {
    console.log('[Custom Fields] *** BADGES FUNCTION CALLED ***');
    
    // First, return a simple test badge to confirm the mechanism works
    const testBadge = {
      title: 'Power-Up',
      text: 'Active',
      color: 'green'
    };
    
    // Try to get custom field data
    return Promise.all([
      t.card('customFieldItems').catch(() => ({ customFieldItems: [] })),
      t.board('customFields').catch(() => ({ customFields: [] }))
    ]).then(function(results) {
      const card = results[0];
      const board = results[1];
      
      const badges = [testBadge]; // Always include test badge
      
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
        
        // Process ALL custom fields, whether they have values or not
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
            // Field is empty - still show it
            displayValue = '(empty)';
            badgeColor = 'light-gray';
          }
          
          badges.push({
            title: field.name,
            text: displayValue,
            color: badgeColor
          });
          
          console.log('[Custom Fields] Added badge:', field.name, '=', displayValue, `(${badgeColor})`);
        });
      }
      
      console.log('[Custom Fields] *** RETURNING', badges.length, 'BADGES ***');
      badges.forEach(function(badge, index) {
        console.log(`[Custom Fields] Badge ${index}:`, badge.title, '=', badge.text, `(${badge.color})`);
      });
      
      return badges;
      
    }).catch(function(error) {
      console.error('[Custom Fields] Error in badges function:', error);
      return [
        testBadge,
        {
          title: 'Error',
          text: 'Failed to load',
          color: 'red'
        }
      ];
    });
  }
});

console.log('[Custom Fields] Power-Up initialization complete');
