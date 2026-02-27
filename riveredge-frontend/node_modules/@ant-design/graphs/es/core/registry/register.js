import { register } from '@antv/g6';
import { BUILT_IN_EXTENSIONS } from './build-in';
export function registerBuiltInExtensions() {
    Object.entries(BUILT_IN_EXTENSIONS).forEach(([category, extensions]) => {
        Object.entries(extensions).forEach(([type, extension]) => {
            register(category, type, extension);
        });
    });
}
