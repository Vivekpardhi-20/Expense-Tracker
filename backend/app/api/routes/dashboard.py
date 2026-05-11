from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.expense import Expense, Income, Budget, Category, LentMoney, Investment
from app.schemas import (
    DashboardStatsResponse,
    DashboardHistoryResponse,
    DailyExpenseResponse,
    CategoryWiseExpenseResponse,
    TransactionResponse,
    BudgetStatusResponse,
)
from app.core.security import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

HISTORY_TYPES = {"expenses", "income", "savings", "receivable", "investments", "transactions"}

def month_bounds(month: str | int = None, year: int = None, from_date: str = None, to_date: str = None) -> tuple[datetime, datetime, str]:
    if from_date and to_date:
        start = datetime.fromisoformat(from_date)
        end = datetime.fromisoformat(to_date)
        if len(to_date) == 10:
            end = end + timedelta(days=1)
        return start, end, start.strftime("%Y-%m")

    if month and isinstance(month, str) and "-" in month:
        start = datetime.strptime(month, "%Y-%m")
    else:
        today = datetime.now()
        selected_year = year or today.year
        selected_month = int(month) if month else today.month
        start = datetime(selected_year, selected_month, 1)

    next_month = datetime(start.year + int(start.month == 12), 1 if start.month == 12 else start.month + 1, 1)
    return start, next_month, start.strftime("%Y-%m")

def movement_sort_key(item: DashboardHistoryResponse):
    return item.date

def expense_history_rows(db: Session, user_id: str, start: datetime, end: datetime) -> list[DashboardHistoryResponse]:
    rows: list[DashboardHistoryResponse] = []
    expenses = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= start,
        Expense.date < end
    ).all()
    for exp in expenses:
        category = db.query(Category).filter(Category.id == exp.category_id).first()
        rows.append(DashboardHistoryResponse(
            id=f"expense-{exp.id}",
            source_id=exp.id,
            source_type="expense",
            source_category_id=exp.category_id,
            type="Expense",
            title=exp.title or exp.description or "Expense",
            category=category.name if category else exp.category_id,
            mode=exp.payment_mode,
            amount=float(exp.amount),
            impact="EXPENSE",
            date=exp.date.strftime("%Y-%m-%d"),
            status="Recorded",
            notes=exp.notes or exp.description,
        ))
    return rows

def income_history_rows(db: Session, user_id: str, start: datetime, end: datetime) -> list[DashboardHistoryResponse]:
    rows: list[DashboardHistoryResponse] = []
    income = db.query(Income).filter(
        Income.user_id == user_id,
        Income.date >= start,
        Income.date < end
    ).all()
    for item in income:
        rows.append(DashboardHistoryResponse(
            id=f"income-{item.id}",
            source_id=item.id,
            source_type="income",
            type="Income",
            title=item.title or item.source,
            category=item.source,
            mode=None,
            amount=float(item.amount),
            impact="INCOME",
            date=item.date.strftime("%Y-%m-%d"),
            status="Received",
            notes=item.notes or item.description,
        ))
    return rows

def lent_history_rows(
    db: Session,
    user_id: str,
    start: datetime,
    end: datetime,
    pending_only: bool = False,
    include_returned_movements: bool = False,
) -> list[DashboardHistoryResponse]:
    query = db.query(LentMoney).filter(LentMoney.user_id == user_id)
    if pending_only:
        query = query.filter(LentMoney.status == "PENDING", LentMoney.given_date >= start, LentMoney.given_date < end)
    else:
        query = query.filter(LentMoney.given_date >= start, LentMoney.given_date < end)
    rows: list[DashboardHistoryResponse] = []
    for item in query.all():
        rows.append(DashboardHistoryResponse(
            id=f"lent-{item.id}",
            source_id=item.id,
            source_type="lent_money",
            type="Money Lent",
            title=f"Money lent to {item.person_name}",
            category=item.person_name,
            mode=item.payment_mode,
            amount=float(item.amount),
            impact="MONEY_LENT",
            date=item.given_date.strftime("%Y-%m-%d"),
            status=item.status,
            notes=item.notes,
        ))
    if include_returned_movements:
        returned = db.query(LentMoney).filter(
            LentMoney.user_id == user_id,
            LentMoney.status == "RETURNED",
            LentMoney.returned_date >= start,
            LentMoney.returned_date < end,
        ).all()
        for item in returned:
            rows.append(DashboardHistoryResponse(
                id=f"returned-{item.id}",
                source_id=item.id,
                source_type="lent_money",
                type="Money Returned",
                title=f"Money returned by {item.person_name}",
                category=item.person_name,
                mode=item.payment_mode,
                amount=float(item.amount),
                impact="MONEY_RETURNED",
                date=item.returned_date.strftime("%Y-%m-%d"),
                status=item.status,
                notes=f"Linked Money Lent ID: {item.id}" + (f" - {item.notes}" if item.notes else ""),
            ))
    return rows

