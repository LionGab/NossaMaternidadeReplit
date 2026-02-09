/**
 * Boot Logger - Tracks app boot sequence for crash reporting
 *
 * Records breadcrumbs at each stage:
 * configure → customerInfo → splash → navigation → ready
 *
 * Use for debugging TestFlight hangs and slow startup
 */

interface BootBreadcrumb {
  stage: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

class BootLogger {
  private breadcrumbs: BootBreadcrumb[] = [];
  private stageStartTimes: Record<string, number> = {};

  /**
   * Record a boot stage
   */
  record(stage: string, metadata?: Record<string, unknown>): void {
    const timestamp = Date.now();
    const prevStage = this.breadcrumbs[this.breadcrumbs.length - 1];
    const duration = prevStage ? timestamp - prevStage.timestamp : 0;

    this.breadcrumbs.push({
      stage,
      timestamp,
      duration: duration > 0 ? duration : undefined,
      metadata,
    });
  }

  /**
   * Mark stage start for later duration tracking
   */
  markStageStart(stage: string): void {
    this.stageStartTimes[stage] = Date.now();
  }

  /**
   * Mark stage end and calculate duration
   */
  markStageEnd(stage: string, metadata?: Record<string, unknown>): void {
    const startTime = this.stageStartTimes[stage];
    if (!startTime) {
      this.record(`${stage}_end`, metadata);
      return;
    }

    const duration = Date.now() - startTime;
    this.record(`${stage}_end`, {
      ...metadata,
      stageDuration: duration,
    });
    delete this.stageStartTimes[stage];
  }

  /**
   * Get all breadcrumbs
   */
  getBreadcrumbs(): BootBreadcrumb[] {
    return [...this.breadcrumbs];
  }

  /**
   * Export for crash reporting
   * Format: stage | duration | metadata (JSON)
   */
  exportForCrashReport(): string {
    const lines = this.breadcrumbs.map((crumb) => {
      const parts = [`[${crumb.timestamp}]`, crumb.stage];

      if (crumb.duration) {
        parts.push(`+${crumb.duration}ms`);
      }

      if (crumb.metadata && Object.keys(crumb.metadata).length > 0) {
        parts.push(JSON.stringify(crumb.metadata));
      }

      return parts.join(" ");
    });

    return lines.join("\n");
  }

  /**
   * Get total boot time (from first breadcrumb to last)
   */
  getTotalBootTime(): number {
    if (this.breadcrumbs.length < 2) {
      return 0;
    }

    const first = this.breadcrumbs[0];
    const last = this.breadcrumbs[this.breadcrumbs.length - 1];

    return last.timestamp - first.timestamp;
  }

  /**
   * Get slowest stage
   */
  getSlowestStage(): { stage: string; duration: number } | null {
    let slowest: { stage: string; duration: number } | null = null;

    for (const crumb of this.breadcrumbs) {
      if (crumb.duration && (!slowest || crumb.duration > slowest.duration)) {
        slowest = { stage: crumb.stage, duration: crumb.duration };
      }
    }

    return slowest;
  }

  /**
   * Reset breadcrumbs (useful for testing)
   */
  reset(): void {
    this.breadcrumbs = [];
    this.stageStartTimes = {};
  }
}

export const bootLogger = new BootLogger();
