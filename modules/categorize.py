def categorize(description):
    d = str(description).lower()

    if "amazon" in d:
        return "Shopping"
    if "shell" in d or "bp" in d:
        return "Gas"
    if "walmart" in d or "jewel" in d:
        return "Groceries"
    if "mortgage" in d:
        return "Housing"
    if "t-mobile" in d:
        return "Phone"

    return "Other"