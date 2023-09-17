import express from 'express';
import dotenv from 'dotenv';
import stripe from 'stripe';

// const base_url = "https://adidas-shop-e.netlify.app/";
// load variables
dotenv.config();

// start server
const app = express();
// const cors = require('cors')


app.use(express.static("public"));   // all client side code living in public folder
app.use(express.json());

// using cors
// app.use(cors)({
//     origin: "https://benevolent-entremet-76c888.netlify.app/"
// })


// home route
app.get("/",(req, res) => {
    res.sendFile("index.html", {root: "public"});
});

//success
app.get("/success",(req, res) => {
    res.sendFile("success.html", {root: "public"});
});

//cancel
app.get("/cancel",(req, res) => {
    res.sendFile("cancel.html", {root: "public"});
});

// stripe
let stripeGateway = stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

app.post("/stripe-checkout", async (req, res) => {
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, '') *100);
        console.log("item-price:", item.price);
        console.log("unitAmount:", unitAmount);
        return{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.productImg]
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        };
    });
    console.log("lineItems:", lineItems);

    // create checkout session
    const session  = await stripeGateway.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${DOMAIN}/success`,
        cancel_url: `${DOMAIN}/cancel`,
        line_items: lineItems,

        // asking address in  stripe checkout page
        billing_address_collection: "required",
    });
    res.json(session.url);
});

// app = require('http').createServer();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on ${port}`));

// app.listen(`${base_url}`, () => {
//     console.log("listening on port 3000;");
// });
