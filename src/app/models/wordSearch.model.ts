import {User} from "./user.model";
import {PuzzleGame} from "./puzzleGame.model";


export class WordSearch {;
  id: number | undefined;
  wordSearchQuestion: string = '';
  puzzleGame: PuzzleGame | undefined;
  user: User | undefined;
  wordSearchAnswer: string = '';
}
