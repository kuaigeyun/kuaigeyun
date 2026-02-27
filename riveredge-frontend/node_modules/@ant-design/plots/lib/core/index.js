"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plots = exports.G2 = void 0;
__exportStar(require("./types"), exports);
var G2 = __importStar(require("@antv/g2"));
exports.G2 = G2;
var base_1 = require("./plots/base");
var area_1 = require("./plots/area");
var bar_1 = require("./plots/bar");
var column_1 = require("./plots/column");
var dual_axes_1 = require("./plots/dual-axes");
var funnel_1 = require("./plots/funnel");
var line_1 = require("./plots/line");
var pie_1 = require("./plots/pie");
var scatter_1 = require("./plots/scatter");
var radar_1 = require("./plots/radar");
var stock_1 = require("./plots/stock");
var tiny_line_1 = require("./plots/tiny-line");
var tiny_area_1 = require("./plots/tiny-area");
var tiny_column_1 = require("./plots/tiny-column");
var tiny_progress_1 = require("./plots/tiny-progress");
var tiny_ring_1 = require("./plots/tiny-ring");
var rose_1 = require("./plots/rose");
var waterfall_1 = require("./plots/waterfall");
var histogram_1 = require("./plots/histogram");
var heatmap_1 = require("./plots/heatmap");
var box_1 = require("./plots/box");
var sankey_1 = require("./plots/sankey");
var bullet_1 = require("./plots/bullet");
var gauge_1 = require("./plots/gauge");
var liquid_1 = require("./plots/liquid");
var wordCloud_1 = require("./plots/wordCloud");
var treemap_1 = require("./plots/treemap");
var radial_bar_1 = require("./plots/radial-bar");
var circle_packing_1 = require("./plots/circle-packing");
var violin_1 = require("./plots/violin");
var bidirectional_bar_1 = require("./plots/bidirectional-bar");
var venn_1 = require("./plots/venn");
var mix_1 = require("./plots/mix");
var sunburst_1 = require("./plots/sunburst");
exports.Plots = {
    Base: base_1.Base,
    Line: line_1.Line,
    Column: column_1.Column,
    Pie: pie_1.Pie,
    Area: area_1.Area,
    Bar: bar_1.Bar,
    DualAxes: dual_axes_1.DualAxes,
    Funnel: funnel_1.Funnel,
    Scatter: scatter_1.Scatter,
    Radar: radar_1.Radar,
    Rose: rose_1.Rose,
    Stock: stock_1.Stock,
    TinyLine: tiny_line_1.TinyLine,
    TinyArea: tiny_area_1.TinyArea,
    TinyColumn: tiny_column_1.TinyColumn,
    TinyProgress: tiny_progress_1.TinyProgress,
    TinyRing: tiny_ring_1.TinyRing,
    Waterfall: waterfall_1.Waterfall,
    Histogram: histogram_1.Histogram,
    Heatmap: heatmap_1.Heatmap,
    Box: box_1.Box,
    Sankey: sankey_1.Sankey,
    Bullet: bullet_1.Bullet,
    Gauge: gauge_1.Gauge,
    Liquid: liquid_1.Liquid,
    WordCloud: wordCloud_1.WordCloud,
    Treemap: treemap_1.Treemap,
    RadialBar: radial_bar_1.RadialBar,
    CirclePacking: circle_packing_1.CirclePacking,
    Violin: violin_1.Violin,
    BidirectionalBar: bidirectional_bar_1.BidirectionalBar,
    Venn: venn_1.Venn,
    Mix: mix_1.Mix,
    Sunburst: sunburst_1.Sunburst,
};
