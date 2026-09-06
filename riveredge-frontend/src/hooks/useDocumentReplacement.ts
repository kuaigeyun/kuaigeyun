/**
 * 解析宿主菜单 path 是否被行业包 document 替代。
 */
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  getDocumentReplacementComponent,
  matchDocumentReplacement,
  type DocumentReplacementDecl,
} from '../utils/documentReplacementRegistry';
import type { ComponentType, LazyExoticComponent } from 'react';

type State = {
  loading: boolean;
  replacement: DocumentReplacementDecl | null;
  Component: LazyExoticComponent<ComponentType> | null;
};

const EMPTY: State = { loading: true, replacement: null, Component: null };

export function useDocumentReplacement(hostPathname: string): State {
  const [state, setState] = useState<State>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    setState(EMPTY);
    (async () => {
      try {
        const res = await api.get<{ items?: DocumentReplacementDecl[] }>(
          '/core/applications/industry-extensions/document-replacements',
        );
        const items = Array.isArray(res?.items) ? res.items : [];
        const hit = matchDocumentReplacement(hostPathname, items);
        if (cancelled) return;
        if (!hit) {
          setState({ loading: false, replacement: null, Component: null });
          return;
        }
        const Component = getDocumentReplacementComponent(hit.replacement_path);
        setState({ loading: false, replacement: hit, Component });
      } catch {
        if (!cancelled) {
          setState({ loading: false, replacement: null, Component: null });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hostPathname]);

  return state;
}
