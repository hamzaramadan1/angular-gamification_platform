import {User} from "./user.model";
import {Course} from "./course.model";
import {Question} from "./question.model";

export class Minigame {
  id: number | undefined;
  description: string = '';
  course: Course | undefined;
  user: User | undefined;
  questions: Question[] = [];
}
