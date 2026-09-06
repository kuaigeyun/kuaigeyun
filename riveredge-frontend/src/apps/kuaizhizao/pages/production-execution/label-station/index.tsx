/**
 * 快制造标签工位入口（R-16）。
 * 启用电子包 document 替代时渲染 OEM 签样页；否则通用工位台。
 */
import React, { Suspense } from 'react';
import { ListPageTemplate } from '../../../../../components/layout-templates';
import PageSkeleton from '../../../../../components/page-skeleton';
import { useDocumentReplacement } from '../../../../../hooks/useDocumentReplacement';
import { LabelStationWorkbench } from '../../../components/LabelStationWorkbench';

const HOST_PATH = '/apps/kuaizhizao/production-execution/label-station';

export default function LabelStationPage() {
  const { loading, Component } = useDocumentReplacement(HOST_PATH);

  if (loading) {
    return (
      <ListPageTemplate>
        <PageSkeleton />
      </ListPageTemplate>
    );
  }

  if (Component) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <Component />
      </Suspense>
    );
  }

  return <LabelStationWorkbench />;
}
