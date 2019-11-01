<center>
<img src="./logo.png" width="300px;" />
<div style="font-weight: bold; font-family: monospace; padding-bottom: 15px;">Be productive without leaving your keyboard</div>
<img src="https://img.shields.io/github/license/huytd/pomoday-v2?style=for-the-badge"/>
<img src="https://img.shields.io/badge/%23-community%20edition-blueviolet?style=for-the-badge"/>
</center>

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

It's flexible and don't tie with any productivity methodologies, that mean, you
can customize and use it in whatever way you want, try implement yourself a GTD or Kanban or
Pomodoro workflow with it.

## Features

1. Task management (of course)
2. Keyboard only workflow
3. Built-in time tracker
4. Activities log to get an overview on how you spent your day
5. Dark mode
6. (A lot coming...)

## Usage and Installation

There are two way to use Pomoday:

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

It's recomended to deploy it to [https://now.sh](now.sh), because it's easy:

```
$ cd dist
$ now
```

## Development

To run it locally during development, use:

```
npm run dev
```

## Similar Projects

- [taskbook](https://github.com/klaussinani/taskbook): This is an awesome task management application that actually works, and works very well for everyone who likes to live in a command line. Pomoday was also heavily inspired by Taskbook, as you can see from the UI and the keyboard-only command interfaces.

## Backers and Sponsors

I would like to give a special thanks to all of the backers who sponsored this project since day-zero.

| <a href="https://github.com/ledongthuc"><img src="https://avatars1.githubusercontent.com/u/1828895?s=460&v=4" width="48" height="48"/></a> | <a href="https://github.com/trungfinity"><img src="https://avatars1.githubusercontent.com/u/6896444?s=460&v=4" width="48" height="48"/></a> | <a href="https://github.com/mquy"><img src="https://avatars0.githubusercontent.com/u/1636026?s=460&v=4" width="48" height="48"/></a> | <a href="https://github.com/quannt"><img src="https://avatars1.githubusercontent.com/u/3423859?s=460&v=4" width="48" height="48"/></a> |
|:--:|:--:|:--:|:--:|
|[**ledongthuc**](https://github.com/ledongthuc)|[**trungfinity**](https://github.com/trungfinity)|[**mquy**](https://github.com/mquy)|[**quannt**](https://github.com/quannt)|

## License

Pomoday is published under BSD 3-Clause license.

