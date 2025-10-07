/* global TrelloPowerUp */

console.log('[Custom Fields] *** VERSION 6 - ADDED DISPENSARY FIELDS ***');

// Field definitions - your 7 custom fields
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
  { id: 'zone-definition', name: 'Zone Definition', type: 'text' },
  { id: 'active-dispensaries', name: 'Active Dispensaries', type: 'text' },
  { id: 'pending-dispensaries', name: 'Pending Dispensaries', type: 'text' }
];

// Initialize the Power-Up with Power-Up storage only
TrelloPowerUp.initialize({
  'card-detail-badges': function(t, options) {
    console.log('[Custom Fields] *** V6 WITH DISPENSARY FIELDS ***');
    
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
        
        // Popup sizing - 450x400px for buffers, 450x350px for others
        let popupWidth = 450;  
        let popupHeight = field.id === 'buffers' ? 400 : 350; 
        
        badges.push({
          title: field.name,
          text: displayValue,
          color: badgeColor,
          callback: function(t) {
            return t.popup({
              title: 'Edit ' + field.name,
              url: './edit-v5-field.html?fieldId=' + field.id + '&fieldName=' + encodeURIComponent(field.name) + '&fieldType=' + field.type + '&v=6',
              height: popupHeight,
              width: popupWidth
            });
          }
        });
        
        console.log('[Custom Fields] V6 Badge created:', field.name, `(${popupWidth}x${popupHeight})`);
      });
      
      console.log('[Custom Fields] *** V6 RETURNING', badges.length, 'BADGES (INCLUDING DISPENSARIES) ***');
      return badges;
      
    }).catch(function(error) {
      console.error('[Custom Fields] V6 Error:', error);
      return [{
        title: 'V6 Error',
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

console.log('[Custom Fields] *** VERSION 6 COMPLETE - 7 FIELDS TOTAL ***');
