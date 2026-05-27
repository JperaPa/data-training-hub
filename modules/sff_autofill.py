import pandas as pd

def autofill_sff_budget():
    # Load processed monthly report
    df = pd.read_csv("data/processed/monthly_report.csv")

    # Sum actuals by category
    actuals = df.groupby("category")["amount"].sum().reset_index()

    # Load SFF budget template
    template = pd.read_csv("templates/sff_budget_template.csv")

    # Merge actuals into template
    merged = template.merge(actuals, on="category", how="left")

    # Rename for clarity
    merged = merged.rename(columns={"amount": "actual"})

    # Fill missing actuals with 0
    merged["actual"] = merged["actual"].fillna(0)

    # Compute variance
    merged["variance"] = merged["budget"] - merged["actual"]

    # Save output
    merged.to_csv("data/processed/sff_budget_filled.csv", index=False)

    print("SFF Budget auto-filled.")
