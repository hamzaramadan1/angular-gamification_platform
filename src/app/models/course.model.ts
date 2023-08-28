import {User} from "./user.model";
import {Minigame} from "./minigame.model";

export class Course {
  id: number | undefined;
  courseName: string = '';
  courseDescription: string = '';
  courseLink: string = '';
  file!: File | string;
  imageName!: string;
  imageType!: string;
  user: User | undefined;
}
