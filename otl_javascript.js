let stock = [{ "name": "runners_red", "sizes": [6, 7, 9, 10, 11], "price": 1200, "img_src": "images/runners_red.jpg", "color": "red", "type": "runners" },
    { "name": "runners_green", "sizes": [6, 7, 8, 9, 10, 11], "price": 1200, "img_src": "images/runners_green.jpg", "color": "green", "type": "runners" },
    { "name": "runners_yellow", "sizes": [6, 7, 9, 10, 11], "price": 1200, "img_src": "images/runners_yellow.jpg", "color": "yellow", "type": "runners" },
    { "name": "sneaker_boots_red", "sizes": [6, 7, 9, 10, 11], "price": 1400, "img_src": "images/sneaker_boots_red.jpg", "color": "red", "type": "sneaker_boots" },
    { "name": "sneaker_boots_beige", "sizes": [6, 7, 9, 10, 11], "price": 1400, "img_src": "images/sneaker_boots_beige.jpg", "color": "beige", "type": "sneaker_boots" },
    { "name": "sneaker_boots_blue", "sizes": [6, 7, 9, 10, 11], "price": 1400, "img_src": "images/sneaker_boots_blue.jpg", "color": "blue", "type": "sneaker_boots" },
    { "name": "hikers_grey", "sizes": [6, 7, 9, 10, 11], "price": 1100, "img_src": "images/hikers_grey.jpg", "color": "grey", "type": "hikers" },
    { "name": "sneakers_pink", "sizes": [6, 7, 9, 10, 11], "price": 1700, "img_src": "images/sneakers_pink.jpg", "color": "pink", "type": "sneakers" },
    { "name": "sneakers_yellow", "sizes": [6, 7, 9, 10, 11], "price": 1700, "img_src": "images/sneakers_yellow.jpg", "color": "yellow", "type": "sneakers" },
    { "name": "sneakers_rainbow", "sizes": [3, 7, 9, 10, 11], "price": 1700, "img_src": "images/sneakers_rainbow.jpg", "color": "rainbow", "type": "sneakers" }
];


let cart = [];

let vatRate = 0.15;

let discountCoupons = [{ "name": "FIRSTBUY", "value": 0.1 }, { "name": "ENDOFCOVID", "value": 0.05 }, { "name": "IVANTEST", "value": 0.15 }];

let shippingMethods = [{ "name": "free", "cost": 0 }, { "name": "standard", "cost": 100 }, { "name": "express", "cost": 250 }, { "name": "collection", "cost": 0 }];




// myLoad() is called when the catalogue page gets loaded
function catalogueLoad() {

    let catalogueContent = document.querySelector("div");
    let i = 0;
    stock.forEach(function(e) {
        let rowItem = document.createElement("div");
        rowItem.innerHTML = `<div class="col-sm-4">
                                <img src=${e.img_src} alt=${e.name} class="img-fluid img-thumbnail">
                            </div>
                            <div class="col-sm-6">
                                <p id=${e.name}_p>Here are some ${e.color} ${e.type}<br>
                                    <ul class="more_details">
                                        <li>Type: ${e.type}</li>
                                        <li>Color: ${e.color}</li>
                                        <li>Price: R${e.price} (inc)</li>
                                        <li>Available Sizes:
                                            <ul id=${e.name}_sizes>
                                            </ul>
                                        </li>
                                    </ul>
                                </p>
                            </div>
                            <div class="col-sm-2 addToCartSection">
                                <button class="addToCartButton" type="button">ADD TO CART</button>
                                <form id="addToCart_${e.name}" onSubmit="submitToCart(); return false">
                                    <label for="inputSize">Size</label>
                                    <select name="${e.name}_size" id="${e.name}_sizeSelect">
                                        <option value=0>---</option>
                                    </select>
                                    <label for="inputSize">Quantity</label>
                                    <select name="${e.name}_qty" id="${e.name}_qtySelect">
                                    </select>
                                    <button type="button" class="submitToCartButton" id="${e.name}_submit" onclick="submitToCart(this)">ADD TO CART</button>
                                    <button type="button" class="cancelCartButton" id="${e.name}_cancel" onclick="cancelAddToCart(this)">CANCEL</button> 
                                </form>
                            </div>`;
        rowItem.setAttribute("class", "row");
        rowItem.setAttribute("id", `${e.name}_row`);
        catalogueContent.appendChild(rowItem);
        let ul_item = document.getElementById(`${e.name}_sizes`);
        let select_size = document.getElementById(`${e.name}_sizeSelect`);
        let select_qty = document.getElementById(`${e.name}_qtySelect`);
        for (q = 0; q <= 10; q++) {
            let opt_qty = document.createElement("option");
            opt_qty.innerHTML = q;
            opt_qty.setAttribute("value", q);
            select_qty.appendChild(opt_qty);
        }
        let j = 0;

        $.each(e.sizes, function(index, value) {
            let li_item = document.createElement("li");
            li_item.innerHTML = value;
            ul_item.appendChild(li_item);
            let opt_size = $("<option></option>").text(value).attr("value", value);
            $(select_size).append(opt_size);
        });
        i++;
    });
    sessionStorage.setItem("ssstock", JSON.stringify(stock));

    if (sessionStorage.getItem("cartHasLoaded") === null) {
        sessionStorage.setItem("sscart", JSON.stringify(cart));
        sessionStorage.setItem("cartHasLoaded", true);
    } else {
        cart = JSON.parse(sessionStorage.getItem("sscart"));
    }
    console.log(sessionStorage.getItem("sscart"));
    console.log(cart);
    console.log("catalogue has loaded");
}

