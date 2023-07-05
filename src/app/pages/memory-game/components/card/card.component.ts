import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent {
  @Input() card: Card;    
  @Output() clicked = new EventEmitter();

  constructor() { }  

  cardClick() {
    if (this.card.revealed == true) {
      Swal.fire({
        title: this.card.cardContent
      });
    } else  {
      Swal.fire({
        title: this.card.cardContent,
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => this.clicked.emit([this.card.cardIndex, this.card.id, this.card.cardQuestion, this.card.cardAnswer]), 1500);
    }
  }
  
}