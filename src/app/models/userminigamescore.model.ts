import {User} from "./user.model";
import {Minigame} from "./minigame.model";

export class UserMinigameScore {
  id: number | undefined;
  user: User | undefined;
  minigame: Minigame | undefined;
}
