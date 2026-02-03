import { Controller, Get, Query, UseGuards, Request } from "@nestjs/common";
import { SearchService } from "./search.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "../common/interfaces/authenticated-request.interface";

@Controller("search")
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query("q") query: string, @Request() req: AuthenticatedRequest) {
    return this.searchService.search(query, req.user.id);
  }
}
