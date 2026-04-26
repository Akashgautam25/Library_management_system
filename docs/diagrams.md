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
Describes the functional requirements and actor interactions.

```mermaid
useCaseDiagram
    actor Student
    actor Admin

    package "Library Management System" {
        usecase "Browse & Search Books" as UC1
        usecase "Borrow Book" as UC2
        usecase "Return Book" as UC3
        usecase "View Personal History & Fines" as UC4
        usecase "Manage Books (CRUD)" as UC5
        usecase "Manage Users" as UC6
        usecase "View Admin Dashboard" as UC7
        usecase "Manage Overdue & Fines" as UC8
        usecase "View All Transactions" as UC9
    }

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4

    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
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
