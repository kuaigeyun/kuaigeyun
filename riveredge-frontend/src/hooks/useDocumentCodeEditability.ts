import { useEffect, useState } from 'react';
import { getDocumentCodeEditability } from '../services/codeRule';

export interface DocumentCodeEditabilityState {
  editable: boolean;
  lockedReason: string | null;
  loading: boolean;
}

/**
 * 编辑态编号可编辑性（草稿或无下游可改，全站统一 API）。
 */
export function useDocumentCodeEditability(
  pageCode: string,
  documentId: number | null | undefined,
  override?: { editable?: boolean; lockedReason?: string | null },
): DocumentCodeEditabilityState {
  const [state, setState] = useState<DocumentCodeEditabilityState>({
    editable: true,
    lockedReason: null,
    loading: false,
  });

  useEffect(() => {
    if (override?.editable !== undefined) {
      setState({
        editable: override.editable,
        lockedReason: override.lockedReason ?? null,
        loading: false,
      });
      return;
    }
    if (!documentId) {
      setState({ editable: true, lockedReason: null, loading: false });
      return;
    }
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true }));
    getDocumentCodeEditability(pageCode, documentId)
      .then((res) => {
        if (cancelled) return;
        setState({
          editable: res.editable,
          lockedReason: res.locked_reason ?? null,
          loading: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ editable: false, lockedReason: 'document_code.has_downstream', loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [pageCode, documentId, override?.editable, override?.lockedReason]);

  return state;
}
