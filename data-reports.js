const { log } = require('console');
const fs = require('fs');

// Reading data from the file where we are storing our data set 
const data = fs.readFileSync('sales-data.txt', 'utf-8');

// Split the input data into rows
const rows = data.split('\n').slice(1);

// Define the JSON data structure
const jsonData = [];    

// Iterate over each row and convert it to an object
rows.forEach(row => {
    const values = row.split(',');
    const rowObject = {
        "Date": values[0],
        "SKU": values[1],
        "Unit Price": parseInt(values[2]),
        "Quantity": parseInt(values[3]),
        "Total Price": parseInt(values[4])
    };
    jsonData.push(rowObject);
});

//1. Total sales of the store.
const totalSales = jsonData.reduce((sum, row) => sum + row['Total Price'], 0);
console.log(`Total sales of the store: ${totalSales}\n`)


//2. Month wise sales totals.
const monthWiseSales = jsonData.reduce((obj, ele) => {
    const month = ele['Date'].substring(0, 7); // Extract YYYY-MM from the Date
    if(obj[month]){
        obj[month] += ele['Total Price']
    }else{
        obj[month] = ele['Total Price']
    }
    return obj
},{})

console.log('Month-wise Sales Totals:');
for (const month in monthWiseSales) {
    console.log(`${month}: ${monthWiseSales[month]}`);
}
console.log(`\n`)

// Calculation for below questions -
// 3. Most popular item (most quantity sold) in each month.
// 4. Items generating most revenue in each month.
// 5. For the most popular item, find the min, max and average number of orders each month.
const monthWisePopularItem = jsonData.reduce((obj, ele) => {
    const month = ele['Date'].substring(0, 7); // Extract YYYY-MM from the Date
    if(!obj[month]){
        obj[month] = [{
                SKU : ele['SKU'],
                quantity: ele['Quantity'],
                unitPrice: ele["Unit Price"],
                min: ele["Quantity"],
                max: ele["Quantity"],
                totalOrder: 1
            }]
    }else{
        let presentEle = obj[month].find(item => item.SKU === ele['SKU'])
        if(presentEle){
            presentEle.quantity += ele['Quantity']
            presentEle.totalOrder += 1
            if(ele["Quantity"] < presentEle.min){
                presentEle.min = ele["Quantity"]
            }
            if(ele["Quantity"] > presentEle.max ){
                presentEle.max = ele["Quantity"]
            }
        }else{
            obj[month].push({
                SKU : ele['SKU'],
                quantity: ele['Quantity'],
                unitPrice: ele["Unit Price"],
                min: ele["Quantity"],
                max: ele["Quantity"],
                totalOrder: 1
            })
        }
    }
    return obj
},{})


for (const item in monthWisePopularItem) {
    const maxQuantityItem = monthWisePopularItem[item].reduce((maxItem, currentItem) => {
        return currentItem.quantity > maxItem.quantity ? currentItem : maxItem;
      }, monthWisePopularItem[item][0]);


      const maxRevenueItem = monthWisePopularItem[item].reduce((maxItem, currentItem) => {
        return currentItem.quantity*currentItem.unitPrice > maxItem.quantity*maxItem.unitPrice ? currentItem : maxItem;
      }, monthWisePopularItem[item][0]);

    console.log(`Most popular item in ${item} is ${maxQuantityItem.SKU} with quantity ${maxQuantityItem.quantity}`);

    console.log(`Item generating most revenue in ${item} is ${maxRevenueItem.SKU} with revenue ${maxRevenueItem.quantity*maxRevenueItem.unitPrice}`);

    console.log(`For the most popular item in ${item} month, min order quantity is ${maxQuantityItem.min} and max order quantity is ${maxQuantityItem.max}`);

    console.log(`For the most popular item in ${item} month, average order quantity is ${(maxQuantityItem.quantity/maxQuantityItem.totalOrder).toFixed(2)}\n`);
}


