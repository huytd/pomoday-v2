export type Command = {
  command: string,
  tag?: string,
  text?: string,
  id?: number
} | null;

const parseTaskCommand = (str: string) => str.match(/^(t(?:ask)?)\s(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))?(.*)/i);
const parseEditCommand = (str: string) => str.match(/^(e(?:dit)?)\s(\d+)(.*)/i);
const parseMoveCommand = (str: string) => str.match(/^(mv|move)\s(\d+)\s(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))/i);
const parseCheckCommand = (str: string) => str.match(/^(c(?:heck)?)\s(\d+)/i);
const parseBeginCommand = (str: string) => str.match(/^(b(?:egin)?)\s(\d+)/i);
const parseDeleteCommand = (str: string) => str.match(/^(d(?:elete)?)\s(\d+)/i);
const parseFlagCommand = (str: string) => str.match(/^(fl(?:ag)?)\s(\d+)/i);
const parseStopCommand = (str: string) => str.match(/^(st(?:op)?)\s(\d+)/i);
const parseOtherCommand = (str: string) => str.match(/^(close-help|help|today)/i);

export const parseCommand = (input: string): Command => {
  const matchTask = parseTaskCommand(input);
  if (matchTask) {
    return {
      command: matchTask[1],
      tag: matchTask[2],
      text: matchTask[3].trim()
    } as Command;
  }

  const matchEdit = parseEditCommand(input);
  if (matchEdit) {
    return {
      command: matchEdit[1],
      id: parseInt(matchEdit[2]),
      text: matchEdit[3].trim()
    } as Command;
  }

  const matchMove = parseMoveCommand(input);
  if (matchMove) {
    return {
      command: matchMove[1],
      id: parseInt(matchMove[2]),
      tag: matchMove[3]
    } as Command;
  }

  const matchOther = parseCheckCommand(input)  ||
                     parseBeginCommand(input)  ||
                     parseDeleteCommand(input) ||
                     parseFlagCommand(input)   ||
                     parseStopCommand(input);
  if (matchOther) {
    return {
      command: matchOther[1],
      id: parseInt(matchOther[2])
    }
  }

  const matchHelp = parseOtherCommand(input);
  if (matchHelp) {
    return {
      command: matchHelp[1]
    }
  }
  return null;
};
