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
      
      if (board.customFields && card.customFieldItems) {
        // Create a simple map of field names to values
        const fieldMap = {};
        
        // Map field IDs to names
        board.customFields.forEach(function(field) {
          fieldMap[field.id] = {
            name: field.name,
            type: field.type,
            options: field.options
          };
        });
        
        // Process field values
        card.customFieldItems.forEach(function(item) {
          if (item.value && fieldMap[item.idCustomField]) {
            const fieldInfo = fieldMap[item.idCustomField];
            let displayValue = '';
            
            // Handle different field types
            if (fieldInfo.type === 'list' && item.value.option) {
              displayValue = item.value.option.value.text;
            } else if (fieldInfo.type === 'text' && item.value.text) {
              displayValue = item.value.text.substring(0, 30) + (item.value.text.length > 30 ? '...' : '');
            }
            
            if (displayValue && fieldInfo.name) {
              badges.push({
                title: fieldInfo.name,
                text: displayValue,
                color: fieldInfo.type === 'list' ? 'blue' : 'green'
              });
              console.log('[Custom Fields] Added badge:', fieldInfo.name, '=', displayValue);
            }
          }
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
