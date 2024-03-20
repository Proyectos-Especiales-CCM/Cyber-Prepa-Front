# Cyber-Prepa - Frontend

## React + TypeScript + Vite

## Table of Contents

1. [App resume and guide](#app-resume-and-guide)
2. [Requirements](#requirements)
3. [Setup for development](#setup-for-development)
4. [Deployment (Windows)](#deployment-windows)
5. [To contribute to the project](#to-contribute-to-the-project)

## App resume and guide

This is the frontend for the Cyber-Prepa project, a game rental service at Aulas 2 in campus CCM. It is a web application that will be used by students and teachers to manage the service, rules, and other activities. The project is still in its evolution, and we're open to any suggestions and contributions.

## Requirements

- Axios
- React Router Dom
- MUI (Material-UI)
- MUI Icons
- MUI Datatables
- MUI Lab (for the date picker) #x-date-pickers
- dayjs
- react-use-websocket

## Setup for development

Clone the repository and navigate to the directory

```bash
git clone https://github.com/Djmr5/Cyber-Prepa-Front
cd Cyber-Prepa-Front
```

### Install dependencies

Install the necessary packages via:

```bash
npm install yarn
# Or install yarn globally
# npm install -g yarn
yarn install
```

### Run the development server

Run the server via:

```bash
yarn dev
```

### Set environment variables

Create a `.env` file in the root of the project and add the following environment variables.

```env
VITE_API_BASE_URL=http://localhost:8000/
VITE_WS_BASE_URL=ws://localhost:8000/
VITE_MEDIA_BASE_URL=http://localhost/
```

:bangbang: **Note:** All env URLs should end with a `/` to avoid issues with the API requests.

## Deployment (Windows)

To deploy the app, you must turn on the IIS feature on your Windows machine.

### Build the app

Run the following command to build the app.

```bash
yarn build
```

This will create a `dist` folder in the root of the project.

### Install IIS

- Search for "Turn Windows features on or off" in the start menu and open it.
- Scroll down and find "Internet Information Services" and check the box.
- Click OK and wait for the installation to complete.

### Configure IIS

- After the installation is complete, open the IIS Manager.
- Look for the "Sites" node in the left pane and right-click on it.
- Click on the Default Web Site and select `Advanced Settings...`.
- Change the `Physical Path` to the `dist` folder in the root of the project.

### Install URL Rewrite

As the app uses client-side routing, you need to install the URL Rewrite module for IIS.

- Search for `IIS URL Rewrite` in your browser and download the installer.
  - Alternatively, you can download it from [here](https://www.iis.net/downloads/microsoft/url-rewrite)
- Run the installer and follow the instructions.
- Then copy the `web.config` on the root of the project to the `dist` folder.

**You're all set!** You and others can now access the frontend from the network using the machine's IP address.

## To contribute to the project

### Create a new branch

Change \<branch-name> to the name of the branch you want to create.

```bash
git checkout -b <branch-name>
```

Please follow the following naming convention for your branches so the github actions can work properly and label the pull requests accordingly.

`feature/user-authentication` **or**
`feat/chat-groups`

![feature label](https://img.shields.io/badge/feature-4FB916?style=for-the-badge)

`bug/fix-header-styling` **or**
`hotfix/security-patch` **or**
`fix/fix-login-redirect`

![bug label](https://img.shields.io/badge/bug-FF0000?style=for-the-badge)

`docs/update-readme` **or** `documentation/add-documentation` **or** `doc/add-new-guide`

![docs label](https://img.shields.io/badge/docs-0075CA?style=for-the-badge)

`style/update-styles` **or** `frontend/add-styles` **or** `ui/add-new-component` **or** `ux/add-new-animation`

![frontend label](https://img.shields.io/badge/frontend-D93F0B?style=for-the-badge)

`enhancement/add-new-feature` **or** `enhance/improve-feature`

![enhancement label](https://img.shields.io/badge/enhancement-A2EEEF?style=for-the-badge)

If already working on a remote branch, you can pull the latest changes from it and create your local branch.

```bash
git checkout -b <branch-name> origin/<branch-name>
```

### To commit and push your changes

Add your changes to the staging area, commit them with a meaningful message (try to relate your commits to an issue) and push them to the repo.

```bash
git add .
git commit -m "your message"
git push origin <branch-name>
```

- To address an issue on your commit message, use the following syntax.

```bash
git commit -m "partial progress on issue #<issue-number>"
```

- To close an issue on your commit message, use the following syntax.
  - Reserved words are: close, closes, closed, fix, fixes, fixed, resolve, resolves, resolved

```bash
git commit -m "<reserved-word> #<issue-number>"
```

### Please create a pull request

Then go to the repo and create a pull request, but wait for at least two reviews before merging your branch to the main branch.

### Be creative and share ideas :smile:

If you have a request or believe something can be improved, feel free to open an issue and discuss it with the team. The project is still in its early stages, so we're open to any suggestions.
