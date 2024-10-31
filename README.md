# vibeBuddies Server

Link: [Link to this doc](#https://github.com/Gustavogamboa96/vibeBuddies-server/blob/main/README.md)

Author(s): Luis Sierra Osorio, Nicholas Koffler, Gustavo Gamboa Malaver

Status: Reviewed

Last Updated: 2024-10-30

## Contents
- Objective
- Goals
- Non-Goals
- Background
- Overview
- Detailed Design
  - Solution
    - Frontend
    - Backend
    - User Stories

## Objective
The objective of the vibeBuddies project is to create a platform where users can share their music vibes through vibeChecks, interact with friends, and engage with a community of music enthusiasts. This project aims to enhance user engagement by allowing users to like, comment, and connect with others based on their musical preferences.

## Goals
- Enable user registration and account management.
- Provide a user-friendly interface for creating, viewing, and interacting with vibeChecks.
- Facilitate social interactions through friend requests and comments.
- Ensure a safe environment by preventing profanity in comments.
- Support dark/light mode for better user experience.

## Non-Goals
- Implementing advanced music recommendation algorithms.
- Integrating features unrelated to music sharing and social interaction.

## Background
vibeBuddies was conceived to address the growing need for a social music platform where users can share their musical experiences and connect with others. This project will utilize Node.js, Express, DynamoDB, and JWT tokens for secure user authentication and data management. 

## Overview
The vibeBuddies platform will allow users to register, log in, and interact with vibeChecks—a unique way to express musical preferences. Users can create vibeChecks, like/dislike others’ vibeChecks, and comment on them. The platform will also support friend requests and user profile management, making it a comprehensive social music experience.

## Detailed Design
### Solution 1
#### Frontend
The frontend will be built using React, providing a responsive and dynamic user interface. Key features include:
- User registration and login forms.
- Profile management interface.
- VibeCheck creation and interaction UI.
- Global and Friend Feeds for vibeChecks.
- Navigation bar for easy access to different sections of the site.

#### Backend
The backend will be developed using Node.js and Express, handling API requests and user authentication. Key functionalities include:
- User registration and login endpoints.
- VibeCheck creation and management endpoints.
- Friendship management and interaction endpoints.

#### User Stories (MVP)
- As a guest, I should be able to register an account.
- As a guest, I should not be able to like or make vibeChecks.
- As a user, I should be able to log in using my username and password.
- As a user, I should be able to edit my profile (add more info).
- As a user, I should be able to see a history of my vibeChecks and comments in my profile tab.
- As a user, I should be able to go to the website and view global/friends vibeChecks.
- As a user, I should be able to create a vibeCheck for song(s)/album(s).
- As a user, I should be able to like/dislike others’ vibeChecks.
- As a user, I should be able to comment on others’ vibeChecks.
- As a user, I should be able to add friends (through search or click to profile).
- As a user, I should be able to accept/deny friend requests.
- As a user, I should be able to navigate the website through the nav bar.
- As a user, I should be able to log out.
- As a user, I should be allowed to change my password.
- As a user, I should be able to request account deletion.

## APIs
- [Last.fm API](https://www.last.fm/api)
