# UML Design for E-commerce-CLOSET

## Class Diagram

This diagram represents the structure of the application, focusing on the core Data Models, Services, and their relationships with the main `ProductsComponent`.

```mermaid
classDiagram
    %% Interfaces
    class IProduct {
        +number id
        +string title
        +number price
        +string description
        +string category
        +string image
        +IRating rating
        +number quantity?
        +string color?
        +number size?
        +string localCategory?
    }

    class IRating {
        +number rate
        +number count
    }

    %% Relationships
    IProduct *-- IRating : contains

    %% Services
    class ProductApiServicesService {
        +getAllProducts() Observable~IProduct[]~
        +getProductById(id) Observable~IProduct~
        +addProduct(product)
        +deleteProduct(id)
    }

    class CartServicesService {
        -BehaviorSubject~IProduct[]~ cartSubject
        +getCart() Observable~IProduct[]~
        +addToCart(product, quantity)
        +removeFromCart(index)
        +clearCart()
        +getTotal() Observable~number~
        +getCount() Observable~number~
        +increaseQty(index)
        +decreaseQty(index)
        +getCartCount() number
    }

    class AuthService {
        -BehaviorSubject~User~ currentUser
        -BehaviorSubject~boolean~ isAdmin
        +register(email, password, name)
        +login(email, password)
        +signInWithGoogle()
        +signInWithFacebook()
        +logout()
        +loginAsAdmin(code)
        +getCurrentUser()
    }

    class FirebaseService {
        +logEvent(userId, type, data)
        +addSubscriber(email)
        +createOrder(orderData)
    }

    %% Components (Sample)
    class ProductsComponent {
        +IProduct[] products
        +IProduct[] filterProducts
        +isAdmin boolean
        +addToCart(product)
        +deleteProduct(id)
        +filterByCategory(cat)
        +applyFilter()
    }

    %% Dependencies
    ProductsComponent ..> ProductApiServicesService : uses
    ProductsComponent ..> CartServicesService : uses
    ProductsComponent ..> AuthService : uses
    ProductsComponent ..> FirebaseService : uses
    ProductsComponent ..> IProduct : uses

    ProductApiServicesService ..> IProduct : returns
    CartServicesService ..> IProduct : manages
```

## Sequence Diagram: Add to Cart Flow

This diagram illustrates the interaction between the User, Component, and Services when a user attempts to add a product to the cart.

```mermaid
sequenceDiagram
    actor User
    participant PC as ProductsComponent
    participant Auth as AuthService
    participant Cart as CartServicesService
    participant FB as FirebaseService
    participant Router as Router

    User->>PC: Clicks "Add to Cart"
    PC->>Auth: getCurrentUser()
    Auth-->>PC: Returns User Object (or null)

    alt User is Logged In
        PC->>Cart: addToCart(product)
        activate Cart
        Cart-->>Cart: Update State & LocalStorage
        deactivate Cart
        
        PC->>FB: logEvent(userId, 'add_to_cart', {productId})
        activate FB
        FB-->>FB: Write to Firestore
        deactivate FB
        
        PC-->>User: Visual Feedback (Button/Badge update)
    else User is NOT Logged In
        PC-->>User: Show Alert "Must be logged in"
        PC->>Router: navigate(['/login'])
    end
```
