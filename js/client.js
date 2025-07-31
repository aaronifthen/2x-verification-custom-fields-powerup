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
        
        // Log all custom fields for debugging
        customFields.forEach(function(field, index) {
          console.log(`[Custom Fields] Available field ${index}:`, field.name, field.type, field.id);
        });
        
        // Log all field items for debugging
        customFieldItems.forEach(function(item, index) {
          console.log(`[Custom Fields] Field item ${index}:`, item.idCustomField, item.value);
        });
        
        // Create field values map
        const fieldValues = {};
        customFieldItems.forEach(function(item) {
          if (item.value) {
            fieldValues[item.idCustomField] = item.value;
            console.log('[Custom Fields] Field value mapped:', item.idCustomField, item.value);
          }
        });
        
        // Process each target field
        Object.keys(FIELD_MAPPINGS).forEach(function(internalName) {
          const mappedName = FIELD_MAPPINGS[internalName];
          
          // Find the field definition by name (case-insensitive)
          const fieldDef = customFields.find(function(field) {
            return field.name.toLowerCase() === mappedName.toLowerCase();
          });
          
          if (fieldDef) {
            console.log('[Custom Fields] Found target field:', fieldDef.name, 'ID:', fieldDef.id, 'Type:', fieldDef.type);
            
            if (fieldValues[fieldDef.id]) {
              const value = fieldValues[fieldDef.id];
              let displayValue = '';
              
              console.log('[Custom Fields] Processing value for', fieldDef.name, ':', value);
              
              // Handle different field types
              if (fieldDef.type === 'list' && value.option) {
                displayValue = value.option.value.text;
                console.log('[Custom Fields] Dropdown value found:', displayValue);
              } else if (fieldDef.type === 'text' && value.text) {
                displayValue = value.text.length > 30 ? value.text.substring(0, 30) + '...' : value.text;
                console.log('[Custom Fields] Text value found:', displayValue);
              } else if (fieldDef.type === 'number' && value.number !== undefined) {
                displayValue = value.number.toString();
                console.log('[Custom Fields] Number value found:', displayValue);
              } else if (fieldDef.type === 'date' && value.date) {
                displayValue = new Date(value.date).toLocaleDateString();
                console.log('[Custom Fields] Date value found:', displayValue);
              } else if (fieldDef.type === 'checkbox') {
                displayValue = value.checked ? '✓ Yes' : '✗ No';
                console.log('[Custom Fields] Checkbox value found:', displayValue);
              }
              
              if (displayValue) {
                badges.push({
                  title: fieldDef.name,
                  text: displayValue,
                  color: fieldDef.type === 'list' ? 'blue' : 'green'
                });
                console.log('[Custom Fields] Badge created for:', fieldDef.name, displayValue);
              }
            } else {
              console.log('[Custom Fields] No value found for field:', fieldDef.name);
            }
          } else {
            console.log('[Custom Fields] Target field NOT found:', mappedName);
          }
        });
        
        // Always add informational badge
        badges.push({
          title: 'Custom Fields',
          text: `${badges.length} fields with values`,
          color: 'light-gray'
        });
        
        console.log('[Custom Fields] Final badges count:', badges.length);
        console.log('[Custom Fields] Badges:', badges.map(b => `${b.title}: ${b.text}`));
        
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
    console.log('[Custom Fields] *** SHOW-SETTINGS CALLED ***');
    return t.popup({
      title: 'Custom Fields Info',
      url: './debug.html',
      height: 400
    });
  }
});

console.log('[Custom Fields] Power-Up initialization complete');
