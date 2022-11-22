window.addEventListener("DOMContentLoaded", () => {
  const app = new ProgressClock("#app");
});

class ProgressClock {
  constructor(qs) {
    this.el = document.querySelector(qs);
    this.time = 0;
    this.updateTimeout = null;
    this.ringTimeouts = [];
    this.update();
  }
  update() {
    this.time = new Date();

    if (this.el) {
      const sec = this.time.getSeconds();
      const m_progress = sec / 60;
      const units = [
        {
          label: "m",
          progress: m_progress,
        },
        {
          label: "mm",
          progress: m_progress,
        },
      ];

      // flush out the timeouts
      this.ringTimeouts.forEach((t) => {
        clearTimeout(t);
      });
      this.ringTimeouts = [];

      // update the display
      units.forEach((u) => {
        const ring = this.el.querySelector(`[data-ring="${u.label}"]`);

        if (ring) {
          const strokeDashArray = ring.getAttribute("stroke-dasharray");
          const fill360 = "progress-clock__ring-fill--360";

          if (strokeDashArray) {
            // calculate the stroke
            const circumference = +strokeDashArray.split(" ")[0];
            const strokeDashOffsetPct = 1 - u.progress;

            ring.setAttribute(
              "stroke-dashoffset",
              strokeDashOffsetPct * circumference
            );

            // add the fade-out transition, then remove it
            if (strokeDashOffsetPct === 1) {
              ring.classList.add(fill360);

              this.ringTimeouts.push(
                setTimeout(() => {
                  ring.classList.remove(fill360);
                }, 600)
              );
            }
          }
        }
      });
    }

    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(this.update.bind(this), 1e3);
  }
}
