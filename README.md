# ioBroker.frontier_silicon

![Logo](admin/radio.png)

## ioBroker adapter for Frontier SmartRadio

[![NPM version](http://img.shields.io/npm/v/iobroker.frontier_silicon.svg)](https://www.npmjs.com/package/iobroker.frontier_silicon)
[![Downloads](https://img.shields.io/npm/dm/iobroker.frontier_silicon.svg)](https://www.npmjs.com/package/iobroker.frontier_silicon)
![Number of Installations (latest)](http://iobroker.live/badges/frontier_silicon-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/frontier_silicon-stable.svg)

**Tests:** ![Test and Release](https://github.com/iobroker-community-adapters/ioBroker.frontier_silicon/workflows/Test%20and%20Release/badge.svg)

[![NPM](https://nodei.co/npm/iobroker.frontier_silicon.svg?data=d,s)](https://www.npmjs.com/package/iobroker.frontier_silicon)

## Info

Provides support for media players, internet radios and SmartRadios equipped with a Frontier Silicon chipset using FSAPI.

NOTE: This adapter has been transferred to iobroker-community-adapters for maintenance. Thus planned features (see below) will not be implemented. Only important bug fixes and dependency updates will be released in the future. However PRs with bug fixes or feature enhancements are always welcome.

RELEASE NOTES:

Version 0.6.x includes a Breaking Change and a new navigation function:

- node>=20, js-controller>=7.0.7 and admin>=7.7.22 required  
Upgrade your ioBroker to at least this software level, if you want to use this adapter

- New Navigation functions  
 New button objects (up/down/select/back/home/search) allow to explore and navigate the file structure of the FSAPI device and to select playable items.  
 New state objects identify the current location within the file structure and list the items like directories or files and their properties at that location.  
 Together, buttons and item lists allow integration of the FSAPI adapter in media player widgets of ioBroker visualizations like VIS2 or iqontrol.

- New preset functions  
 New Button objects allow setting the currently playing radio station as a new preset. Also there are buttons to navigate the presets of the current mode up or down. These buttons can also be used to integrate preset navigation into a visualization media player widget.

## Features

### Implemented features

- Power control
- Mode selection
- Preset selection
- Notifications for several states
- Volume control
- Notifications
- Auto discovery
- Navigation

### Planned features

- More states
- Translations
- More Exception handling
- Cleaner code
- Multi room features

### Not planned features

- Changing system information

### Known Bugs and Limitations

- The Media player must be on for preset discovery
- Due to limitations of the FSAPI protocol, parallel operation with the UNDOK App is not reliable and thus not supported. Use at own risk.
- Due to limitations of the FSAPI protocol, Radio station icons are not available in DAB+ mode.

## Documentation

This adapter lets you control internet radios and media players based on Frontier Silicon chipsets. Many devices which can be controlled via [UNDOK](https://support.undok.net) should work. Tested devices come from [Revo](https://revo.co.uk/de/products/), [Sangean](https://www.sangean.eu/products/all_product.asp), [Hama](https://de.hama.com/produkte/audio-hifi/digitalradio) and [SilverCrest](https://www.lidl.de), others should work, too.

After installation the device's IP and PIN must be entered in the configuration dialog. If the radio does not play DAB after switching on via the UNDOK App or this adapter try again with "DAB starts without sound" enabled.

When the adapter starts for the first time it collects information about the device. For that it needs to switch through all modes. During checking settings the device will be muted for a few seconds to avoid disturbing sounds.

Documentation of the states and objects as well as general FSAPI documentation can be found at  
<https://github.com/iobroker-community-adapters/ioBroker.frontier_silicon/blob/master/docs/en>

## Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->
### **WORK IN PROGRESS**
- (copilot) Adapter requires node.js >= 22 now

- (pdbjjens) **New**: navigation functions (up/down/select/back/home/search) for all modes (#342)
- (pdbjjens) **New**: functions to set presets and to navigate presets up/down

### 0.5.1 (2026-03-07)

- (copilot) Adapter requires admin >= 7.7.22 now
- (pdbjjens) **Fixed**: update release-script (#348)
- (mcm1957) Dependencies have been updated
- (pdbjjens) Fix: Add GitHub as npm Trusted Publisher
- (pdbjjens) Change: Update dependencies

### 0.5.0 (2025-08-28) - 2025H2 maintenance release

- (pdbjjens) Change: node>=20, js-controller>=7.0.7 and admin>=7.6.17 required
- (oelison)  New: Read and write from daylight saving time
- (pdbjjens) Fix: UpdatePreset now handles empty presets correctly (#289)
- (pdbjjens) Change: Adapter and FSAPI documentation was moved to the docs folder (#281)
- (pdbjjens) Change: Cleanup devDependencies

### 0.4.0 (2025-02-01) - 2025H1 maintenance release

- (pdbjjens) Change: media state changed from number to string and readonly (#241)
- (pdbjjens) New: Added media control function "stop" (#241)
- (pdbjjens) New: Optimizations for responsive design (#244)
- (pdbjjens) Change: Migration to ESLint 9 (#253)
- (pdbjjens) Fix: Added button state acknowledgement
- (pdbjjens) Fix: Prevent warning on adapter stop

### 0.3.0 (2024-08-27) - 2024H2 maintenance release

- (pdbjjens) Change: node>=18, js-contoller>=5 and admin>=6 required
- (pdbjjens) Change: Removed .npmignore
- (pdbjjens) Change: Cyclic connection retry instead of disabling the adapter (#191)
- (pdbjjens) New: Updated dependencies
- (pdbjjens) Fix: Replace deprecated method "deleteChannel" by "delObject" (#224)

### 0.2.0 (2024-01-28)

- (pdbjjens) Change: Increase minor version number

[Older changelogs can be found there](CHANGELOG_OLD.md)

## Legal Notices

Frontier, Frontier Silicon, SmartRadio, UNDOK and associated logos are trademarks or registered trademarks of Frontier Smart Technologies Limited  [https://www.frontiersmart.com](https://www.frontiersmart.com)

All other trademarks are the property of their respective owners.

The authors are in no way endorsed by or affiliated with Frontier Smart Technologies Limited , or any associated subsidiaries, logos or trademarks.

## License

MIT License

Copyright (c) 2026 iobroker-community-adapters <iobroker-community-adapters@gmx.de>  
Copyright (c) 2025 halloamt <iobroker@halloserv.de> & IoBroker-Community

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
