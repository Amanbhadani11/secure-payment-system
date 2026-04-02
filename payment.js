const express = require("express");
const app = express();

app.use(express.json());

// 🔐 API Key (Security)
const API_KEY = "12345";

// 🔐 Middleware for API Key check
app.use((req, res, next) => {
  const key = req.headers["x-api-key"];

  if (key !== API_KEY) {
    return res.send("Unauthorized access");
  }

  next();
});

// Fake user login
const user = {
  username: "aman",
  password: "1234",
};

// Track number of transactions
let transactionCount = 0;

// Store transaction history
let transactions = [];

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    return res.send("Login Successful");
  }

  res.send("Invalid Credentials");
});

// Payment API
app.post("/pay", (req, res) => {
  const { name, amount } = req.body;

  // ✅ Input validation
  if (!name || !amount) {
    return res.send("Invalid input");
  }

  if (amount <= 0) {
    return res.send("Amount must be positive");
  }

  transactionCount++;

  let status = "Payment Successful";

  // 🚨 Fraud detection
  if (amount > 5000) {
    status = "⚠️ Fraud Alert: High Amount";
  }

  if (transactionCount > 3) {
    status = "⚠️ Fraud Alert: Too Many Transactions";
    transactionCount = 0; // reset counter
  }

  // Save transaction
  const txn = {
    name: name,
    amount: amount,
    status: status,
  };

  transactions.push(txn);

  res.json(txn);
});

// 📊 Transaction History API
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

// Start server
app.listen(3000, () => {
  console.log("Payment Server running on port 3000");
});
