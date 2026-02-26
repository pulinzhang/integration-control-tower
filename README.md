# Integration Control Tower

> Enterprise-grade integration governance simulation platform

**English** | [中文](#中文)

## Overview

Integration Control Tower is a demo/simulation platform that demonstrates enterprise-grade integration governance capabilities. It provides a professional SaaS-style dashboard for monitoring and managing data integrations between various enterprise systems.

## Why This Exists

Direct API connections without governance can lead to:

- Data corruption
- Duplicate records
- Payroll inconsistencies
- Financial reporting errors
- Silent synchronization failures

Automation without governance creates systemic risk.

Integration Control Tower demonstrates how enterprise systems can implement a controlled, observable, and risk-aware integration layer.

## Business Risk Narrative

When integrating operational systems with financial systems, even small inconsistencies can cascade into major financial and reporting issues.

For example:

- A mistyped project ID may create duplicate payroll entries.
- Inconsistent naming may break reconciliation reports.
- Missing callbacks may cause silent data loss.
- Repeated retries without idempotency may create double payments.

Integration Control Tower demonstrates how such risks can be detected, isolated, and controlled before automation propagates errors downstream.


This platform simulates how such risks can be detected and controlled before data reaches financial systems.

This platform intentionally simulates integration flows without external dependencies.

Its purpose is to demonstrate architectural patterns, governance controls, and risk mitigation strategies independent of specific vendor APIs.

- Data Validation
- Data Mapping
- Idempotency
- Logging & Traceability
- Retry Mechanisms
- Manual Review Workflows
- TCC (Try-Confirm-Cancel) Transaction Simulation

## Architecture Concept

It represents a governance-oriented integration layer sitting between operational systems and financial systems. 

- Validation Layer
- Standardization Layer
- Conflict Detection Layer
- Idempotency Guard
- Routing Layer
- Retry Engine
- Manual Review Queue
- Transaction Control (TCC)

It reflects how modern integration governance can be designed without heavyweight middleware.

## Design Principles

- Observability First – Every message must be traceable.
- Fail Safe – No silent failures.
- Idempotency by Default – Prevent duplicate side effects.
- Controlled Automation – Human review when risk thresholds are exceeded.
- Stateless Simulation – Architecture over vendor dependency.

## Target Audience

- Companies integrating field operations with payroll systems
- ERP / CRM integration projects
- Organizations requiring auditability and traceability
- Teams seeking safer automation practices
- Solution architects evaluating integration patterns
- Technical leads designing cross-system automation

## Features

### Dashboard & Monitoring

- **Overview** - Real-time system health, message counts, error rates, and integration flow diagrams
- **Integration Flows** - Visual pipeline representation from source to target systems
- **Message Center** - Transaction logs with full payload inspection and state machine visualization

### Governance

- **Governance Rules** - Validation rules, transformation rules, compliance policies, and alert configurations
- **Error Control** - Error categorization, root cause analysis, retry management

### Advanced Patterns

- **TCC Simulation** - Interactive Try-Confirm-Cancel transaction pattern demonstration with compensation flow

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   └── Layout.tsx          # Main application layout (top bar + navigation)
├── pages/
│   ├── Overview.tsx         # Dashboard with metrics and charts
│   ├── IntegrationFlows.tsx # Integration pipeline management
│   ├── MessageCenter.tsx   # Transaction logs with state machine
│   ├── GovernanceRules.tsx  # Validation, transformation, compliance
│   ├── ErrorControl.tsx     # Error monitoring and resolution
│   └── TCCSimulation.tsx    # TCC transaction pattern demo
├── data/
│   └── mockData.ts         # Mock data for development
├── App.tsx                 # Router configuration
└── main.tsx               # Application entry point
```

## Message Status State Machine

All integration messages follow a defined state machine:

```
RECEIVED → VALIDATED → MAPPED → SENT → CALLBACK_RECEIVED → CONFIRMED
                            ↓              ↓              ↓
                          FAILED       RETRYING        REVIEW
                            ↓              ↓
                      RETRYING /   SENT / FAILED /
                      MANUAL_REVIEW  MANUAL_REVIEW
```

| Status              | Description                        |
| ------------------- | ---------------------------------- |
| `RECEIVED`          | Message received from source       |
| `VALIDATED`         | Validation passed                  |
| `MAPPED`            | Payload transformed                |
| `SENT`              | Request sent to target             |
| `CALLBACK_RECEIVED` | Callback received from target      |
| `CONFIRMED`         | Transaction completed successfully |
| `FAILED`            | Transaction failed                 |
| `RETRYING`          | Automatic retry in progress        |
| `MANUAL_REVIEW`     | Requires manual intervention       |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Pages

| Route           | Page              | Description                    |
| --------------- | ----------------- | ------------------------------ |
| `/overview`     | Overview          | System health, metrics, charts |
| `/integrations` | Integration Flows | Pipeline management            |
| `/messages`     | Message Center    | Transaction logs               |
| `/governance`   | Governance Rules  | Rules and policies             |
| `/errors`       | Error Control     | Error monitoring               |
| `/tcc`          | TCC Simulation    | TCC pattern demo               |

Integration is not about connecting APIs.
It is about controlling risk across systems.
---

## 中文

## 概述

Integration Control Tower 是一个演示/模拟平台，用于展示企业级集成治理能力。它提供了一个专业的 SaaS 风格仪表板，用于监控和管理各种企业系统之间的数据集成。

这是一个**模拟平台**，用于展示：

- 数据验证
- 数据映射
- 幂等性
- 日志与追踪
- 重试机制
- 人工审核工作流
- TCC（Try-Confirm-Cancel）事务模拟

## 功能特性

### 仪表板与监控

- **概览** - 实时系统健康状况、消息数量、错误率、集成流程图
- **集成流程** - 从源系统到目标系统的可视化管道表示
- **消息中心** - 带有完整载荷检查和状态机可视化的交易日志

### 治理

- **治理规则** - 验证规则、转换规则、合规策略、告警配置
- **错误控制** - 错误分类、根因分析、重试管理

### 高级模式

- **TCC 模拟** - 交互式 Try-Confirm-Cancel 事务模式演示，包含补偿流程

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **路由**: React Router DOM
- **图表**: Recharts
- **图标**: Lucide React

## 页面说明

| 路由            | 页面     | 描述                     |
| --------------- | -------- | ------------------------ |
| `/overview`     | 概览     | 系统健康状况、指标、图表 |
| `/integrations` | 集成流程 | 管道管理                 |
| `/messages`     | 消息中心 | 交易日志                 |
| `/governance`   | 治理规则 | 规则和策略               |
| `/errors`       | 错误控制 | 错误监控                 |
| `/tcc`          | TCC 模拟 | TCC 模式演示             |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

然后访问 http://localhost:5174

## 颜色主题

项目使用深色企业级主题：

| 颜色                      | 用途        |
| ------------------------- | ----------- |
| `#0D0D12` (obsidian)      | 主背景      |
| `#16161D` (charcoal)      | 卡片背景    |
| `#1E1E28` (slate-dark)    | 悬停/输入框 |
| `#2A2A36` (graphite)      | 边框        |
| `#00D4FF` (electric-cyan) | 主强调色    |
| `#8B5CF6` (violet-accent) | 次要强调色  |
| `#10B981` (emerald)       | 成功状态    |
| `#F59E0B` (amber-warning) | 警告状态    |
| `#EF4444` (coral)         | 错误状态    |
| `#3B82F6` (steel-blue)    | 信息状态    |

## 许可证

MIT
