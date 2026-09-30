from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from backend_flask.app import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=True)
    user_type = db.Column(db.String(32), default='salaried') # salaried, student, freelancer, household
    currency = db.Column(db.String(8), default='INR')
    monthly_income = db.Column(db.Numeric(12, 2), default=0.0)
    primary_goal = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    incomes = db.relationship('Income', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    expenses = db.relationship('Expense', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    budgets = db.relationship('Budget', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    savings_goals = db.relationship('SavingsGoal', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'user_type': self.user_type,
            'currency': self.currency,
            'monthly_income': float(self.monthly_income or 0),
            'primary_goal': self.primary_goal,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
