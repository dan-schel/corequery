import { CanvasController } from "@/web/components/canvas/canvas-controller";
import clsx from "clsx";
import { useEffect, useRef, useState } from "preact/hooks";

export type CreateControllerFunc<T> = (
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
) => CanvasController<T>;

type CanvasProps<T> = {
  class?: string;
  data: T;
  createController: CreateControllerFunc<T>;
};

export function Canvas<T>(props: CanvasProps<T>) {
  const { data, createController } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [controller, setController] = useState<CanvasController<T> | null>(
    null,
  );

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

  useEffect(() => {
    controller?.setData(data);
  }, [controller, data]);

  return (
    <div
      ref={containerRef}
      className={clsx(props.class, "relative overflow-hidden")}
    >
      <canvas
        className="absolute top-0 left-0 select-none"
        ref={canvasRef}
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
