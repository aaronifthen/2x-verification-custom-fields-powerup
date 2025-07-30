# Custom Fields Trello Power-Up

A Trello Power-Up that enhances the management of existing custom fields on your Trello boards, specifically designed for buffers, buffer approach, buffer definition, zones, and zone definitions.

## Features

- **Enhanced Field Management** - Better interface for editing existing custom fields
- **Field Type Support** - Works with text, dropdown/list, number, date, and checkbox fields
- **Comprehensive Logging** - Built-in observability for troubleshooting
- **Clean Interface** - LinkedIn/Claude.ai inspired design with readable fonts

## Prerequisites

**Important**: This Power-Up is designed to work with existing Trello custom fields. You must first:

1. Enable Trello's built-in "Custom Fields" Power-Up on your board
2. Create these 5 custom fields on your board:
   - **buffers** (Text field)
   - **buffer-approach** (List/Dropdown field)
   - **buffer-definition** (Text field) 
   - **zones** (Text field)
   - **zone-definition** (Text field)

## Configuration

### Field Name Mapping

In `js/client.js`, update the `FIELD_MAPPINGS` object to match your exact field names:

```javascript
const FIELD_MAPPINGS = {
  'buffers': 'buffers',                    // Change if your field name is different
  'buffer-approach': 'buffer-approach',    // Change if your field name is different
  'buffer-definition': 'buffer-definition', // Change if your field name is different
  'zones': 'zones',                        // Change if your field name is different
  'zone-definition': 'zone-definition'     // Change if your field name is different
};
```

### Buffer Approach Options

For the buffer-approach dropdown field, create these options in Trello's Custom Fields settings:
- property-center-to-property-center
- parcel-to-parcel
- natural-path
- other-approach
- not-applicable

## File Structure

```
trello-powerup/
├── index.html                    # Main Power-Up page
├── manifest.json                 # Power-Up configuration
├── style.css                    # Styling for all pages
├── edit-existing-field.html     # Edit existing custom fields
├── manage-existing-fields.html  # Field management interface
├── settings.html                # Power-Up settings
├── js/
│   └── client.js                # Main Power-Up logic
├── images/
│   ├── icon-light.svg           # Light theme icon (create this)
│   └── icon-dark.svg            # Dark theme icon (create this)
└── README.md                    # This file
```

## Setup Instructions

### 1. Create Custom Fields in Trello First

1. Go to your Trello board
2. Click "Power-Ups" in the board menu
3. Enable "Custom Fields" Power-Up
4. Create your 5 custom fields with the exact names listed above

### 2. Upload to GitHub Pages

1. Create a new GitHub repository (e.g., `trello-custom-fields-powerup`)
2. Upload all the files to your repository
3. Enable GitHub Pages in repository settings
4. Your Power-Up will be available at: `https://yourusername.github.io/your-repo-name/`

### 3. Add Power-Up to Trello

1. Go to your Trello board
2. Click "Power-Ups" in the board menu  
3. Click "Custom" at the bottom
4. Enter your GitHub Pages URL
5. Enable the Power-Up

## How It Works

- **Enhanced Display**: Shows custom field values as badges on cards with better formatting
- **Smart Editing**: Provides appropriate input types for each field (textarea for text fields, dropdown for list fields)
- **Field Management**: Central interface to view and manage all custom fields on a card
- **Real-time Updates**: Changes are immediately reflected in Trello's native custom fields
- **Comprehensive Logging**: All operations are logged to browser console for debugging

## Usage

### Viewing Fields
- Open any card with custom fields
- Custom field values appear as badges in the card details
- Click any badge to edit that field

### Editing Fields
- Click a field badge or use the "Manage Fields" button
- Edit the field value using the appropriate input type
- Click "Save" to update the field in Trello
- Use "Clear Field" to remove the value

### Managing Multiple Fields
- Click "Field Manager" → "Manage Fields" 
- View all custom fields on the board
- See which fields have values and which are empty
- Target fields (your 5 specific fields) are highlighted
- Click "Edit" or "Set Value" for any field

## Field Types Supported

- **Text Fields**: Large textarea for multi-line input (buffers, buffer-definition, zones, zone-definition)
- **List/Dropdown Fields**: Dropdown selection (buffer-approach)
- **Number Fields**: Numeric input with validation
- **Date Fields**: Date picker integration
- **Checkbox Fields**: Boolean true/false selection

