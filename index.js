const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Cashfree Keys
const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET = process.env.CASHFREE_SECRET;


app.post("/create-order", async (req, res) => {
    try {
        const { amount, items } = req.body;

        if (!amount || amount <= 0)
            return res.status(400).json({ error: "Invalid amount" });

        const payload = {
            order_id: "order_" + Date.now(),
            order_amount: amount,
            order_currency: "INR",
            customer_details: {
                customer_id: "cust_" + Date.now(),
                customer_email: "",
                customer_phone: ""
            }
        };

        const response = await fetch("https://api.cashfree.com/pg/orders", {
            method: "POST",
            headers: {
                "x-client-id": APP_ID,
                "x-client-secret": SECRET,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        return res.json({
            success: true,
            order: data,
            items
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.get("/", (req, res) => {
    res.send("Cashfree backend running!");
});

// Port required by Render
app.listen(10000, () => console.log("Server running on port 10000"));
