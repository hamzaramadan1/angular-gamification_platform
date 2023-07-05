import {User} from "./user.model";
import {MemoryGame} from "./memoryGame.model";


export class Card {;
  cardIndex: number | undefined;
  id: number | undefined;
  cardQuestion: string = '';
  memoryGame: MemoryGame | undefined;
  user: User | undefined;
  cardAnswer: string = '';
  revealed: boolean = false;
  cardContent: string;
  color: string;

  constructor(cardIndex: number, id: number, cardContent: string, color: string) {
    this.cardIndex = cardIndex;
    this.id = id;
    this.cardContent = cardContent;
    this.color = color;
  }
}