$(document).ready(function() {
    $(".top_ribbon > a").animate({ opacity: 1 }, 1500).parent().next().slideDown("fast");
    if (curPage == "catalogue" && curPage) {
        catalogueLoad();
        $(".addToCartButton").click(function() {
            console.log("addToCart button clicked");
            $(this).hide().next().css("visibility", "visible");
            console.log($(this).next().length);
            stock = JSON.parse(sessionStorage.getItem("ssstock"));
            stockIndex = stock.findIndex(x => x.name === $(this).parent().parent().attr('id').substring(0, $(this).parent().parent().attr('id').length - 4));
            console.log(stock[stockIndex].name);
        });
    } else if (curPage = "checkout") {
        let totalDue = JSON.parse(sessionStorage.getItem("sstotalCart"));
        let reducedRate = JSON.parse(sessionStorage.getItem("couponApplied"));
        let shippingCost = JSON.parse(sessionStorage.getItem("ssshippingCost"));
        let paymentTotal = (Math.floor(100 * (1 - reducedRate) * totalDue) / 100) + shippingCost;

        $("#confirmTotalDue").html(paymentTotal);
        $("#confirmVatDue").html(Math.floor(((shippingCost + ((1 - reducedRate) * totalDue)) * 100) * (vatRate / (1 + vatRate))) / 100);
        $("#confirmShoppingTotal").html(Math.floor((1 - reducedRate) * totalDue * 100 * (1 / (1 + vatRate))) / 100);
        $("#confirmShippingDue").html(Math.floor(100 * (shippingCost * (1 / (1 + vatRate)))) / 100);
        $("#orderConfirm").click(function() {
            window.location.replace("home-otl.html");
            let refNumber = generateRef();
            alert("Thank you for your order. Your payment of R " + paymentTotal + " will be processed soon and you reference number is " + refNumber);
            sessionStorage.clear();
        });
    }
});

function submitToCart(g) {
    cart = JSON.parse(sessionStorage.getItem("sscart"));
    console.log(cart);
    console.log(g);
    console.log("size: " + g.parentElement.firstElementChild.nextElementSibling.value);
    console.log("qty: " + g.previousElementSibling.value);
    let submitSize = g.parentElement.firstElementChild.nextElementSibling;
    let submitQty = g.previousElementSibling;
    let itemName = g.id.substring(0, g.id.length - 7);
    let cartElement = { "item": itemName, "quantity": parseInt(`${submitQty.value}`), "size": parseInt(`${submitSize.value}`) };
    let itemPrice = search(itemName, stock).price;
    console.log(cart);

    // Calculate and alert the user what the current total is on the shopping cart
    if (sessionStorage.getItem("hasTotalCalculatedBefore") === null) {
        sessionStorage.setItem("hasTotalCalculatedBefore", true);
        totalCart = submitQty.value * itemPrice;
    } else {
        totalCart = JSON.parse(sessionStorage.getItem("sstotalCart")) + (submitQty.value * itemPrice);
    }


    if (submitQty.value != 0 && submitSize.value != 0) {
        cart.push(cartElement);
        sessionStorage.setItem("sscart", JSON.stringify(cart));
        console.log(cart);
        submitSize.value = 0;
        submitQty.value = 0;
        g.parentElement.style.cssText = "";
        g.parentElement.parentElement.firstElementChild.style.cssText = "";

        console.log("the current total cart value is " + totalCart);
        alert("Your current shopping cart total is R" + totalCart + ".00");
        sessionStorage.setItem("sstotalCart", totalCart);
    } else {
        alert("You did not insert a valid quantity or size");
    }
}



