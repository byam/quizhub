# Deployment

- [Deployment](#deployment)
  - [Refs](#refs)
  - [Frontend](#frontend)
    - [Local test](#local-test)
    - [Docker test](#docker-test)
    - [Deploy to Firebase Hosting](#deploy-to-firebase-hosting)
  - [Backend](#backend)
    - [Backend local test](#backend-local-test)
    - [Backend Deploy to CloudRun](#backend-deploy-to-cloudrun)

## Refs

Service

- Frontend: <https://compro-quizhub.web.app/>
- Backend: <https://compro-quizhub-backend-6fp366znna-uc.a.run.app>

Cloud

- [Firebase: compro-quizhub](https://console.firebase.google.com/u/0/project/compro-quizhub)
- [Google Cloud: compro-quizhub](https://console.cloud.google.com/run?project=compro-quizhub)
- [Cloud MongoDB: (byambasuren) ComproQuizHub](https://cloud.mongodb.com/v2/64484914b197ca7842575f91#/serverless/detail/ComproQuizHub)

## Frontend

### Local test

```sh
cd frontend

# install dependencies
npm i

# local test
ng serve
```

Go to <http://localhost:4200>

### Docker test

```sh
cd frontend

# image build
docker build -t frontend:local .

# local test
docker run -it -p 8080:8080 docker.io/library/frontend:local
```

Go to <http://localhost:8080>

### Deploy to Firebase Hosting

```sh
# build files
npm run build --prod --aot

# deploy to hosting
firebase deploy -m "frontend hosting" --only hosting
```

Go to <https://compro-quizhub.web.app/>

## Backend

### Backend local test

Make sure `.env` file is properly set.

```sh
cd backend

npm install

npm run start
```

Test on <http://localhost:3000> using HTTP Client

### Backend Deploy to CloudRun

Make sure `.env.yaml` file is properly set.

```sh
cd backend

sh build.sh
sh deploy_run.sh
```
