import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateLangListDTO } from './DTOs/CreateLangList.DTO';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/langList')
  async getTrendingReposByDate(): Promise<CreateLangListDTO[]> {
    return await this.appService.get_Trending_ReposByDate();
  }
}
