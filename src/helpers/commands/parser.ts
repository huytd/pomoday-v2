export type Command = {
  command: string;
  tag?: string;
  text?: string;
  id?: string;
} | null;
const parseTaskCommand = (str: string) =>
  str.match(/^(t(?:ask)?)\s(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))?([\s\S]*)/i);
const parseEditCommand = (str: string) =>
  str.match(/^(e(?:dit)?)\s(\d+)([\s\S]*)/i);
const parseMoveCommand = (str: string) =>
  str.match(/^(mv|move)\s(?:(\d+)\s)+(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))/i);
const parseCheckCommand = (str: string) =>
  str.match(/^(c(?:heck)?)\s([\s\S]*)/i);
const parseBeginCommand = (str: string) =>
  str.match(/^(b(?:egin)?)\s([\s\S]*)/i);
const parseDeleteCommand = (str: string) =>
  str.match(/^(d(?:elete)?)\s([\s\S]*)/i);
const parseFlagCommand = (str: string) => str.match(/^(fl(?:ag)?)\s([\s\S]*)/i);
const parseStopCommand = (str: string) => str.match(/^(st(?:op)?)\s([\s\S]*)/i);
const parseSwitchCommand = (str: string) =>
  str.match(/^(sw(?:itch)?)\s([\s\S]*)/i);
const parseArchiveCommand = (str: string) =>
  str.match(/^(a(?:rchive)?)\s([\s\S]*)/i);
const parseRestoreCommand = (str: string) =>
  str.match(/^(re(?:store)?)\s([\s\S]*)/i);
const parseTagRenameCommand = (str: string) =>
  str.match(
    /^(tr|tagre|tagrename)\s(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))\s(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))/i,
  );
const parseVisibilityCommand = (str: string) =>
  str.match(
    /^(hide|show)\s\b(done|finished|wait|pending|ongoing|wip|flag|flagged)\b/i,
  );
const parseOtherCommand = (str: string) =>
  str.match(
    /^(help|quickhelp|today|dark|light|customize|list-archived|login|logout)/i,
  );
const parseTextFallback = (str: string) => str.match(/((?:\b\w*\b\S*)\s)/);
const parseSearch = (str: string) => str.match(/^\/.*/);

/* ----------------------------------------- */

function compileTaskCommand(input: string) {
  const matchTask = parseTaskCommand(input);
  if (matchTask) {
    return {
      command: matchTask[1],
      tag: matchTask[2],
      text: matchTask[3].trim(),
    } as Command;
  }
  return null;
}

function compileEditCommand(input: string) {
  const matchEdit = parseEditCommand(input);
  if (matchEdit) {
    return {
      command: matchEdit[1],
      id: matchEdit[2],
      text: matchEdit[3].trim(),
    } as Command;
  }
  return null;
}

function compileMoveCommand(input: string) {
  const matchMove = parseMoveCommand(input);
  if (matchMove) {
    return {
      command: matchMove[1],
      id: matchMove[2],
      tag: matchMove[3],
    } as Command;
  }
  return null;
}

function compileTagReCommand(input: string) {
  const matchTagRe = parseTagRenameCommand(input);
  if (matchTagRe) {
    return {
      command: matchTagRe[1],
      tag: matchTagRe[2] + ' ' + matchTagRe[3],
    } as Command;
  }
  return null;
}

function compileMathOtherCommand(input: string) {
  const matchOther =
    parseCheckCommand(input) ||
    parseBeginCommand(input) ||
    parseDeleteCommand(input) ||
    parseFlagCommand(input) ||
    parseStopCommand(input) ||
    parseSwitchCommand(input) ||
    parseArchiveCommand(input) ||
    parseRestoreCommand(input);
  if (matchOther) {
    return {
      command: matchOther[1],
      id: matchOther[2],
    };
  }
  return null;
}

function compileVisibilityCommand(input: string) {
  const matchVisibility = parseVisibilityCommand(input);
  if (matchVisibility) {
    return {
      command: matchVisibility[1],
      text: matchVisibility[2],
    } as Command;
  }
  return null;
}

function compileHelpCommand(input: string) {
  const matchHelp = parseOtherCommand(input);
  if (matchHelp) {
    return {
      command: matchHelp[1],
    };
  }
  return null;
}

function compileSearchCommand(input: string) {
  if (parseSearch(input)) {
    return {
      command: 'search',
      text: input.replace(/^\//, ''),
    };
  }
  return null;
}

/* ----------------------------------------- */

export const parseCommand = (input: string): Command => {
  let ret;

  ret = compileSearchCommand(input);
  if (ret) return ret;

  ret = compileTaskCommand(input);
  if (ret) return ret;

  ret = compileEditCommand(input);
  if (ret) return ret;

  ret = compileMoveCommand(input);
  if (ret) return ret;

  ret = compileTagReCommand(input);
  if (ret) return ret;

  ret = compileMathOtherCommand(input);
  if (ret) return ret;

  ret = compileVisibilityCommand(input);
  if (ret) return ret;

  ret = compileHelpCommand(input);
  if (ret) return ret;

  if (parseTextFallback(input)) {
    return compileTaskCommand(`task ${input}`);
  }

  return null;
};
