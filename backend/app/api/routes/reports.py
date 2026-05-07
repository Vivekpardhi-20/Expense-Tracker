from fastapi import APIRouter

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/monthly-summary")
def get_monthly_summary():
    return {"data": "monthly summary"}

@router.get("/category-report")
def get_category_report():
    return {"data": "category report"}

@router.post("/export")
def export_report(format: str = "pdf"):
    return {"message": f"Exporting report as {format}"}
