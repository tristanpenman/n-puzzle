# Plan

- Puzzle solvability check (**in-progress**)
- Convert all classes to ES2015 syntax (**in-progress**)
- Dark mode (**in-progress**)
- General improvements
  - Click initial and start states to open modals
  - Store last pair of states in local storage
  - Alternative vector renderer
- Automatic deployment
  - Hosted on github.io
  - GitHub actions
- ~~Fix jankiness while loading~~
- ~~Improve CSS~~
- ~~Check whether test suite still works~~

## Lint issue subtasks

- ~~`no-var` usage cleanup~~
- ~~`prefer-const` opportunities~~

## Other lint improvement ideas

- Add `eqeqeq` to avoid accidental coercion bugs
- Add `curly` to enforce explicit block bodies for control flow statements
- Add `no-implicit-globals` and `no-redeclare` to avoid hard-to-debug state leakage
- Add `default-case` for clearer `switch` behavior
- Add `no-shadow` to prevent accidental variable masking in nested scopes