def investment_history_rows(db: Session, user_id: str, start: datetime, end: datetime) -> list[DashboardHistoryResponse]:
    rows: list[DashboardHistoryResponse] = []
    investments = db.query(Investment).filter(
        Investment.user_id == user_id,
        Investment.purchase_date >= start,
        Investment.purchase_date < end
    ).all()
    for item in investments:
        rows.append(DashboardHistoryResponse(
            id=f"investment-{item.id}",
            source_id=item.id,
            source_type="investment",
            type="Investment",
            title=item.investment_name,
            category=item.investment_type,
            mode=item.broker_name,
            amount=float(item.amount_invested),
            impact="INVESTMENT",
            date=item.purchase_date.strftime("%Y-%m-%d"),
            status="Invested",
            notes=item.notes,
        ))
    return rows

@router.get("/stats", response_model=DashboardStatsResponse)
def get_stats(
    month: str = None,
    year: int = None,
    from_date: str = None,
    to_date: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start, end, month_key = month_bounds(month, year, from_date, to_date)
    prev_date = (start - timedelta(days=1)).strftime("%Y-%m")
    prev_start, prev_end, _ = month_bounds(prev_date)
    
    normal_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user["sub"],
        Expense.date >= start,
        Expense.date < end
    ).scalar() or 0

    pending_lent_expenses = db.query(func.sum(LentMoney.amount)).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.status == "PENDING",
        LentMoney.given_date >= start,
        LentMoney.given_date < end
    ).scalar() or 0

    investment_outflow = db.query(func.sum(Investment.amount_invested)).filter(
        Investment.user_id == current_user["sub"],
        Investment.purchase_date >= start,
        Investment.purchase_date < end
    ).scalar() or 0

    current_expenses = normal_expenses + pending_lent_expenses + investment_outflow
    
    # Previous month expenses
    prev_normal_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user["sub"],
        Expense.date >= prev_start,
        Expense.date < prev_end
    ).scalar() or 0

    prev_pending_lent = db.query(func.sum(LentMoney.amount)).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.status == "PENDING",
        LentMoney.given_date >= prev_start,
        LentMoney.given_date < prev_end
    ).scalar() or 0

    prev_investments = db.query(func.sum(Investment.amount_invested)).filter(
        Investment.user_id == current_user["sub"],
        Investment.purchase_date >= prev_start,
        Investment.purchase_date < prev_end
    ).scalar() or 0

    prev_expenses = prev_normal_expenses + prev_pending_lent + prev_investments
    
    # Current month income
    current_income = db.query(func.sum(Income.amount)).filter(
        Income.user_id == current_user["sub"],
        Income.date >= start,
        Income.date < end
    ).scalar() or 0

    receivable_amount = db.query(func.sum(LentMoney.amount)).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.status == "PENDING"
    ).scalar() or 0

    total_investments = db.query(func.sum(Investment.amount_invested)).filter(
        Investment.user_id == current_user["sub"],
        Investment.purchase_date >= start,
        Investment.purchase_date < end
    ).scalar() or 0
    
    # Previous month income
    prev_income = db.query(func.sum(Income.amount)).filter(
        Income.user_id == current_user["sub"],
        Income.date >= prev_start,
        Income.date < prev_end
    ).scalar() or 0
    
    # Calculate changes
    expenses_change = ((current_expenses - prev_expenses) / prev_expenses * 100) if prev_expenses > 0 else 0
    income_change = ((current_income - prev_income) / prev_income * 100) if prev_income > 0 else 0
    
    savings = current_income - current_expenses
    prev_savings = prev_income - prev_expenses
    savings_change = ((savings - prev_savings) / abs(prev_savings) * 100) if prev_savings != 0 else 0
    
    # Total transactions
    current_transactions = db.query(func.count(Expense.id)).filter(
        Expense.user_id == current_user["sub"],
        Expense.date >= start,
        Expense.date < end
    ).scalar() + db.query(func.count(Income.id)).filter(
        Income.user_id == current_user["sub"],
        Income.date >= start,
        Income.date < end
    ).scalar() + db.query(func.count(LentMoney.id)).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.given_date >= start,
        LentMoney.given_date < end
    ).scalar() + db.query(func.count(LentMoney.id)).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.status == "RETURNED",
        LentMoney.returned_date >= start,
        LentMoney.returned_date < end
    ).scalar() + db.query(func.count(Investment.id)).filter(
        Investment.user_id == current_user["sub"],
        Investment.purchase_date >= start,
        Investment.purchase_date < end
    ).scalar()
    
    prev_transactions = db.query(func.count(Expense.id)).filter(
        Expense.user_id == current_user["sub"],
        Expense.date >= prev_start,
        Expense.date < prev_end
    ).scalar() + db.query(func.count(Income.id)).filter(
        Income.user_id == current_user["sub"],
        Income.date >= prev_start,
        Income.date < prev_end
    ).scalar() + db.query(func.count(LentMoney.id)).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.given_date >= prev_start,
        LentMoney.given_date < prev_end
    ).scalar() + db.query(func.count(LentMoney.id)).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.status == "RETURNED",
        LentMoney.returned_date >= prev_start,
        LentMoney.returned_date < prev_end
    ).scalar() + db.query(func.count(Investment.id)).filter(
        Investment.user_id == current_user["sub"],
        Investment.purchase_date >= prev_start,
        Investment.purchase_date < prev_end
    ).scalar()
    
    transactions_change = ((current_transactions - prev_transactions) / prev_transactions * 100) if prev_transactions > 0 else 0
    
    return DashboardStatsResponse(
        total_expenses=float(current_expenses),
        total_income=float(current_income),
        savings=float(savings),
        receivable_amount=float(receivable_amount),
        total_investments=float(total_investments),
        total_transactions=int(current_transactions),
        expenses_change_percent=float(expenses_change),
        income_change_percent=float(income_change),
        savings_change_percent=float(savings_change),
        transactions_change_percent=float(transactions_change),
    )

