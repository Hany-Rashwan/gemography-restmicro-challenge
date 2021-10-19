import { Injectable } from '@nestjs/common';
import moment from 'moment';
import fetch from 'node-fetch';
import { CreateReposListDTO } from './DTOs/CreateReposList.DTO';
import { CreateLangListDTO } from './DTOs/CreateLangList.DTO';

@Injectable()
export class AppService {
  async get_Trending_ReposByDate(): Promise<CreateLangListDTO[]> {
    try {
      const date = await this.get_Date();
      const response = await fetch(
        `https://api.github.com/search/repositories?q=created:>${date}&sort=stars&order=desc&per_page=100`,
      );
      if (response.ok) {
        const gitResponse = await response.json();
        const list = await this.get_ResponseList(gitResponse.items); // get list of repos form json object
        const langList_Without_Null = await this.filter_By_Target(null, list); // get list of repos without null languages
        const langList_unique = await this.get_Languages(langList_Without_Null); // get unique languages from 'langList_Without_Null'
        const langList_Final = await this.list_Repos(
          langList_Without_Null,
          langList_unique,
        );
        return langList_Final;
      } else {
        throw Error('Cannot reach this server right now');
      }
    } catch (err) {
      throw Error(err);
    }
  }
  //----------------------------------------------------------------------------
  private async get_ResponseList(
    list: CreateReposListDTO[],
  ): Promise<string[]> {
    const newList = [];
    let counter = 0;
    const length = list.length;
    while (counter < length) {
      // CreateReposListDTO
      const object = {
        id: list[counter].id,
        name: list[counter].name,
        description: list[counter].description,
        url: list[counter].url,
        language: list[counter].language,
      };
      newList.push(object);
      counter++;
    }
    return newList;
  }
  //----------------------------------------------------------------------
  private async get_Languages(list: CreateReposListDTO[]) {
    const newList = new Set(); // Unique Values
    list.forEach((value) => {
      newList.add(value.language);
    });
    return Array.from(newList);
  }
  //----------------------------------------------------------------------
  private async list_Repos(list: CreateLangListDTO[], target: string | any[]) {
    const newList = [];
    //  Align (each language) against (whole list)
    for (let i = 0; i < target.length; i++) {
      const languageList: string[] = await this.filter_By_Target(
        target[i],
        list,
      );
      // CreateLangListDTO
      const schema = {
        Name_of_Lang: target[i],
        Num_Of_Repos: languageList.length, // count repositories for a specific language
        List_Of_Repos: languageList,
      };
      newList.push(schema);
    }
    return newList;
  }
  //==================================================================
  //=========== Can filter by ( Null | Language )=====================
  private async filter_By_Target(target: any, list: any[]) {
    let newList = [];
    if (target === null) {
      newList = list.filter((item) => {
        return item.language != null;
      });
      // console.log(newList);
      return newList;
    } else {
      newList = list.filter((item) => {
        //console.log(item.language);
        return item.language == target;
      });
      return newList;
    }
  }
  //---------- calculate date 30 days behind from current ----------
  private async get_Date(): Promise<string> {
    const date = moment().subtract(30, 'days').format('YYYY-MM-DD');
    return date.toString();
  }
  //=================================================================
  //=================================================================
}
