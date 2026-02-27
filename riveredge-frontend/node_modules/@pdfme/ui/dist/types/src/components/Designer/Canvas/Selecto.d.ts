import React from 'react';
import { OnSelect as SelectoOnSelect, OnDragStart as SelectoOnDragStart } from 'react-selecto';
type Props = {
    container: HTMLElement | null;
    continueSelect: boolean;
    onDragStart: (e: SelectoOnDragStart) => void;
    onSelect: (e: SelectoOnSelect) => void;
};
declare const Selecto: (props: Props) => React.JSX.Element;
export default Selecto;
