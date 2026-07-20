# JavaScript

These conventions provide sensible defaults for JavaScript projects. Follow the existing code, formatter, linter, and framework conventions when they differ.

## Core Guidelines

### Code Style

- Let the project's formatter define whitespace, quotes, semicolons, and line wrapping. When no formatter exists, prefer two-space indentation and follow nearby code.
- Use `const` by default, `let` when reassignment is necessary, and avoid `var`.
- Prefer strict equality (`===` and `!==`).
- Choose clear, domain-specific names.
- Keep functions focused and make side effects apparent.
- Prefer early returns over deeply nested conditionals.
- Throw `Error` objects rather than strings.
- Avoid mutable global state.
- Comment on intent or non-obvious constraints, not straightforward code.

### Data and Asynchronous Code

- Avoid mutating inputs unless mutation is part of the documented API.
- Do not store values that can be derived cheaply from existing state.
- Prefer `async` and `await`, and handle failures where they can be recovered from or presented meaningfully.
- Run independent asynchronous work concurrently.
- Protect against cancelled operations and stale asynchronous results where relevant.
- Validate data at system boundaries.

### Browser and UI Code

- Keep rendering declarative and move complex logic into named functions, computed values, or selectors.
- Use semantic HTML and accessible controls.
- Use stable domain identifiers as list keys. Use array indexes only for static lists.
- Keep state close to its owner and share it only when multiple consumers need the same source of truth.
- Keep business logic independent of the UI framework where practical.

### Example

```js
export async function loadActiveUsers(userIds, client) {
  if (!Array.isArray(userIds)) {
    throw new TypeError('userIds must be an array');
  }

  const uniqueUserIds = [...new Set(userIds)];

  try {
    const users = await Promise.all(
      uniqueUserIds.map((userId) => client.getUser(userId)),
    );

    return users.filter((user) => user.isActive);
  } catch (error) {
    throw new Error('Unable to load users', { cause: error });
  }
}
```

## Integrations

### Vue.js

- Use single-file components when they are established by the project, ordered as `<template>`, `<script>`, then `<style>`.
- Follow the API style already used by the project. Prefer the Composition API for new applications and reusable composables; retain the Options API where consistency is more valuable.
- Use props for data flowing in and events for actions flowing out. Do not mutate props.
- Keep transient state local. Lift shared state to a common owner or an established store.
- Use computed properties for derived values and watchers for side effects or synchronisation.
- Extract composables for reusable stateful Vue logic. Keep pure helpers as ordinary functions.
- Keep templates declarative and use stable `:key` values with `v-for`.
- Keep component styles scoped or local when appropriate, and place shared styles in the project's established location.

### React

- Prefer focused function components and treat rendering as a pure calculation.
- Keep state local by default. Lift it to the nearest common owner when components need to coordinate.
- Use props for ordinary parent-child data flow and context for values needed across a broad subtree.
- Avoid duplicating props or derived values in state.

#### Hooks

- Use Hooks when a component needs React features such as state, context, refs, or synchronisation with an external system.
- Create a custom Hook when reusable logic depends on other Hooks.
- Use an ordinary function for calculations, formatting, validation, and other logic that does not need React.
- Handle user actions in event handlers. Use Effects to synchronise with external systems, not to derive render data or mirror props into state.
- Keep Effects focused, declare their dependencies, and clean up subscriptions and resources.
- Call Hooks only at the top level of function components or custom Hooks. Enable the React Hooks lint rules.
- Use refs for persistent values that do not drive rendering or for imperative access to an API.
- Use memoisation for demonstrated performance or identity needs, not by default.

#### State Management

- Start with component state and lifted state. Use `useReducer` for related transitions that benefit from an explicit reducer.
- Consider an external store when state is shared across distant components, changes frequently, has substantial actions, or must be accessed outside React.
- Zustand is a good lightweight option for shared client state. Follow an existing state solution instead of adding another without a clear boundary.
- Keep Zustand stores focused, expose domain actions, and use narrow selectors to avoid unnecessary rerenders.
- Keep local form state, derived values, and server cache data out of the store unless there is a specific reason to include them.
- Define store lifetime, initialisation, persistence, and hydration explicitly in server-rendered applications.

#### Components and JSX

- Keep JSX declarative and move complex conditions into named values or child components.
- Use explicit event handlers for multi-step behaviour.
- Use controlled inputs when React must coordinate their values; otherwise consider uncontrolled inputs.
- Use stable keys and do not generate them during render.
- Provide deliberate loading, empty, and error states for asynchronous screens.

## Tooling

### Project and Tooling Choices

- Prefer ES modules for new projects.
- Introduce TypeScript, frameworks, state management, or other major dependencies only when the project benefits from them.
- Keep dependencies purposeful and commit the package-manager lockfile.
- Run the relevant formatter, linter, tests, and build before submitting changes.

### CSS Conventions

- Follow the project's existing styling approach.
- Keep component-specific styles local and reuse shared design tokens.
- Prefer flexible layouts and respect relevant user preferences such as reduced motion.

## Testing

- Use the project's test runner and conventions.
- Test observable behaviour rather than implementation details.
- Unit test pure logic and state transitions; use component or integration tests for user interactions and framework wiring.
- Cover important success, failure, empty, and boundary cases.
- Keep tests deterministic.
