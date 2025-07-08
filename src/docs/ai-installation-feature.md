# AI辅助安装功能实现文档

## 功能概述

实现了MCP Now中的AI辅助服务器安装功能，为用户提供智能化的服务器配置和安装体验。

## 实现的功能

### 1. 核心组件

#### `AIInstallDialog.tsx`
- 提供AI安装对话框界面
- 显示安装进度和步骤
- 支持6个安装步骤：确认安装、选择连接模式、检查依赖项、配置API密钥、完成配置、验证安装
- 集成AI聊天启动功能

#### `useAIInstallation.ts` Hook
- 管理AI安装流程的状态
- 处理AI聊天的启动和导航
- 提供安装上下文的存储和获取

### 2. 增强的现有组件

#### `AddInstanceDialog.tsx`
- 新增AI辅助安装选项卡
- 在配置界面显示AI安装建议
- 集成AIInstallDialog组件

#### `ServerSelectionDialog.tsx` (两个版本)
- 添加onStartAIChat回调支持
- 在配置步骤中提供AI安装选项
- 支持启动AI聊天安装流程

#### `ChatInterface.tsx`
- 新增mode和initialContext属性
- 支持安装模式初始化
- 自动加载AI安装上下文

#### `AIChat.tsx` 页面
- 检测安装模式参数
- 初始化AI安装上下文
- 传递参数到ChatInterface

### 3. 集成点

#### Host管理页面
- `MCPNowHostView.tsx`: 集成AI安装功能
- `Host-newlayout.tsx`: 支持AI安装启动

## 用户流程

### 完整的AI安装流程：

1. **入口**: 用户在Server配置页面点击"Setup"按钮
2. **AI选项**: 显示AI辅助安装选项卡，提供"使用AI安装"按钮
3. **启动对话**: 点击后启动AIInstallDialog或直接跳转到AI Chat
4. **安装步骤**:
   - 确认安装意图
   - 选择连接模式（HTTP_SSE、STDIO、WS）
   - 检查前置依赖项（Node.js、npm等）
   - 配置API密钥（如果需要）
   - 完成实例配置
   - 验证服务器连接
5. **完成**: 自动添加到当前Profile，显示安装成功

### AI聊天引导流程：

1. **Context传递**: 安装上下文传递给AI聊天
2. **智能对话**: AI根据服务器类型提供定制化安装指导
3. **步骤确认**: 每个关键步骤需要用户确认
4. **自动化执行**: AI协助执行依赖检查、配置验证等
5. **结果反馈**: 实时显示安装进度和结果

## 技术实现特点

### 1. 模块化设计
- 各组件职责清晰，易于维护
- Hook复用，状态管理统一
- 支持不同入口点的AI安装

### 2. 用户体验优化
- 渐进式引导，降低学习成本
- 实时反馈，增强信任感
- 错误处理和重试机制

### 3. 扩展性
- 支持新的服务器类型
- 可配置的安装步骤
- 灵活的AI对话模式

## 文件结构

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx (增强)
│   │   └── ...
│   ├── hosts/
│   │   ├── MCPNowHostView.tsx (更新)
│   │   ├── ServerSelectionDialog.tsx (更新)
│   │   └── new-layout/
│   │       └── ServerSelectionDialog.tsx (更新)
│   └── servers/
│       ├── AddInstanceDialog.tsx (增强)
│       └── AIInstallDialog.tsx (新增)
├── hooks/
│   └── useAIInstallation.ts (新增)
├── pages/
│   ├── AIChat.tsx (增强)
│   └── Host-newlayout.tsx (更新)
└── docs/
    └── ai-installation-feature.md (文档)
```

## 未来增强计划

1. **智能推荐**: 基于用户历史和服务器特性推荐最佳配置
2. **自动依赖安装**: 支持自动安装缺失的依赖项
3. **配置模板**: 预定义常用配置模板
4. **批量安装**: 支持同时安装多个相关服务器
5. **安装历史**: 记录和回放安装过程