# TritonScript - Getting Started Guide

Welcome to TritonScript! This guide will help you set up and run the application on your local machine.

## What is TritonScript?

TritonScript is a note-sharing platform for the Office for Students with Disabilities at UCSD. 
It allows approved scribes to upload course notes and students to access them through a centralized dashboard. Then, some admins can manage who can upload notes and who can access it.

## Setup Instructions.

```
git clone https://github.com/CSES-Open-Source/tritonscript.git
cd TritonScript
npm install
```
- You might be wondering why are we not using our old tech stacks and why are we using this random thing called Appwrite. It's because it's very easy to setup the backend and therefore developers can work on the frontend. https://www.youtube.com/watch?v=L07xPMyL8sY 
- Now createa `.env.local` in the root directory and add the followwing code
```
NEXT_PUBLIC_DB_ID=
NEXT_PUBLIC_PROFILES_COLLECTION_ID=
NEXT_PUBLIC_PROJECT_ID=""
NEXT_PUBLIC_STORAGE_BUCKET_ID=""
NEXT_PUBLIC_NOTES_COLLECTION_ID=""
```
- you can get all the values on notion
- Now, run the development server ```npm run dev```
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- If you see this <img width="815" height="778" alt="image" src="https://github.com/user-attachments/assets/81e8b48c-efcb-495c-8d9e-341abd972936" />
  we gucci
- Now, we need to know how next.js works. It's easy, if you know basic React, then you know how Next.js works.
- Main thing we need to know for our project is that it has File-Based Routing. What I mean by that is there is a directory app. And let's say I wanna design an endpoint ```/login``` Then, all I do is create a directory called login inside app and create a file named ```page.tsx```.
- 


