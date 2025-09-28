# ioBroker Adapter Development with GitHub Copilot

**Version:** 0.4.0
**Template Source:** https://github.com/DrozmotiX/ioBroker-Copilot-Instructions

This file contains instructions and best practices for GitHub Copilot when working on ioBroker adapter development.

## Project Context

You are working on an ioBroker adapter. ioBroker is an integration platform for the Internet of Things, focused on building smart home and industrial IoT solutions. Adapters are plugins that connect ioBroker to external systems, devices, or services.

This specific adapter (frontier_silicon) provides support for media players equipped with a Frontier Silicon chipset using the FSAPI (Frontier Silicon API). The adapter connects to internet radios, DAB radios, and media players from manufacturers like Pure, Roberts, Revo, Hama, and many others that use Frontier Silicon technology. Key functionality includes controlling power state, volume, presets, media playback, and synchronization with the UNDOK mobile app.

Key technical aspects:
- Uses FSAPI protocol for device communication via HTTP/XML
- Implements session management and PIN authentication
- Handles long-polling for real-time state updates
- Manages device discovery and connection retry logic
- Synchronizes state changes with the UNDOK mobile application

## Testing

### Unit Testing
- Use Jest as the primary testing framework for ioBroker adapters
- Test files should be named `*.test.js` and located in appropriate directories
- Mock ioBroker adapter core functionality using `@iobroker/testing`
- Test both positive and negative scenarios for device communication
- Include tests for session handling, authentication, and error recovery

### Integration Testing
- Use the ioBroker testing framework from `@iobroker/testing`
- Test adapter startup, shutdown, and configuration validation
- Verify proper object tree creation and state management
- Test FSAPI protocol implementation and error handling
- Include tests for preset management and media control functions

## Code Style & Standards

### ESLint Configuration
- Follow the `@iobroker/eslint-config` rules
- Use ESLint 9+ configuration with `eslint.config.mjs`
- Address JSDoc warnings but don't let them block builds
- Maintain consistent code formatting with Prettier

### Documentation
- Use JSDoc comments for all functions and methods
- Document FSAPI-specific parameters and return values
- Include examples for complex device interaction patterns
- Document session management and authentication flows

## ioBroker-Specific Patterns

### Adapter Core
```javascript
const utils = require('@iobroker/adapter-core');
const adapter = utils.adapter('frontier_silicon');
```

### State Management
```javascript
// Create states with proper definitions
await this.setObjectNotExistsAsync('device.power', {
    type: 'state',
    common: {
        name: 'Power state',
        type: 'boolean',
        role: 'switch.power',
        read: true,
        write: true
    },
    native: {}
});

// Set states with acknowledgment
await this.setStateAsync('device.power', true, true);
```

### Configuration Access
```javascript
// Access adapter configuration
const deviceIP = this.config.ip;
const pin = this.config.pin;
```

### Logging
```javascript
// Use appropriate log levels
this.log.error('Connection failed');
this.log.warn('Retrying connection');
this.log.info('Device connected');
this.log.debug('Raw FSAPI response: ' + response);
```

## Frontend Development (Admin UI)

### JSON Config
- Use `jsonConfig.json` for configuration UI definition
- Implement proper validation for IP addresses and PIN codes
- Provide helpful descriptions and tooltips
- Use appropriate input types (text, number, checkbox, etc.)

### Multi-language Support
- Store translations in `admin/i18n/{lang}/translations.json`
- Use translation keys in the format `"adapter_name_key": "Translation"`
- Support major languages: en, de, ru, pt, nl, fr, it, es, pl, uk, zh-cn

## FSAPI-Specific Implementation

### Session Management
```javascript
// Initialize FSAPI session with PIN authentication
const sessionId = await this.createSession(pin);
await this.validateSession(sessionId);
```

### Device Communication
```javascript
// Example FSAPI request structure
const response = await this.fsapiRequest('netRemote.sys.power', 'GET');
const powerState = response.value[0].c8_array[0];
```

### Error Handling
```javascript
// Implement proper error handling for FSAPI calls
try {
    const result = await this.fsapiRequest(endpoint, method, value);
    return result;
} catch (error) {
    this.log.error(`FSAPI request failed: ${error.message}`);
    throw error;
}
```

## Common Anti-Patterns to Avoid

- Don't use `setState` without proper object definitions
- Avoid blocking the main thread with synchronous operations
- Don't ignore error handling in FSAPI communications
- Avoid hardcoded strings; use configuration or constants
- Don't forget to clean up timers and intervals in `unload()`

## Dependencies & Packages

### Core Dependencies
- `@iobroker/adapter-core`: Adapter base functionality
- `axios`: HTTP client for FSAPI communication
- `xml2js`: XML parsing for FSAPI responses

### Development Dependencies
- `@iobroker/testing`: Testing framework
- `@iobroker/eslint-config`: Code style rules
- `typescript`: Type checking support

## File Structure

```
/
├── .github/
│   ├── copilot-instructions.md (this file)
│   └── workflows/
├── admin/
│   ├── i18n/           # Translations
│   ├── jsonConfig.json # Admin UI configuration
│   └── *.png           # Icons
├── docs/               # Documentation
├── lib/                # Utility libraries
├── test/               # Test files
├── main.js            # Main adapter code
├── io-package.json    # Adapter metadata
└── package.json       # Node.js package definition
```

## Device-Specific Considerations

### Supported Devices
- Internet radios with Frontier Silicon chipsets
- DAB/DAB+ radios
- Network music players
- Smart speakers with FSAPI support

### Communication Protocol
- HTTP-based XML API (FSAPI)
- Session-based authentication with PIN codes
- Long-polling for real-time updates
- Multi-room audio synchronization support

### State Synchronization
- Bidirectional sync with UNDOK mobile app
- Handle concurrent state changes gracefully
- Implement connection retry with exponential backoff
- Manage preset selection and media metadata updates

## Performance Considerations

- Use connection pooling for FSAPI requests
- Implement proper timeout handling (default 10 seconds)
- Cache session tokens and renew as needed
- Avoid excessive polling; use long-polling when available
- Clean up resources properly in the unload() method

Remember: This adapter bridges ioBroker's object-oriented state system with the FSAPI protocol used by Frontier Silicon devices, requiring careful handling of session management, XML parsing, and real-time state synchronization.