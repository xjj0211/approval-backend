# 🚀 审批系统后端服务 | Approval System Server

> 基于 NestJS + TypeScript 构建的 RESTful API 服务，为审批系统前端提供数据持久化、表单配置下发及业务逻辑处理能力。

## 📚 项目介绍
本项目是 [前端审批系统] 的配套后端服务。利用 NestJS 框架的模块化特性，实现了审批单的 CRUD、复杂的筛选分页查询以及动态 Schema 下发。

### 💡 核心特性
* **全量接口支持**：实现了列表查询（支持多维度筛选）、详情、创建、更新、审批（通过/驳回）等 7 大核心接口。
* **动态 Schema 下发**：提供 `/schema` 接口，向前端下发 JSON 格式的表单配置，控制前端渲染逻辑。
* **文件流处理**：支持 Base64 格式的大文件（图片/Excel）传输与存储，配置了 50MB 的 Payload 限制。
* **内存数据持久化**：使用 In-Memory 模拟数据库操作，支持数据的实时读写（服务重启后重置）。

## 🛠️ 技术栈
* **框架**: NestJS (Node.js)
* **语言**: TypeScript
* **验证**: class-validator, class-transformer
* **部署**: Render

## 🔌 API 接口文档

### 1. 审批单管理
| 方法 | 路径 | 描述 |
| :--- | :--- | :--- |
| `GET` | `/api/approvals` | 获取审批列表 (支持分页、筛选) |
| `GET` | `/api/approvals/:id` | 获取审批单详情 |
| `POST` | `/api/approvals` | 创建新审批单 |
| `PATCH` | `/api/approvals/:id` | 更新审批单 |

### 2. 审批操作
| 方法 | 路径 | 描述 |
| :--- | :--- | :--- |
| `POST` | `/api/approvals/:id/pass` | 通过审批 |
| `POST` | `/api/approvals/:id/reject` | 驳回审批 |

### 3. 系统配置
| 方法 | 路径 | 描述 |
| :--- | :--- | :--- |
| `GET` | `/api/approvals/schema` | 获取动态表单 Schema 配置 |

## 🚀 本地运行

1. **克隆项目**
\`\`\`bash
git clone https://github.com/你的用户名/approval-backend.git
cd approval-backend
\`\`\`

2. **安装依赖**
\`\`\`bash
npm install
\`\`\`

3. **启动开发环境**
\`\`\`bash
npm run start:dev
\`\`\`
服务默认运行在 `http://localhost:3000`。

## ⚙️ 核心逻辑示例
**动态 Schema 数据结构：**
\`\`\`json
{
  "code": 0,
  "data": [
    {
      "field": "projectName",
      "component": "Input",
      "validator": { "maxCount": 20 }
    },
    {
      "field": "department",
      "component": "DepartmentSelect"
    }
  ]
}
\`\`\`

---
