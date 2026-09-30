import pytest
from decimal import Decimal

def test_savings_calculation():
    income = Decimal('65000.00')
    expenses = Decimal('41250.00')
    savings = income - expenses
    savings_rate = (savings / income) * 100
    assert savings == Decimal('23750.00')
    assert round(savings_rate, 1) == Decimal('36.5')

def test_budget_utilization():
    spent = Decimal('4500.00')
    limit = Decimal('6000.00')
    percentage = (spent / limit) * 100
    assert percentage == Decimal('75.0')

def test_over_budget_detection():
    spent = Decimal('4800.00')
    limit = Decimal('3000.00')
    percentage = (spent / limit) * 100
    assert percentage == Decimal('160.0')
    is_exceeded = percentage > Decimal('100.0')
    assert is_exceeded is True
