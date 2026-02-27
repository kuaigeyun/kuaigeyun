/**
 * Wraps plugins collection with utility methods
 */
export const pluginRegistry = (plugins) => {
    return {
        plugins: plugins,
        entries: () => Object.entries(plugins),
        values: () => Object.values(plugins),
        exists: () => Object.values(plugins).length > 0,
        findWithLabelByType(type) {
            for (const [label, plugin] of Object.entries(this.plugins)) {
                if (!plugin || typeof plugin !== 'object')
                    continue;
                if (!plugin.propPanel || typeof plugin.propPanel !== 'object')
                    continue;
                const defaultSchema = plugin.propPanel.defaultSchema;
                if (defaultSchema && 'type' in defaultSchema && defaultSchema.type === type) {
                    return [label, plugin];
                }
            }
            return ['', undefined];
        },
        findByType(type) {
            const [, plugin] = this.findWithLabelByType(type);
            return plugin;
        },
    };
};
//# sourceMappingURL=pluginRegistry.js.map