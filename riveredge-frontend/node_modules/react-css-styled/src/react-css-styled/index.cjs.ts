import styled, * as modules from "./index";

for (const name in modules) {
    (styled as any)[name] = (modules as any)[name];
}

module.exports = styled;
export * from "./index";
export default styled;
