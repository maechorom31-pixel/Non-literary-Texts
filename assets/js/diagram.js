/* =============================================================
   diagram.js - 도식 SVG 단계별 reveal 제어
   ============================================================= */

(function (root) {
  "use strict";

  const cache = new Map();

  async function loadSvgText(url) {
    if (cache.has(url)) return cache.get(url);
    let res;
    try {
      res = await fetch(url, { cache: "no-cache" });
    } catch (netErr) {
      // 네트워크 오류 (오프라인 등)
      const msg = "네트워크 연결을 확인해 주세요. (도식 로드 실패: " + url + ")";
      const err = new Error(msg);
      err.kind = "network";
      err.url = url;
      throw err;
    }
    if (!res.ok) {
      const msg = res.status === 404
        ? "도식 파일을 찾을 수 없습니다: " + url
        : "도식 로드 실패 (" + res.status + "): " + url;
      const err = new Error(msg);
      err.kind = "http";
      err.status = res.status;
      err.url = url;
      throw err;
    }
    const text = await res.text();
    if (!text || !text.trim().startsWith("<svg")) {
      const err = new Error("도식 형식이 올바르지 않습니다: " + url);
      err.kind = "format";
      err.url = url;
      throw err;
    }
    cache.set(url, text);
    return text;
  }

  /**
   * Inject inline SVG into the given container element.
   * Returns the inserted <svg> element.
   * 오류 시 사용자에게 보이는 메시지를 컨테이너에 표시.
   */
  async function inject(container, url) {
    try {
      const txt = await loadSvgText(url);
      container.innerHTML = txt;
      const svg = container.querySelector("svg");
      if (svg) {
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        // 앱이 단계별 reveal을 제어한다는 표시. SVG 단독 보기에서는 이 속성이 없으므로 모두 보임.
        svg.setAttribute("data-app", "1");
      }
      return svg;
    } catch (err) {
      // 사용자에게 보이는 오류 패널
      const safeMsg = (err && err.message ? err.message : "도식을 불러오지 못했습니다.")
        .replace(/[<>]/g, "");
      const isNet = err && err.kind === "network";
      container.innerHTML = `
        <div style="padding:32px 24px;text-align:center;color:#7a6f5f;background:#fbf2f4;border:1px solid #d8c0c4;border-radius:6px;font-family:'Pretendard',sans-serif;">
          <div style="font-size:16px;font-weight:700;color:#a83a4a;margin-bottom:8px;">⚠ 도식을 불러오지 못했어요</div>
          <div style="font-size:13px;line-height:1.6;color:#5e544a;margin-bottom:14px;">${safeMsg}</div>
          ${isNet ? '<div style="font-size:12px;color:#7a6f5f;">인터넷 연결을 확인하거나 잠시 후 다시 시도해 주세요.</div>' : ''}
          <button type="button" class="diagram-retry" style="margin-top:14px;padding:8px 16px;font:inherit;font-size:12.5px;border:1px solid #1a1612;background:transparent;cursor:pointer;border-radius:2px;letter-spacing:0.02em;">다시 시도</button>
        </div>
      `;
      const retry = container.querySelector(".diagram-retry");
      if (retry) {
        retry.addEventListener("click", () => {
          cache.delete(url);
          inject(container, url);
        });
      }
      throw err;
    }
  }

  /**
   * Show all reveal groups whose data-reveal-step <= step.
   * Other reveal groups are hidden by .reveal { opacity:0 } via SVG inline style.
   */
  function setRevealStep(svgRoot, step) {
    if (!svgRoot) return;
    const groups = svgRoot.querySelectorAll("[data-reveal-step]");
    groups.forEach(g => {
      const s = parseInt(g.getAttribute("data-reveal-step"), 10) || 0;
      if (s <= step) g.classList.add("on");
      else g.classList.remove("on");
    });
  }

  function reset(svgRoot) {
    setRevealStep(svgRoot, 0);
  }

  function bindLightbox(svgRoot, onZoom) {
    if (!svgRoot) return;
    svgRoot.style.cursor = "zoom-in";
    svgRoot.addEventListener("click", () => { if (onZoom) onZoom(); });
  }

  root.Diagram = { inject, setRevealStep, reset, bindLightbox };
})(window);
