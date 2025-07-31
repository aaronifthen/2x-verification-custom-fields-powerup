/* global TrelloPowerUp */

console.log('[Custom Fields] *** VERSION 5 - WIDER/SHORTER TEXT FIELDS ***');

// Field definitions - your 5 custom fields
const CUSTOM_FIELDS = [
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
  { id: 'zone-definition', name: 'Zone Definition', type: 'text' }
];

// Initialize the Power-Up with Power-Up storage only
TrelloPowerUp.initialize({
  'card-detail-badges': function(t, options) {
    console.log('[Custom Fields] *** V5 WIDER/SHORTER TEXT FIELDS ***');
    
    // Get all Power-Up stored values
    const fieldPromises = CUSTOM_FIELDS.map(function(field) {
      return t.get('card', 'shared', field.id, '').then(function(value) {
        return { field: field, value: value };
      });
    });
    
    return Promise.all(fieldPromises).then(function(fieldData) {
      const badges = [];
      
      fieldData.forEach(function(data) {
        const field = data.field;
        const value = data.value;
        
        let displayValue = value || '(click to add)';
        let badgeColor = value ? (field.type === 'list' ? 'blue' : 'green') : 'light-gray';
        
        // Popup sizing - adjusted for Trello's window limits
        let popupWidth = 400;  
        let popupHeight = 350; 
        
        if (field.type === 'text') {
          popupWidth = 900;    // More realistic max width for Trello popups
          popupHeight = 400;   // Reasonable height
        } else if (field.type === 'list') {
          popupWidth = 600;    // Unchanged dropdown size  
          popupHeight = 300;   // Unchanged dropdown size
        }
        
        badges.push({
          title: field.name,
          text: displayValue,
          color: badgeColor,
          callback: function(t) {
            return t.popup({
              title: 'Edit ' + field.name,
              url: './edit-v5-field.html?fieldId=' + field.id + '&fieldName=' + encodeURIComponent(field.name) + '&fieldType=' + field.type + '&v=5',
              height: popupHeight,
              width: popupWidth
            });
          }
        });
        
        console.log('[Custom Fields] V5 Sized popup:', field.name, `(${popupWidth}x${popupHeight})`);
      });
      
      console.log('[Custom Fields] *** V5 RETURNING', badges.length, 'WIDER/SHORTER BADGES ***');
      return badges;
      
    }).catch(function(error) {
      console.error('[Custom Fields] V5 Error:', error);
      return [{
        title: 'V5 Error',
        text: 'Failed to load: ' + error.message,
        color: 'red'
      }];
    });
  }
});

console.log('[Custom Fields] *** VERSION 5 COMPLETE ***');
