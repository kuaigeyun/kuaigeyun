/**
 * 物料管理列表左侧分组筛选：进入新建/编辑后返回时恢复选中。
 * sessionStorage 作为浏览上下文真源，避免 location.state 丢失或 restore=null 冲掉分组。
 */

export type MaterialListGroupFilterId = number | null

export const MATERIAL_LIST_GROUP_FILTER_STORAGE_KEY =
  'apps.master-data.materials.listGroupFilter'

export function normalizeMaterialListGroupFilterId(
  value: unknown,
): MaterialListGroupFilterId | undefined {
  if (value === undefined) return undefined
  if (value === null || value === 'all') return null
  if (value === 'no-group') return -1
  const n = Number(value)
  if (!Number.isFinite(n)) return undefined
  if (n === -1) return -1
  if (n > 0) return n
  return undefined
}

export function persistMaterialListGroupFilter(groupId: MaterialListGroupFilterId): void {
  try {
    sessionStorage.setItem(
      MATERIAL_LIST_GROUP_FILTER_STORAGE_KEY,
      groupId == null ? 'all' : String(groupId),
    )
  } catch {
    // ignore quota / private mode
  }
}

export function readPersistedMaterialListGroupFilter(): MaterialListGroupFilterId | undefined {
  try {
    const raw = sessionStorage.getItem(MATERIAL_LIST_GROUP_FILTER_STORAGE_KEY)
    if (raw == null || raw === '') return undefined
    return normalizeMaterialListGroupFilterId(raw === 'all' ? null : raw)
  } catch {
    return undefined
  }
}

/**
 * 保存物料后应恢复的左侧分组。
 * - 新建：优先保存后所属分组，否则进入页时的分组
 * - 编辑且改了所属分组：定位到新分组
 * - 否则：保持进入页时的分组（含「全部」null）
 */
export function resolveRestoreGroupIdAfterMaterialSave(params: {
  isCreatePage: boolean
  entryGroupId: MaterialListGroupFilterId | undefined
  previousGroupId?: number | null
  savedGroupId?: number | null
}): MaterialListGroupFilterId {
  const saved =
    params.savedGroupId != null && params.savedGroupId > 0 ? params.savedGroupId : null
  const prev =
    params.previousGroupId != null && params.previousGroupId > 0
      ? params.previousGroupId
      : null

  if (params.isCreatePage) {
    return saved ?? params.entryGroupId ?? null
  }
  if (saved != null && saved !== prev) {
    return saved
  }
  return params.entryGroupId !== undefined ? params.entryGroupId : null
}

/**
 * 是否应用 restore 到树选中。
 * null（全部）不得覆盖组件内存里仍保留的分组选中——那是上次「修复」仍复现的根因。
 */
export function shouldApplyRestoredGroupSelection(
  restoreGroupId: MaterialListGroupFilterId | undefined,
): restoreGroupId is number {
  return restoreGroupId != null && (restoreGroupId === -1 || restoreGroupId > 0)
}
