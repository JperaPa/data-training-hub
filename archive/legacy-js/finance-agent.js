const fs = require("fs");
const path = require("path");
const PDF = require("pdf-parse");
const generateForecast = require("./forecasting");

module.exports = async function runFinanceAgent() {
  console.log("[FINANCE] Finance Agent started");

  // ------------------------------------------------------------
  // 1. Locate bills folder
  // ------------------------------------------------------------
  const billsFolder = path.join(__dirname, "../..", "data/raw/bills");

  if (!fs.existsSync(billsFolder)) {
    console.log("[FINANCE] Bills folder not found:", billsFolder);
    return { netCashFlow: 0, income: [], expenses: [], alerts: [] };
  }

  const billFiles = fs.readdirSync(billsFolder).filter(f => f.endsWith(".pdf"));
  console.log("[FINANCE] Found bill files:", billFiles);

  const bills = [];

  // ------------------------------------------------------------
  // 2. Read and extract text from each PDF
  // ------------------------------------------------------------
  for (const file of billFiles) {
    const filePath = path.join(billsFolder, file);
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await PDF(dataBuffer);

    bills.push({
      file,
      text: pdfData.text
    });
  }

  // ------------------------------------------------------------
  // 3. Parse vendor, amount, due date
  // ------------------------------------------------------------
  const parsedBills = bills.map(bill => {
    const text = bill.text;

    const vendorMatch = text.match(/(ComEd|Nicor|Xfinity|AT&T|T-Mobile|Verizon|Chase|Capital One|USAA|Discover|Amex|Groot|Antioch|Water|Sewer)/i);
    const amountMatch = text.match(/\$([0-9,]+\.\d{2})/);
    const dueMatch = text.match(/Due Date[:\s]+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);

    return {
      file: bill.file,
      vendor: vendorMatch ? vendorMatch[1] : null,
      amount: amountMatch ? amountMatch[1] : null,
      due_date: dueMatch ? dueMatch[1] : null
    };
  });

  console.log("[FINANCE] Parsed bills:", parsedBills);

  // ------------------------------------------------------------
  // 4. Save to CSV for dashboard
  // ------------------------------------------------------------
  const outputPath = path.join(__dirname, "../..", "data/processed/bills.csv");
  const header = "file,vendor,amount,due_date\n";

  const rows = parsedBills
    .map(b => `${b.file},${b.vendor || ""},${b.amount || ""},${b.due_date || ""}`)
    .join("\n");

  fs.writeFileSync(outputPath, header + rows);
  console.log("[FINANCE] Saved CSV:", outputPath);

  const forecast = generateForecast(parsedBills, []); // transactions later

return {
  netCashFlow: forecast.projectedNet,
  income: [],
  expenses: parsedBills,
  alerts: [],
  forecast
};

  // ------------------------------------------------------------
  // 5. Return data to CE Agent / Dashboard
  // ------------------------------------------------------------
  return {
    netCashFlow: 0,
    income: [],
    expenses: parsedBills,
    alerts: []
  };
};