## Troubleshooting

### Common Issues

1. **Fields Not Showing**: 
   - Verify custom fields exist on the board using Trello's Custom Fields Power-Up
   - Check field names match exactly in `FIELD_MAPPINGS`
   - Look at browser console for error messages

2. **Can't Save Values**:
   - Ensure you have edit permissions on the board
   - Check browser console for API errors
   - Verify the custom field type matches expected input

3. **Power-Up Not Loading**:
   - Confirm GitHub Pages is properly configured
   - Check all files are uploaded correctly
   - Verify manifest.json is valid JSON

### Debug Logging

Enable debug logging in settings to see detailed operation logs in browser console:
```
[Custom Fields Power-Up] Loading card badges
[Custom Fields Power-Up] Found custom fields: 5
[Custom Fields Power-Up] Generated badges: 6
```

## Customization

### Adding More Field Types

To support additional custom fields, update the `FIELD_MAPPINGS` object in `js/client.js`:

```javascript
const FIELD_MAPPINGS = {
  'buffers': 'buffers',
  'buffer-approach': 'buffer-approach',
  'buffer-definition': 'buffer-definition', 
  'zones': 'zones',
  'zone-definition': 'zone-definition',
  'new-field': 'your-new-field-name'  // Add new mappings here
};
```

### Styling Customization

The CSS uses a clean, readable design inspired by LinkedIn and Claude.ai. Key design elements:

- Light color theme with good contrast
- Medium to large fonts for readability
- Subtle shadows and hover effects
- Clear visual hierarchy
- Accessible color choices

## Advanced Features

### Observability
- All operations logged with timestamps
- Error tracking and reporting
- Performance monitoring of API calls
- User action tracking for analytics

### Data Integrity
- Validates field types before saving
- Handles edge cases (empty values, invalid data)
- Graceful error handling with user feedback
- Automatic refresh of field data

## API Integration

The Power-Up uses Trello's official Power-Up API:

- `t.card('customFieldItems')` - Get current field values
- `t.board('customFields')` - Get field definitions  
- `t.card('customFieldItems', value, fieldId)` - Update field values

## Security & Privacy

- No data stored outside of Trello
- All operations use Trello's secure API
- No external API calls or data transmission
- Respects Trello's permission model

## Contributing

To contribute improvements:

1. Fork the repository
2. Make your changes
3. Test thoroughly with different field types
4. Update documentation as needed
5. Submit a pull request

## License

This Power-Up is provided as-is for your use. Modify and distribute as needed for your organization.

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify Trello custom fields are properly configured
3. Review the troubleshooting section above
4. Check that all files are properly uploaded to GitHub Pages# Custom Fields Trello Power-Up

A Trello Power-Up that adds five custom fields to your cards for enhanced project management and organization.

## Features

- **Buffers** - Text area field for buffer information
- **Buffer Approach** - Dropdown field with predefined approach options
- **Buffer Definition** - Text area field for detailed buffer definitions  
- **Zones** - Text area field for zone information
- **Zone Definition** - Text area field for detailed zone definitions

## File Structure

```
trello-powerup/
├── index.html              # Main Power-Up page
├── manifest.json           # Power-Up configuration
├── style.css              # Styling for all pages
├── edit-field.html        # Field editing interface
├── add-fields.html        # Add new fields interface
├── settings.html          # Power-Up settings
├── js/
│   └── client.js          # Main Power-Up logic
├── images/
│   ├── icon-light.svg     # Light theme icon (create this)
│   └── icon-dark.svg      # Dark theme icon (create this)
└── README.md              # This file
```

## Setup Instructions

### 1. Upload to GitHub Pages

1. Create a new GitHub repository (e.g., `trello-custom-fields-powerup`)
2. Upload all the files to your repository
3. Enable GitHub Pages in repository settings
4. Your Power-Up will be available at: `https://yourusername.github.io/your-repo-name/`

### 2. Create Icons (Optional)

Create two simple SVG icons:

**images/icon-light.svg** (for light theme):
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#172b4d" stroke-width="2">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  <line x1="9" y1="9" x2="15" y2="9"/>
  <line x1="9" y1="15" x2="15" y2="15"/>
</svg>
```

**images/icon-dark.svg** (for dark theme):
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  <line x1="9" y1="9" x2="15" y2="9"/>
