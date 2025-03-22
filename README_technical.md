# National Trust Weather Widget

## Overview

This project adds real-time weather forecasts to National Trust property pages, enhancing visitor experience by providing crucial planning information without modifying the site's core structure. The solution uses a single JavaScript file that can be injected into any National Trust property page.

## Features

- **Automated Location Detection**: Extracts property coordinates directly from the page's Google Maps component
- **Weather Forecast Display**: Shows 5-day weather forecast with temperature, conditions, wind, and precipitation
- **Seamless Integration**: Matches National Trust's design language with accordion-style components
- **A/B Testing**: Built-in testing framework to measure impact on visitor engagement
- **Responsive Design**: Works across desktop and mobile devices
- **Error Handling**: Graceful fallbacks when data can't be retrieved

## Implementation Details

### Technical Architecture

The solution consists of a single JavaScript file with several core functions:

1. **`lonlatRetriever()`**: Extracts latitude and longitude from the property's Google Maps element
2. **`weather_fetch()`**: Calls the weather API with the property's coordinates
3. **`createWeatherDiv()`**: Generates the weather widget with National Trust styling
4. **`getABTestGroup()`**: Manages A/B testing by assigning visitors to test groups

Individual functions were developed using TDD to ensure immediate debugging and edge case handling.

### Weather Data

Weather information is retrieved from a mock endpoint that simulates the OpenWeatherMap API:

```
https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-endpoint/forecast?appid=a2ef86c41a&lat=[latitude]&lon=[longitude]
```

### A/B Testing Approach

The script implements a cookie-based A/B testing system:

- Users are randomly assigned to group A (control) or B (weather widget)
- Assignment persists for 30 days via cookies
- This allows measurement of the feature's impact on visitor conversion rates

## Setup Instructions

### For Developers

1. Copy the script to the National Trust site using Chrome DevTools or inject it via tag manager
2. No external dependencies required - everything is contained in one file
3. Script automatically finds coordinates and renders the widget

### For National Trust Team

The script can be deployed by:

1. Adding a script tag to property pages: `<script src="collated_script.js"></script>`
2. Integrating with your tag management system
3. No server-side changes required

## User Experience

When visitors load a National Trust property page, they'll see:

- A new "Weather Forecast" accordion section next to other property information
- Forecast data showing conditions for the next week
- Easy-to-understand weather icons and temperature information
- Wind direction and precipitation details to help plan their visit

---
