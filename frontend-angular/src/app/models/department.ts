import { Signature } from "./signature";
import { User } from "./user";

export interface Department {
    id: number;
  name: string;
  description: string;
  users?: User[];
  signatures?: Signature[];
}
