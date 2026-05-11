from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: str
    password: str

class CategoryBase(BaseModel):
    name: str
    category_type: str = "EXPENSE"
    icon: Optional[str] = None
    color: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    category_id: str
    amount: float = Field(gt=0)
    date: datetime
    title: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    payment_mode: str

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class IncomeBase(BaseModel):
    source: str
    title: Optional[str] = None
    amount: float = Field(gt=0)
    date: datetime
    description: Optional[str] = None
    notes: Optional[str] = None

class IncomeCreate(IncomeBase):
    pass

class IncomeResponse(IncomeBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class BudgetBase(BaseModel):
    category_id: str
    category_name: Optional[str] = None
    amount: Optional[float] = None
    limit_amount: float = Field(gt=0)
    month: str
    year: Optional[int] = None

class BudgetCreate(BudgetBase):
    pass

class BudgetResponse(BudgetBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class DashboardStatsResponse(BaseModel):
    total_expenses: float
    total_income: float
    savings: float
    receivable_amount: float = 0
    total_investments: float = 0
    total_transactions: int
    expenses_change_percent: float
    income_change_percent: float
    savings_change_percent: float
    transactions_change_percent: float

class DailyExpenseResponse(BaseModel):
    date: str
    amount: float

class CategoryWiseExpenseResponse(BaseModel):
    name: str
    value: float
    percentage: float

class TransactionResponse(BaseModel):
    id: str
    type: str
    category: str
    amount: float
    date: str
    title: str
    description: str

class BudgetStatusResponse(BaseModel):
    category: str
    spent: float
    limit: float
    percentage: float

class DashboardHistoryResponse(BaseModel):
    id: str
    source_id: str
    source_type: str
    source_category_id: Optional[str] = None
    type: str
    title: str
    category: str
    mode: Optional[str] = None
    amount: float
    impact: str
    date: str
    status: Optional[str] = None
    notes: Optional[str] = None

class LentMoneyBase(BaseModel):
    person_name: str
    amount: float = Field(gt=0)
    payment_mode: str
    given_date: datetime
    expected_return_date: Optional[datetime] = None
    notes: Optional[str] = None

class LentMoneyCreate(LentMoneyBase):
    pass

class LentMoneyResponse(LentMoneyBase):
    id: str
    user_id: str
    returned_date: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True

class BudgetDetailResponse(BudgetResponse):
    spent: float = 0
    remaining: float = 0
    percentage: float = 0

class InvestmentBase(BaseModel):
    investment_type: str
    investment_name: str
    amount_invested: float = Field(gt=0)
    quantity: Optional[float] = None
    broker_name: Optional[str] = None
    purchase_date: datetime
    notes: Optional[str] = None

class InvestmentCreate(InvestmentBase):
    pass

class InvestmentResponse(InvestmentBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class RecurringBase(BaseModel):
    type: str
    title: str
    category: Optional[str] = None
    amount: float = Field(gt=0)
    payment_mode: Optional[str] = None
    frequency: str
    start_date: datetime
    next_due_date: datetime
    status: str = "ACTIVE"
    notes: Optional[str] = None

class RecurringCreate(RecurringBase):
    pass

class RecurringResponse(RecurringBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class GoalBase(BaseModel):
    name: str
    target_amount: float = Field(gt=0)
    current_amount: float = 0
    target_date: datetime
    status: str = "ACTIVE"
    notes: Optional[str] = None

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: str
    user_id: str
    progress_percentage: float = 0

class GoalContributionCreate(BaseModel):
    amount: float = Field(gt=0)
    contribution_date: datetime
    notes: Optional[str] = None

class PreferenceBase(BaseModel):
    currency: str = "INR"
    theme: str = "light"
    monthly_income_target: float = 0
    monthly_budget_target: float = 0

class PreferenceResponse(PreferenceBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str