function cancelAddToCart(f) {
    console.log(f);
    f.parentElement.firstElementChild.nextElementSibling.value = 0;
    f.previousElementSibling.value = 0;
    f.parentElement.style.cssText = "";
    f.parentElement.parentElement.firstElementChild.style.cssText = "";
}

// The viewCart() function is called when the shopping cart page is loaded to get all the items in a user's cart
function cartLoad() {
    console.log("cartLoad has begun");
    let cartItems = document.getElementById("cartItems");
    console.log(cartItems);
    if (sessionStorage.getItem("cartHasLoaded") != null) {
        cart = JSON.parse(sessionStorage.getItem("sscart"));

        if (cart.length > 0) {
            document.getElementById("shoppingStats").style.visibility = "visible";
            document.getElementById("shoppingStats").style.position = "static";
        }
        id = 0;
        totalCart = 0;
        cart.forEach(function(g) {
            let rowItem = document.createElement("div");
            let cartItem = search(g.item, stock);
            let cartItemPrice = cartItem.price;
            rowItem.innerHTML = `<div class="col-md-2">
                                    <img src=${cartItem.img_src} class="img-thumbnail">
                                </div>
                                <div class="col-md-3">
                                    ${g.item}
                                </div>
                                <div class="col-md-3">
                                    ${g.size}
                                </div>
                                <div class="col-md-2">
                                    ${g.quantity}
                                </div>
                                <div class="col-md-2">
                                    <button type="button" onclick="removeItem(${id})">REMOVE</button>
                                </div>`;
            totalCart += cartItemPrice * g.quantity;
            rowItem.setAttribute("class", "row shoppingCartItem");
            cartItems.appendChild(rowItem);
            g.id = id;
            id++;
        });

        sessionStorage.setItem("sstotalCart", totalCart);
        let totalDue = totalCart;
        let reducedRate = JSON.parse(sessionStorage.getItem("couponApplied"));
        document.getElementById("totalDue").innerHTML = Math.floor(100 * (1 - reducedRate) * totalDue) / 100;
        document.getElementById("vatDue").innerHTML = (Math.floor((1 - reducedRate) * totalDue * 100 * (vatRate / (1 + vatRate))) / 100);
        document.getElementById("shoppingTotal").innerHTML = (Math.floor((1 - reducedRate) * totalDue * 100 * (1 / (1 + vatRate))) / 100);

    }
}

// The below function will remove a object from the sscart array

function removeItem(x) {
    cart.splice(x, 1);
    sessionStorage.setItem("sscart", JSON.stringify(cart));
    window.location.reload();
}



// The search() function is used to lookup the index of an object in an array of objects where the value of an a key matches the specified value
function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}


// The below function will be used to calculate and apply the coupons to the order total

function applyCoupons(g) {
    let userCoupon = search(g.previousElementSibling.value, discountCoupons).value;
    let totalDue = JSON.parse(sessionStorage.getItem("sstotalCart"));
    sessionStorage.setItem("couponApplied", JSON.stringify(userCoupon));
    alert("You have applied the " + search(g.previousElementSibling.value, discountCoupons).name + " coupon. Your total amount due is now R" + Math.floor(100 * (1 - userCoupon) * totalDue) / 100);
}

// The below function will allow the user to proceed to checkout and display the order total to them

function proceedCheckout() {
    let myForm = document.forms[1];
    let shippingMethod = myForm.elements["shippingMethod"].value;
    let shippingMethodCost = search(shippingMethod, shippingMethods).cost;
    sessionStorage.setItem("ssshippingCost", JSON.stringify(shippingMethodCost));
    alert("your selected shipping method costs " + shippingMethodCost);
}

// The below function will generate a random reference number

function generateRef() {
    let minNumber = Math.floor(Math.random() * 10) + 1;
    let maxNumber = Math.floor(Math.random() * 100) + 1;
    let refNumber = Math.floor((Math.random() * 10000 * maxNumber) + minNumber);
    return refNumber;
};