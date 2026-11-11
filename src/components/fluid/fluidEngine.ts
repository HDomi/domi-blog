import { BRUSH, FLOW, PERF, SIM } from "./fluid.config";
import { createProgram, createTarget, deleteTarget, type Target } from "./gl";
import { DISPLAY_FRAG, SIM_FRAG, VERT } from "./shaders";

export type FluidOptions = {
  /** 정지 화면 한 장만 그린다. 루프·마우스 반응 없음. */
  reducedMotion: boolean;
  onFirstFrame?: () => void;
};

export type FluidHandle = {
  destroy: () => void;
};

/** 가우시안 반지름 항. 폭은 √R 에 비례한다. */
const SPLAT_RADIUS = BRUSH.baseRadius * BRUSH.widthRatio ** 2;

/**
 * WebGL2 유체 배경. 지원하지 않으면 null 을 반환한다 (호출 쪽은 CSS 대체 배경을 유지).
 *
 * 프레임마다: 저해상도 상태 패스 1번 (마우스 → 속도/변위), 그다음 낮춘 렌더 배율로
 * 화면 패스 1번을 그리고 CSS 로 늘려 보여준다.
 */
export function createFluid(canvas: HTMLCanvasElement, opts: FluidOptions): FluidHandle | null {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "default",
  });
  if (!gl) return null;
  // half-float 타깃에 렌더할 수 있어야 한다.
  if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return null;

  let sim: ReturnType<typeof createProgram>;
  let display: ReturnType<typeof createProgram>;
  try {
    sim = createProgram(gl, VERT, SIM_FRAG);
    display = createProgram(gl, VERT, DISPLAY_FRAG);
  } catch (e) {
    console.warn("[fluid]", e);
    return null;
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  let renderScale: number = PERF.baseRenderScale;
  let simW = 0;
  let simH = 0;
  let targets: [Target, Target] | null = null;
  let raf = 0;
  let running = false;
  let destroyed = false;
  let firstFrame = true;
  let time: number = FLOW.startTime;
  let last = 0;
  const frameTimes: number[] = [];

  // 마우스 위치 (uv, y 위쪽). 프레임 사이 이동량을 누적한다.
  const pointer = { x: 0.5, y: 0.5, dx: 0, dy: 0, moved: false, seen: false };

  /* ---------- 크기 ---------- */

  const freeTargets = () => {
    targets?.forEach((t) => deleteTarget(gl, t));
    targets = null;
  };

  const resize = () => {
    const cssW = Math.max(1, canvas.clientWidth);
    const cssH = Math.max(1, canvas.clientHeight);
    let scale = renderScale * Math.min(window.devicePixelRatio || 1, PERF.maxDpr);
    if (cssW * cssH * scale * scale > PERF.maxRenderPixels) scale = Math.sqrt(PERF.maxRenderPixels / (cssW * cssH));
    const w = Math.max(1, Math.round(cssW * scale));
    const h = Math.max(1, Math.round(cssH * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const k = PERF.simLongSide / Math.max(cssW, cssH);
    const sw = Math.max(8, Math.round(cssW * k));
    const sh = Math.max(8, Math.round(cssH * k));
    if (sw !== simW || sh !== simH || !targets) {
      freeTargets();
      simW = sw;
      simH = sh;
      targets = [createTarget(gl, sw, sh), createTarget(gl, sw, sh)];
    }
  };

  /* ---------- 패스 ---------- */

  const consumePointerForce = (dt: number): [number, number] => {
    let fx = 0;
    let fy = 0;
    if (pointer.moved && dt > 0) {
      fx = (pointer.dx / dt) * BRUSH.forceScale;
      fy = (pointer.dy / dt) * BRUSH.forceScale;
      const len = Math.hypot(fx, fy);
      if (len > BRUSH.maxForce) {
        fx *= BRUSH.maxForce / len;
        fy *= BRUSH.maxForce / len;
      }
    }
    pointer.dx = pointer.dy = 0;
    pointer.moved = false;
    return [fx, fy];
  };

  const step = (dt: number) => {
    if (!targets) return;
    const [src, dst] = targets;
    const frames = 60 * dt;
    const [fx, fy] = consumePointerForce(dt);

    gl.useProgram(sim.p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
    gl.viewport(0, 0, simW, simH);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, src.tex);
    gl.uniform1i(sim.u("uState"), 0);
    gl.uniform2f(sim.u("uTexel"), 1 / simW, 1 / simH);
    gl.uniform1f(sim.u("uDt"), dt);
    gl.uniform1f(sim.u("uVelDecay"), Math.pow(SIM.velDecayPer60, frames));
    gl.uniform1f(sim.u("uDispDecay"), Math.pow(SIM.dispDecayPer60, frames));
    gl.uniform2f(sim.u("uPoint"), pointer.x, pointer.y);
    gl.uniform2f(sim.u("uForce"), fx, fy);
    gl.uniform1f(sim.u("uRadius"), SPLAT_RADIUS);
    gl.uniform1f(sim.u("uAspect"), canvas.clientWidth / Math.max(1, canvas.clientHeight));
    gl.uniform1f(sim.u("uTime"), time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    targets = [dst, src];
  };

  const draw = () => {
    if (!targets) return;
    gl.useProgram(display.p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, targets[0].tex);
    gl.uniform1i(display.u("uState"), 0);
    gl.uniform1f(display.u("uTime"), time);
    gl.uniform2f(display.u("uRes"), canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (firstFrame) {
      firstFrame = false;
      opts.onFirstFrame?.();
    }
  };

  /** 자동 품질 조절: 프레임 시간 중간값이 느리면 렌더 배율을 낮춘다. */
  const adapt = (ms: number) => {
    if (renderScale <= PERF.minRenderScale) return;
    frameTimes.push(ms);
    if (frameTimes.length < PERF.sampleFrames) return;
    const sorted = [...frameTimes].sort((a, b) => a - b);
    frameTimes.length = 0;
    if (sorted[Math.floor(sorted.length / 2)] > PERF.slowFrameMs) {
      renderScale = Math.max(PERF.minRenderScale, renderScale * PERF.downscaleStep);
      resize();
    }
  };

  /* ---------- 루프 ---------- */

  const frame = (now: number) => {
    if (!running) return;
    const ms = last ? now - last : 1000 / 60;
    last = now;
    const dt = Math.min(ms / 1000, PERF.maxDt);
    time += dt;
    step(dt);
    draw();
    adapt(ms);
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || destroyed || opts.reducedMotion) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  /* ---------- 이벤트 ---------- */

  const onPointerMove = (e: PointerEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = 1 - e.clientY / window.innerHeight;
    // 첫 이벤트는 위치만 잡는다. 그래야 중앙에서 갑자기 튀어 들어오지 않는다.
    if (pointer.seen) {
      pointer.dx += x - pointer.x;
      pointer.dy += y - pointer.y;
      pointer.moved = true;
    }
    pointer.seen = true;
    pointer.x = x;
    pointer.y = y;
  };

  const onVisibility = () => (document.hidden ? stop() : start());

  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resize();
      if (!running) draw();
    }, PERF.resizeDebounceMs);
  });

  const onContextLost = (e: Event) => {
    e.preventDefault();
    stop();
  };

  /* ---------- 초기화 ---------- */

  resize();
  ro.observe(canvas);
  canvas.addEventListener("webglcontextlost", onContextLost);

  if (opts.reducedMotion) {
    draw();
  } else {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (!document.hidden) start();
  }

  return {
    destroy() {
      destroyed = true;
      stop();
      clearTimeout(resizeTimer);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      freeTargets();
      gl.deleteProgram(sim.p);
      gl.deleteProgram(display.p);
      gl.deleteVertexArray(vao);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
