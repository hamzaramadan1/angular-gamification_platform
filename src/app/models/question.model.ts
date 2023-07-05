import {User} from "./user.model";
import {Minigame} from "./minigame.model";


export class Question {
  id: number | undefined;
  questionText: string = '';
  minigame: Minigame | undefined;
  user: User | undefined;
  answerText: string = '';
}
