import type { ReactNode } from 'react';
import type { TooltipProps } from '../tooltip';
declare const convertToTooltipProps: <P extends TooltipProps>(tooltip: P | ReactNode) => P | null;
export default convertToTooltipProps;
