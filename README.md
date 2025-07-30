# Custom Fields Trello Power-Up

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
