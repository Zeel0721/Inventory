import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { COMPANY_SERVICE } from '../token';
import { CompanyService } from './company.service';
import { Request } from 'express';
import { CompanyDto } from '../DTO/company.dto';

@Controller('company')
export class CompanyController {
  constructor(
    @Inject(COMPANY_SERVICE) private companyService: CompanyService,
  ) {}

  @Post('create')
  create(@Req() req: Request, @Body() company: CompanyDto) {
    return this.companyService.create(req.user, company);
  }

  @Get('getall')
  getAll(@Req() req: Request) {
    return this.companyService.getAll(req.user);
  }

  @Put('updatecompany/:id')
  updateCompany(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() newCompany: CompanyDto,
  ) {
    return this.companyService.updateCompany(req.user, id, newCompany);
  }

  @Delete('deletecompany/:id')
  deleteOne(@Req() req: Request, @Param('id') id: string) {
    return this.companyService.deleteOne(req.user, id);
  }
}
