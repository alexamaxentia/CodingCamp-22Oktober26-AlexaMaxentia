# Requirements Document

## Introduction

The To-Do List Life Dashboard is a client-side web application built with HTML, CSS, and Vanilla JavaScript. It provides a personal productivity dashboard that combines a live clock and greeting, a configurable Pomodoro focus timer, a persistent to-do list, quick-access website links, a light/dark mode toggle, and a customizable user name. All data is stored exclusively in the browser's Local Storage — no backend server is required. The app must work as a standalone web page or browser extension across all modern browsers.

## Glossary

- **Dashboard**: The single-page web application that hosts all features.
- **Greeting_Module**: The section that displays the current time, date, and a time-based greeting with the user's name.
- **Focus_Timer**: The Pomodoro-style countdown timer component.
- **Task_Manager**: The component responsible for adding, editing, completing, and deleting to-do tasks.
- **Quick_Links**: The component that stores and displays user-defined shortcut buttons to external websites.
- **Theme_Controller**: The component that manages light/dark color mode toggling.
- **Storage**: The browser's Local Storage API used to persist all user data client-side.
- **Task**: A single to-do item containing at minimum a title and a completion status.
- **Pomodoro_Duration**: The configurable countdown length (in minutes) for the Focus_Timer, defaulting to 25 minutes.
- **Quick_Link**: A user-defined record containing a label and a URL that opens in a new browser tab.

---

## Requirements

### Requirement 1: Live Greeting Display

**User Story:** As a user, I want to see the current time, date, and a personalized greeting when I open the dashboard, so that I feel welcomed and immediately oriented to the current moment.

#### Acceptance Criteria

1. WHEN each second elapses, THE Greeting_Module SHALL update the displayed time to reflect the current local time in 24-hour HH:MM:SS format.
2. THE Greeting_Module SHALL display the current date in "DayName, DD MonthName YYYY" format (e.g., "Monday, 22 October 2026"), derived from the device's local clock.
3. WHEN the device's current local time is between 05:00 and 11:59, THE Greeting_Module SHALL display the greeting "Good Morning".
4. WHEN the device's current local time is between 12:00 and 17:59, THE Greeting_Module SHALL display the greeting "Good Afternoon".
5. WHEN the device's current local time is between 18:00 and 21:59, THE Greeting_Module SHALL display the greeting "Good Evening".
6. WHEN the device's current local time is between 22:00 and 04:59, THE Greeting_Module SHALL display the greeting "Good Night".
7. WHEN a custom name of 1 to 30 characters has been saved, THE Greeting_Module SHALL display the greeting followed by a comma and the custom name (e.g., "Good Morning, Alex").
8. WHEN no custom name has been saved, THE Greeting_Module SHALL display the greeting without a name suffix.
9. IF a saved custom name exceeds 30 characters, THEN THE Greeting_Module SHALL truncate the displayed name to the first 30 characters.

---

### Requirement 2: Custom Name Configuration

**User Story:** As a user, I want to set my own name in the greeting, so that the dashboard feels personalized to me.

#### Acceptance Criteria

1. THE Dashboard SHALL provide an input field for the user to enter a custom name.
2. WHEN the user submits a custom name, THE Storage SHALL save the name under a designated key.
3. WHEN the Dashboard loads, THE Greeting_Module SHALL read the saved name from Storage and display it in the greeting.
4. WHEN the user clears or resets the custom name, THE Greeting_Module SHALL revert to displaying the greeting without a name suffix.
5. THE Dashboard SHALL only accept a custom name between 1 and 50 characters in length, inclusive.
6. IF the user submits a custom name that is 0 characters or exceeds 50 characters in length, THEN THE Dashboard SHALL reject the submission and display an error message indicating the valid character range, leaving the previously saved name unchanged.

---

### Requirement 3: Focus Timer (Pomodoro)

**User Story:** As a user, I want a countdown focus timer with start, stop, and reset controls, so that I can manage focused work sessions using the Pomodoro technique.

#### Acceptance Criteria

1. THE Focus_Timer SHALL display the remaining time in MM:SS format.
2. WHILE the Focus_Timer is in the idle state, THE Focus_Timer SHALL display 25:00 as the initial countdown value.
3. WHEN the user activates the Start control, THE Focus_Timer SHALL begin counting down one second at a time.
4. WHILE the Focus_Timer is running, WHEN the user activates the Stop control, THE Focus_Timer SHALL pause the countdown and retain the remaining time.
5. WHILE the Focus_Timer is paused, WHEN the user activates the Start control, THE Focus_Timer SHALL resume the countdown from the retained remaining time.
6. WHEN the user activates the Reset control, THE Focus_Timer SHALL stop the countdown and reset the display to 25:00.
7. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and display a completion message that remains visible until the user dismisses it or for a minimum of 3 seconds, whichever is longer.
8. IF the Focus_Timer is in the running state, THEN THE Focus_Timer SHALL disable the Start control.
9. IF the Focus_Timer is not in the running state, THEN THE Focus_Timer SHALL disable the Stop control.

