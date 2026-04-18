declare global {
  interface CanvasRenderingContext2D {
    backingStorePixelRatio?: number;
  }
}

export abstract class CanvasController<T> {
  readonly ctx: CanvasRenderingContext2D;
  private readonly _resizeListener: () => void;

  private _data: T | null;
  private _width: number;
  private _height: number;
  private _dpiRatio: number;

  private _dirty: boolean;
  private _running: boolean;

  constructor(
    private readonly _canvasContainer: HTMLDivElement,
    readonly canvas: HTMLCanvasElement,
  ) {
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) throw new Error("Failed to get 2D rendering context.");
    this.ctx = ctx;
    this._resizeListener = this._onResize.bind(this);

    this._data = null;
    this._width = 1;
    this._height = 1;
    this._dpiRatio = 1;

    this._dirty = true;
    this._running = false;
  }

  get data(): T {
    if (this._data == null) throw new Error("Data not set.");
    return this._data;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  setData(data: T) {
    this._data = data;
    this.onDataUpdated();
    this._dirty = true;

    if (!this._running) {
      this._start();
    }
  }

  private _start() {
    this._fitCanvas();

    this._running = true;
    this._render();

    window.addEventListener("resize", this._resizeListener);
    this._canvasContainer.addEventListener("resize", this._resizeListener);
    this.onStart();
  }

  destroy() {
    this._running = false;

    window.removeEventListener("resize", this._resizeListener);
    this._canvasContainer.removeEventListener("resize", this._resizeListener);
    this.onDestroy();
  }

  private _render() {
    if (!this._running) return;

    requestAnimationFrame(() => {
      this._render();
    });

    if (!this._dirty) return;

    this._dirty = false;

    this.ctx.save();

    this.ctx.clearRect(
      0,
      0,
      this._width * this._dpiRatio,
      this._height * this._dpiRatio,
    );
    this.ctx.scale(this._dpiRatio, this._dpiRatio);

    this.onRender();

    this.ctx.restore();
  }

  onStart(): void {}
  onDestroy(): void {}
  onDataUpdated(): void {}
  abstract onRender(): void;

  private _onResize() {
    this._fitCanvas();
  }

  private _fitCanvas() {
    const containerSize = this._canvasContainer.getBoundingClientRect();
    this._width = containerSize.width;
    this._height = containerSize.height;

    const dpr = window.devicePixelRatio ?? 1;
    const bsr = this.ctx.backingStorePixelRatio ?? 1;
    this._dpiRatio = dpr / bsr;

    this.canvas.style.width = `${this._width}px`;
    this.canvas.style.height = `${this._height}px`;
    this.canvas.width = this._width * this._dpiRatio;
    this.canvas.height = this._height * this._dpiRatio;

    this._dirty = true;
  }

  markDirty() {
    this._dirty = true;
  }
}
