# Dsy_ChallengeTask2

## Challenge Task FS 2023

This semester's challenge task (CT) is the design and implementation of a simple distributed system (of your choice), with at least one service with a websocket, and where a service instance can fail. The system needs to have the following components:

1. Simple Frontend (e.g., HTML, Vue, React, Svelte)
2. Loadbalancer(e.g., traefik, nginx, HAproxy, Caddy)
3. Two instances of a service (your choice), and during the challenge task presentation, one instance will be shut off.
4. One storage backend

## Requirements

All requirements below must be met in order to pass this lecture.
1. Load balancing with scalable service
2. Failover of a service instance
3. Dockerized and Frontend connects via HTTP/3
4. Persistant storage (storage does not need to be scalable, but you can build it scalable if you want)
5. Use latest stable releases of chosen libraries and frameworks


## Deliverables

Hand-in 1: 17.04.2023, 23:59 (CET)  - initial version of your project.

Final hand-in: 22.05.2023, 23:59 (CET) (CET) - well documented infrastructure, presentation (slides) of the application, also showing the architecture and design decisions via email to thomas.ost-at-bocek.ch or via a repository invite. The code and configuration should be easy to read and/or well documented, the presentation (slides or text) should show the architecture, components, and design decisions. During the weeks 23.05./30.05., you will present and demo your solutions onsite.

# Documentation

## Architecture Overview
![Architecture](/images/architecture.png)

The system comprises of four main components:
- React
  - Frontend service which displays a to-do list.
- Traefik
  - Listens to all traffic on port 80 (HTTP) and port 443 (HTTPS). Redirects all traffic to HTTPS.
  - Load balances traffic between the two Node.js instances.
  - If one Node.js instance fails, Traefik will automatically redirect traffic to the other instance.
  - HTTP/3 is enabled.
- Node.js
  - Backend service which handles all requests from the frontend.
  - Two instances are running simultaneously.
- MongoDB
  - Database which stores all to-do list items.

## Layer Architecture
![Layer](/images/layer_architecture.png)

## Frontend/Presentation Layer
The frontend/presentation layer employs the following technology stack:
- HTML
- CSS
- JavaScript
- React.js

We opted to utilize React.js for our frontend service due to its widespread popularity and extensive documentation. 
We also have some prior experience with React.js, which we felt would be beneficial in the development process.

The presentation layer consists of the user interface component, 
enabling users to interact with the application via a web browser. 
This layer communicates with the backend layer to retrieve data and receive notifications of any changes.

## Load Balancer
For load balancing our application, we selected Traefik. 
Initially, we experimented with Traefik but encountered issues with HTTP3 visibility. 
Consequently, we attempted using Caddy but then encountered issues with its configuration.
Ultimately, we returned to Traefik and resolved the HTTP3 visibility issue.

## Backend/Backend Layer
The backend/backend layer employs the following technology stack:
- Node.js
- JavaScript
- Express
- Docker

While we possessed some familiarity with most of these technologies, our knowledge was not extensive.

The backend layer serves as the foundation of the application, providing services and implementing the logical components of our web application. 
All services operate through the backend layer, which communicates with the presentation layer to inform it of any changes.

## Usage with Docker

```shell
docker-compose up --build
```

Please allow a moment for the process to complete. 
Afterward, open your web browser and navigate to https://localhost.
