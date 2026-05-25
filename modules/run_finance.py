from modules.ingest import load_bank_statements, load_budget
from modules.clean import clean_columns
from modules.categorize import categorize
from modules.budget_compare import compare_budget

import pandas as pd

# Load
df = load_bank_statements()
budget = load_budget()

# Clean
df = clean_columns(df)
budget = clean_columns(budget)

# Categorize
df["category"] = df["description"].apply(categorize)

# Compare
report = compare_budget(df, budget)

# Save
report.to_csv("data/processed/monthly_report.csv", index=False)

print("Finance report generated.")