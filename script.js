let price = 19.5;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];
const currency_values = {
  PENNY: 0.01,
  NICKEL: 0.05,
  DIME: 0.1,
  QUARTER: 0.25,
  ONE: 1,
  FIVE: 5,
  TEN: 10,
  TWENTY: 20,
  "ONE HUNDRED": 100,
};

const totalAmount = document.getElementById("total-amt");
const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const cashInDrawer = document.getElementById("cash-in-drawer");
let cidObj = {}; // To store the number of currency I have
let result = "";

totalAmount.textContent += `$${price}`;

const displayAndUpdateCID = (cid) => {
  cashInDrawer.innerHTML = "";
  cid.forEach((element) => {
    cashInDrawer.innerHTML += `<p><strong>${element[0]}:</strong> $${element[1]}</p>`;
    let key = element[0];
    let value = Math.floor(element[1] / currency_values[element[0]]);
    cidObj[key] = value;
  });
};
displayAndUpdateCID(cid);
console.log(cidObj);

purchaseBtn.addEventListener("click", () => {
  if (Number(cash.value) < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  if (Number(cash.value) == price) {
    changeDue.textContent = "No change due - customer paid with exact cash";
    return;
  } else {
    const cid_sum = cid.reduce((total, ele) => total + ele[1], 0);
    let change = Number(cash.value) - price;
    let tempChange = change;
    let cid_rev = cid.slice().reverse();
    let tempCidRev = cid_rev.slice();

    if (!isExactChangePossible(cid_sum, cid_rev, change)) {
      change = tempChange;
      cid_rev = tempCidRev;
      console.log(cid_rev);
      displayAndUpdateCID(cid_rev.slice().reverse());
      changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    } else {
      if (cid.reduce((total, ele) => total + ele[1], 0) == 0) {
        changeDue.textContent = "Status: CLOSED " + result;
      } else {
        changeDue.textContent = "Status: OPEN " + result;
      }
    }
  }
});

const isExactChangePossible = (cid_sum, cid_rev, change) => {
  if (cid_sum < change) return false;

  for (let i = 0; i < cid_rev.length; i++) {
    while (
      currency_values[cid_rev[i][0]] <= change &&
      cidObj[cid_rev[i][0]] > 0
    ) {
      console.log(`Change is: ${change}`);
      console.log(
        `GOT: ${currency_values[cid_rev[i][0]]} for ${cid_rev[i][0]}`
      );
      const numberOfCurrency = Math.floor(
        change / currency_values[cid_rev[i][0]]
      );
      console.log(`NOC: ${numberOfCurrency}`);

      if (cidObj[cid_rev[i][0]] >= numberOfCurrency) {
        change -= numberOfCurrency * currency_values[cid_rev[i][0]];
        change = Number(change.toFixed(2));
        console.log(change);
        cid_rev[i][1] -= numberOfCurrency * currency_values[cid_rev[i][0]];
        result += `${cid_rev[i][0]}: $${
          numberOfCurrency * currency_values[cid_rev[i][0]]
        } `;
        
        displayAndUpdateCID(cid_rev.slice().reverse());
        
        if (change == 0) 
          return true;

      }
      else {
        change -= cidObj[cid_rev[i][0]] * currency_values[cid_rev[i][0]];
        console.log(change);
        cid_rev[i][1] -= cidObj[cid_rev[i][0]] * currency_values[cid_rev[i][0]];
        change = Number(change.toFixed(2));
        result += `${cid_rev[i][0]}: $${
          cidObj[cid_rev[i][0]] * currency_values[cid_rev[i][0]]
        } `;

        displayAndUpdateCID(cid_rev.slice().reverse());

        if (change === 0) 
          return true;
      }
    }
  }
  return false;
};
