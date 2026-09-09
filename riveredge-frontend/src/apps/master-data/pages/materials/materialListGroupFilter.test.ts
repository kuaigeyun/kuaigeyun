import assert from 'node:assert/strict'
import {
  normalizeMaterialListGroupFilterId,
  resolveRestoreGroupIdAfterMaterialSave,
  shouldApplyRestoredGroupSelection,
} from './materialListGroupFilter'

assert.equal(normalizeMaterialListGroupFilterId(undefined), undefined)
assert.equal(normalizeMaterialListGroupFilterId(null), null)
assert.equal(normalizeMaterialListGroupFilterId('all'), null)
assert.equal(normalizeMaterialListGroupFilterId('no-group'), -1)
assert.equal(normalizeMaterialListGroupFilterId(12), 12)
assert.equal(normalizeMaterialListGroupFilterId('0'), undefined)

assert.equal(
  resolveRestoreGroupIdAfterMaterialSave({
    isCreatePage: false,
    entryGroupId: 5,
    previousGroupId: 5,
    savedGroupId: 5,
  }),
  5,
)
assert.equal(
  resolveRestoreGroupIdAfterMaterialSave({
    isCreatePage: false,
    entryGroupId: 5,
    previousGroupId: 5,
    savedGroupId: 9,
  }),
  9,
)
assert.equal(
  resolveRestoreGroupIdAfterMaterialSave({
    isCreatePage: true,
    entryGroupId: 5,
    savedGroupId: null,
  }),
  5,
)
assert.equal(
  resolveRestoreGroupIdAfterMaterialSave({
    isCreatePage: false,
    entryGroupId: undefined,
    previousGroupId: 1,
    savedGroupId: 1,
  }),
  null,
)

assert.equal(shouldApplyRestoredGroupSelection(undefined), false)
assert.equal(shouldApplyRestoredGroupSelection(null), false)
assert.equal(shouldApplyRestoredGroupSelection(-1), true)
assert.equal(shouldApplyRestoredGroupSelection(8), true)

console.log('materialListGroupFilter.test.ts: ok')
