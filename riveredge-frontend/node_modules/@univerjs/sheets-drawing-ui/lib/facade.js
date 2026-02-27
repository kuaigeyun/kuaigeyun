var Q = Object.defineProperty;
var Z = (s, t, r) => t in s ? Q(s, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : s[t] = r;
var W = (s, t, r) => Z(s, typeof t != "symbol" ? t + "" : t, r);
import { Inject as N, Injector as L, ICommandService as K, ImageSourceType as y, ArrangeTypeEnum as O, DrawingTypeEnum as v, generateRandomId as ee, toDisposable as T, CanceledError as D, UniverInstanceType as te, IUniverInstanceService as re } from "@univerjs/core";
import { FBase as ne, FEnum as z, FEventName as X, FUniver as Y } from "@univerjs/core/facade";
import { getImageSize as ie, IDrawingManagerService as S, SetDrawingSelectedOperation as j } from "@univerjs/drawing";
import { IRenderManagerService as C, getCurrentTypeOfRenderer as se } from "@univerjs/engine-render";
import { RemoveSheetDrawingCommand as k, SetSheetDrawingCommand as f, SetDrawingArrangeCommand as F, SheetCanvasFloatDomManagerService as p, transformToDrawingPosition as M, InsertSheetDrawingCommand as E, IBatchSaveImagesService as V, FileNamePart as b, SheetDrawingUpdateController as oe } from "@univerjs/sheets-drawing-ui";
import { SheetSkeletonManagerService as H, ISheetSelectionRenderService as x, convertPositionSheetOverGridToAbsolute as ae, convertPositionCellToSheetOverGrid as de } from "@univerjs/sheets-ui";
import { ISheetDrawingService as w, SheetDrawingAnchorType as ce } from "@univerjs/sheets-drawing";
import { transformComponentKey as U } from "@univerjs/sheets-ui/facade";
import { FWorksheet as $, FRange as q } from "@univerjs/sheets/facade";
import { ComponentManager as G } from "@univerjs/ui";
var ge = Object.getOwnPropertyDescriptor, J = (s, t, r, e) => {
  for (var n = e > 1 ? void 0 : e ? ge(t, r) : t, i = s.length - 1, a; i >= 0; i--)
    (a = s[i]) && (n = a(n) || n);
  return n;
}, P = (s, t) => (r, e) => t(r, e, s);
function me(s, t) {
  const { from: r, to: e, flipY: n = !1, flipX: i = !1, angle: a = 0, skewX: o = 0, skewY: d = 0 } = s.sheetTransform, { column: g, columnOffset: c, row: m, rowOffset: h } = r, _ = ae(
    s.unitId,
    s.subUnitId,
    { from: r, to: e },
    t
  ), { width: l, height: u } = _;
  return {
    ...s,
    column: g,
    columnOffset: c,
    row: m,
    rowOffset: h,
    width: l,
    height: u,
    flipY: n,
    flipX: i,
    angle: a,
    skewX: o,
    skewY: d
  };
}
function he(s, t, r) {
  const { column: e, columnOffset: n, row: i, rowOffset: a, flipY: o = !1, flipX: d = !1, angle: g = 0, skewX: c = 0, skewY: m = 0, width: h, height: _ } = s, l = de(
    s.unitId,
    s.subUnitId,
    { column: e, columnOffset: n, row: i, rowOffset: a },
    h,
    _,
    t,
    r
  ), { sheetTransform: u, transform: A } = l;
  return {
    ...s,
    sheetTransform: {
      ...u,
      flipY: o,
      flipX: d,
      angle: g,
      skewX: c,
      skewY: m
    },
    transform: {
      ...A,
      flipY: o,
      flipX: d,
      angle: g,
      skewX: c,
      skewY: m
    }
  };
}
let B = class {
  constructor(s, t, r) {
    W(this, "_image");
    this._injector = r, this._image = {
      drawingId: ee(6),
      drawingType: v.DRAWING_IMAGE,
      imageSourceType: y.BASE64,
      source: "",
      unitId: s,
      subUnitId: t,
      column: 0,
      columnOffset: 0,
      row: 0,
      rowOffset: 0,
      width: 0,
      height: 0
    };
  }
  /**
   * Set the initial image configuration for the image builder.
   * @param {ISheetImage} image - The image configuration
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set initial image configuration.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setImage({
   *     drawingId: '123456',
   *     drawingType: univerAPI.Enum.DrawingType.DRAWING_IMAGE,
   *     imageSourceType: univerAPI.Enum.ImageSourceType.BASE64,
   *     source: 'https://avatars.githubusercontent.com/u/61444807?s=48&v=4',
   *     unitId: fWorkbook.getId(),
   *     subUnitId: fWorksheet.getSheetId(),
   *   })
   *   .setColumn(5)
   *   .setRow(5)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setImage(s) {
    const r = this._injector.get(C).getRenderById(s.unitId);
    if (!r)
      throw new Error(`Render Unit with unitId ${s.unitId} not found`);
    const e = r.with(H);
    return s.sheetTransform == null && (s.sheetTransform = {
      from: {
        column: 0,
        columnOffset: 0,
        row: 0,
        rowOffset: 0
      },
      to: {
        column: 0,
        columnOffset: 0,
        row: 0,
        rowOffset: 0
      }
    }), this._image = me(s, e), this;
  }
  setSource(s, t) {
    const r = t != null ? t : y.URL;
    return this._image.source = s, this._image.imageSourceType = r, this;
  }
  /**
   * Get the source of the image
   * @returns {string} The source of the image
   * @example
   * ```ts
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const images = fWorksheet.getImages();
   * images.forEach((image) => {
   *   console.log(image, image.toBuilder().getSource());
   * });
   * ```
   */
  getSource() {
    return this._image.source;
  }
  /**
   * Get the source type of the image
   * @returns {ImageSourceType} The source type of the image
   * @example
   * ```ts
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const images = fWorksheet.getImages();
   * images.forEach((image) => {
   *   console.log(image, image.toBuilder().getSourceType());
   * });
   * ```
   */
  getSourceType() {
    return this._image.imageSourceType;
  }
  /**
   * Set the horizontal position of the image
   * @param {number} column - The column index of the image start position, start at 0
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set image source.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(5)
   *   .setRow(5)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setColumn(s) {
    return this._image.column = s, this;
  }
  /**
   * Set the vertical position of the image
   * @param {number} row - The row index of the image start position, start at 0
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set image source.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(5)
   *   .setRow(5)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setRow(s) {
    return this._image.row = s, this;
  }
  /**
   * Set the horizontal offset of the image
   * @param {number} offset - The column offset of the image start position, pixel unit
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set image source.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell and horizontal offset is 10px.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(5)
   *   .setRow(5)
   *   .setColumnOffset(10)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setColumnOffset(s) {
    return this._image.columnOffset = s, this;
  }
  /**
   * Set the vertical offset of the image
   * @param {number} offset - The row offset of the image start position, pixel unit
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set image source.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell and vertical offset is 10px.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(5)
   *   .setRow(5)
   *   .setRowOffset(10)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setRowOffset(s) {
    return this._image.rowOffset = s, this;
  }
  /**
   * Set the width of the image
   * @param {number} width - The width of the image, pixel unit
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set image source.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell, width is 120px and height is 50px.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(5)
   *   .setRow(5)
   *   .setWidth(120)
   *   .setHeight(50)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setWidth(s) {
    return this._image.width = s, this;
  }
  /**
   * Set the height of the image
   * @param {number} height - The height of the image, pixel unit
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set image source.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell, width is 120px and height is 50px.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(5)
   *   .setRow(5)
   *   .setWidth(120)
   *   .setHeight(50)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setHeight(s) {
    return this._image.height = s, this;
  }
  /**
   * Set the anchor type of the image, whether the position and size change with the cell
   * @param {SheetDrawingAnchorType} anchorType - The anchor type of the image
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   *
   * // image1 position is start from A6 cell, anchor type is Position.
   * // Only the position of the drawing follows the cell changes. When rows or columns are inserted or deleted, the position of the drawing changes, but the size remains the same.
   * const image1 = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(0)
   *   .setRow(5)
   *   .setAnchorType(univerAPI.Enum.SheetDrawingAnchorType.Position)
   *   .buildAsync();
   *
   * // image2 position is start from C6 cell, anchor type is Both.
   * // The size and position of the drawing follow the cell changes. When rows or columns are inserted or deleted, the size and position of the drawing change accordingly.
   * const image2 = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(2)
   *   .setRow(5)
   *   .setAnchorType(univerAPI.Enum.SheetDrawingAnchorType.Both)
   *   .buildAsync();
   *
   * // image3 position is start from E6 cell, anchor type is None.
   * // The size and position of the drawing do not follow the cell changes. When rows or columns are inserted or deleted, the position and size of the drawing remain unchanged.
   * const image3 = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(4)
   *   .setRow(5)
   *   .setAnchorType(univerAPI.Enum.SheetDrawingAnchorType.None)
   *   .buildAsync();
   *
   * // insert images into the sheet
   * fWorksheet.insertImages([image1, image2, image3]);
   *
   * // after 2 seconds, set the row height of the 5th row to 100px and insert a row before the 5th row.
   * // then observe the position and size changes of the images.
   * setTimeout(() => {
   *   fWorksheet.setRowHeight(5, 100).insertRowBefore(5);
   * }, 2000);
   * ```
   */
  setAnchorType(s) {
    return this._image.anchorType = s, this;
  }
  /**
   * Set the cropping region of the image by defining the top edges, thereby displaying the specific part of the image you want.
   * @param {number} top - The number of pixels to crop from the top of the image
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set image source.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell, top crop is 10px.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(5)
   *   .setRow(5)
   *   .setCropTop(10)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setCropTop(s) {
    return this._initializeSrcRect(), this._image.srcRect.top = s, this;
  }
  /**
   * Set the cropping region of the image by defining the left edges, thereby displaying the specific part of the image you want.
   * @param {number} left - The number of pixels to crop from the left side of the image
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set image source.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell, left crop is 10px.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(5)
   *   .setRow(5)
   *   .setCropLeft(10)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setCropLeft(s) {
    return this._initializeSrcRect(), this._image.srcRect.left = s, this;
  }
  /**
   * Set the cropping region of the image by defining the bottom edges, thereby displaying the specific part of the image you want.
   * @param {number} bottom - The number of pixels to crop from the bottom of the image
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set image source.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell, bottom crop is 10px.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(5)
   *   .setRow(5)
   *   .setCropBottom(10)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setCropBottom(s) {
    return this._initializeSrcRect(), this._image.srcRect.bottom = s, this;
  }
  /**
   * Set the cropping region of the image by defining the right edges, thereby displaying the specific part of the image you want.
   * @param {number} right - The number of pixels to crop from the right side of the image
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set image source.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell, right crop is 10px.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(5)
   *   .setRow(5)
   *   .setCropRight(10)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setCropRight(s) {
    return this._initializeSrcRect(), this._image.srcRect.right = s, this;
  }
  _initializeSrcRect() {
    this._image.srcRect == null && (this._image.srcRect = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    });
  }
  /**
   * Set the rotation angle of the image
   * @param {number} angle - Degree of rotation of the image, for example, 90, 180, 270, etc.
   * @returns {FOverGridImageBuilder} The `FOverGridImageBuilder` for chaining
   * @example
   * ```ts
   * // create a new image builder and set image source.
   * // then build `ISheetImage` and insert it into the sheet, position is start from F6 cell, rotate 90 degrees.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = await fWorksheet.newOverGridImage()
   *   .setSource('https://avatars.githubusercontent.com/u/61444807?s=48&v=4', univerAPI.Enum.ImageSourceType.URL)
   *   .setColumn(5)
   *   .setRow(5)
   *   .setRotate(90)
   *   .buildAsync();
   * fWorksheet.insertImages([image]);
   * ```
   */
  setRotate(s) {
    return this._image.angle = s, this;
  }
  setUnitId(s) {
    return this._image.unitId = s, this;
  }
  setSubUnitId(s) {
    return this._image.subUnitId = s, this;
  }
  async buildAsync() {
    const t = this._injector.get(C).getRenderById(this._image.unitId);
    if (!t)
      throw new Error(`Render Unit with unitId ${this._image.unitId} not found`);
    const r = t.with(x), e = t.with(H);
    if (this._image.width === 0 || this._image.height === 0) {
      const n = await ie(this._image.source), i = n.width, a = n.height;
      this._image.width === 0 && (this._image.width = i), this._image.height === 0 && (this._image.height = a);
    }
    return he(this._image, r, e);
  }
};
B = J([
  P(2, N(L))
], B);
let I = class extends ne {
  constructor(s, t, r) {
    super(), this._image = s, this._commandService = t, this._injector = r;
  }
  /**
   * Get the id of the image
   * @returns {string} The id of the image
   * @example
   * ```ts
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const images = fWorksheet.getImages();
   * images.forEach((image) => {
   *   console.log(image, image.getId());
   * });
   * ```
   */
  getId() {
    return this._image.drawingId;
  }
  /**
   * Get the drawing type of the image
   * @returns {DrawingTypeEnum} The drawing type of the image
   * @example
   * ```ts
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const images = fWorksheet.getImages();
   * images.forEach((image) => {
   *   console.log(image, image.getType());
   * });
   * ```
   */
  getType() {
    return this._image.drawingType;
  }
  /**
   * Remove the image from the sheet
   * @returns {boolean} true if the image is removed successfully, otherwise false
   * @example
   * ```ts
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = fWorksheet.getImages()[0];
   * const result = image?.remove();
   * console.log(result);
   * ```
   */
  remove() {
    return this._commandService.syncExecuteCommand(k.id, { unitId: this._image.unitId, drawings: [this._image] });
  }
  /**
   * Convert the image to a FOverGridImageBuilder
   * @returns {FOverGridImageBuilder} The builder FOverGridImageBuilder
   * @example
   * ```ts
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const images = fWorksheet.getImages();
   * images.forEach((image) => {
   *   console.log(image, image.toBuilder().getSource());
   * });
   * ```
   */
  toBuilder() {
    const s = this._injector.createInstance(B);
    return s.setImage(this._image), s;
  }
  setSource(s, t) {
    const r = t != null ? t : y.URL;
    return this._image.source = s, this._image.imageSourceType = r, this._commandService.syncExecuteCommand(f.id, { unitId: this._image.unitId, drawings: [this._image] });
  }
  async setPositionAsync(s, t, r, e) {
    const n = this.toBuilder();
    n.setColumn(t), n.setRow(s), r != null && n.setRowOffset(r), e != null && n.setColumnOffset(e);
    const i = await n.buildAsync();
    return this._commandService.syncExecuteCommand(f.id, { unitId: this._image.unitId, drawings: [i] });
  }
  /**
   * Set the size of the image
   * @param {number} width - The width of the image, pixel unit
   * @param {number} height - The height of the image, pixel unit
   * @returns {boolean} true if the size is set successfully, otherwise false
   * @example
   * ```ts
   * // set the image width 120px and height 50px
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = fWorksheet.getImages()[0];
   * const result = image?.setSizeAsync(120, 50);
   * console.log(result);
   * ```
   */
  async setSizeAsync(s, t) {
    const r = this.toBuilder();
    r.setWidth(s), r.setHeight(t);
    const e = await r.buildAsync();
    return this._commandService.syncExecuteCommand(f.id, { unitId: this._image.unitId, drawings: [e] });
  }
  /**
   * Set the cropping region of the image by defining the top, bottom, left, and right edges, thereby displaying the specific part of the image you want.
   * @param {number} top - The number of pixels to crop from the top of the image
   * @param {number} left - The number of pixels to crop from the left side of the image
   * @param {number} bottom - The number of pixels to crop from the bottom of the image
   * @param {number} right - The number of pixels to crop from the right side of the image
   * @returns {boolean} true if the crop is set successfully, otherwise false
   * @example
   * ```ts
   * // set the crop of the image, top 10px, left 10px, bottom 10px, right 10px.
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = fWorksheet.getImages()[0];
   * const result = image?.setCrop(10, 10, 10, 10);
   * console.log(result);
   * ```
   */
  setCrop(s, t, r, e) {
    return this._image.srcRect == null && (this._image.srcRect = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }), s != null && (this._image.srcRect.top = s), t != null && (this._image.srcRect.left = t), r != null && (this._image.srcRect.bottom = r), e != null && (this._image.srcRect.right = e), this._commandService.syncExecuteCommand(f.id, { unitId: this._image.unitId, drawings: [this._image] });
  }
  /**
   * Set the rotation angle of the image
   * @param {number} angle - Degree of rotation of the image, for example, 90, 180, 270, etc.
   * @returns {boolean} true if the rotation is set successfully, otherwise false
   * @example
   * ```ts
   * // set 90 degrees rotation of the image
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = fWorksheet.getImages()[0];
   * const result = image?.setRotate(90);
   * console.log(result);
   * ```
   */
  setRotate(s) {
    return this._image.sheetTransform.angle = s, this._image.transform && (this._image.transform.angle = s), this._commandService.syncExecuteCommand(f.id, { unitId: this._image.unitId, drawings: [this._image] });
  }
  /**
   * Move the image layer forward by one level
   * @returns {boolean} true if the image is moved forward successfully, otherwise false
   * @example
   * ```ts
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = fWorksheet.getImages()[0];
   * const result = image?.setForward();
   * console.log(result);
   * ```
   */
  setForward() {
    return this._commandService.syncExecuteCommand(F.id, {
      unitId: this._image.unitId,
      subUnitId: this._image.subUnitId,
      drawingIds: [this._image.drawingId],
      arrangeType: O.forward
    });
  }
  /**
   * Move the image layer backward by one level
   * @returns {boolean} true if the image is moved backward successfully, otherwise false
   * @example
   * ```ts
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = fWorksheet.getImages()[0];
   * const result = image?.setBackward();
   * console.log(result);
   * ```
   */
  setBackward() {
    return this._commandService.syncExecuteCommand(F.id, {
      unitId: this._image.unitId,
      subUnitId: this._image.subUnitId,
      drawingIds: [this._image.drawingId],
      arrangeType: O.backward
    });
  }
  /**
   * Move the image layer to the bottom layer
   * @returns {boolean} true if the image is moved to the bottom layer successfully, otherwise false
   * @example
   * ```ts
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = fWorksheet.getImages()[0];
   * const result = image?.setBack();
   * console.log(result);
   * ```
   */
  setBack() {
    return this._commandService.syncExecuteCommand(F.id, {
      unitId: this._image.unitId,
      subUnitId: this._image.subUnitId,
      drawingIds: [this._image.drawingId],
      arrangeType: O.back
    });
  }
  /**
   * Move the image layer to the top layer
   * @returns {boolean} true if the image is moved to the top layer successfully, otherwise false
   * @example
   * ```ts
   * const fWorkbook = univerAPI.getActiveWorkbook();
   * const fWorksheet = fWorkbook.getActiveSheet();
   * const image = fWorksheet.getImages()[0];
   * const result = image?.setFront();
   * console.log(result);
   * ```
   */
  setFront() {
    return this._commandService.syncExecuteCommand(F.id, {
      unitId: this._image.unitId,
      subUnitId: this._image.subUnitId,
      drawingIds: [this._image.drawingId],
      arrangeType: O.front
    });
  }
};
I = J([
  P(1, K),
  P(2, N(L))
], I);
class le extends $ {
  getFloatDomById(t) {
    const e = this._injector.get(p).getFloatDomInfo(t);
    if (!e) return null;
    const { unitId: n, subUnitId: i } = e, { rect: a } = e, o = a.getState(), { left: d = 0, top: g = 0, width: c = 0, height: m = 0, flipX: h = !1, flipY: _ = !1, angle: l = 0, skewX: u = 0, skewY: A = 0 } = o, R = this._injector.get(w).getDrawingByParam({
      drawingId: e.id,
      unitId: n,
      subUnitId: i
    });
    return R ? {
      position: {
        left: d,
        top: g,
        width: c,
        height: m,
        flipX: h,
        flipY: _,
        angle: l,
        skewX: u,
        skewY: A
      },
      componentKey: R.componentKey,
      allowTransform: R.allowTransform,
      data: R.data,
      id: e.id
    } : null;
  }
  getAllFloatDoms() {
    const t = this._injector.get(p), r = this._workbook.getUnitId(), e = this._worksheet.getSheetId();
    return Array.from(t.getFloatDomsBySubUnitId(r, e).values()).map((n) => {
      const { rect: i } = n, a = this._injector.get(w).getDrawingByParam({
        drawingId: n.id,
        unitId: r,
        subUnitId: e
      }), { left: o, top: d, width: g, height: c, flipX: m, flipY: h, angle: _, skewX: l, skewY: u } = i.getState();
      return {
        position: {
          left: o,
          top: d,
          width: g,
          height: c,
          flipX: m,
          flipY: h,
          angle: _,
          skewX: l,
          skewY: u
        },
        componentKey: a.componentKey,
        allowTransform: a.allowTransform,
        data: a.data,
        id: n.id
      };
    });
  }
  updateFloatDom(t, r) {
    var l, u;
    const n = this._injector.get(p).getFloatDomInfo(t);
    if (!n) return this;
    const { unitId: i, subUnitId: a } = n, o = this._injector.get(w).getDrawingByParam({
      unitId: i,
      subUnitId: a,
      drawingId: t
    }), d = this._injector.get(C);
    if (!d.getRenderById(i)) return this;
    if (!this.getSkeleton()) return this;
    const m = (l = d.getRenderById(this.getWorkbook().getUnitId())) == null ? void 0 : l.with(x);
    if (!m) return this;
    const h = {
      ...o,
      componentKey: r.componentKey || o.componentKey,
      allowTransform: r.allowTransform !== void 0 ? r.allowTransform : o.allowTransform,
      data: r.data || o.data,
      sheetTransform: r.position && (u = M(
        r.position,
        m
      )) != null ? u : o.sheetTransform,
      transform: {
        ...o.transform,
        ...r.position
        // Merge with existing transform
      }
    };
    if (!this._commandService.syncExecuteCommand(f.id, { unitId: i, subUnitId: a, drawings: [h] }))
      throw new Error("updateFloatDom failed");
    return this;
  }
  batchUpdateFloatDoms(t) {
    var a;
    const r = this._injector.get(p), e = this._injector.get(w), n = this._injector.get(C), i = [];
    for (const o of t) {
      const d = r.getFloatDomInfo(o.id);
      if (!d) continue;
      const { unitId: g, subUnitId: c } = d, m = e.getDrawingByParam({
        unitId: g,
        subUnitId: c,
        drawingId: o.id
      });
      if (!m) continue;
      const h = n.getRenderById(g);
      if (!h || !this.getSkeleton()) continue;
      const l = h.with(x);
      if (!l) return this;
      const u = {
        ...m,
        componentKey: o.config.componentKey || m.componentKey,
        allowTransform: o.config.allowTransform !== void 0 ? o.config.allowTransform : m.allowTransform,
        data: o.config.data || m.data,
        sheetTransform: o.config.position && (a = M(
          o.config.position,
          l
        )) != null ? a : m.sheetTransform,
        transform: {
          ...m.transform,
          ...o.config.position
          // Merge with existing transform
        }
      };
      i.push(u);
    }
    if (i.length > 0) {
      const o = this._workbook.getUnitId(), d = this._worksheet.getSheetId();
      if (!this._commandService.syncExecuteCommand(f.id, { unitId: o, subUnitId: d, drawings: i }))
        throw new Error("batchUpdateFloatDoms failed");
    }
    return this;
  }
  removeFloatDom(t) {
    const e = this._injector.get(p).getFloatDomInfo(t);
    if (!e) return this;
    const { unitId: n, subUnitId: i } = e, o = this._injector.get(w).getDrawingByParam({
      unitId: n,
      subUnitId: i,
      drawingId: t
    });
    if (!o) return this;
    if (!this._commandService.syncExecuteCommand(k.id, {
      unitId: n,
      drawings: [o]
    }))
      throw new Error("removeFloatDom failed");
    return this;
  }
  addFloatDomToPosition(t, r) {
    const e = this._workbook.getUnitId(), n = this._worksheet.getSheetId(), { key: i, disposableCollection: a } = U(t, this._injector.get(G)), d = this._injector.get(p).addFloatDomToPosition({ ...t, componentKey: i, unitId: e, subUnitId: n }, r);
    return d ? (a.add(d.dispose), {
      id: d.id,
      dispose: () => {
        a.dispose(), d.dispose();
      }
    }) : (a.dispose(), null);
  }
  addFloatDomToRange(t, r, e, n) {
    const i = this._workbook.getUnitId(), a = this._worksheet.getSheetId(), { key: o, disposableCollection: d } = U(r, this._injector.get(G)), c = this._injector.get(p).addFloatDomToRange(t.getRange(), { ...r, componentKey: o, unitId: i, subUnitId: a }, e, n);
    return c ? (d.add(c.dispose), {
      id: c.id,
      dispose: () => {
        d.dispose(), c.dispose();
      }
    }) : (d.dispose(), null);
  }
  addFloatDomToColumnHeader(t, r, e, n) {
    const i = this._workbook.getUnitId(), a = this._worksheet.getSheetId(), { key: o, disposableCollection: d } = U(r, this._injector.get(G)), c = this._injector.get(p).addFloatDomToColumnHeader(t, { ...r, componentKey: o, unitId: i, subUnitId: a }, e, n);
    return c ? (d.add(c.dispose), {
      id: c.id,
      dispose: () => {
        d.dispose(), c.dispose();
      }
    }) : (d.dispose(), null);
  }
  async insertImage(t, r, e, n, i) {
    const a = this.newOverGridImage();
    if (typeof t == "string")
      a.setSource(t);
    else {
      const g = await t.getBlob().getDataAsString();
      a.setSource(g, y.BASE64);
    }
    r !== void 0 ? a.setColumn(r) : a.setColumn(0), e !== void 0 ? a.setRow(e) : a.setRow(0), n !== void 0 ? a.setColumnOffset(n) : a.setColumnOffset(0), i !== void 0 ? a.setRowOffset(i) : a.setRowOffset(0);
    const o = await a.buildAsync();
    return this._commandService.syncExecuteCommand(E.id, { unitId: this._fWorkbook.getId(), drawings: [o] });
  }
  insertImages(t) {
    const r = t.map((e) => (e.unitId = this._fWorkbook.getId(), e.subUnitId = this.getSheetId(), e));
    return this._commandService.syncExecuteCommand(E.id, { unitId: this._fWorkbook.getId(), drawings: r }), this;
  }
  deleteImages(t) {
    const r = t.map((e) => ({
      unitId: this._fWorkbook.getId(),
      drawingId: e.getId(),
      subUnitId: this.getSheetId(),
      drawingType: e.getType()
    }));
    return this._commandService.syncExecuteCommand(k.id, { unitId: this._fWorkbook.getId(), drawings: r }), this;
  }
  getImages() {
    const r = this._injector.get(w).getDrawingData(this._fWorkbook.getId(), this.getSheetId()), e = [];
    for (const n in r) {
      const i = r[n];
      i.drawingType === v.DRAWING_IMAGE && e.push(this._injector.createInstance(I, i));
    }
    return e;
  }
  getImageById(t) {
    const e = this._injector.get(w).getDrawingByParam({ unitId: this._fWorkbook.getId(), subUnitId: this.getSheetId(), drawingId: t });
    return e && e.drawingType === v.DRAWING_IMAGE ? this._injector.createInstance(I, e) : null;
  }
  getActiveImages() {
    const r = this._injector.get(w).getFocusDrawings(), e = [];
    for (const n in r) {
      const i = r[n];
      e.push(this._injector.createInstance(I, i));
    }
    return e;
  }
  updateImages(t) {
    return this._commandService.syncExecuteCommand(f.id, { unitId: this._fWorkbook.getId(), drawings: t }), this;
  }
  onImageInserted(t) {
    const r = this._injector.get(w);
    return T(r.add$.subscribe((e) => {
      const n = e.map(
        (i) => this._injector.createInstance(I, r.getDrawingByParam(i))
      );
      t(n);
    }));
  }
  onImageDeleted(t) {
    const r = this._injector.get(w);
    return T(r.remove$.subscribe((e) => {
      const n = e.map(
        (i) => this._injector.createInstance(I, r.getDrawingByParam(i))
      );
      t(n);
    }));
  }
  onImageChanged(t) {
    const r = this._injector.get(w);
    return T(r.update$.subscribe((e) => {
      const n = e.map(
        (i) => this._injector.createInstance(I, r.getDrawingByParam(i))
      );
      t(n);
    }));
  }
  newOverGridImage() {
    const t = this._fWorkbook.getId(), r = this.getSheetId();
    return this._injector.createInstance(B, t, r);
  }
  async saveCellImagesAsync(t, r) {
    var m;
    const e = this._injector.get(V), n = this._fWorkbook.getId(), i = this.getSheetId(), a = r ? r.map((h) => h.getRange()) : [this._worksheet.getCellMatrix().getDataRange()], o = e.getCellImagesFromRanges(n, i, a);
    if (o.length === 0)
      return !1;
    if (o.length === 1)
      try {
        return await e.downloadSingleImage(o[0]), !0;
      } catch (h) {
        return console.error("Failed to download image:", h), !1;
      }
    const d = [], g = (m = t == null ? void 0 : t.useCellAddress) != null ? m : !0, c = t == null ? void 0 : t.useColumnIndex;
    g && d.push(b.CELL_ADDRESS), c !== void 0 && d.push(b.COLUMN_VALUE), d.length === 0 && d.push(b.CELL_ADDRESS);
    try {
      return await e.saveImagesWithContext(o, {
        fileNameParts: d,
        columnIndex: c
      }, n, i), !0;
    } catch (h) {
      return console.error("Failed to save images:", h), !1;
    }
  }
}
$.extend(le);
class ue extends z {
  get DrawingType() {
    return v;
  }
  get ImageSourceType() {
    return y;
  }
  get SheetDrawingAnchorType() {
    return ce;
  }
}
z.extend(ue);
class fe extends X {
  get BeforeFloatDomAdd() {
    return "BeforeFloatDomAdd";
  }
  get FloatDomAdded() {
    return "FloatDomAdded";
  }
  get BeforeFloatDomUpdate() {
    return "BeforeFloatDomUpdate";
  }
  get FloatDomUpdated() {
    return "FloatDomUpdated";
  }
  get BeforeFloatDomDelete() {
    return "BeforeFloatDomDelete";
  }
  get FloatDomDeleted() {
    return "FloatDomDeleted";
  }
  get BeforeOverGridImageChange() {
    return "BeforeOverGridImageChange";
  }
  get OverGridImageChanged() {
    return "OverGridImageChanged";
  }
  get BeforeOverGridImageInsert() {
    return "BeforeOverGridImageInsert";
  }
  get OverGridImageInserted() {
    return "OverGridImageInserted";
  }
  get BeforeOverGridImageRemove() {
    return "BeforeOverGridImageRemove";
  }
  get OverGridImageRemoved() {
    return "OverGridImageRemoved";
  }
  get BeforeOverGridImageSelect() {
    return "BeforeOverGridImageSelect";
  }
  get OverGridImageSelected() {
    return "OverGridImageSelected";
  }
}
X.extend(fe);
class we extends Y {
  /**
   * @ignore
   */
  // eslint-disable-next-line max-lines-per-function
  _initialize(t) {
    const r = t.get(K);
    this.registerEventHandler(
      this.Event.BeforeFloatDomAdd,
      () => r.beforeCommandExecuted((e) => {
        if (e.id !== E.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const { drawings: a } = n, o = a.filter(
          (g) => g.drawingType === v.DRAWING_DOM
        );
        if (o.length === 0)
          return;
        const d = {
          workbook: i,
          drawings: o
        };
        if (this.fireEvent(this.Event.BeforeFloatDomAdd, d), d.cancel)
          throw new D();
      })
    ), this.registerEventHandler(
      this.Event.FloatDomAdded,
      () => r.onCommandExecuted((e) => {
        if (e.id !== E.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const { drawings: a } = n, o = a.filter(
          (d) => d.drawingType === v.DRAWING_DOM
        );
        o.length !== 0 && this.fireEvent(this.Event.FloatDomAdded, {
          workbook: i,
          drawings: o
        });
      })
    ), this.registerEventHandler(
      this.Event.BeforeOverGridImageInsert,
      () => r.beforeCommandExecuted((e) => {
        if (e.id !== E.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const { drawings: a } = n, o = {
          workbook: i,
          insertImageParams: a
        };
        if (this.fireEvent(this.Event.BeforeOverGridImageInsert, o), o.cancel)
          throw new D();
      })
    ), this.registerEventHandler(
      this.Event.BeforeOverGridImageRemove,
      () => r.beforeCommandExecuted((e) => {
        if (e.id !== k.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const a = t.get(S), { drawings: o } = n, d = o.map((c) => a.getDrawingByParam(c)), g = {
          workbook: i,
          images: this._createFOverGridImage(d)
        };
        if (this.fireEvent(this.Event.BeforeOverGridImageRemove, g), g.cancel)
          throw new D();
      })
    ), this.registerEventHandler(
      this.Event.BeforeOverGridImageChange,
      () => r.beforeCommandExecuted((e) => {
        if (e.id !== f.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const { drawings: a } = n, o = t.get(S), d = [];
        a.forEach((c) => {
          const m = o.getDrawingByParam(c);
          m != null && d.push({
            changeParam: c,
            image: this._injector.createInstance(I, m)
          });
        });
        const g = {
          workbook: i,
          images: d
        };
        if (this.fireEvent(this.Event.BeforeOverGridImageChange, g), g.cancel)
          throw o.updateNotification(a), new D();
      })
    ), this.registerEventHandler(
      this.Event.BeforeFloatDomUpdate,
      () => r.beforeCommandExecuted((e) => {
        if (e.id !== f.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const { drawings: a } = n, o = t.get(S), d = [];
        if (a.forEach((c) => {
          const m = o.getDrawingByParam(c);
          (m == null ? void 0 : m.drawingType) === v.DRAWING_DOM && d.push(m);
        }), d.length === 0)
          return;
        const g = {
          workbook: i,
          drawings: d
        };
        if (this.fireEvent(this.Event.BeforeFloatDomUpdate, g), g.cancel)
          throw o.updateNotification(a), new D();
      })
    ), this.registerEventHandler(
      this.Event.FloatDomUpdated,
      () => r.onCommandExecuted((e) => {
        if (e.id !== f.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const { drawings: a } = n, o = t.get(S), d = [];
        a.forEach((g) => {
          const c = o.getDrawingByParam(g);
          (c == null ? void 0 : c.drawingType) === v.DRAWING_DOM && d.push(c);
        }), d.length !== 0 && this.fireEvent(this.Event.FloatDomUpdated, {
          workbook: i,
          drawings: d
        });
      })
    ), this.registerEventHandler(
      this.Event.BeforeFloatDomDelete,
      () => r.beforeCommandExecuted((e) => {
        if (e.id !== k.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const a = t.get(S), { drawings: o } = n, d = o.map((c) => a.getDrawingByParam(c)).filter(
          (c) => (c == null ? void 0 : c.drawingType) === v.DRAWING_DOM
        );
        if (d.length === 0)
          return;
        const g = {
          workbook: i,
          drawings: d
        };
        if (this.fireEvent(this.Event.BeforeFloatDomDelete, g), g.cancel)
          throw new D();
      })
    ), this.registerEventHandler(
      this.Event.FloatDomDeleted,
      () => r.onCommandExecuted((e) => {
        if (e.id !== k.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const { drawings: a } = n;
        this.fireEvent(this.Event.FloatDomDeleted, {
          workbook: i,
          drawings: a.filter((o) => o.drawingType === v.DRAWING_DOM).map((o) => o.drawingId)
        });
      })
    ), this.registerEventHandler(
      this.Event.BeforeOverGridImageSelect,
      () => r.beforeCommandExecuted((e) => {
        if (e.id !== j.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null)
          return;
        const a = t.get(S), o = a.getFocusDrawings(), d = n.map((c) => a.getDrawingByParam(c)), g = {
          workbook: i,
          selectedImages: this._createFOverGridImage(d),
          oldSelectedImages: this._createFOverGridImage(o)
        };
        if (this.fireEvent(this.Event.BeforeOverGridImageSelect, g), g.cancel)
          throw new D();
      })
    ), this.registerEventHandler(
      this.Event.OverGridImageInserted,
      () => r.onCommandExecuted((e) => {
        if (e.id !== E.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const { drawings: a } = n;
        this.fireEvent(this.Event.OverGridImageInserted, {
          workbook: i,
          images: this._createFOverGridImage(a)
        });
      })
    ), this.registerEventHandler(
      this.Event.OverGridImageRemoved,
      () => r.onCommandExecuted((e) => {
        if (e.id !== k.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const { drawings: a } = n;
        this.fireEvent(this.Event.OverGridImageRemoved, {
          workbook: i,
          removeImageParams: a
        });
      })
    ), this.registerEventHandler(
      this.Event.OverGridImageChanged,
      () => r.onCommandExecuted((e) => {
        if (e.id !== f.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null || n == null)
          return;
        const { drawings: a } = n, o = t.get(S), d = a.map((g) => this._injector.createInstance(I, o.getDrawingByParam(g)));
        this.fireEvent(this.Event.OverGridImageChanged, {
          workbook: i,
          images: d
        });
      })
    ), this.registerEventHandler(
      this.Event.OverGridImageSelected,
      () => r.onCommandExecuted((e) => {
        if (e.id !== j.id) return;
        const n = e.params, i = this.getActiveWorkbook();
        if (i == null)
          return;
        const a = t.get(S), o = n.map((d) => a.getDrawingByParam(d));
        this.fireEvent(this.Event.OverGridImageSelected, {
          workbook: i,
          selectedImages: this._createFOverGridImage(o)
        });
      })
    );
  }
  _createFOverGridImage(t) {
    return t.map((r) => this._injector.createInstance(I, r));
  }
}
Y.extend(we);
class Ie extends q {
  async insertCellImageAsync(t) {
    var i;
    const r = this._injector.get(C), e = (i = se(te.UNIVER_SHEET, this._injector.get(re), r)) == null ? void 0 : i.with(oe);
    if (!e)
      return !1;
    const n = {
      unitId: this._workbook.getUnitId(),
      subUnitId: this._worksheet.getSheetId(),
      row: this.getRow(),
      col: this.getColumn()
    };
    return typeof t == "string" ? e.insertCellImageByUrl(t, n) : e.insertCellImageByFile(t, n);
  }
  async saveCellImagesAsync(t) {
    var c;
    const r = this._injector.get(V), e = this._workbook.getUnitId(), n = this._worksheet.getSheetId(), i = this.getRange(), a = r.getCellImagesFromRanges(e, n, [i]);
    if (a.length === 0)
      return !1;
    if (a.length === 1)
      try {
        return await r.downloadSingleImage(a[0]), !0;
      } catch (m) {
        return console.error("Failed to download image:", m), !1;
      }
    const o = [], d = (c = t == null ? void 0 : t.useCellAddress) != null ? c : !0, g = t == null ? void 0 : t.useColumnIndex;
    d && o.push(b.CELL_ADDRESS), g !== void 0 && o.push(b.COLUMN_VALUE), o.length === 0 && o.push(b.CELL_ADDRESS);
    try {
      return await r.saveImagesWithContext(a, {
        fileNameParts: o,
        columnIndex: g
      }, e, n), !0;
    } catch (m) {
      return console.error("Failed to save images:", m), !1;
    }
  }
}
q.extend(Ie);
