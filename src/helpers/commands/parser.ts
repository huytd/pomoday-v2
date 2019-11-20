export type Command = {
  command: string;
  tag?: string;
  text?: string;
  id?: string;
} | null;
const parseTaskCommand = (str: string) =>
  str.match(/^(t(?:ask)?)\s(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))?(.*)/i);
const parseEditCommand = (str: string) => str.match(/^(e(?:dit)?)\s(\d+)(.*)/i);
const parseMoveCommand = (str: string) =>
  str.match(/^(mv|move)\s(?:(\d+)\s)+(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))/i);
const parseCheckCommand = (str: string) => str.match(/^(c(?:heck)?)\s(.*)/i);
const parseBeginCommand = (str: string) => str.match(/^(b(?:egin)?)\s(.*)/i);
const parseDeleteCommand = (str: string) => str.match(/^(d(?:elete)?)\s(.*)/i);
const parseFlagCommand = (str: string) => str.match(/^(fl(?:ag)?)\s(.*)/i);
const parseStopCommand = (str: string) => str.match(/^(st(?:op)?)\s(.*)/i);
const parseArchiveCommand = (str: string) =>
  str.match(/^(a(?:rchive)?)\s(.*)/i);
const parseRestoreCommand = (str: string) =>
  str.match(/^(re(?:store)?)\s(.*)/i);
const parseTagRenameCommand = (str: string) =>
  str.match(
    /^(tr|tagre|tagrename)\s(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))\s(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))/i,
  );
const parseVisibilityCommand = (str: string) =>
  str.match(
    /^(hide|show)\s\b(done|finished|wait|pending|ongoing|wip|flag|flagged)\b/i,
  );
const parseOtherCommand = (str: string) =>
  str.match(/^(close-help|help|today|dark|light|customize|list-archived)/i);
export const parseCommand = (input: string): Command => {
  const matchTask = parseTaskCommand(input);
  if (matchTask) {
    return {
      command: matchTask[1],
      tag: matchTask[2],
      text: matchTask[3].trim(),
    } as Command;
  }

  const matchEdit = parseEditCommand(input);
  if (matchEdit) {
    return {
      command: matchEdit[1],
      id: matchEdit[2],
      text: matchEdit[3].trim(),
    } as Command;
  }

  const matchMove = parseMoveCommand(input);
  if (matchMove) {
    return {
      command: matchMove[1],
      id: matchMove[2],
      tag: matchMove[3],
    } as Command;
  }

  const matchTagRe = parseTagRenameCommand(input);
  if (matchTagRe) {
    return {
      command: matchTagRe[1],
      tag: matchTagRe[2] + ' ' + matchTagRe[3],
    } as Command;
  }

  const matchOther =
    parseCheckCommand(input) ||
    parseBeginCommand(input) ||
    parseDeleteCommand(input) ||
    parseFlagCommand(input) ||
    parseStopCommand(input) ||
    parseArchiveCommand(input) ||
    parseRestoreCommand(input);
  if (matchOther) {
    return {
      command: matchOther[1],
      id: matchOther[2],
    };
  }

  const matchVisibility = parseVisibilityCommand(input);
  if (matchVisibility) {
    return {
      command: matchVisibility[1],
      text: matchVisibility[2],
    } as Command;
  }

  const matchHelp = parseOtherCommand(input);
  if (matchHelp) {
    return {
      command: matchHelp[1],
    };
  }
  return null;
};
