# Implementation Plan: To-Do List Life Dashboard

## Overview

Implement a single-page client-side web application using plain HTML, CSS, and Vanilla JavaScript. The application consists of six loosely coupled modules wired together by a central `init()` function. All persistence is handled through a `StorageService` abstraction over `localStorage`. No build step, no bundler, no external libraries.

## Tasks

- [x] 1. Scaffold project structure and HTML skeleton
  - Create `index.html` at the project root with semantic HTML sections for each module: Greeting, Focus Timer, Task Manager, Quick Links, and a header with the theme toggle and name configurator
  - Add a `<link>` to `css/styles.css` and a `<script defer src="js/app.js">` in `<head>`
  - Add an empty inline `<script>` block in `<head>` (before the stylesheet link) as a placeholder for the FOUC-prevention snippet
  - Create `css/styles.css` as an empty file
  - Create `js/app.js` as an empty file with a `DOMContentLoaded` listener calling `init()`
  - _Requirements: 9.1, 9.3_

- [x] 2. Implement CSS custom properties and base theming
  - [x] 2.1 Define CSS custom properties for light and dark color palettes
    - Declare `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-border`, and `--color-error` on `:root` (light mode defaults)
    - Add `[data-theme="dark"]` selector overriding each custom property with dark palette values
    - Verify that text-to-background contrast is at least 4.5:1 for normal text and 3:1 for large text in both modes
    - _Requirements: 8.6_

  - [x] 2.2 Write base layout and responsive styles
    - Style the overall dashboard grid/flex layout so all sections are visible and non-overlapping at viewport widths from 320px to 2560px
    - Add media queries to reflow the layout at narrow viewports (≤ 480px)
    - Ensure no horizontal scrollbar appears and all interactive elements remain reachable at all supported widths
    - _Requirements: 10.3, 10.4_

  - [x] 2.3 Style each module section
    - Apply typography, spacing, and component-level styles for Greeting, Focus Timer, Task Manager, Quick Links, Theme toggle, and Name Configurator sections
    - Style the completed-task state: `text-decoration: line-through` and reduced `opacity`
    - Style inline error messages using `--color-error` so they are visually distinct
    - _Requirements: 5.7, 9.5_

- [x] 3. Implement StorageService
  - [x] 3.1 Implement `StorageService` module object in `js/app.js`
    - Define the `KEYS` constant object with all five keys: `tld_tasks`, `tld_name`, `tld_duration`, `tld_theme`, `tld_links`
    - Implement `isAvailable()`: write/read/delete a sentinel value in a `try/catch`; return `false` on any thrown error
    - Implement `get(key)`: call `localStorage.getItem(key)`, pass result through `JSON.parse` in a `try/catch`; return `null` on any failure
    - Implement `set(key, value)`: call `localStorage.setItem(key, JSON.stringify(value))` in a `try/catch`; return `true` on success, `false` on failure
    - Implement `remove(key)`: call `localStorage.removeItem(key)` in a `try/catch`; return `true` on success, `false` on failure
    - _Requirements: 6.7, 6.8_

  - [ ]* 3.2 Write property test for StorageService serialization round-trip (P16)
    - **Property 16: Storage serialization round-trip preserves task list structure**
    - **Validates: Requirements 5.11, 6.1**

  - [ ]* 3.3 Write property test for corrupted storage returning null (P17)
    - **Property 17: Corrupted or unparseable storage values return null**
    - **Validates: Requirements 6.7**

- [ ] 4. Implement FOUC-prevention inline script and ThemeController
  - [~] 4.1 Write the FOUC-prevention inline `<script>` in `<head>`
    - Place it before `<link rel="stylesheet">` so it executes before first paint
    - Read `localStorage.getItem('tld_theme')` synchronously, defaulting to `"light"` if absent or unparseable
    - Set `document.documentElement.setAttribute('data-theme', theme)` immediately
    - _Requirements: 8.3, 8.4, 8.5_

  - [-] 4.2 Implement `ThemeController` module object in `js/app.js`
    - Implement `_apply(theme)`: set `data-theme` on `<html>` and update the toggle control's visual state
    - Implement `toggle()`: read current theme from `document.documentElement.dataset.theme`, switch to opposite, call `StorageService.set(KEYS.THEME, newTheme)`, call `_apply(newTheme)` — all within a single synchronous call path so the switch completes within 100 ms
    - Implement `init()`: read saved theme from `StorageService`, call `_apply()`, and wire the toggle button's `click` event to `toggle()`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 4.3 Write property test for theme toggle involution (P21)
    - **Property 21: Theme toggle is an involution (toggling twice returns original theme)**
    - **Validates: Requirements 8.2, 6.4**

