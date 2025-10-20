# Older changes
## 0.1.2 (2024-01-26) - 2024 maintenance release

- (pdbjjens) Change: node>=16, js-contoller>=4 and admin>=5 required
- (pdbjjens) New: Optionally display PIN code and limit to 4 digits in config GUI
- (pdbjjens) Updated dependencies

## 0.1.1 (2023-07-26)

- (pdbjjens) Breaking Change: node>=14, js-contoller>=4 and admin>=5 required
- (pdbjjens) Breaking Change: PIN encryption and validity check of all parameters in config UI
- (pdbjjens) Breaking Change: Type of `frontier_silicon.X.modes.selectPreset` changed from "string" to  "number"
- (pdbjjens) Change: Validity check of all parameters in config UI
- (pdbjjens) Change: Re-establish session if network connection is lost
- (pdbjjens) New: Synchronization of power, volume and mute states with the UNDOK App

## 0.1.0 (2023-07-15)

- (pdbjjens) Breaking Changes: node>=14, js-contoller>=4 and admin>=5 required
- (pdbjjens) New: json config UI
- (pdbjjens) New: Re-establish session if network connection is lost
- (pdbjjens) New: Remove obsolete unit testing
- (pdbjjens) Fix: Prevent crashes if radio device is not reachable

## 0.0.11 (2023-03-30) 2023 maintenance release

- (pdbjjens) New: Transfer of adapter to community
- (pdbjjens) New: Updated dependencies
- (pdbjjens) New: Use adapter-dev instead of gulp translate
- (pdbjjens) Fix: Prevent js-controller >=3.2.x warnings regarding non-existent objects and typeErrors

## 0.0.10 (2020-11-29)

- Translations

## 0.0.9

- (halloamt) Selected preset can be read now. The adapter guesses a little but this seems to work.

- (halloamt) Nicer readme
- (halloamt) (Hopefully) more robust session handling.
- (halloamt) Long polling should work more reliably
- (halloamt) Sleep timers are cleared on `onUnload`

## 0.0.7 und 0.0.8

- (halloamt) Formal but neccessary stuff for ioBroker

## 0.0.6

- (halloamt) Nothing really, small stuff for npm

## 0.0.5

- (halloamt) Media state controls

- (halloamt) Bugfixes

## 0.0.4

- (halloamt) Media and volume control buttons

- (halloamt) Bugfixes

## 0.0.3

- (halloamt) Get notifications from the radio

- (halloamt) Change volume / mute

## 0.0.1

- (halloamt) initial release
- (halloamt) Change mode
- (halloamt) Select Preset
