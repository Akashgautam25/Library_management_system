# 🏛️ Library Management System (SaaS) - Architecture Documentation

This document contains professional UML diagrams representing the architecture and design of the SaaS-based Library Management System.

---

## 1. Class Diagram
Represents the system's static structure, including entities and services.

```mermaid
classDiagram
    class User {
        +String _id
        +String name
        +String email
        +String role
        +Boolean isBlocked
        +Date createdAt
    }

    class Book {
        +String _id
        +String title
        +String author
        +String isbn
        +Number copies
        +String category
        +isAvailable() Boolean
    }

    class Transaction {
        +String _id
        +String userId
        +String bookId
        +Date borrowDate
        +Date dueDate
        +Date returnDate
        +Number fine
        +String status
    }

    class AuthService {
        +login(credentials)
        +register(userData)
        +verifyToken(token)
    }

    class BookService {
        +addBook(bookData)
        +updateBook(id, data)
        +deleteBook(id)
        +searchBooks(query)
    }

    class TransactionService {
        +issueBook(userId, bookId)
        +returnBook(transactionId)
        +calculateFine(dueDate)
        +getOverdueTransactions()
    }

    User "1" -- "*" Transaction : makes
    Book "1" -- "*" Transaction : involved in
    TransactionService ..> Transaction : manages
    BookService ..> Book : manages
    AuthService ..> User : authenticates
```

---

## 2. Use Case Diagram
Describes the functional requirements and actor interactions (GitHub Compatible).

```mermaid
flowchart LR
    subgraph Actors
        S([Student])
        A([Admin])
    end

    subgraph "Library Management System"
        direction TB
        UC1(Browse & Search Books)
        UC2(Borrow Book)
        UC3(Return Book)
        UC4(View Personal History & Fines)
        
        UC5(Manage Books - CRUD)
        UC6(Manage Users)
        UC7(View Admin Dashboard)
        UC8(Manage Overdue & Fines)
        UC9(View All Transactions)
    end

    %% Student Connections
    S --> UC1
    S --> UC2
    S --> UC3
    S --> UC4

    %% Admin Connections
    A --> UC5
    A --> UC6
    A --> UC7
    A --> UC8
    A --> UC9

    %% Styling
    style S fill:#f9f,stroke:#333,stroke-width:2px
    style A fill:#bbf,stroke:#333,stroke-width:2px
    style UC1,UC2,UC3,UC4 fill:#fff,stroke:#333,stroke-width:1px
    style UC5,UC6,UC7,UC8,UC9 fill:#fff,stroke:#333,stroke-width:1px
```

---

## 3. Sequence Diagram
Illustrates the logic flow for borrowing and returning books.

### Borrowing Flow
```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as Frontend (Dashboard)
    participant API as TransactionService
    participant DB as MongoDB

    Student->>UI: Clicks "Borrow"
    UI->>API: POST /api/transactions/borrow
    API->>DB: Check Book Availability
    DB-->>API: Available
    API->>DB: Create Transaction record
    API->>DB: Update Book Copy Count
    DB-->>API: Success
    API-->>UI: 201 Created (Success)
    UI-->>Student: Show Success Toast
```

### Returning Flow (with Fine)
```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as Frontend
    participant API as TransactionService
    participant DB as MongoDB

    Student->>UI: Clicks "Return"
    UI->>API: POST /api/transactions/return/:id
    API->>DB: Fetch Transaction Details
    DB-->>API: Transaction found
    API->>API: calculateFine(dueDate, currentDate)
    Note over API: If Overdue, set status to 'returned' & store fine
    API->>DB: Update Transaction (returnDate, fine, status)
    API->>DB: Increment Book Copy Count
    DB-->>API: Success
    API-->>UI: 200 OK (Processed with Fine)
    UI-->>Student: Display Fine details & Success
```

---

## 4. Entity-Relationship (ER) Diagram
Defines the database schema and data relationships.

```mermaid
erDiagram
    USER ||--o{ TRANSACTION : "initiates"
    BOOK ||--o{ TRANSACTION : "recorded_in"

    USER {
        string id PK
        string name
        string email
        string password
        string role "admin | student"
        boolean isBlocked
    }

    BOOK {
        string id PK
        string title
        string author
        string isbn
        int totalCopies
        int availableCopies
    }

    TRANSACTION {
        string id PK
        string userId FK
        string bookId FK
        date borrowDate
        date dueDate
        date returnDate
        float fine
        string status "borrowed | returned | overdue"
    }
```
