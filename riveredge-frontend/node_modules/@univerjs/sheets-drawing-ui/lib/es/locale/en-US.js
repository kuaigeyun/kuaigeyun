const e = {
  sheetImage: {
    title: "Image",
    upload: {
      float: "Float Image",
      cell: "Cell Image"
    },
    panel: {
      title: "Edit Image"
    },
    save: {
      title: "Save Cell Images",
      menuLabel: "Save Cell Images",
      imageCount: "Image Count",
      fileNameConfig: "File Name",
      useRowCol: "Use Cell Address (A1, B2...)",
      useColumnValue: "Use Column Value",
      selectColumn: "Select Column",
      cancel: "Cancel",
      confirm: "Save",
      saving: "Saving...",
      error: "Failed to save cell images"
    }
  },
  "image-popup": {
    replace: "Replace",
    delete: "Delete",
    edit: "Edit",
    crop: "Crop",
    reset: "Reset Size"
  },
  "drawing-anchor": {
    title: "Anchor Properties",
    both: "Move and size with cells",
    position: "Move but don't size with cells",
    none: "Don't move or size with cells"
  },
  "update-status": {
    exceedMaxSize: "Image size exceeds limit, limit is {0}M",
    invalidImageType: "Invalid image type",
    exceedMaxCount: "Only {0} images can be uploaded at a time",
    invalidImage: "Invalid image"
  },
  "cell-image": {
    pasteTitle: "Paste as cell image",
    pasteContent: "Pasting a cell image will overwrite the existing content of the cell, continue pasting",
    pasteError: "Sheet cell image copy paste is not supported in this unit"
  }
};
export {
  e as default
};
