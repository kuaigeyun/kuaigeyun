import * as React from 'react';
import type { TimelineItemType, TimelineMode, TimelineProps } from './Timeline';
export default function useItems(prefixCls: string, mode: TimelineMode, items?: TimelineItemType[], children?: React.ReactNode, pending?: TimelineProps['pending'], pendingDot?: TimelineProps['pendingDot']): TimelineItemType[];
