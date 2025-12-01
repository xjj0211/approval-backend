import { IsString, IsNotEmpty, IsArray, MaxLength, IsOptional } from 'class-validator';

export class CreateApprovalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  projectName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  content: string;

  @IsArray()
  @IsNotEmpty()
  department: string[];

  @IsString()
  @IsNotEmpty()
  executeDate: string;

  // ✅ 新增：图片列表 (存 Base64 字符串)
  @IsArray()
  @IsOptional()
  images?: string[];

  // ✅ 新增：附件列表 (存对象: { name: string, url: string })
  @IsArray()
  @IsOptional()
  attachments?: { name: string; url: string }[];
}

export class QueryApprovalDto {
  // ... (保持之前的 QueryDto 内容不变，这里省略以节省篇幅) ...
  current?: number;
  pageSize?: number;
  projectName?: string;
  status?: string;
  department?: string;
  startTime?: string;
  endTime?: string;
  updateStartTime?: string;
  updateEndTime?: string;
}