
const payBtn = document.querySelector(".btn-buy");

payBtn.addEventListener("click", () => {
    fetch("/stripe-checkout", {
        method: "post",  // cuz it's a post request
        headers: new Headers({"Content-Type": "application/Json"}),
        body: JSON.stringify({
            items: JSON.parse(localStorage.getItem("cartItems")),
        }),
    })
     .then((res) => res.json())
     .then((url) => {
        location.href = url;
        clearCart();
    })
    .catch((err) => console.log(err));  // fetch doesn't fail on its own.    // WDS video
});
