function calculateCart() {

    const coffee = Number(
        document.getElementById("coffeeQty").value
    );

    const aloe = Number(
        document.getElementById("aloeQty").value
    );

    const rose = Number(
        document.getElementById("roseQty").value
    );

    const lavender = Number(
        document.getElementById("lavenderQty").value
    );

    const olive = Number(
        document.getElementById("oliveQty").value
    );

    const matcha = Number(
        document.getElementById("matchaQty").value
    );

    if (
        isNaN(coffee) || isNaN(aloe) ||
        isNaN(rose) || isNaN(lavender) ||
        isNaN(olive) || isNaN(matcha) ||
        coffee < 0 || aloe < 0 ||
        rose < 0 || lavender < 0 ||
        olive < 0 || matcha < 0 ||
        !Number.isInteger(coffee) ||
        !Number.isInteger(aloe) ||
        !Number.isInteger(rose) ||
        !Number.isInteger(lavender) ||
        !Number.isInteger(olive) ||
        !Number.isInteger(matcha)
    ) {
        document.getElementById("cartResult").innerHTML =
            "Please enter valid quantities.";
        return false;
    }

    const total =
        coffee * 7.90 +
        aloe * 8.50 +
        rose * 9.90 +
        lavender * 8.90 +
        olive * 7.50 +
        matcha * 9.50;

    document.getElementById("cartResult").innerHTML =
        "Total: €" + total.toFixed(2);

    return false;
}


function resetCart() {
    document.getElementById("cartResult").innerHTML =
        "Total: €0.00";
}

function loginUser() {

    const role = document.getElementById("role").value;

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if (username === "" || password === "") {
        document.getElementById("loginResult").innerHTML =
            "Please complete all fields.";

    } else if (role === "employee") {
        document.getElementById("loginResult").innerHTML =
            "Employee demo login successful. " +
            '<a href=" ">Open Dashboard</a >';

    } else {
        document.getElementById("loginResult").innerHTML =
            "Customer demo login successful. " +
            '<a href="products.html">Start Shopping</a >';
    }

    return false;
}

function calculateStock() {

    const price = Number(
        document.getElementById("stockPrice").value
    );

    const quantity = Number(
        document.getElementById("stockQuantity").value
    );

    if (
        isNaN(price) || isNaN(quantity) ||
        price <= 0 || quantity < 0 ||
        !Number.isInteger(quantity)
    ) {
        document.getElementById("stockResult").innerHTML =
            "Please enter valid values.";

    } else {
        const total = price * quantity;

        document.getElementById("stockResult").innerHTML =
            "Total Stock Value: €" + total.toFixed(2);
    }

    return false;
}

function calculatePackaging() {

    const soaps = Number(
        document.getElementById("soapCount").value
    );

    const regularPackaging = 20;
    const alternativePackaging = 5;

    if (
        isNaN(soaps) || soaps <= 0 ||
        !Number.isInteger(soaps)
    ) {
        document.getElementById("packagingResult").innerHTML =
            "Please enter a valid number of soaps.";

    } else {
        const saving =
            soaps * (regularPackaging - alternativePackaging);

        document.getElementById("packagingResult").innerHTML =
            "Estimated Plastic Savings: " +
            saving + " grams.";
    }

    return false;
}