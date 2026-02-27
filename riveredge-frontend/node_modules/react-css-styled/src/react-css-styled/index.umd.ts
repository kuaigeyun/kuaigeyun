import styled, * as others from "./index";

for (const name in others) {
    (styled as any)[name] = (others as any)[name];
}
export default styled;
