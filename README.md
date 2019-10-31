# Pomoday - Be productive without leaving your keyboard

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

## How to use

There are two way to use Pomoday:

1. Use it online at https://pomoday.app
2. Host it yourself (see instruction below)

## Host it yourself

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

## License

Pomoday is published under BSD 3-Clause license.

## Backers and Sponsors

I would like to give a special thanks to all of the backers who sponsored this project since day-zero.

| <a href="https://github.com/ledongthuc"><img src="https://avatars1.githubusercontent.com/u/1828895?s=460&v=4" width="48" height="48"/></a> | <a href="https://github.com/trungfinity"><img src="https://avatars1.githubusercontent.com/u/6896444?s=460&v=4" width="48" height="48"/></a> | <a href="https://github.com/mquy"><img src="https://avatars0.githubusercontent.com/u/1636026?s=460&v=4" width="48" height="48"/></a> | <a href="https://github.com/quannt"><img src="https://avatars1.githubusercontent.com/u/3423859?s=460&v=4" width="48" height="48"/></a> |
|:--:|:--:|:--:|:--:|
|[**ledongthuc**](https://github.com/ledongthuc)|[**trungfinity**](https://github.com/trungfinity)|[**mquy**](https://github.com/mquy)|[**quannt**](https://github.com/quannt)|
