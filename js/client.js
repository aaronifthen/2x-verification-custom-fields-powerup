/* global TrelloPowerUp */

// Initialize the Power-Up
TrelloPowerUp.initialize({
  // Define custom field types
  'card-detail-badges': function(t, options) {
    return Promise.all([
      t.get('card', 'shared', 'buffers', ''),
      t.get('card', 'shared', 'buffer-approach', ''),
      t.get('card', 'shared', 'buffer-definition', ''),
      t.get('card', 'shared', 'zones', ''),
      t.get('card', 'shared', 'zone-definition', '')
    ]).then(function(values) {
      const badges = [];
      
      // Buffers field
      if (values[0]) {
        badges.push({
          title: 'Buffers',
          text: values[0].length > 30 ? values[0].substring(0, 30) + '...' : values[0],
          callback: function(t) {
            return t.popup({
              title: 'Edit Buffers',
              url: './edit-field.html?field=buffers&type=textarea',
              height: 300
            });
          }
        });
      }
      
      // Buffer Approach field
      if (values[1]) {
        badges.push({
          title: 'Buffer Approach',
          text: values[1],
          callback: function(t) {
            return t.popup({
              title: 'Edit Buffer Approach',
              url: './edit-field.html?field=buffer-approach&type=dropdown',
              height: 200
            });
          }
        });
      }
      
      // Buffer Definition field
      if (values[2]) {
        badges.push({
          title: 'Buffer Definition',
          text: values[2].length > 30 ? values[2].substring(0, 30) + '...' : values[2],
          callback: function(t) {
            return t.popup({
              title: 'Edit Buffer Definition',
              url: './edit-field.html?field=buffer-definition&type=textarea',
              height: 300
            });
          }
        });
      }
      
      // Zones field
      if (values[3]) {
        badges.push({
          title: 'Zones',
          text: values[3].length > 30 ? values[3].substring(0, 30) + '...' : values[3],
          callback: function(t) {
            return t.popup({
              title: 'Edit Zones',
              url: './edit-field.html?field=zones&type=textarea',
              height: 300
            });
          }
        });
      }
      
      // Zone Definition field
      if (values[4]) {
        badges.push({
          title: 'Zone Definition',
          text: values[4].length > 30 ? values[4].substring(0, 30) + '...' : values[4],
          callback: function(t) {
            return t.popup({
              title: 'Edit Zone Definition',
              url: './edit-field.html?field=zone-definition&type=textarea',
              height: 300
            });
          }
        });
      }
      
      // Add button to add new fields if none exist
      if (badges.length === 0) {
        badges.push({
          title: 'Custom Fields',
          text: 'Add Fields',
          callback: function(t) {
            return t.popup({
              title: 'Add Custom Fields',
              url: './add-fields.html',
              height: 400
            });
          }
        });
      }
      
      return badges;
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
