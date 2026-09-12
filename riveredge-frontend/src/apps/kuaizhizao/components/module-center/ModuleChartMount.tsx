import React, { useEffect, useRef, useState } from 'react';

export type ModuleChartMountDims = {
  width: number;
  height: number;
};

export type ModuleChartMountProps = {
  height: number;
  children: (dims: ModuleChartMountDims) => React.ReactNode;
};

/**
 * 模块中心图表挂载器：等容器有稳定宽度后再渲染。
 * 瀑布流（flex 双列）下 Pie/Column 易在首帧量到错误宽度导致圆心错位。
 */
export function ModuleChartMount({ height, children }: ModuleChartMountProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<ModuleChartMountDims | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // 双帧后再量宽，避免 Masonry / 侧栏动画首帧 flex 未完成
        requestAnimationFrame(() => {
          const width = Math.floor(host.clientWidth);
          if (width <= 0) return;

          setDims((prev) =>
            prev && prev.width === width && prev.height === height ? prev : { width, height },
          );
        });
      });
    };

    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(host);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [height]);

  return (
    <div
      ref={hostRef}
      style={{
        width: '100%',
        height,
        minWidth: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        position: 'relative',
        contain: 'layout',
      }}
    >
      {dims ? (
        <div
          key={`${dims.width}x${dims.height}`}
          style={{
            width: dims.width,
            height: dims.height,
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          {children(dims)}
        </div>
      ) : null}
    </div>
  );
}

export default ModuleChartMount;
