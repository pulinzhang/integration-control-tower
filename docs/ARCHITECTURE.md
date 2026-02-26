# Integration Control Tower - Architecture & Module Design

## 1. Product Overview

**Integration Control Tower (ICT)** is a simulation platform that demonstrates enterprise-grade integration governance capabilities. It provides a realistic SaaS-like interface for managing API integrations with comprehensive governance features.

### 1.1 Core Value Proposition

| Capability                 | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| **Data Validation**        | Schema validation, type checking, business rule enforcement       |
| **Mapping**                | Source-to-target field transformation with visual mapping         |
| **Idempotency**            | Duplicate detection and handling for safe retries                 |
| **Logging & Traceability** | Full audit trail with request/response tracking                   |
| **Retry Mechanism**        | Configurable retry policies with exponential backoff              |
| **Manual Review Workflow** | Approval queues for high-risk or anomalous transactions           |
| **TCC Transaction**        | Try-Confirm-Cancel pattern for distributed transaction management |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER (Web UI)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  Dashboard  │ │ Integration │ │   Monitor   │ │   Admin     │            │
│  │   Module    │ │   Designer  │ │   Console   │ │   Panel     │            │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY LAYER                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  REST API   │ │  WebSocket  │ │    GraphQL  │ │  Webhook    │          │
│  │  Endpoints  │ │   Real-time │ │   (Optional)│ │  Handler    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CORE ENGINE LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    ORCHESTRATION ENGINE                             │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐           │   │
│  │  │  Request  │ │  Process  │  │  Worker   │ │  Event    │           │   │
│  │  │  Router   │ │  Scheduler│ │  Queue    │ │  Bus      │           │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  Validation │ │   Mapping   │ │ Idempotency │ │    TCC      │          │
│  │   Engine    │ │   Engine    │ │   Manager   │ │  Coordinator│          │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA PERSISTENCE LAYER                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  PostgreSQL │ │    Redis    │ │   Elastic   │ │    S3/MinIO │          │
│  │  (Primary)  │ │   (Cache)   │ │   (Logs)    │ │  (Payloads) │          │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SIMULATION & MOCK LAYER                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Mock      │ │   Scenario  │ │   Chaos     │ │  Test Data  │          │
│  │  Endpoints  │ │  Runner     │ │  Engine     │ │  Generator  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Module Breakdown

### 3.1 Client Layer Modules

#### 3.1.1 Dashboard Module

**Purpose**: Central monitoring and analytics hub

**Features**:

- Real-time integration health status
- Transaction volume charts (line, bar, pie)
- Success/failure rate metrics
- Recent activity feed
- Quick action buttons (pause, resume, retry failed)
- System alerts and notifications

**Components**:

- `MetricCard` - KPI display components
- `ActivityTimeline` - Recent events visualization
- `HealthStatusGrid` - Integration status overview
- `AlertPanel` - Notifications and warnings

---

#### 3.1.2 Integration Designer Module

**Purpose**: Visual configuration of integrations

**Features**:

- Drag-and-drop integration builder
- Source/target system configuration
- Field mapping interface
- Transformation rule editor
- Validation rule definition
- Test/simulate functionality

**Components**:

- `IntegrationCanvas` - Visual workspace
- `SourceConfigPanel` - Source system setup
- `TargetConfigPanel` - Target system setup
- `MappingEditor` - Field transformation UI
- `ValidationRuleBuilder` - Rule configuration

---

#### 3.1.3 Monitor Console Module

**Purpose**: Real-time transaction monitoring

**Features**:

- Live transaction stream
- Log viewer with filtering
- Trace ID correlation
- Payload inspection (request/response)
- Performance metrics
- Error investigation tools

**Components**:

- `TransactionTable` - Paginated transaction list
- `LogViewer` - Structured log display
- `PayloadInspector` - JSON/XML viewer
- `TraceExplorer` - Distributed tracing UI
- `FilterPanel` - Advanced search

