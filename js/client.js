/* global TrelloPowerUp */

// Field name mappings - update these to match your existing Trello custom field names
const FIELD_MAPPINGS = {
  'buffers': 'buffers',           // Change to match your existing field name
  'buffer-approach': 'buffer-approach',
  'buffer-definition': 'buffer-definition', 
  'zones': 'zones',
  'zone-definition': 'zone-definition'
};

// Initialize the Power-Up
TrelloPowerUp.initialize({
  // Enhanced badges that work with existing custom fields
  'card-detail-badges': function(t, options) {
    console.log('[Custom Fields] Loading card badges');
    
    return t.card('customFieldItems').then(function(card) {
      return t.board('customFields').then(function(board) {
        const badges = [];
        const customFields = board.customFields || [];
        const customFieldItems = card.customFieldItems || [];
        
        console.log('[Custom Fields] Found custom fields:', customFields.length);
        console.log('[Custom Fields] Found field items:', customFieldItems.length);
        
        // Create a map of field definitions
        const fieldDefinitions = {};
        customFields.forEach(function(field) {
          fieldDefinitions[field.id] = field;
        });
        
        // Create a map of field values
        const fieldValues = {};
        customFieldItems.forEach(function(item) {
          if (item.value) {
            fieldValues[item.idCustomField] = item.value;
          }
        });
        
        // Process each of our target fields
        Object.keys(FIELD_MAPPINGS).forEach(function(internalName) {
          const mappedName = FIELD_MAPPINGS[internalName];
          
          // Find the field definition by name
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
              displayValue = value.checked ? '✓' : '✗';
            }
            
            if (displayValue) {
              badges.push({
                title: fieldDef.name,
                text: displayValue,
                callback: function(t) {
                  return t.popup({
                    title: 'Edit ' + fieldDef.name,
                    url: './edit-existing-field.html?fieldId=' + fieldDef.id + '&fieldName=' + encodeURIComponent(fieldDef.name) + '&fieldType=' + fieldDef.type,
                    height: fieldDef.type === 'text' ? 300 : 200
                  });
                }
              });
            }
          }
        });
        
        // Add management button
        badges.push({
          title: 'Field Manager',
          text: 'Manage Fields',
          callback: function(t) {
            return t.popup({
              title: 'Manage Custom Fields',
              url: './manage-existing-fields.html',
              height: 400
            });
          }
        });
        
        console.log('[Custom Fields] Generated badges:', badges.length);
        return badges;
      });
    }).catch(function(error) {
      console.error('[Custom Fields] Error loading badges:', error);
      return [{
        title: 'Error',
        text: 'Failed to load fields',
        color: 'red'
      }];
    });
  },
  
  'show-settings': function(t, options) {
    return t.popup({
      title: 'Custom Fields Settings',
      url: './settings.html',
      height: 300
    });
  }
});

// Logging utility
function logEvent(event, data) {
  console.log('[Custom Fields Power-Up]', event, data);
}