- [ ] 5. Implement GreetingModule
  - [~] 5.1 Implement pure helper functions in `GreetingModule`
    - Implement `formatTime(date)`: return zero-padded `HH:MM:SS` string from a `Date` object
    - Implement `formatDate(date)`: return `"DayName, DD MonthName YYYY"` string using English day/month name arrays
    - Implement `getGreetingForHour(hour)`: map integer hours 0–23 to one of four greeting strings per the requirements table
    - Implement `buildGreetingText(hour, name)`: combine greeting + optional name; truncate `name` to 30 characters if longer; return greeting-only if `name` is null, undefined, or empty
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

  - [ ]* 5.2 Write property test for time formatting (P1)
    - **Property 1: Time formatting always produces zero-padded HH:MM:SS**
    - **Validates: Requirements 1.1**

  - [ ]* 5.3 Write property test for date formatting (P2)
    - **Property 2: Date formatting always produces the correct "DayName, DD MonthName YYYY" string**
    - **Validates: Requirements 1.2**

  - [ ]* 5.4 Write property test for greeting-for-hour mapping (P3)
    - **Property 3: Every hour (0–23) maps to exactly one correct greeting**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**

  - [ ]* 5.5 Write property test for greeting text with name truncation (P4)
    - **Property 4: Greeting text correctly incorporates name with truncation**
    - **Validates: Requirements 1.7, 1.8, 1.9**

  - [~] 5.6 Implement `GreetingModule.init()` and `tick()`
    - Implement `tick()`: call `formatTime`, `formatDate`, `buildGreetingText` with `new Date()` and stored name, then update the relevant DOM elements
    - Implement `init()`: read saved name from `StorageService`, call `tick()` once immediately, then set a `setInterval` to call `tick()` every 1000 ms
    - _Requirements: 1.1, 1.2, 2.3_

- [ ] 6. Implement NameConfigurator
  - [~] 6.1 Implement `NameConfigurator` pure helper and module
    - Implement `isValidName(value)`: return `true` iff `value.length >= 1 && value.length <= 50`
    - Implement `saveName(value)`: validate with `isValidName`; on failure display inline error; on success call `StorageService.set(KEYS.NAME, value)` and call `GreetingModule.tick()` to refresh the greeting
    - Implement `clearName()`: call `StorageService.remove(KEYS.NAME)` and call `GreetingModule.tick()` to revert greeting to no-name form
    - Implement `init()`: read saved name from `StorageService`, populate the name input field, wire the save button's `click` and the clear button's `click` to `saveName` and `clearName` respectively; clear error on `input` event
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 6.2 Write property test for name validation (P5)
    - **Property 5: Name validation accepts exactly the range [1, 50] and rejects outside it**
    - **Validates: Requirements 2.5, 2.6**

  - [ ]* 6.3 Write property test for name persistence round-trip (P6)
    - **Property 6: Name persistence round-trip**
    - **Validates: Requirements 2.2, 6.2**

- [ ] 7. Checkpoint — Ensure StorageService, GreetingModule, and NameConfigurator pass all tests
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement FocusTimer
  - [~] 8.1 Implement `FocusTimer` state machine and pure helpers
    - Define `STATE` constant: `{ IDLE: 'idle', RUNNING: 'running', PAUSED: 'paused' }`
    - Implement `formatDisplay(totalSeconds)`: return zero-padded `MM:SS` string for any integer in [0, 7200]
    - Implement `isValidDuration(value)`: return `true` iff `value` is an integer and `1 <= value <= 120`
    - _Requirements: 3.1, 4.2, 4.3_

  - [ ]* 8.2 Write property test for timer display formatting (P7)
    - **Property 7: Timer display formatting always produces zero-padded MM:SS**
    - **Validates: Requirements 3.1**

  - [ ]* 8.3 Write property test for duration validation (P8)
    - **Property 8: Duration validation accepts exactly the range [1, 120] and rejects outside it**
    - **Validates: Requirements 4.2, 4.3**

  - [ ]* 8.4 Write property test for duration persistence round-trip (P9)
    - **Property 9: Duration persistence round-trip**
    - **Validates: Requirements 4.4, 6.3**

  - [~] 8.5 Implement `FocusTimer` start, stop, reset, and completion logic
    - Implement `start()`: if state is IDLE or PAUSED, start `setInterval` calling `_tick()` every 1000 ms, transition to RUNNING, update control states (disable Start, enable Stop)
    - Implement `stop()`: clear interval, transition to PAUSED, update control states (enable Start, disable Stop)
    - Implement `reset()`: clear interval, reset `remainingSeconds` to configured duration, transition to IDLE, update display and control states
    - Implement `_tick()`: decrement `remainingSeconds`; if it reaches 0, call `_onComplete()`
    - Implement `_onComplete()`: clear interval, transition to IDLE, call `formatDisplay(0)` to update display, show completion notification that persists for at least 3 seconds
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

  - [~] 8.6 Implement `FocusTimer.init()` and duration configuration
    - Implement `init()`: read saved duration from `StorageService` (default 25), set `remainingSeconds`, render display, wire Start/Stop/Reset button click events, wire the duration input's save button to validate and persist the new duration per Requirements 4.7 and 4.8
    - When saving a new duration while in IDLE state, update `remainingSeconds` and refresh the display within 1 second
    - When saving a new duration while RUNNING or PAUSED, store it for the next session without altering the current countdown
    - Show inline error when duration input is out of range; clear error on `input` event
    - _Requirements: 4.1, 4.4, 4.5, 4.6, 4.7, 4.8_

