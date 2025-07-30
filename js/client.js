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

// Debug: Log what we're about to initialize
const capabilities = {
  'card-detail-badges': function(t, options) {
    console.log('[Custom Fields] card-detail-badges called');
    console.log('[Custom Fields] Context:', options);
    
    // Simple test badge first
    return Promise.resolve([
      {
        title: 'Test',
        text: 'Working',
        color: 'green'
      }
    ]);
  }
};

console.log('[Custom Fields] Initializing with capabilities:', Object.keys(capabilities));

// Initialize the Power-Up
TrelloPowerUp.initialize(capabilities);

console.log('[Custom Fields] Power-Up initialization complete');
