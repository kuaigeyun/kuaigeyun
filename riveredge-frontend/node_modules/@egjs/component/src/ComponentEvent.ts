/*
 * Copyright (c) 2015 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import ActualComponentEvent from "./ActualComponentEvent";
import { ComponentEventConstructor, DefaultProps } from "./types";

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment
const ComponentEvent = ActualComponentEvent as ComponentEventConstructor;

// eslint-disable-next-line @typescript-eslint/ban-types
type ComponentEvent<PROPS = {}, TYPE extends string = string, THIS = any> = DefaultProps<TYPE, THIS> & PROPS;

export default ComponentEvent;