---

#### 3.1.4 Admin Panel Module

**Purpose**: System configuration and user management

**Features**:

- User authentication & authorization
- Role-based access control (RBAC)
- System settings configuration
- API key management
- Audit log export
- Integration templates

**Components**:

- `UserManagement` - User CRUD
- `RoleEditor` - Permission configuration
- `SettingsForm` - System preferences
- `ApiKeyManager` - Key lifecycle
- `AuditLogViewer` - Compliance logs

---

### 3.2 API Gateway Layer Modules

#### 3.2.1 REST API Module

**Purpose**: Primary API for external and internal clients

**Endpoints Structure**:

```
/api/v1/
├── /integrations          # Integration CRUD
│   ├── GET    /api/v1/integrations
│   ├── POST   /api/v1/integrations
│   ├── GET    /api/v1/integrations/{id}
│   ├── PUT    /api/v1/integrations/{id}
│   └── DELETE /api/v1/integrations/{id}
│
├── /transactions          # Transaction operations
│   ├── GET    /api/v1/transactions
│   ├── GET    /api/v1/transactions/{id}
│   ├── POST   /api/v1/transactions (submit new)
│   ├── POST   /api/v1/transactions/{id}/retry
│   └── POST   /api/v1/transactions/{id}/cancel
│
├── /mappings              # Mapping configuration
│   ├── GET    /api/v1/mappings
│   ├── POST   /api/v1/mappings
│   └── PUT    /api/v1/mappings/{id}
│
├── /validations           # Validation rules
│   ├── GET    /api/v1/validations
│   ├── POST   /api/v1/validations
│   └── PUT    /api/v1/validations/{id}
│
├── /logs                  # Log retrieval
│   ├── GET    /api/v1/logs
│   └── GET    /api/v1/logs/{traceId}
│
├── /reviews               # Manual review workflow
│   ├── GET    /api/v1/reviews
│   ├── POST   /api/v1/reviews/{id}/approve
│   └── POST   /api/v1/reviews/{id}/reject
│
└── /health                # System health
    └── GET    /api/v1/health
```

---

#### 3.2.2 WebSocket Module

**Purpose**: Real-time updates and notifications

**Channels**:

- `transaction.stream` - Live transaction events
- `integration.status` - Integration health changes
- `review.notifications` - Manual review alerts
- `system.alerts` - System-wide notifications

---

#### 3.2.3 Webhook Handler Module

**Purpose**: Receive and process inbound webhooks

**Features**:

- Signature verification
- Payload parsing
- Retry on failure
- Event transformation

---

### 3.3 Core Engine Layer Modules

#### 3.3.1 Orchestration Engine

**Purpose**: Coordinate all integration processing

**Sub-modules**:

| Module                | Responsibility                                                            |
| --------------------- | ------------------------------------------------------------------------- |
| **Request Router**    | Parse incoming requests, determine integration route, apply routing rules |
| **Process Scheduler** | Manage job scheduling, priority queues, concurrency control               |
| **Worker Queue**      | Handle async processing, distribute workloads, manage worker pools        |
| **Event Bus**         | Pub/sub for inter-service communication, event-driven architecture        |

---

#### 3.3.2 Validation Engine

**Purpose**: Enforce data quality and business rules

**Validation Types**:

1. **Schema Validation** - JSON Schema, XSD, custom formats
2. **Type Validation** - Data type checking (string, number, date, etc.)
3. **Range Validation** - Min/max values, length constraints
4. **Format Validation** - Regex patterns, format specifiers
5. **Business Rule Validation** - Custom validation scripts
6. **Referential Integrity** - Cross-field validation

**Architecture**:

