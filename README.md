# LifeBudget
Financial stress is one of the most common problems faced by people worldwide. Many individuals live paycheck to paycheck and struggle to track spending, manage bills, save money, or understand where their income actually goes. Existing financial tools are often too complex, overwhelming, or designed only for financially literate users. 

The purpose of LifeBudget is to provide a simple, human-friendly financial wellness platform that helps people understand their income, expenses, and spending habits without requiring accounting knowledge. The project focuses on clarity, accessibility, and emotional well-being rather than complex financial forecasting.

---

## Contributors

**Syla Marie Cumuyog**
"Choose you love, love your choice" President Thomas S. Monson

**Miguel Condorí**
"The more you learn about the Savior, the easier it will be to trust in His mercy, His infinite love, and His strengthening, healing, and redeeming power. The Savior is never closer to you than when you are facing or climbing a mountain with faith" President Russell M. Nelson

**Lucas Mendonça**
“Freedom is not doing what one wants, but wanting what one ought to do.” Kant, I. (2012). Groundwork of the metaphysics of morals (M. Gregor & J. Timmermann, Trans.). Cambridge University Press. (Original work published 1785)

---

## Project Structure
```text
LifeBudget
│
├── backend
│ └── LifeBudget.Api # ASP.NET Core Web API
│
├── frontend
│ └── lifebudget-web # Frontend web application (Vite)
│
└── README.md
```

## Tech Stack

**Backend**
- ASP.NET Core Web API
- MongoDB Atlas
- Swagger (API documentation)

**Frontend**
- Vite
- JavaScript / HTML / CSS
- Node.js

### Design and Project Board
These resources capture the initial ideation, planning, and system design for the LifeBudget project.
[Trello Board](https://trello.com/b/o0uedwXo/lifebudget)
[Sequence Diagrams](https://miro.com/welcomeonboard/UU84VkhvYjdPeTFZRGd0OU5ManpzalFJUFRJbDZlQ1lmdEZvdkJ3ZEZqWHo4a0diSis4L1l0UVJKYTJub0lUeEZOM3A3Y1dhRkFZaEtlczg2WTRYVEVIc0JuSk00NmtrUW1KL1gzTm9DS3l2YlVVanBJazczUjlYajNFbEtvTDFQdGo1ZEV3bUdPQWRZUHQzSGl6V2NBPT0hdjE=?share_link_id=782349014295)

## How to Run the Project

Two terminals are required to run the project locally.

### Backend
```bash
cd backend/LifeBudget.Api
dotnet run
---

API and Swagger will be available at:
http://localhost:5272

```
### Frontend
```bash
cd frontend/lifebudget-web
npm install
npm run dev

The frontend will run at:
http://localhost:5173