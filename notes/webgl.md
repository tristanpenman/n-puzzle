# WebGL

Goal is to migrate the search-tree renderer from 2D canvas drawing to a WebGL-backed renderer that supports smooth, high-performance pan and zoom, while preserving existing behavior and visual style.

## Constraints (from existing implementation)

- Tree rendering is currently done in `tree-view.vue` using a single `<canvas>` and recursive per-node drawing calls.
- Positioning and edge layout are computed by `TreeLayout` and consumed at draw time.
- Node visuals are currently bitmap-font based via `PuzzleStateRenderer` (sprite atlas images + `drawImage`).
- Navigation is currently based on native scrollbars using a large fake content element (`viewport` + `fake`) and offsets derived from `scrollLeft`/`scrollTop`.

These details mean pan/zoom cannot be added cleanly by simply scaling the existing canvas drawing code; the interaction model and render pipeline should be separated first.

## Migration strategy

### Phase 0: Define rendering contract (no visual changes)

1. Introduce a renderer-agnostic interface, e.g. `TreeRenderer`, with methods like:
   - `initialize(canvasOrHost)`
   - `setViewport(width, height, dpr)`
   - `setCamera({x, y, zoom})`
   - `render(scene)`
   - `dispose()`
2. Add a scene-building step in `tree-view.vue` that converts model/layout into a plain render scene:
   - node instances: `{id, x, y, depth, heuristic, kind, tileData}`
   - edge instances: `{fromX, fromY, toX, toY}`
3. Keep existing Canvas2D implementation behind the same contract as a fallback renderer.

### Phase 1: Camera + interaction system

1. Replace scrollbar-based navigation with an explicit camera state:
   - world coordinates (layout space)
   - screen coordinates (canvas pixels)
   - transform matrix (pan + zoom)
2. Add interactions:
   - drag (pointer/mouse) to pan
   - wheel or pinch to zoom centered around cursor/focal point
   - optional keyboard reset (`fit`, `100%`)
3. Add clamped zoom range (e.g. `0.2x` to `4x`) and inertial smoothing only if needed.
4. Preserve existing initial framing behavior by implementing `fitToTreeBounds()`.

### Phase 2: WebGL renderer foundation

1. Add a `WebGLTreeRenderer` using WebGL2 if available, fallback to WebGL1.
2. Build a minimal shader pipeline:
   - line program for tree edges
   - quad/sprite program for node boxes and text glyphs
3. Port existing atlas textures (`font.png`, `tiny-font.png`) into WebGL textures.
4. Implement batching:
   - one dynamic buffer for edges
   - one instanced (or batched) buffer for node quads
5. Apply camera transform in shader uniforms (MVP matrix).

### Phase 3: Visual parity and quality pass

1. Match stroke widths and spacing behavior from Canvas2D renderer.
2. Handle pixel snapping strategy for crisp small glyph rendering:
   - nearest-neighbor sampling for bitmap fonts
   - optional snap node origins at specific zoom ranges
3. Verify label rendering for special values (`-`, `>=1k`, etc.).
4. Confirm color mappings by node kind are unchanged.

### Phase 4: Performance and scalability

1. Add culling using tree bounding boxes and camera frustum.
2. Avoid full scene rebuild on every frame:
   - rebuild buffers only when tree changes
   - update only camera uniforms during pan/zoom
3. Add performance instrumentation:
   - frame time, draw calls, node count, texture uploads
4. Test large trees and low-end GPUs.

## Risks

### Text/glyph clarity at variable zoom

- Bitmap fonts that look sharp at 1x may blur/shimmer when scaled.
- **Mitigation:** nearest filtering, controlled zoom steps, snap logic, and acceptance criteria for legibility.

### Coordinate drift and precision

- Deep trees + high pan offsets can expose float precision artifacts in shaders.
- **Mitigation:** keep camera-relative coordinates (rebasing), use 32-bit-safe ranges, and test large coordinate values.

### Input/event differences across devices

- Wheel delta differs by browser/OS; trackpads can produce high-frequency deltas.
- **Mitigation:** normalize wheel input, unify pointer events, and test mouse/trackpad/touch separately.

### WebGL context loss

- Browsers may lose GPU context during tab switches or memory pressure.
- **Mitigation:** subscribe to `webglcontextlost`/`webglcontextrestored` and rehydrate resources.

### Layout/render coupling

- Current recursion draws edges and nodes together; WebGL benefits from precomputed batches.
- **Mitigation:** strict scene extraction layer between layout and renderer.

### Memory pressure with large trees

- Naively buffering all primitives each frame can spike GC and VRAM use.
- **Mitigation:** persistent typed arrays, pooling, and incremental updates.

### Testing gaps
- Existing tests focus on algorithm/model behavior, not rendering parity.
- **Mitigation:** add snapshot/structural scene tests and manual parity checklist.

## Changes

### New modules

- `src/js/rendering/TreeSceneBuilder.js`
- `src/js/rendering/camera/Camera2D.js`
- `src/js/rendering/webgl/WebGLTreeRenderer.js`
- `src/js/rendering/canvas2d/CanvasTreeRenderer.js` (adapter around current logic)
- `src/js/rendering/shared/RenderTypes.js`

### Component changes

- `tree-view.vue` becomes orchestration-only:
  - model + layout update -> scene build
  - input events -> camera updates
  - animation loop / redraw scheduling

### Non-goals (first iteration)

- No change to tree layout algorithm.
- No switch to SDF/vector text initially.
- No 3D effects.

## Validation

1. Functional
   - Pan drag works in all directions.
   - Zoom centers on cursor and keeps focus stable.
   - `fitToTreeBounds()` frames full tree from any camera state.
2. Visual
   - Node box sizes, edge topology, and state text match current renderer at 1x.
3. Performance
   - Pan/zoom remains smooth with large trees (target FPS threshold to be defined).
4. Compatibility
   - Graceful fallback when WebGL unsupported/failed.