---

### Requirement 4: Configurable Pomodoro Duration

**User Story:** As a user, I want to change the default focus timer duration, so that I can adapt the timer to my preferred work-session length.

#### Acceptance Criteria

1. THE Dashboard SHALL provide an input field for the user to enter a Pomodoro_Duration value in whole minutes.
2. THE Dashboard SHALL accept Pomodoro_Duration values between 1 and 120 minutes (inclusive).
3. IF the user enters a Pomodoro_Duration value outside the range of 1 to 120, THEN THE Focus_Timer SHALL reject the value and display an inline error message indicating that the valid range is 1 to 120 minutes.
4. WHEN the user saves a valid Pomodoro_Duration, THE Storage SHALL persist the value under a designated key.
5. WHEN the Dashboard loads, THE Focus_Timer SHALL read the saved Pomodoro_Duration from Storage and use it as the initial countdown value.
6. WHEN no Pomodoro_Duration has been saved, THE Focus_Timer SHALL default to 25 minutes.
7. WHEN a new Pomodoro_Duration is saved while the Focus_Timer is in a stopped or reset state (countdown not in progress), THE Focus_Timer SHALL update its displayed countdown value to the new Pomodoro_Duration within 1 second.
8. WHEN a new Pomodoro_Duration is saved while the Focus_Timer is running or paused, THE Focus_Timer SHALL apply the new Pomodoro_Duration as the initial value for the next session without altering the current countdown in progress.

---

### Requirement 5: To-Do Task Management

**User Story:** As a user, I want to add, edit, complete, and delete tasks in a to-do list, so that I can track and manage my daily activities.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide an input field and a submit control for adding a new Task.
2. WHEN the user submits a non-empty task title of 1 to 200 characters, THE Task_Manager SHALL add the Task to the list and display it immediately.
3. IF the user submits an empty task title or a task title exceeding 200 characters, THEN THE Task_Manager SHALL reject the submission and display an inline error message indicating the validation rule that was violated.
4. WHEN the user activates the edit control on a Task, THE Task_Manager SHALL render the task title as an editable field pre-filled with the current title and accepting up to 200 characters.
5. WHEN the user saves an edited task title of 1 to 200 characters, THE Task_Manager SHALL update the Task title in the list and in Storage.
6. IF the user saves an edited task title that is empty or exceeds 200 characters, THEN THE Task_Manager SHALL reject the save and display an inline error message indicating the validation rule that was violated.
7. WHEN the user activates the complete control on a Task, THE Task_Manager SHALL toggle the Task's completion status and visually distinguish completed tasks with strikethrough text and reduced opacity compared to incomplete tasks.
8. WHEN the user activates the delete control on a Task, THE Task_Manager SHALL remove the Task from the list and from Storage.
9. WHEN the Dashboard loads and Storage is available, THE Task_Manager SHALL read all saved Tasks from Storage and render them in insertion order (oldest-added first).
10. IF the Dashboard loads and Storage is unavailable or its contents cannot be parsed, THEN THE Task_Manager SHALL display an empty task list and show an error message indicating that saved tasks could not be loaded.
11. WHEN any Task is added, edited, completed, or deleted, THE Storage SHALL be updated before the next user interaction is processed to reflect the current task list.

---

### Requirement 6: Data Persistence via Local Storage

**User Story:** As a user, I want my tasks, timer settings, name, quick links, and theme preference to be saved automatically, so that my data is still available after closing and reopening the browser.

#### Acceptance Criteria

1. WHEN the Task list changes, THE Storage SHALL persist the Task list, including each task's title, completion status, and priority, under a consistent, module-specific key.
2. WHEN the custom name is updated, THE Storage SHALL persist the new name value under a consistent, module-specific key.
3. WHEN the Pomodoro_Duration is updated, THE Storage SHALL persist the new Pomodoro_Duration value under a consistent, module-specific key.
4. WHEN the active theme changes, THE Storage SHALL persist the active theme value (light or dark) under a consistent, module-specific key.
5. WHEN the Quick_Links list changes, THE Storage SHALL persist the Quick_Links list, including each entry's label and URL, under a consistent, module-specific key.
6. WHEN the Dashboard loads, THE Dashboard SHALL read all module-specific keys from Storage and restore the last saved state for each module, such that each module's UI reflects the loaded data before any user interaction.
7. IF a Storage read returns null, an empty value, or a value that cannot be parsed as the expected data type for that module, THEN THE Dashboard SHALL initialise that module with its default value as specified in the project's requirements documentation.
8. IF a Storage write operation fails for any reason, THEN THE Dashboard SHALL retain the current in-memory state and display an error message indicating that the data could not be saved.

