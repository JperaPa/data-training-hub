import pandas as pd
import glob

def load_bank_statements():
    files = glob.glob("data/raw/bank_statements/*.csv")
    dfs = []

    for f in files:
        df = pd.read_csv(f)

        # Standardize column names
        df = df.rename(columns={
            "Posting Date": "date",
            "Description": "description",
            "Amount": "amount",
            "Credit Debit Indicator": "indicator"
        })

        # Normalize debit/credit
        df["amount"] = df.apply(
            lambda row: -abs(row["amount"]) if str(row["indicator"]).lower() == "debit" else abs(row["amount"]),
            axis=1
        )

        # Parse date
        df["date"] = pd.to_datetime(df["date"], errors="coerce")

        dfs.append(df)

    # If no CSVs found, return empty dataframe
    if not dfs:
        return pd.DataFrame(columns=["date", "description", "amount"])

    return pd.concat(dfs, ignore_index=True)

def load_budget():
    return pd.read_csv("data/raw/budget/budget.csv")