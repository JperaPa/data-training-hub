import os
import re
from pdfminer.high_level import extract_text

BILL_REGEX = {
    "amount": r"\$([0-9,]+\.\d{2})",
    "due_date": r"(Due Date|DUE DATE|Due)\s*[:\-]?\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})",
    "vendor": r"(AT&T|ComEd|Nicor|Xfinity|T-Mobile|Verizon|Chase|Capital One|USAA|Discover|Amex)"
}

def parse_bill_text(text):
    vendor = None
    for v in ["AT&T","ComEd","Nicor","Xfinity","T-Mobile","Verizon","Chase","Capital One","USAA","Discover","Amex"]:
        if v.lower() in text.lower():
            vendor = v
            break

    amount_match = re.search(BILL_REGEX["amount"], text)
    due_match = re.search(BILL_REGEX["due_date"], text)

    return {
        "vendor": vendor,
        "amount": amount_match.group(1) if amount_match else None,
        "due_date": due_match.group(2) if due_match else None,
        "raw_text": text[:5000]
    }

def read_bills(folder="data/raw/bills"):
    bills = []
    for file in os.listdir(folder):
        if file.lower().endswith(".pdf"):
            path = os.path.join(folder, file)
            text = extract_text(path)
            parsed = parse_bill_text(text)
            parsed["file"] = file
            bills.append(parsed)
    return bills
import os
import re
from pdfminer.high_level import extract_text

BILL_REGEX = {
    "amount": r"\$([0-9,]+\.\d{2})",
    "due_date": r"(Due Date|DUE DATE|Due)\s*[:\-]?\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})",
    "vendor": r"(AT&T|ComEd|Nicor|Xfinity|T-Mobile|Verizon|Chase|Capital One|USAA|Discover|Amex)"
}

def parse_bill_text(text):
    vendor = None
    for v in ["AT&T","ComEd","Nicor","Xfinity","T-Mobile","Verizon","Chase","Capital One","USAA","Discover","Amex"]:
        if v.lower() in text.lower():
            vendor = v
            break

    amount_match = re.search(BILL_REGEX["amount"], text)
    due_match = re.search(BILL_REGEX["due_date"], text)

    return {
        "vendor": vendor,
        "amount": amount_match.group(1) if amount_match else None,
        "due_date": due_match.group(2) if due_match else None,
        "raw_text": text[:5000]
    }

def read_bills(folder="data/raw/bills"):
    bills = []
    for file in os.listdir(folder):
        if file.lower().endswith(".pdf"):
            path = os.path.join(folder, file)
            text = extract_text(path)
            parsed = parse_bill_text(text)
            parsed["file"] = file
            bills.append(parsed)
    return bills