```
ValidationRequest
       │
       ▼
┌──────────────────┐
│  Validation      │
│  Chain Builder   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐
│  Schema         │────▶│  Type            │
│  Validator       │     │  Validator       │
└──────────────────┘     └──────────────────┘
         │                       │
         ▼                       ▼
┌──────────────────┐     ┌──────────────────┐
│  Range           │────▶│  Business        │
│  Validator       │     │  Rules           │
└──────────────────┘     └──────────────────┘
         │
         ▼
┌──────────────────┐
│  Validation     │
│  Reporter        │
└──────────────────┘
```

---

#### 3.3.3 Mapping Engine

**Purpose**: Transform data between source and target formats

**Mapping Operations**:

1. **Direct Mapping** - Field-to-field copy
2. **Constant Mapping** - Static value assignment
3. **Expression Mapping** - Calculated fields
4. **Lookup Mapping** - Reference table lookup
5. **Conditional Mapping** - If-then-else logic
6. **Concatenation** - Multiple source to single target
7. **Split** - Single source to multiple targets
8. **Format Conversion** - Date, number format transformations

**Visual Representation**:

```
Source JSON                    Target JSON
─────────────────              ─────────────────
{
  "customer": {        ────▶   "client_info": {
    "first_name": "John",            "name": "John Doe",
    "last_name": "Doe",             "contact": "john@example.com"
    "email": "john@example.com"   }
  }
}
```

---

#### 3.3.4 Idempotency Manager

**Purpose**: Ensure safe retry of operations

**Key Features**:

- **Idempotency Key Generation** - Unique keys per request
- **Deduplication** - Detect and handle duplicates
- **Result Caching** - Store operation results
- **TTL Management** - Key expiration policies

**Flow**:

```
Request with Idempotency-Key
           │
           ▼
    ┌─────────────┐
    │  Check      │
    │  Cache      │
    └──────┬──────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
  EXISTS      NOT EXISTS
     │           │
     ▼           ▼
 Return    Process
 Cached     Request
 Result     Normally
     │           │
     └─────┬─────┘
           │
           ▼
    ┌─────────────┐
    │  Store      │
    │  Result     │
    └─────────────┘
```

---

#### 3.3.5 TCC Coordinator

**Purpose**: Implement Try-Confirm-Cancel pattern

**Transaction States**:

- `TRYING` - Prepare resources, reserve capacity
- `CONFIRMED` - Commit changes, make permanent
- `CANCELLED` - Rollback, release resources

**Features**:

- Distributed transaction management
- Compensating transactions
- Timeout handling
- Partial failure recovery

**Flow**:

```
┌─────────────────────────────────────────────────────────────┐
│                     TCC FLOW                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────┐    ┌───────────┐    ┌────────────┐    ┌────────┐  │
│  │Client│───▶│    TRY    │───▶│  CONFIRM   │───▶│  END   │  │
│  └──────┘    └───────────┘    └────────────┘    └────────┘  │
│                  │                    │                     │
│                  │ (on failure)        │ (on failure)       │
│                  ▼                    ▼                     │
│            ┌───────────┐        ┌────────────┐              │
│            │  CANCEL   │        │  CANCEL    │              │
│            └───────────┘        └────────────┘              │
│                  │                    │                     │
│                  └────────┬───────────┘                     │
│                           ▼                                 │
│                      ┌────────┐                              │
│                      │  END   │                              │
│                      └────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

---

#### 3.3.6 Retry Mechanism

**Purpose**: Handle transient failures gracefully

**Configuration Options**:
| Parameter | Description |
|-----------|-------------|
| `maxRetries` | Maximum retry attempts |
| `initialDelay` | First retry delay (ms) |
| `maxDelay` | Maximum delay cap (ms) |
| `backoffMultiplier` | Exponential backoff factor |
| `retryableErrors` | List of errors that trigger retry |
| `jitter` | Randomization to prevent thundering herd |

**Strategies**:

1. **Fixed Delay** - Constant wait between retries
2. **Exponential Backoff** - Delay increases exponentially
3. **Exponential with Jitter** - Randomized exponential backoff
4. **Linear Backoff** - Delay increases linearly

---

#### 3.3.7 Manual Review Workflow

**Purpose**: Human-in-the-loop for high-risk operations

**Features**:

- **Review Queue** - Pending items for review
- **Approval/Rejection** - Binary decision
- **Escalation** - Route to different approvers
- **Comments** - Annotation capability
- **Bulk Actions** - Process multiple items
- **SLA Tracking** - Review time monitoring

**Rules Engine**:

```
Request → Risk Assessment → Decision
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         Auto-Approve    Manual Review    Auto-Reject
         (Low Risk)      (Medium Risk)     (High Risk)
