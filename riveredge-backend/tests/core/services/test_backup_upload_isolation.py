import io
import json
import zipfile
from datetime import datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi import UploadFile
from core.services.system import data_backup_service as service


def upload(marker):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as z:
        z.writestr("backup_metadata.json", json.dumps({"backup_scope": "tenant"}))
        z.writestr("database.dump", marker)
    buf.seek(0)
    return UploadFile(file=buf)


@pytest.mark.asyncio
async def test_same_name_and_second_uploads_do_not_share_files(monkeypatch, tmp_path):
    monkeypatch.setattr(service, "resolve_data_backup_dir", lambda: str(tmp_path))
    monkeypatch.setattr(service, "resolve_business_datetime", lambda: datetime(2026, 9, 6))
    monkeypatch.setattr(service, "store_backup_file_path", lambda p: p)
    async def create(**kw):
        return SimpleNamespace(uuid="fixture", **kw)
    monkeypatch.setattr(service.DataBackup, "create", create)
    first = await service.DataBackupService.upload_backup_file(1, upload("first"), "same")
    second = await service.DataBackupService.upload_backup_file(2, upload("second"), "same")
    assert first.file_path != second.file_path
    for record, expected in [(first, b"first"), (second, b"second")]:
        with zipfile.ZipFile(record.file_path) as z:
            assert z.read("database.dump") == expected


@pytest.mark.asyncio
async def test_failed_record_creation_removes_only_new_upload(monkeypatch, tmp_path):
    existing = tmp_path / "existing.zip"
    existing.write_bytes(b"keep")
    monkeypatch.setattr(service, "resolve_data_backup_dir", lambda: str(tmp_path))
    monkeypatch.setattr(service, "store_backup_file_path", lambda p: p)
    monkeypatch.setattr(service.DataBackup, "create", AsyncMock(side_effect=RuntimeError("fixture failure")))
    with pytest.raises(RuntimeError):
        await service.DataBackupService.upload_backup_file(1, upload("new"), "same")
    assert list(tmp_path.iterdir()) == [existing]
    assert existing.read_bytes() == b"keep"


@pytest.mark.asyncio
async def test_exclusive_create_never_deletes_an_existing_collision(monkeypatch, tmp_path):
    monkeypatch.setattr(service, "resolve_data_backup_dir", lambda: str(tmp_path))
    monkeypatch.setattr(service, "resolve_business_datetime", lambda: datetime(2026, 9, 6))
    monkeypatch.setattr(service, "uuid4", lambda: SimpleNamespace(hex="fixed"))
    existing = tmp_path / "same_20260906000000_fixed.zip"
    existing.write_bytes(b"keep")
    with pytest.raises(FileExistsError):
        await service.DataBackupService.upload_backup_file(1, upload("new"), "same")
    assert existing.read_bytes() == b"keep"
