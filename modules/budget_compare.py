def compare_budget(transactions, budget):
    summary = (
        transactions.groupby("category")["amount"].sum()
        .reset_index()
        .rename(columns={"amount": "actual"})
    )

    result = summary.merge(budget, on="category", how="left")
    result["difference"] = result["actual"] - result["budget"]
    result["percent"] = result["difference"] / result["budget"]

    return result