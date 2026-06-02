// src/js/finance-agent.js

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");   // we will install this

module.exports = async function runFinanceAgent() {

    // ------------------------------------------------------------
    // 1. READ PDF BILLS
    // ------------------------------------------------------------
    const billsFolder = path.join(__dirname, "../..", "data/raw/bills");
    const billFiles = fs.readdirSync(billsFolder).filter(f => f.endsWith(".pdf"));

    const bills = [];

    for (const file of billFiles) {
        const filePath = path.join(billsFolder, file);
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);

        bills.push({
            file,
            text: pdfData.text
        });
    }

    // Now `bills` contains all extracted PDF text
    // Next step: parse vendor, amount, due date

        // ------------------------------------------------------------
    // 2. PARSE BILL TEXT
    // ------------------------------------------------------------
    const parsedBills = bills.map(bill => {
        const text = bill.text;

        const vendorMatch = text.match(/(ComEd|Nicor|Xfinity|AT&T|T-Mobile|Verizon|Chase|Capital One|USAA|Discover|Amex)/i);
        const amountMatch = text.match(/\$([0-9,]+\.\d{2})/);
        const dueMatch = text.match(/Due Date[:\s]+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);

        return {
            file: bill.file,
            vendor: vendorMatch ? vendorMatch[1] : null,
            amount: amountMatch ? amountMatch[1] : null,
            due_date: dueMatch ? dueMatch[1] : null
        };
    });
// ------------------------------------------------------------
    // 3. SAVE TO CSV FOR DASHBOARD
    // ------------------------------------------------------------
    const outputPath = path.join(__dirname, "../..", "data/processed/bills.csv");
    const header = "file,vendor,amount,due_date\n";

    const rows = parsedBills
        .map(b => `${b.file},${b.vendor || ""},${b.amount || ""},${b.due_date || ""}`)
        .join("\n");

    fs.writeFileSync(outputPath, header + rows);