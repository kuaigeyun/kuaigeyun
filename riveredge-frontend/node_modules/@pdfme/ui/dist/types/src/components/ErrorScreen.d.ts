import React from 'react';
import { Size } from '@pdfme/common';
declare const ErrorScreen: ({ size, error }: {
    size: Size;
    error: Error;
}) => React.JSX.Element;
export default ErrorScreen;
