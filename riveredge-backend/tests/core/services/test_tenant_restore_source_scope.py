from pathlib import Path
from types import SimpleNamespace

import pytest

from core.services.system import data_backup_jobs as jobs


@pytest.mark.parametrize("source_tenant_id", [1, 2])
def test_restore_only_clears_target_tenant(monkeypatch, source_tenant_id):
    scripts = []

    def capture(cmd, **kwargs):
        scripts.append(Path(cmd[-1]).read_text())
        return SimpleNamespace(returncode=0)

    monkeypatch.setattr(jobs.subprocess, "run", capture)
    monkeypatch.setattr(jobs, "_psql_base_cmd", lambda: ["psql-fixture"])
    monkeypatch.setattr(jobs, "_psql_env", lambda: {})
    jobs._run_tenant_restore_transaction(
        delete_order=["core_files"],
        insert_order=["core_files"],
        import_plan={"core_files": (["tenant_id", "file_path"], "tenant_id,file_path\n1,1/a.pdf\n")},
        target_tenant_id=1,
        source_tenant_id=source_tenant_id,
        table_pk_map={},
        table_column_meta={},
        table_column_map={"core_files": ["tenant_id", "file_path"]},
        fk_rows=[],
        fk_constraints=[],
    )
    sql = scripts[0]
    assert 'DELETE FROM "core_files" WHERE tenant_id = 1;' in sql
    assert 'WHERE tenant_id = 2' not in sql
    assert 'tenant_id IN (1, 2)' not in sql
    assert 'tenant_id IN (1)' in sql  # 关联表仍清理目标租户
    assert sql.startswith("BEGIN;") and sql.endswith("COMMIT;\n")
    if source_tenant_id != 1:
        assert "WHERE tenant_id = 1 AND file_path LIKE '2/%'" in sql


def test_cross_system_csv_still_maps_tenant_and_file_path():
    columns, csv = jobs._prepare_csv_for_import(
        "core_files", "tenant_id,file_path\n2,2/a.pdf\n",
        target_tenant_id=1, source_tenant_id=2,
        table_columns=["tenant_id", "file_path"],
    )
    assert columns == ["tenant_id", "file_path"]
    assert "1,1/a.pdf" in csv
    assert "2/a.pdf" not in csv