@router.get("/expense-overview", response_model=list[DailyExpenseResponse])
def get_expense_overview(
    month: str = None,
    year: int = None,
    from_date: str = None,
    to_date: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start, end, _ = month_bounds(month, year, from_date, to_date)
    
    expenses = db.query(
        func.date(Expense.date).label("date"),
        func.sum(Expense.amount).label("amount")
    ).filter(
        Expense.user_id == current_user["sub"],
        Expense.date >= start,
        Expense.date < end
    ).group_by(func.date(Expense.date)).all()
    
    totals: dict[str, float] = {str(exp.date): float(exp.amount) for exp in expenses}

    lent = db.query(func.date(LentMoney.given_date).label("date"), func.sum(LentMoney.amount).label("amount")).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.status == "PENDING",
        LentMoney.given_date >= start,
        LentMoney.given_date < end,
    ).group_by(func.date(LentMoney.given_date)).all()
    for item in lent:
        totals[str(item.date)] = totals.get(str(item.date), 0) + float(item.amount)

    investments = db.query(func.date(Investment.purchase_date).label("date"), func.sum(Investment.amount_invested).label("amount")).filter(
        Investment.user_id == current_user["sub"],
        Investment.purchase_date >= start,
        Investment.purchase_date < end,
    ).group_by(func.date(Investment.purchase_date)).all()
    for item in investments:
        totals[str(item.date)] = totals.get(str(item.date), 0) + float(item.amount)

    return [DailyExpenseResponse(date=date, amount=amount) for date, amount in sorted(totals.items())]

