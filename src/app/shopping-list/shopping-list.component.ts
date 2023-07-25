import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('assets/data.json').subscribe((data: any) => {
      this.itemsData = data;
      console.log(this.itemsData);
    });
  }

  selectedItems: { [category: string]: any[] } = {};

onItemChange(item: any, category: string) {
  if (!this.selectedItems[category]) {
    this.selectedItems[category] = [];
  }

  const index = this.selectedItems[category].indexOf(item);
  if (index !== -1) {
    this.selectedItems[category].splice(index, 1);
  } else {
    if (this.selectedItems[category].length < 3) {
      this.selectedItems[category].push(item);
    }
  }
}

onQuantityChange(action: 'add' | 'subtract', item:any): void {
  debugger;
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
   
  if(item.quantity>=2){
   
    this.showModalPopUp = true;
  }

    // Find the index of the selected item in the original data
    const index = this.itemsData[this.initialItem].findIndex((x: any) => x.name === item.name);

    // Update the item's quantity and total price in the original data
    this.itemsData[this.initialItem][index].quantity = item.quantity
 
}

onItemClick = (item:any) =>{
   this.initialItem = item;
}

onClose = () =>{
  this.showModalPopUp = false;
}

}