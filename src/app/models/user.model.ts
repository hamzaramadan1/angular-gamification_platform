import { Grade } from "./grade.enum";
import {Role} from "./role.enum";

export class User {
  id: number|undefined;
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  profilePicturePath: string = '';
  experiencePoints: number | undefined;
  userImageFile!: File;
  userImageName!: string;
  userImageType!: string;
  userLevel: number | undefined;
  accessToken: string = '';
  refreshToken: string = '';
  role: Role = Role.USER;
  grade: Grade = Grade.DEBUTANT;
  locked: boolean|undefined;
}