@router.get("/category-expenses", response_model=list[CategoryWiseExpenseResponse])
def get_category_expenses(
    month: str = None,
    year: int = None,
    from_date: str = None,
    to_date: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start, end, _ = month_bounds(month, year, from_date, to_date)
    
    normal_total = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user["sub"],
        Expense.date >= start,
        Expense.date < end
    ).scalar() or 0
    lent_total_for_denominator = db.query(func.sum(LentMoney.amount)).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.status == "PENDING",
        LentMoney.given_date >= start,
        LentMoney.given_date < end
    ).scalar() or 0
    investment_total_for_denominator = db.query(func.sum(Investment.amount_invested)).filter(
        Investment.user_id == current_user["sub"],
        Investment.purchase_date >= start,
        Investment.purchase_date < end
    ).scalar() or 0
    total = normal_total + lent_total_for_denominator + investment_total_for_denominator or 1
    
    categories_exp = db.query(
        Category.name,
        func.sum(Expense.amount).label("amount")
    ).join(Expense).filter(
        Expense.user_id == current_user["sub"],
        Expense.date >= start,
        Expense.date < end
    ).group_by(Category.id, Category.name).all()
    
    result = [
        CategoryWiseExpenseResponse(
            name=cat.name,
            value=float(cat.amount),
            percentage=(float(cat.amount) / float(total) * 100)
        )
        for cat in categories_exp
    ]
    lent_total = db.query(func.sum(LentMoney.amount)).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.status == "PENDING",
        LentMoney.given_date >= start,
        LentMoney.given_date < end,
    ).scalar() or 0
    if lent_total:
        result.append(CategoryWiseExpenseResponse(name="Money Lent", value=float(lent_total), percentage=(float(lent_total) / float(total) * 100)))
    investment_total = db.query(func.sum(Investment.amount_invested)).filter(
        Investment.user_id == current_user["sub"],
        Investment.purchase_date >= start,
        Investment.purchase_date < end,
    ).scalar() or 0
    if investment_total:
        result.append(CategoryWiseExpenseResponse(name="Investments", value=float(investment_total), percentage=(float(investment_total) / float(total) * 100)))
    return result

@router.get("/recent-transactions", response_model=list[TransactionResponse])
def get_recent_transactions(
    limit: int = 10,
    month: str = None,
    year: int = None,
    from_date: str = None,
    to_date: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start, end, _ = month_bounds(month, year, from_date, to_date)
    expenses = db.query(Expense).filter(
        Expense.user_id == current_user["sub"],
        Expense.date >= start,
        Expense.date < end
    ).order_by(Expense.date.desc()).limit(limit).all()

    income = db.query(Income).filter(
        Income.user_id == current_user["sub"],
        Income.date >= start,
        Income.date < end
    ).order_by(Income.date.desc()).limit(limit).all()

    lent_entries = db.query(LentMoney).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.given_date >= start,
        LentMoney.given_date < end
    ).order_by(LentMoney.given_date.desc()).limit(limit).all()

    returned_entries = db.query(LentMoney).filter(
        LentMoney.user_id == current_user["sub"],
        LentMoney.status == "RETURNED",
        LentMoney.returned_date >= start,
        LentMoney.returned_date < end
    ).order_by(LentMoney.returned_date.desc()).limit(limit).all()

    investments = db.query(Investment).filter(
        Investment.user_id == current_user["sub"],
        Investment.purchase_date >= start,
        Investment.purchase_date < end
    ).order_by(Investment.purchase_date.desc()).limit(limit).all()
    
    transactions = [
        (
            lambda category: TransactionResponse(
                id=exp.id,
                type="expense",
                category=category.name if category else exp.category_id,
                amount=exp.amount,
                date=exp.date.strftime("%Y-%m-%d"),
                title=exp.title or exp.description or "Expense",
                description=exp.notes or exp.description or "",
            )
        )(db.query(Category).filter(Category.id == exp.category_id).first())
        for exp in expenses
    ]

    transactions.extend(
        TransactionResponse(
            id=item.id,
            type="income",
            category="Income",
            amount=item.amount,
            date=item.date.strftime("%Y-%m-%d"),
            title=item.title or item.source,
            description=item.notes or item.description or "",
        )
        for item in income
    )

    transactions.extend(
        TransactionResponse(
            id=item.id,
            type="lent",
            category="Money Lent",
            amount=item.amount,
            date=item.given_date.strftime("%Y-%m-%d"),
            title=f"Money lent to {item.person_name}",
            description=item.notes or item.status,
        )
        for item in lent_entries
    )

    transactions.extend(
        TransactionResponse(
            id=item.id,
            type="money_returned",
            category="Money Returned",
            amount=item.amount,
            date=item.returned_date.strftime("%Y-%m-%d"),
            title=f"Money returned by {item.person_name}",
            description=f"Linked Money Lent ID: {item.id}",
        )
        for item in returned_entries
        if item.returned_date
    )

    transactions.extend(
        TransactionResponse(
            id=item.id,
            type="investment",
            category=item.investment_type,
            amount=item.amount_invested,
            date=item.purchase_date.strftime("%Y-%m-%d"),
            title=item.investment_name,
            description=item.broker_name or "",
        )
        for item in investments
    )
    
    return sorted(transactions, key=lambda item: item.date, reverse=True)[:limit]