- [ ] 9. Implement TaskManager
  - [~] 9.1 Implement `TaskManager` pure helpers and CRUD operations
    - Implement `isValidTitle(title)`: return `true` iff `title.trim().length >= 1 && title.trim().length <= 200`
    - Implement `addTask(title)`: validate with `isValidTitle`; on failure show inline error; on success create a `Task` object `{ id: Date.now().toString(), title, completed: false, createdAt: Date.now() }`, push to in-memory array, call `StorageService.set`, call `_render()`
    - Implement `editTask(id, newTitle)`: validate new title; on failure show inline error on the edit input; on success update the matching task's `title` in the in-memory array, call `StorageService.set`, call `_render()`
    - Implement `toggleTask(id)`: flip `completed` on the matching task, call `StorageService.set`, call `_render()`
    - Implement `deleteTask(id)`: remove the matching task from the in-memory array, call `StorageService.set`, call `_render()`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.11_

  - [ ]* 9.2 Write property test for task title validation (P10)
    - **Property 10: Task title validation accepts exactly the range [1, 200] and rejects outside it**
    - **Validates: Requirements 5.2, 5.3, 5.6**

  - [ ]* 9.3 Write property test for addTask growing list by one (P11)
    - **Property 11: Adding a valid task grows the list by exactly one and the task is findable**
    - **Validates: Requirements 5.2**

  - [ ]* 9.4 Write property test for editTask preserving other tasks (P12)
    - **Property 12: Editing a task preserves all other tasks unchanged**
    - **Validates: Requirements 5.5**

  - [ ]* 9.5 Write property test for toggleTask idempotence (P13)
    - **Property 13: Toggling task completion twice restores the original state**
    - **Validates: Requirements 5.7**

  - [ ]* 9.6 Write property test for deleteTask removing exactly one task (P14)
    - **Property 14: Deleting a task removes exactly that task from the list**
    - **Validates: Requirements 5.8**

  - [~] 9.7 Implement `TaskManager._render()` and `init()`
    - Implement `_render()`: sort the in-memory task array by ascending `createdAt`, then build and replace the task list DOM — each task renders as a list item with: a checkbox/complete toggle, the title (or an inline edit input when in edit mode), an edit button, and a delete button; completed tasks receive `text-decoration: line-through` and reduced opacity via CSS class
    - Implement `init()`: read tasks from `StorageService`; if result is null or unparseable, set in-memory array to `[]` and show error notice; otherwise sort and call `_render()`; wire the add-task form's submit event to `addTask`; clear add-task error on `input` event
    - _Requirements: 5.9, 5.10_

  - [ ]* 9.8 Write property test for insertion-order rendering (P15)
    - **Property 15: Task list renders in ascending insertion order**
    - **Validates: Requirements 5.9**

