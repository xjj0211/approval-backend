// src/approvals/approvals.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { CreateApprovalDto, QueryApprovalDto } from './dto/create-approval.dto';

@Controller('api/approvals') // 路由前缀
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) { }

  // 1. 查询列表 GET /api/approvals
  @Get()
  findAll(@Query() query: QueryApprovalDto) {
    return this.approvalsService.findAll(query);
  }

  @Get('schema')
  getSchema() {
    return this.approvalsService.getFormSchema();
  }

  // 2. 查询详情 GET /api/approvals/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.approvalsService.findOne(id);
  }

  // 3. 新建 POST /api/approvals
  @Post()
  create(@Body() createDto: CreateApprovalDto) {
    return this.approvalsService.create(createDto);
  }

  // 4. 修改 PATCH /api/approvals/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateApprovalDto>) {
    return this.approvalsService.update(id, updateDto);
  }

  // 5. 撤回 POST /api/approvals/:id/withdraw
  @Post(':id/withdraw')
  withdraw(@Param('id') id: string) {
    return this.approvalsService.withdraw(id);
  }

  // 6. 通过 POST /api/approvals/:id/pass
  @Post(':id/pass')
  approve(@Param('id') id: string) {
    return this.approvalsService.approve(id);
  }

  // 7. 驳回 POST /api/approvals/:id/reject
  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.approvalsService.reject(id);
  }

}