@router.get("/history", response_model=list[DashboardHistoryResponse])
def get_dashboard_history(
    type: str,
    month: str = None,
    year: int = None,
    from_date: str = None,
    to_date: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if type not in HISTORY_TYPES:
        return []

    start, end, _ = month_bounds(month, year, from_date, to_date)
    user_id = current_user["sub"]

    if type == "expenses":
        rows = (
            expense_history_rows(db, user_id, start, end)
            + lent_history_rows(db, user_id, start, end, pending_only=True)
            + investment_history_rows(db, user_id, start, end)
        )
    elif type == "income":
        rows = income_history_rows(db, user_id, start, end)
    elif type == "savings":
        rows = (
            income_history_rows(db, user_id, start, end)
            + expense_history_rows(db, user_id, start, end)
            + lent_history_rows(db, user_id, start, end, include_returned_movements=True)
            + investment_history_rows(db, user_id, start, end)
        )
    elif type == "receivable":
        rows = lent_history_rows(db, user_id, start, end)
    elif type == "investments":
        rows = investment_history_rows(db, user_id, start, end)
    else:
        rows = (
            income_history_rows(db, user_id, start, end)
            + expense_history_rows(db, user_id, start, end)
            + lent_history_rows(db, user_id, start, end, include_returned_movements=True)
            + investment_history_rows(db, user_id, start, end)
        )

    return sorted(rows, key=movement_sort_key, reverse=True)

@router.get("/budget-status", response_model=list[BudgetStatusResponse])
def get_budget_status(
    month: str = None,
    year: int = None,
    from_date: str = None,
    to_date: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start, end, month_key = month_bounds(month, year, from_date, to_date)
    
    budgets = db.query(Budget).filter(
        Budget.user_id == current_user["sub"],
        Budget.month == month_key
    ).all()
    
    result = []
    for budget in budgets:
        spent = db.query(func.sum(Expense.amount)).filter(
            Expense.category_id == budget.category_id,
            Expense.user_id == current_user["sub"],
            Expense.date >= start,
            Expense.date < end
        ).scalar() or 0
        
        percentage = (float(spent) / float(budget.limit_amount) * 100) if budget.limit_amount > 0 else 0
        
        cat = db.query(Category).filter(Category.id == budget.category_id).first()
        
        result.append(BudgetStatusResponse(
            category=cat.name if cat else budget.category_id,
            spent=float(spent),
            limit=float(budget.limit_amount),
            percentage=percentage
        ))
    
    return result

@router.get("", response_model=DashboardStatsResponse)
def get_dashboard_summary(
    month: str = None,
    year: int = None,
    from_date: str = None,
    to_date: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_stats(month=month, year=year, from_date=from_date, to_date=to_date, current_user=current_user, db=db)
