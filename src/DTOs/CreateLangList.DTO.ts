/* eslint-disable prettier/prettier */
import { CreateReposListDTO } from './CreateReposList.DTO';

export class CreateLangListDTO  {
  Name_of_Lang: string;
  Num_Of_Repos: number;
  List_Of_Repos: CreateReposListDTO[];
}
