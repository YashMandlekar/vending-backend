const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

// ENVIRONMENT VARIABLES FROM RENDER
const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET = process.env.CASHFREE_SECRET;

app.post("/create-order", async (req, res) => {
    try {
        const { amount, items } = req.body;

        if (!amount || amount <= 0)
            return res.json({ success: false, error: "Invalid amount" });

        // Cashfree needs a unique order_id
        const orderId = "order_" + Date.now();

        const payload = {
            order_id: orderId,
            order_amount: amount,
            order_currency: "INR",
            customer_details: {
                customer_id: "cust_" + Date.now()
            }
        };

        const headers = {
            "Content-Type": "application/json",
            "x-client-id": APP_ID,
            "x-client-secret": SECRET
        };

        // CREATE ORDER IN CASHFREE
        const response = await axios.post(
            "https://api.cashfree.com/pg/orders",
            payload,
            { headers }
        );

        // RETURN ONLY WHAT FRONTEND NEEDS
        return res.json({
            success: true,
            order: response.data, 
            items 
        });

    } catch (err) {
        console.error("Cashfree Error:", err.response?.data || err.message);

        return res.json({
            success: false,
            error: err.response?.data || err.message
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Backend running on port", PORT));

