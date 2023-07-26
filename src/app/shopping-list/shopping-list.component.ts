import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ShoppingService } from '../Services/shopping.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  categories: string[] = ['Fish', 'Meat', 'Fruits', 'Veggies'];
  itemsData: any = {};
  showModalPopUp : boolean = false;
  quantity : number = 1;
  initialItem : any = 'Fish';
  modelMessage : string = '';
  totalAvailableAmount : number = 15346.50;
  remainingAmount : number = 0;
  totalAmount : number = 0;
  selectedItemsCount : number = 0;

  constructor(private http: HttpClient, private shoppingService : ShoppingService) {
    
  }

  ngOnInit(): void {
    this.shoppingService.getItemList().subscribe((data: any) => {
      this.itemsData = data;
    });
  }

  selectedItems: { [category: string]: any[] } = {};

  onItemChange( category: string,item: any, operation : string) {
    debugger;
    if (!this.selectedItems[item]) {
      this.selectedItems[item] = [];
    }

    const selectedItemIndex = this.selectedItems[item].findIndex(
      (selectedItem:any) => selectedItem.category === category
    );
  
    if (selectedItemIndex !== -1 && operation == 'subtract') {
      this.selectedItems[item].splice(selectedItemIndex, 1);
    }// else if(this.selectedItems[item].length < 3){
        this.selectedItems[item].push({category: category, item: item,  });
   // }else{
    //  this.showModalPopUp = true;
    //  return;
   // }

   this.getTotalAmount();
  }
  

onQuantityChange(action: 'add' | 'subtract', item:any): void {

  if (action === 'add') {
    // Increase the quantity when the plus button is clicked
    item.quantity = ++item.quantity;
    
  } else if (action === 'subtract') {
    if(item.quantity > 0){

   
    // Decrease the quantity when the minus button is clicked, but not below 1
    item.quantity = --item.quantity;
  }else{
    return;
  }
  }
   
    // Find the index of the selected item in the original data
    const index = this.itemsData[this.initialItem].findIndex((x: any) => x.name === item.name);

    // Update the item's quantity and total price in the original data
    this.itemsData[this.initialItem][index].quantity = item.quantity
    
    this.onItemChange(this.initialItem, item, action); 
}

onItemClick = (item:any) =>{
   this.initialItem = item;
}

onClose = () =>{
  this.showModalPopUp = false;
}

getTotalAmount(): void {
  let totalAmount = 0;
  let totalKg = 0;
  for (const category in this.selectedItems) {
    if (this.selectedItems.hasOwnProperty(category)) {
      const itemsInCategory = this.selectedItems[category];
      for (const selectedItem of itemsInCategory) {
        totalAmount += selectedItem.item.price * selectedItem.item.quantity;
      }
    }
  }
  for (const category in this.categories) {
    let totalKg = 0;
    const itemsForCategory = this.itemsData[category];
    if (Array.isArray(itemsForCategory)) {
      for (const item of itemsForCategory) {
        totalKg += item.quantity;
      }
      console.log(`Total kilograms for ${category}: ${totalKg}`);
    } else {
      console.error(`Invalid itemsData for category ${category}`);
    }
  }

  this.totalAmount = totalAmount;

 if(this.totalAvailableAmount - totalAmount <= 0 ){
 // this.showModalPopUp = true;
   //  this.modelMessage = "Total Amount exceeded the wallet Amount, Please proceed for checkout"
   alert("Total Amount exceeded the wallet Amount, Please proceed for checkout");
    return;
 }else{
  this.remainingAmount = this.totalAvailableAmount - totalAmount;
 }

 if(totalKg > 40){
  alert("Maximum limit exceeded");
 }
  
}

getSelectedCategories(): string[] {
  return Object.keys(this.selectedItems);
}
getSelectedItemsForCategory(category: string): any[] {

  var t = this.selectedItems[category];
  return this.selectedItems[category] || [];
}

getGroupedItemsForCategory(category: string): any[] {
  const selectedItemsInCategory = this.selectedItems[category] || [];
  const groupedItems: { [key: string]: any } = {};

  for (const selectedItem of selectedItemsInCategory) {
    const itemName = selectedItem.item.name;
    if (!groupedItems[itemName]) {
      groupedItems[itemName] = { ...selectedItem.item };
      groupedItems[itemName].quantity = selectedItem.item.quantity;
    } else {
      //groupedItems[itemName].quantity += selectedItem.item.quantity;
    }
  }

  return Object.values(groupedItems);
}

onCheckOut = () =>{

}

}