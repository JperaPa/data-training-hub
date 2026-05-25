import pandas as pd
import glob

def load_bank_statements():
    files = glob.glob("data/raw/bank_statements/*.csv")
    dfs = [pd.read_csv(f) for f in files]
    return pd.concat(dfs, ignore_index=True)

def load_budget():
    return pd.read_csv("data/raw/budget/budget.csv")