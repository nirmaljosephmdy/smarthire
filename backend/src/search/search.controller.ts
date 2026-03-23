import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
// @UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  async search(
    @Body('query') query: string,
    @Body('filters') filters: any,
    @Req() req: any
  ) {
    const userId = req.user?.id || 'system';
    return this.searchService.semanticSearch(query, filters, userId);
  }
}
