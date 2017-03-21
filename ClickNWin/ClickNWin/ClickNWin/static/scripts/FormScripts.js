﻿function registerFormValidation()//preforms validation on the registration form
{
    var pass1 = document.getElementById("password").value;
    var pass2 = document.getElementById("cpassword").value;
    var sPass1 = String(pass1);
    var sPass2 = String(pass2);
    var username = document.getElementById("username").value;

    AJAXCalls.checkUser(username);//AJAX call to check if given username already exists
    var user = document.getElementById("userError").innerText;

    if(pass1 != pass2)//outputs error messages if passwords do not match
    {
        document.getElementById("passMatch1").style.backgroundColor = "#EB4141"
        document.getElementById("passMatch2").style.backgroundColor = "#EB4141"
        document.getElementById("passMatch1").innerText = "Passwords do not match";
        document.getElementById("passMatch2").innerText = "Passwords do not match";
        return false;
    }
    else if(user != "")
    {
        return false;
    }

}

function failedLogin(fail)//outputs error messages for a failed login
{
    if (fail == true)
    {
        document.getElementById("loginFail").style.backgroundColor = "#EB4141";
        document.getElementById("loginFail").innerText = "Username or Password is incorrect. Please try again."
    }
}

function populateDates()//used on addPayment cards to prepare selectable dates
{
    var months = document.getElementById("expiryMonths");
    var years = document.getElementById("expiryYears");

    for(var i = 1; i <= 12; i++)
    {
        var opt = document.createElement("option");
        opt.innerHTML = i;
        opt.value = i;
        months.appendChild(opt);
    }

    var year = new Date().getFullYear();

    for(var i = 0;i < 7;i++)
    {
        var opt = document.createElement("option");
        opt.innerHTML = year;
        opt.value = year;
        years.appendChild(opt);
        year++;
    }
}

function validateCardNo()//uses the Luhn algorithm to validate card number is correct
{
    number = document.getElementById("cardNumber").value;
    numArray = [];
    accepted = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for(var i = number.length-1;i >= 0;i--)
    {
        for (var innerI = 0; innerI < accepted.length; innerI++)
        {
            if (number[i] === accepted[innerI])
            {
                numArray[i] = number.charAt(i);
                numArray[i] = parseInt(numArray[i]);
            }
        }
    }
    
    for (var i = 0; i < numArray.length; i++)
    {
        if(numArray[i] == null)
        {
            numArray.splice(i, 1);
        }
    }
    for(var i = numArray.length - 2;i >= 0;i -= 2)
    {
        numArray[i] *= 2;

        if (numArray[i] > 9)
        {
            numArray[i] -= 9;
        }
    }
    var total = 0;
    for (var i = 0;i < numArray.length;i++)
    {
        total += numArray[i];
    }

    if (total % 10 != 0)
    {
        document.getElementById("invalidCard").style.backgroundColor = "#EB4141";
        document.getElementById("invalidCard").innerText = "Invalid card number.  Please re-enter"
        return true;
    }
    return false;
}


function validateDate()//ensures a card expiry date is valid
{
    var expiryYear = document.getElementById("expiryYears").value;
    var expiryMonth = document.getElementById("expiryMonths").value;
    var year = new Date().getFullYear();
    var month = new Date().getMonth();

    if(expiryYear == year && expiryMonth < month)
    {
        document.getElementById("invalidDate").style.backgroundColor = "#EB4141";
        document.getElementById("invalidDate").innerText = "Invalid Expiry Date.  Please re-enter";
        return true;
    }
    return false;
}

function validateCreditCardForm()
{

    var cardNumber = validateCardNo();
    var date = validateDate();

    if(date == true || cardNumber == true)
    {
        return false;
    }
}

function addInput()//adds a user field if scratch card is being bought for a friend
{
    var check = document.getElementById("myself").checked;
    if (!check)
    {
        document.getElementById("userSelect").innerHTML = "<label class='col-md-2 col-form-label form-label'>User</label><div class='col-md-4'><input type='text' id='selectedUser' name='selectedUser' onblur='checkUser(this.value)' /><span id='userError'></span></div>"
    }
    else
    {
        document.getElementById("userSelect").innerHTML = ""
    }
}


function validateCardPurchase()//validates scratch card purchases
{
    var quantity = document.getElementById("quantity").value;
    if (quantity == '0')
    {
        document.getElementById("quantityError").style.backgroundColor = "#EB4141";
        document.getElementById("quantityError").innerText = "Please select a quantity greater than 0";
        return false
    }
    var balance = document.getElementById("balance").innerText;
    var price = document.getElementById("price").value;
    price = price.substring(1, price.length);
    balance = parseFloat(balance);
    price = parseFloat(price);
    if (price > balance) {
        alert("You do not have enough funds to buy these cards.  Please top up and try again");
        return false
    }
}

function checkBalance(balance)//ensures user is able to redeem the requested amount from their balance
{
    amount = document.getElementById("amount").value;
    amount = amount.toFixed(2);
    if (amount > balance)
    {
        alert("You do not have enough funds in your balance.  Please try a smaller amount");
        return false;
    }
}

function drawCard(id)//uses HTML canvas to draw card design by using AJAX call to retrive card's prize
{
    panelArray = AJAXCalls.getPanels(id);
    var x = 70;
    var y = 50;

    var canvas = document.getElementById("card");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, 600, 300);
    ctx.font = "15px Engravers MT";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("ClickNWin", 350, 50);
    ctx.fillText("Standard Game", 350, 100);
    ctx.fillText("Great Prizes", 350, 150)

    while (panelArray.length > 0) {
        pick = Math.floor(Math.random() * (panelArray.length)) + 0;
        ctx.fillText("€" + panelArray[pick], x, y);
        panelArray.splice(pick, 1);
        y += 100
        if (panelArray.length == 3) {
            x += 120;
            y = 50;
        }
    }
}