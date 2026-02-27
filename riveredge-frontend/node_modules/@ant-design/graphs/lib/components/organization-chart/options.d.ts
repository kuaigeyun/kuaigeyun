import type { GraphOptions } from '../../types';
import { OrganizationChartOptions } from './types';
export declare const DEFAULT_OPTIONS: GraphOptions;
export declare function getOrganizationChartOptions({ direction, labelField, }: Pick<OrganizationChartOptions, 'direction' | 'labelField'>): GraphOptions;