```

---

### 3.4 Data Persistence Layer Modules

#### 3.4.1 PostgreSQL (Primary Database)

**Tables**:

- `integrations` - Integration definitions
- `transactions` - Transaction records
- `mapping_configs` - Field mapping rules
- `validation_rules` - Validation configurations
- `users` - User accounts
- `roles` - Role definitions
- `audit_logs` - System audit trail
- `review_queue` - Manual review items

#### 3.4.2 Redis (Cache & Queue)

- **Cache**: Idempotency keys, session data, rate limiting
- **Queue**: Job queues for async processing
- **Pub/Sub**: Real-time notifications

#### 3.4.3 Elasticsearch (Logs & Search)

- Structured logs with full-text search
- Log aggregation and analytics
- Trace correlation

#### 3.4.4 S3/MinIO (Payload Storage)

- Request/response payloads
- Large JSON/XML documents
- Audit evidence storage

---

### 3.5 Simulation & Mock Layer Modules

#### 3.5.1 Mock Endpoints

**Purpose**: Simulate external API behavior

**Capabilities**:

- Configurable response delays
- Error simulation (500, 429, timeouts)
- Response payload templates
- Dynamic response generation

#### 3.5.2 Scenario Runner

**Purpose**: Execute predefined test scenarios

**Built-in Scenarios**:

1. Happy path transaction
2. Validation failure
3. Network timeout
4. Duplicate submission
5. Partial failure with TCC
6. Manual review trigger

#### 3.5.3 Chaos Engine

**Purpose**: Introduce controlled failures

**Features**:

- Random delay injection
- Error rate simulation
- Network partition simulation

#### 3.5.4 Test Data Generator

**Purpose**: Generate realistic test data

**Capabilities**:

- Sample customer data
- Transaction templates
- Edge case generation

---

## 4. Data Models

### 4.1 Integration

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "source": {
    "type": "REST|GRPC|FILE",
    "config": {}
  },
  "target": {
    "type": "REST|GRPC|DATABASE",
    "config": {}
  },
  "status": "ACTIVE|PAUSED|ERROR",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 4.2 Transaction

```json
{
  "id": "uuid",
  "integration_id": "uuid",
  "trace_id": "uuid",
  "idempotency_key": "string",
  "status": "PENDING|PROCESSING|SUCCESS|FAILED|REVIEW_PENDING|CANCELLED",
  "tcc_state": "TRYING|CONFIRMED|CANCELLED|NONE",
  "retry_count": "number",
  "source_payload": {},
  "mapped_payload": {},
  "target_response": {},
  "error": {},
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 4.3 Review Item

```json
{
  "id": "uuid",
  "transaction_id": "uuid",
  "status": "PENDING|APPROVED|REJECTED",
  "risk_score": "number",
  "risk_factors": [],
  "reviewer_id": "uuid",
  "comments": "string",
  "reviewed_at": "timestamp"
}
```

---

## 5. API Design Patterns

### 5.1 Standard Response Format

```json
{
  "success": true,
  "data": {},
  "meta": {
    "trace_id": "uuid",
    "timestamp": "ISO8601",
    "version": "1.0"
  }
}
```

### 5.2 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": [],
    "trace_id": "uuid"
  }
}
```

### 5.3 Pagination

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

## 6. UI/UX Design Direction

### 6.1 Visual Style

- **Theme**: Dark mode enterprise dashboard (like Datadog, New Relic)
- **Color Palette**:
  - Primary: Deep blue (#1E3A5F)
  - Accent: Cyan (#00D4FF)
  - Success: Green (#00C853)
  - Warning: Amber (#FFB300)
  - Error: Red (#FF5252)
  - Background: Dark gray (#121212, #1E1E1E)
- **Typography**: Clean, monospace for data (JetBrains Mono), sans-serif for UI (Inter)
- **Components**: Card-based, subtle shadows, smooth transitions

### 6.2 Layout

- **Sidebar**: Navigation (240px fixed)
- **Header**: Search, notifications, user menu (64px)
- **Main Content**: Fluid, responsive grid
- **Responsive**: Desktop-first, tablet support

---

## 7. Technology Stack Recommendations

### 7.1 Backend

| Component      | Technology                            |
| -------------- | ------------------------------------- |
| Framework      | Node.js + Express or Python + FastAPI |
| Database       | PostgreSQL                            |
| Cache/Queue    | Redis                                 |
| Search         | Elasticsearch                         |
| Object Storage | MinIO (S3-compatible)                 |
| Task Queue     | BullMQ or Celery                      |

### 7.2 Frontend

| Component        | Technology               |
| ---------------- | ------------------------ |
| Framework        | React + TypeScript       |
| State Management | Zustand or Redux Toolkit |
| UI Library       | Tailwind CSS + shadcn/ui |
| Charts           | Recharts or Chart.js     |
| Tables           | TanStack Table           |
| Forms            | React Hook Form + Zod    |

### 7.3 DevOps (Simulation)

| Component     | Technology     |
| ------------- | -------------- |
| Container     | Docker         |
| Orchestration | Docker Compose |

---

## 8. Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEPENDENCY HIERARCHY                              │
└─────────────────────────────────────────────────────────────────────────────┘

Layer 1: Foundation
├── Configuration Manager
├── Logger
└── Security Utils

Layer 2: Data Access
├── Repository Layer
├── Cache Manager
└── Queue Manager

Layer 3: Core Business Logic
├── Validation Engine
├── Mapping Engine
├── Idempotency Manager
└── TCC Coordinator

Layer 4: Orchestration
├── Request Router
├── Process Scheduler
├── Worker Queue
└── Event Bus

Layer 5: Workflows
├── Retry Mechanism
├── Manual Review Workflow
└── Notification Service

Layer 6: API
├── REST Controllers
├── WebSocket Handler
└── Webhook Receiver

Layer 7: UI (depends on all)
├── Dashboard
├── Integration Designer
├── Monitor Console
└── Admin Panel
```

---

## 9. Implementation Phases

### Phase 1: Core Foundation (Week 1)

- Project setup and infrastructure
- Basic data models
- REST API skeleton
- Authentication

### Phase 2: Core Engines (Week 2)

- Validation Engine
- Mapping Engine
- Idempotency Manager

### Phase 3: Orchestration (Week 3)

- Request processing pipeline
- Worker queue integration
- Retry mechanism

### Phase 4: Workflows (Week 4)

- Manual review workflow
- TCC implementation
- Logging & traceability

### Phase 5: UI Development (Week 5-6)

- Dashboard
- Integration Designer
- Monitor Console
- Admin Panel

### Phase 6: Simulation & Demo (Week 7)

- Mock endpoints
- Scenario runner
- Demo data generation
- Testing & polish

---

## 10. Success Metrics

| Metric                         | Target      |
| ------------------------------ | ----------- |
| Integration Configuration Time | < 5 minutes |
| Transaction Processing Latency | < 500ms     |
| UI Page Load Time              | < 2 seconds |
| Code Coverage                  | > 80%       |
| Demo Scenario Completeness     | 100%        |

---

_Document Version: 1.0_
_Last Updated: 2026-02-26_