---

### Requirement 7: Quick Links

**User Story:** As a user, I want to save and access shortcut buttons to my favorite websites, so that I can open them quickly from the dashboard.

#### Acceptance Criteria

1. THE Quick_Links component SHALL provide input fields for a link label (maximum 50 characters) and a URL (maximum 2048 characters), and a submit control for adding a new Quick_Link.
2. WHEN the user submits a Quick_Link with a non-empty label and a valid URL, THE Quick_Links component SHALL add the Quick_Link to the list and render it as a clickable button.
3. IF the user submits a Quick_Link where the label or URL is empty or contains only whitespace characters, THEN THE Quick_Links component SHALL reject the submission and display an inline error message indicating which field is invalid.
4. IF the user submits a URL that does not begin with "http://" or "https://", THEN THE Quick_Links component SHALL reject the submission and display an inline error message indicating the URL format requirement.
5. WHEN the user activates a Quick_Link button, THE Dashboard SHALL open the associated URL in a new browser tab.
6. WHEN the user activates the delete control on a Quick_Link, THE Quick_Links component SHALL remove the Quick_Link from the list and from Storage.
7. WHEN the Dashboard loads, THE Quick_Links component SHALL read all saved Quick_Links from Storage and render them as clickable buttons.
8. IF Storage is unavailable when the Dashboard loads, THEN THE Quick_Links component SHALL render an empty list and display an inline error message indicating that saved links could not be loaded.
9. IF Storage is unavailable when the user adds or deletes a Quick_Link, THEN THE Quick_Links component SHALL reject the operation and display an inline error message indicating that the change could not be saved.

---

### Requirement 8: Light / Dark Mode

**User Story:** As a user, I want to toggle between light and dark color themes, so that I can choose the visual style that is most comfortable for me.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a single toggle control for switching between light mode and dark mode.
2. WHEN the user activates the theme toggle, THE Theme_Controller SHALL switch the active theme to the opposite mode, save the new theme preference to Storage, and apply it to the entire Dashboard within 100 milliseconds.
3. WHEN the Dashboard loads, THE Theme_Controller SHALL read the saved theme from Storage and apply it before any content is rendered.
4. IF no theme has been saved, THEN THE Theme_Controller SHALL apply light mode as the default theme.
5. IF Storage is unavailable when the Dashboard loads, THEN THE Theme_Controller SHALL apply light mode as the default theme.
6. THE Dashboard SHALL apply color schemes for light mode and dark mode such that the background color is distinct between modes and text-to-background contrast meets a minimum ratio of 4.5:1 for normal text and 3:1 for large text in both modes.

---

### Requirement 9: Single-File Structure and Code Quality

**User Story:** As a developer, I want the project to follow a strict single-file-per-type structure and clean code standards, so that the codebase remains easy to maintain and extend.

#### Acceptance Criteria

1. THE Dashboard SHALL be built using exactly one HTML file, one CSS file located inside the `css/` directory, and one JavaScript file located inside the `js/` directory.
2. THE Dashboard SHALL not depend on any external JavaScript frameworks or libraries (React, Vue, Angular, jQuery, etc.).
3. THE Dashboard SHALL not require a backend server or build step to run; opening the HTML file directly in a browser SHALL fully initialize the application.
4. WHEN the Dashboard is opened in a browser with no network throttling, THE Dashboard SHALL load and display all initial content within 2 seconds, where "initial content" means all structural elements, default task list entries, and UI controls are visible and interactive.
5. WHILE the user interacts with any Dashboard control, THE Dashboard SHALL reflect the interaction result within 100 milliseconds, where "interaction result" means the visible DOM state change (e.g., task added to list, checkbox checked, item deleted) that directly corresponds to the user's action.
6. IF the browser does not support a Web API used by the Dashboard (e.g., localStorage), THEN THE Dashboard SHALL display an inline message indicating that the feature requiring that API is unavailable, without preventing the rest of the Dashboard from rendering.

---

### Requirement 10: Browser Compatibility

**User Story:** As a user, I want the dashboard to work correctly across all major modern browsers, so that I can use it regardless of my preferred browser.

#### Acceptance Criteria

1. THE Dashboard SHALL load all pages, render all visible UI components, and allow all interactive elements (buttons, inputs, checkboxes, dropdowns) to respond to user input in the latest stable releases of Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari.
2. THE Dashboard SHALL use only Web APIs and JavaScript features that are supported in the browsers listed in Acceptance Criterion 1.
3. THE Dashboard SHALL render all content without overlapping elements, clipped text, or a horizontal scrollbar on viewport widths between 320px and 2560px.
4. WHEN the viewport width changes between 320px and 2560px, THE Dashboard SHALL keep all interactive elements reachable and operable without horizontal scrolling.
