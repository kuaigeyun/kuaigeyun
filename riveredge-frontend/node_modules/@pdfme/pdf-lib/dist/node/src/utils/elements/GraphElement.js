"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maths_1 = require("../maths");
class GraphElement {
    distance(P) {
        const H = this.orthoProjection(P);
        return (0, maths_1.distance)(H, P);
    }
}
exports.default = GraphElement;
//# sourceMappingURL=GraphElement.js.map