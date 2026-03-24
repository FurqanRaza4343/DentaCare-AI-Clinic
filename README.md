# 🦷 DentaCare AI — Intelligent Dental Clinic System

A full-stack AI-powered dental clinic website with an intelligent chatbot that automates appointment booking, lead capture, and patient communication — end to end.

---

## 🚨 The Problem

Most dental clinics still rely on phone calls and manual scheduling. This creates a chain of daily losses:

- Missed calls = missed patients
- Staff spending hours answering repetitive questions
- No system to capture or follow up on leads
- Language barriers with patients
- Appointments lost due to no follow-up process

---

## ✅ The Solution

A 24/7 AI receptionist that handles everything automatically — from the moment a patient visits the website to the moment the clinic confirms the appointment.

---

## 🏗️ System Architecture

> User → Website (Lead Capture) → Flowise Chatbot (AI) → Booking Engine → n8n Automation → Patient Email + Owner Notification
```

Patient visits website
       ↓
Enters name, email & phone (mandatory lead capture)
       ↓
AI chatbot activates (Flowise — Tool Agent + Memory)
       ↓
Chatbot understands issue → books appointment
       ↓
n8n workflow triggers
       ↓
Patient gets confirmation email + Owner gets call reminder
       ↓
All data saved in system automatically
```

---

## ⚙️ Features

### 🔐 Mandatory Lead Capture
Before a patient can start chatting, they must provide:
- Full name
- Email address
- Phone number

Every website visitor becomes a captured lead — automatically.

### 💬 Multilingual AI Chatbot
Built on Flowise with a Tool Agent and Buffer Memory. Supports:
- English
- Urdu
- Roman Urdu
- Any language the patient is comfortable with

The chatbot understands context, remembers the conversation, and guides patients through the booking process naturally.

### 📅 Smart Appointment Booking
The chatbot collects:
- Patient's dental issue / reason for visit
- Preferred date and time
- Confirms the appointment in chat

### 📧 Automated Dual Email System (via n8n)
When a booking is confirmed:
- **Patient** receives a confirmation email instantly
- **Clinic owner** receives a notification email with a reminder to make a follow-up call

Zero manual work required.

### 🧠 RAG Integration
The chatbot is trained on the clinic's own data — services, pricing, FAQs, clinic info. Responses are:
- Accurate (not hallucinated)
- Context-aware
- Specific to the clinic

### 💾 Full Data Storage
Every patient interaction, lead, and appointment is stored and structured inside the system automatically. No spreadsheets. No manual entry.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| AI Chatbot | Flowise (Tool Agent + Buffer Memory) |
| LLM | Google Gemini via ChatGoogleGenerativeAI |
| Knowledge Base | RAG (Retrieval-Augmented Generation) |
| Automation | n8n (email workflows) |
| Frontend | Custom HTML/CSS/JS Website |
| Deployment | Flowise Cloud + Vercel |

---

## 📂 Project Structure
```
dentacare-ai/
├── website/              # Frontend dental clinic website
│   ├── index.html
│   ├── style.css
│   └── script.js
├── flowise/              # Chatbot configuration
│   └── chatflow.json     # Exported Flowise chatflow
├── n8n/                  # Automation workflows
│   └── workflow.json     # Email automation export
└── README.md
```

---

## 🎥 Demo

> Full walkthrough video: Website → Lead Capture → Chatbot Conversation (Roman Urdu) → Appointment Booking → Email Confirmations

https://www.linkedin.com/posts/furqan-raza-879504351_aiautomation-dentalai-healthcareai-activity-7442118806459654145-v6qD?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAFfRa90B1vtKNLXmWpPEBAZFHgoRvziSRFE

---

## 🚀 Use Cases

- **Pakistan** — Clinics running on WhatsApp/phone calls with no digital system
- **International** — Clinics looking to automate front-desk operations at scale
- **Any language market** — Multilingual support removes the language barrier

---

## 👤 Built By

**Furqan Raza** — AI Automation Developer
- LinkedIn: (https://linkedin.com/in/furqan-raza-879504351)
- Building AI solutions for real businesses

---

## 📩 Want This For Your Clinic?

DM me on LinkedIn if you want a system like this built for your business.
