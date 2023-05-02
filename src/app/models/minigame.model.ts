import {User} from "./user.model";
import {Course} from "./course.model";

export class Minigame {
  id: number | undefined;
  description: string = '';
  question: string = '';
  answer: string = '';
  course: Course | undefined;
  user: User | undefined;
}
