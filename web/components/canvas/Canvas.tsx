import { CanvasController } from "@/web/components/canvas/canvas-controller";
import clsx from "clsx";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";

export type CreateControllerFunc<T> = (
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
) => CanvasController<T>;

type CanvasProps<T> = {
  class?: string;
  data: T;
  createController: CreateControllerFunc<T>;
  interceptTouches?: boolean;
};

export function Canvas<T>(props: CanvasProps<T>) {
  const { data, createController } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [controller, setController] = useState<CanvasController<T> | null>(
    null,
  );

  const style =
    (props.interceptTouches ?? false) ? { touchAction: "none" } : undefined;

  useEffect(() => {
    if (containerRef.current == null || canvasRef.current == null) return;

    const controller = createController(
      containerRef.current,
      canvasRef.current,
    );
    setController(controller);

    return () => {
      if (controller != null) {
        controller.destroy();
      }
    };
  }, [createController]);

  // The `useLayoutEffect` is needed because map diagram stops can change
  // dynamically (e.g. when its collapsed/expanded on the service page), and the
  // data needs to set immediately after the layout updates because the number
  // of stops might've changed, and it reads the Y-levels of the DOM components,
  // leading to a race condition if we just used `useEffect` instead.
  useLayoutEffect(() => {
    controller?.setData(data);
  }, [controller, data]);

  return (
    <div
      ref={containerRef}
      className={clsx(props.class, "relative overflow-hidden")}
    >
      <canvas className="absolute top-0 left-0" ref={canvasRef} style={style} />
    </div>
  );
}
