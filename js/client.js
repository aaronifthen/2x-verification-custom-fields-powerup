/* global TrelloPowerUp */

console.log('[Custom Fields] Starting Power-Up initialization');

// Field name mappings - update these to match your existing Trello custom field names
const FIELD_MAPPINGS = {
  'buffers': 'buffers',
  'buffer-approach': 'buffer-approach',
  'buffer-definition': 'buffer-definition', 
  'zones': 'zones',
  'zone-definition': 'zone-definition'
};

// Initialize the Power-Up
TrelloPowerUp.initialize({
  'card-detail-badges': function(t, options) {
    console.log('[Custom Fields] *** CARD-DETAIL-BADGES CALLED ***');
    
    return t.card('customFieldItems').then(function(card) {
      return t.board('customFields').then(function(board) {
        console.log('[Custom Fields] Found custom fields:', board.customFields ? board.customFields.length : 0);
        console.log('[Custom Fields] Found field items:', card.customFieldItems ? card.customFieldItems.length : 0);
        
        const badges = [];
        const customFields = board.customFields || [];
        const customFieldItems = card.customFieldItems || [];
        
        // Create field values map
        const fieldValues = {};
        customFieldItems.forEach(function(item) {
          if (item.value) {
            fieldValues[item.idCustomField] = item.value;
          }
        });
        
        // Process each target field
        Object.keys(FIELD_MAPPINGS).forEach(function(internalName) {
          const mappedName = FIELD_MAPPINGS[internalName];
          
          // Find the field definition by name (case-insensitive)
          const fieldDef = customFields.find(function(field) {
            return field.name.toLowerCase() === mappedName.toLowerCase();
          });
          
          if (fieldDef && fieldValues[fieldDef.id]) {
            const value = fieldValues[fieldDef.id];
            let displayValue = '';
            
            // Handle different field types
            if (fieldDef.type === 'list' && value.option) {
              displayValue = value.option.value.text;
            } else if (fieldDef.type === 'text' && value.text) {
              displayValue = value.text.length > 30 ? value.text.substring(0, 30) + '...' : value.text;
            } else if (fieldDef.type === 'number' && value.number !== undefined) {
              displayValue = value.number.toString();
            } else if (fieldDef.type === 'date' && value.date) {
              displayValue = new Date(value.date).toLocaleDateString();
            } else if (fieldDef.type === 'checkbox') {
              displayValue = value.checked ? '✓ Yes' : '✗ No';
            }
            
            if (displayValue) {
              const badge = {
                title: fieldDef.name,
                text: displayValue,
                color: fieldDef.type === 'list' ? 'blue' : 'green'
              };
              badges.push(badge);
              console.log('[Custom Fields] BADGE CREATED:', badge.title, '=', badge.text);
            }
          }
        });
        
        // Add summary badge
        badges.push({
          title: 'Fields',
          text: `${badges.length} active`,
          color: 'light-gray'
        });
        
        console.log('[Custom Fields] *** RETURNING', badges.length, 'BADGES ***');
        console.log('[Custom Fields] Badge list:', badges.map(b => `${b.title}: ${b.text}`));
        
        return badges;
      });
    }).catch(function(error) {
      console.error('[Custom Fields] Error getting custom fields:', error);
      return [{
        title: 'Error',
        text: error.message,
        color: 'red'
      }];
    });
  },
  
  'show-settings': function(t, options) {
    return t.popup({
      title: 'Custom Fields Info',
      url: './debug.html',
      height: 400
    });
  }
});

console.log('[Custom Fields] Power-Up initialization complete');
