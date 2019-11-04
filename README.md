<p align="center"><img src="./logo.png" width="300px;" /></p>
<p align="center" style="font-weight: bold; text-align: center; font-family: monospace; padding-bottom: 15px;"><code>Be productive without leaving your keyboard</code></p>

<p align="center" style="text-align: center;"><img src="https://img.shields.io/github/license/huytd/pomoday-v2?style=for-the-badge"/> <img src="https://img.shields.io/badge/%23-community%20edition-blueviolet?style=for-the-badge"/></p>

<p align="center">Try it online at https://pomoday.app</p>

---

- [What is Pomoday?](#what-is-pomoday)
- [Features](#features)
- [Usage and Installation](#usage-and-installation)
    - [Online version](#online-version)
    - [Self-hosted](#self-hosted-version)
- [Development](#development)
- [Similar Projects](#similar-projects)
- [Backers and Sponsors](#backers-and-sponsors)
- [License](#license)

---

## What is Pomoday?

![](https://www.pomoday.com/screenshot.png)

Pomoday is an easy to use, yet powerful and flexible web-based task management software that you can use with just a keyboard.

It's flexible and doesn't tie with any productivity methodologies, that means, you
can customize and use it in anyway you want, try implementing yourself a GTD or Kanban or
Pomodoro workflow with it.

## Features

1. Task management (of course)
2. Keyboard only workflow
3. Built-in time tracker
4. Activities log to get an overview on how you spent your day
5. Dark mode
6. (A lot coming...)

## Usage and Installation

There are two ways to use Pomoday:

### Online version

You can use the online version at https://pomoday.app

### Self-hosted version

Please make sure you have `node` and `npm` installed on your machine.

To host Pomoday locally or on your own server:

1. Clone this repository
  ```
  git clone https://github.com/huytd/pomoday-v2
  ```
2. Install the dependencies
  ```
  npm install
  ```
3. Build
  ```
  npm run dist
  ```
4. Now you can deploy the `dist` folder anywhere, just like a static web page

It's recomended to deploy it to [now.sh](https://now.sh), because it's easy:

```
$ cd dist
$ now
```

## Development

To run it locally during development, use:

```
npm run dev
```

## Docker

This repo includes a `Dockerfile` and a `docker-compose.yml` to easily run the project in a container. Just run the following two commands to build the container image and start it up:

```
docker-compose build
docker-compose up -d
```

## Similar Projects

- [taskbook](https://github.com/klaussinani/taskbook): This is an awesome task management application that actually works, and works very well for everyone who likes to live in a command line. Pomoday was also heavily inspired by Taskbook, as you can see from the UI and the keyboard-only command interfaces.

## Backers and Sponsors

I would like to give a special thanks to all of the backers who sponsored this project since day-zero.

| <a href="https://github.com/ledongthuc"><img src="https://avatars1.githubusercontent.com/u/1828895?s=460&v=4" width="48" height="48"/></a> | <a href="https://github.com/trungfinity"><img src="https://avatars1.githubusercontent.com/u/6896444?s=460&v=4" width="48" height="48"/></a> | <a href="https://github.com/thaod"><img src="https://avatars3.githubusercontent.com/u/11632797?s=460&v=4" width="48" height="48"/></a> | <a href="https://github.com/mquy"><img src="https://avatars0.githubusercontent.com/u/1636026?s=460&v=4" width="48" height="48"/></a> | <a href="https://github.com/quannt"><img src="https://avatars1.githubusercontent.com/u/3423859?s=460&v=4" width="48" height="48"/></a> | <a href="https://github.com/dvkndn"><img src="https://avatars1.githubusercontent.com/u/5953369?s=460&v=4" width="48" height="48"/> |
|:--:|:--:|:--:|:--:|:--:|:--:|
|[**ledongthuc**](https://github.com/ledongthuc)|[**trungfinity**](https://github.com/trungfinity)|[**thaod**](https://github.com/thaod)|[**mquy**](https://github.com/mquy)|[**quannt**](https://github.com/quannt)|[**dvkndn**](https://github.com/dvkndn)|

## License

Pomoday is published under BSD 3-Clause license.

