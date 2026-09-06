"""供应商评价加权得分单测（R-03）。"""

from decimal import Decimal
from types import SimpleNamespace

from apps.kuaizhizao.services.supplier_eval_scoring import (
    compute_weighted_score,
    resolve_grade,
)


def test_weighted_score_and_grade():
    lines = [
        SimpleNamespace(weight=1, max_score=100, score=90),
        SimpleNamespace(weight=1, max_score=100, score=70),
    ]
    score = compute_weighted_score(lines)
    assert score == Decimal("80.00")
    assert resolve_grade(score, None) == "B"


def test_score_clamped_to_max():
    lines = [SimpleNamespace(weight=2, max_score=50, score=80)]
    score = compute_weighted_score(lines)
    assert score == Decimal("100.00")
    assert resolve_grade(score, [{"min": 100, "grade": "S"}, {"min": 0, "grade": "A"}]) == "S"
