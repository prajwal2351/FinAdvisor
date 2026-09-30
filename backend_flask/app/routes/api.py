from flask import Blueprint, request, jsonify
from decimal import Decimal
from backend_flask.app import db
from backend_flask.app.models.user import User
from backend_flask.app.models.financial import Income, Expense, Budget, SavingsGoal

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'online', 'service': 'FinAdvisor REST API'})

@api_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    user_id = request.args.get('userId', 'user_alex')
    month = request.args.get('month', '9')
    year = request.args.get('year', '2026')

    prefix = f"{year}-{month.zfill(2)}"
    incomes = Income.query.filter(Income.user_id == user_id, Income.date.startswith(prefix)).all()
    expenses = Expense.query.filter(Expense.user_id == user_id, Expense.date.startswith(prefix)).all()

    total_inc = sum([float(i.amount) for i in incomes])
    total_exp = sum([float(e.amount) for e in expenses])
    savings = total_inc - total_exp
    rate = round((savings / total_inc * 100), 2) if total_inc > 0 else 0.0

    return jsonify({
        'kpis': {
            'total_income': total_inc,
            'total_expenses': total_exp,
            'total_savings': savings,
            'savings_rate': rate
        }
    })
