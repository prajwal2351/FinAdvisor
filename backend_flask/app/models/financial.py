from datetime import datetime
from backend_flask.app import db

class Income(db.Model):
    __tablename__ = 'incomes'

    id = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    source = db.Column(db.String(120), nullable=False)
    income_type = db.Column(db.String(32), default='salary')
    date = db.Column(db.String(10), nullable=False, index=True) # YYYY-MM-DD
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': float(self.amount),
            'source': self.source,
            'income_type': self.income_type,
            'date': self.date,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Expense(db.Model):
    __tablename__ = 'expenses'

    id = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    category = db.Column(db.String(64), nullable=False, index=True)
    description = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(10), nullable=False, index=True) # YYYY-MM-DD
    payment_method = db.Column(db.String(32), default='UPI')
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': float(self.amount),
            'category': self.category,
            'description': self.description,
            'date': self.date,
            'payment_method': self.payment_method,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Budget(db.Model):
    __tablename__ = 'budgets'

    id = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    month = db.Column(db.Integer, nullable=False) # 1-12
    year = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(64), nullable=False)
    limit_amount = db.Column(db.Numeric(12, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'month': self.month,
            'year': self.year,
            'category': self.category,
            'limit_amount': float(self.limit_amount),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class SavingsGoal(db.Model):
    __tablename__ = 'savings_goals'

    id = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(120), nullable=False)
    target_amount = db.Column(db.Numeric(12, 2), nullable=False)
    current_amount = db.Column(db.Numeric(12, 2), default=0.0)
    target_date = db.Column(db.String(10), nullable=False) # YYYY-MM-DD
    monthly_contribution = db.Column(db.Numeric(12, 2), default=0.0)
    icon = db.Column(db.String(32), default='Target')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'target_amount': float(self.target_amount),
            'current_amount': float(self.current_amount),
            'target_date': self.target_date,
            'monthly_contribution': float(self.monthly_contribution),
            'icon': self.icon,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
