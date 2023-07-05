import {User} from "./user.model";
import {Course} from "./course.model";
import {Card} from "./card.model";

export class MemoryGame {
  id: number | undefined;
  description: string = '';
  course: Course | undefined;
  user: User | undefined;
  cards: Card[] = [];
}