- [ ] 10. Implement QuickLinks
  - [~] 10.1 Implement `QuickLinks` pure helpers and CRUD operations
    - Implement `isValidUrl(url)`: return `true` iff `url.trim().length > 0`, `url.length <= 2048`, and `url` starts with `"http://"` or `"https://"` (case-sensitive)
    - Implement `isValidLabel(label)`: return `true` iff `label.trim().length >= 1 && label.trim().length <= 50`
    - Implement `addLink(label, url)`: validate both fields; on failure show per-field inline errors; on success create `{ id: Date.now().toString(), label, url }`, push to in-memory array, call `StorageService.set`, call `_render()`
    - Implement `deleteLink(id)`: remove matching entry from in-memory array, call `StorageService.set`, call `_render()`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6_

  - [ ]* 10.2 Write property test for URL validation (P18)
    - **Property 18: Quick Links URL validation rejects non-http(s) URLs**
    - **Validates: Requirements 7.4**

  - [ ]* 10.3 Write property test for addLink growing list by one (P19)
    - **Property 19: Adding a Quick Link grows the list by exactly one and the link is findable**
    - **Validates: Requirements 7.2**

  - [ ]* 10.4 Write property test for deleteLink removing exactly one entry (P20)
    - **Property 20: Deleting a Quick Link removes exactly that entry from the list**
    - **Validates: Requirements 7.6**

  - [~] 10.5 Implement `QuickLinks._render()` and `init()`
    - Implement `_render()`: build and replace the links container DOM — each entry renders as an `<a>` button with `target="_blank"` and `rel="noopener noreferrer"` plus a delete button
    - Implement `init()`: read links from `StorageService`; if unavailable, set in-memory array to `[]` and show inline error notice; otherwise call `_render()`; wire the add-link form's submit event to `addLink`; clear field errors on `input` events
    - _Requirements: 7.5, 7.7, 7.8, 7.9_

- [ ] 11. Checkpoint — Ensure all module tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Wire all modules in `init()` and handle global Storage unavailability
  - [~] 12.1 Implement the top-level `init()` function
    - Call `StorageService.isAvailable()` first; if `false`, display a global banner at the top of the page indicating that persistence is unavailable, then proceed to initialise all modules (they will operate in-memory only)
    - Call each module's `init()` in order: `ThemeController`, `GreetingModule`, `NameConfigurator`, `FocusTimer`, `TaskManager`, `QuickLinks`
    - Bind the `DOMContentLoaded` event to `init()` at the bottom of `app.js`
    - _Requirements: 6.6, 9.6_

  - [~] 12.2 Implement the `StorageService.set` failure path in each module
    - In `TaskManager.addTask`, `editTask`, `toggleTask`, `deleteTask`: if `StorageService.set` returns `false`, retain the in-memory change and display an inline error banner ("Data could not be saved. Changes may be lost after reload.")
    - Apply the same error-banner pattern to `QuickLinks.addLink`, `deleteLink`, `NameConfigurator.saveName`, `FocusTimer` duration save, and `ThemeController.toggle`
    - _Requirements: 6.8_

- [ ] 13. Verify responsive layout and cross-browser compatibility
  - [~] 13.1 Audit and fix layout at 320px, 768px, 1280px, and 2560px viewport widths
    - Open `index.html` in a browser's DevTools responsive mode and confirm no overlapping elements, no clipped text, and no horizontal scrollbar at each breakpoint
    - Fix any CSS issues found
    - _Requirements: 10.3, 10.4_

  - [~] 13.2 Audit and fix API usage for cross-browser compatibility
    - Replace or polyfill any Web API calls not supported in the latest stable Chrome, Firefox, Edge, and Safari (e.g., prefer `Array.from` over spread where needed, avoid non-standard CSS)
    - Add a `try/catch` guard for any Web API that might be absent, showing an inline unavailability message per Requirement 9.6
    - _Requirements: 9.2, 10.1, 10.2, 9.6_

- [ ] 14. Final checkpoint — Ensure all tests pass and the app opens correctly in a browser
  - Ensure all automated tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- The design document's 21 Correctness Properties map 1:1 to property-based test sub-tasks; each is annotated with its property number and the requirement(s) it validates
- Property-based tests use **fast-check** (load via CDN in a test HTML harness, or `npm install fast-check --save-dev` for a local runner); each test runs a minimum of 100 iterations
- Checkpoints at Tasks 7, 11, and 14 ensure incremental validation before adding dependent modules
- The FOUC-prevention inline script (Task 4.1) must remain before the `<link rel="stylesheet">` tag to prevent a flash of the wrong theme on load

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "3.1"] },
    { "id": 2, "tasks": ["2.3", "3.2", "3.3", "4.1"] },
    { "id": 3, "tasks": ["4.2", "5.1"] },
    { "id": 4, "tasks": ["4.3", "5.2", "5.3", "5.4", "5.5", "5.6"] },
    { "id": 5, "tasks": ["6.1", "8.1"] },
    { "id": 6, "tasks": ["6.2", "6.3", "8.2", "8.3", "8.4", "8.5"] },
    { "id": 7, "tasks": ["8.6", "9.1"] },
    { "id": 8, "tasks": ["9.2", "9.3", "9.4", "9.5", "9.6", "9.7", "10.1"] },
    { "id": 9, "tasks": ["9.8", "10.2", "10.3", "10.4", "10.5"] },
    { "id": 10, "tasks": ["12.1"] },
    { "id": 11, "tasks": ["12.2"] },
    { "id": 12, "tasks": ["13.1", "13.2"] }
  ]
}
```
