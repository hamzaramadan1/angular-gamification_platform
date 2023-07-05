import {User} from "./user.model";
import {Course} from "./course.model";
import {WordSearch} from "./wordSearch.model";

export class PuzzleGame {
  id: number | undefined;
  description: string = '';
  course: Course | undefined;
  user: User | undefined;
  wordSearches: WordSearch[] = [];
}
