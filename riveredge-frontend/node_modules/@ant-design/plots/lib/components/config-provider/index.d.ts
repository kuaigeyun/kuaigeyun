import React, { ReactNode } from 'react';
import { ConfigValue } from '../../context';
export interface ConfigProviderProps extends ConfigValue {
    children?: ReactNode;
}
export default function ConfigProvider({ children, ...value }: ConfigProviderProps): React.JSX.Element;
