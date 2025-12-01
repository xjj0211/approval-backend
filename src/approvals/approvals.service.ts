// src/approvals/approvals.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateApprovalDto, QueryApprovalDto } from './dto/create-approval.dto';

// 定义接口类型
export interface Approval {
  id: string;
  projectName: string;
  content: string;
  department: string[];
  executeDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  createTime: string;
  updateTime: string;
  // ✅ 新增字段
  images?: string[]; 
  attachments?: { name: string; url: string }[]; 
}

@Injectable()
export class ApprovalsService {
  // 模拟数据库
  private approvals: Approval[] = [
    {
      id: '1',
      projectName: '示例审批单',
      content: '初始化数据...',
      department: ['tech', 'fe'],
      executeDate: '2025-12-01',
      status: 'pending',
      createTime: '2025-11-20 10:00:00',
      updateTime: '--',
    },
  ];

  // 1. 查询列表 (支持筛选 + 分页)
  findAll(query: QueryApprovalDto) {
    let result = [...this.approvals];

    // --- 筛选逻辑 ---
    if (query.projectName) {
      const name = query.projectName;
      result = result.filter((item) => item.projectName.includes(name));
    }
    if (query.status) {
      result = result.filter((item) => item.status === query.status);
    }
    if (query.department) {
      const dept = query.department;
      result = result.filter((item) => item.department.includes(dept));
    }

    // ✅ 新增：创建时间筛选
    if (query.startTime && query.endTime) {
      const start = new Date(query.startTime).getTime();
      const end = new Date(query.endTime).getTime();
      result = result.filter(item => {
        const itemTime = new Date(item.createTime).getTime();
        return itemTime >= start && itemTime <= end;
      });
    }

    // ✅ 新增：审批时间筛选
    if (query.updateStartTime && query.updateEndTime) {
      const start = new Date(query.updateStartTime).getTime();
      const end = new Date(query.updateEndTime).getTime();
      result = result.filter(item => {
        if (item.updateTime === '--') return false; // 未审批的数据排除
        const itemTime = new Date(item.updateTime).getTime();
        return itemTime >= start && itemTime <= end;
      });
    }

    

    // --- 分页逻辑 ---
    const current = Number(query.current) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const total = result.length;

    // 倒序排列 (最新的在前)
    result.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

    const startIndex = (current - 1) * pageSize;
    const data = result.slice(startIndex, startIndex + pageSize);

    return { data, total, current, pageSize };
  }

  // 2. 查询详情 [cite: 51]
  findOne(id: string) {
    const item = this.approvals.find((item) => item.id === id);
    if (!item) throw new NotFoundException('审批单不存在');
    return item;
  }

  // 3. 新建审批单 [cite: 52]
  create(createDto: CreateApprovalDto) {
    const newItem: Approval = {
      id: Date.now().toString(),
      ...createDto,
      status: 'pending',
      createTime: new Date().toLocaleString(), // 简单格式化
      updateTime: '--',
    };
    this.approvals.unshift(newItem);
    return newItem;
  }

  // 4. 修改审批单 [cite: 53]
  update(id: string, updateDto: Partial<CreateApprovalDto>) {
    const index = this.approvals.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException('审批单不存在');

    // 只有待审批状态才能修改
    if (this.approvals[index].status !== 'pending') {
      throw new BadRequestException('只有待审批状态可以修改');
    }

    this.approvals[index] = { ...this.approvals[index], ...updateDto };
    return this.approvals[index];
  }

  // 5. 撤回审批单 [cite: 54]
  withdraw(id: string) {
    return this.updateStatus(id, 'withdrawn', '只有待审批状态可以撤回');
  }

  // 6. 通过审批 [cite: 55]
  approve(id: string) {
    return this.updateStatus(id, 'approved', '只有待审批状态可以操作');
  }

  // 7. 驳回审批 [cite: 56]
  reject(id: string) {
    return this.updateStatus(id, 'rejected', '只有待审批状态可以操作');
  }

  // 辅助函数：更新状态
  private updateStatus(id: string, status: Approval['status'], errorMsg: string) {
    const index = this.approvals.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException('审批单不存在');

    const currentStatus = this.approvals[index].status;
    if (currentStatus !== 'pending') {
      throw new BadRequestException(errorMsg);
    }

    this.approvals[index].status = status;
    this.approvals[index].updateTime = new Date().toLocaleString();
    return this.approvals[index];
  }
  // ✅ 新增：获取表单配置 Schema
  getFormSchema() {
    return {
      code: 0,
      msg: 'success',
      data: [
        {
          field: 'projectName',
          name: '审批项目',
          component: 'Input',
          validator: { maxCount: 20, required: true }, // 这里补一个 required 以匹配之前的逻辑
        },
        {
          field: 'content',
          name: '审批内容',
          component: 'Textarea',
          validator: { maxCount: 300, required: true },
        },
        {
          field: 'department', // 注意：为了兼容之前的接口，这里用 department
          name: '申请部门',
          component: 'DepartmentSelect',
          validator: { required: true },
        },
        {
          field: 'executeDate',
          name: '执行日期',
          component: 'DateTimePicker',
          validator: { required: true },
        },
      ],
    };
  }
}