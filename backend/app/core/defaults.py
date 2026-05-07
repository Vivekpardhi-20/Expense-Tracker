EXPENSE_CATEGORIES = [
    "Food & Dining",
    "Groceries",
    "Transport",
    "Fuel",
    "Shopping",
    "Bills & Utilities",
    "Rent",
    "EMI / Loans",
    "Mobile Recharge",
    "Internet / WiFi",
    "Electricity",
    "Water Bill",
    "Gas Bill",
    "Entertainment",
    "Movies",
    "OTT Subscriptions",
    "Travel",
    "Health & Medical",
    "Gym & Fitness",
    "Education",
    "Office Expenses",
    "Family Expenses",
    "Insurance",
    "Investment",
    "Savings",
    "Personal Care",
    "Gifts & Donations",
    "Maintenance",
    "Tax",
    "Miscellaneous",
    "Money Lent",
    "Stocks",
    "Mutual Funds",
    "SIP Investment",
    "ETF Investment",
    "Gold Investment",
    "Trading Charges",
    "Brokerage",
    "Investment Fees",
]

INCOME_CATEGORIES = [
    "Salary",
    "Freelancing",
    "Business Income",
    "Bonus",
    "Commission",
    "Rental Income",
    "Investment Returns",
    "Interest",
    "Cashback",
    "Refund",
    "Gift Received",
    "Money Returned",
    "Dividend Income",
    "Capital Gains",
    "Other Income",
]

def seed_default_categories(db, user_id: str, category_model, uuid_factory):
    existing = {
        (category.name, category.category_type)
        for category in db.query(category_model).filter(category_model.user_id == user_id).all()
    }

    for category_name in EXPENSE_CATEGORIES:
        if (category_name, "EXPENSE") not in existing:
            db.add(category_model(id=str(uuid_factory()), user_id=user_id, name=category_name, category_type="EXPENSE"))

    for category_name in INCOME_CATEGORIES:
        if (category_name, "INCOME") not in existing:
            db.add(category_model(id=str(uuid_factory()), user_id=user_id, name=category_name, category_type="INCOME"))
