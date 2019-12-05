import { stopWorkLogging, TaskItem, TaskStatus } from '../utils';

export function moveCommand(tasksToUpdate: any, state, ids, cmd) {
  tasksToUpdate = state.tasks.map(t => {
    if (ids.indexOf(t.id) !== -1) {
      t.tag = cmd.tag;
    }
    return t;
  });
  return tasksToUpdate;
}

export function beginCommand(tasksToUpdate: any, state, ids) {
  tasksToUpdate = state.tasks.map(t => {
    if (ids.indexOf(t.id) !== -1) {
      if (t.status !== TaskStatus.WIP) {
        t.status = TaskStatus.WIP;
        t.logs = (t.logs || []).concat({
          start: Date.now(),
          end: 0,
        });
      }
    }
    return t;
  });
  return tasksToUpdate;
}

export function checkCommand(tasksToUpdate: any, state, ids) {
  tasksToUpdate = state.tasks.map(t => {
    if (ids.indexOf(t.id) !== -1) {
      t.status =
        t.status === TaskStatus.DONE ? TaskStatus.WAIT : TaskStatus.DONE;
      if (t.status === TaskStatus.DONE) {
        t = stopWorkLogging(t);
      }
    }
    return t;
  });
  return tasksToUpdate;
}

export function deleteCommand(tasksToUpdate: any, ids, cmd, state) {
  if (!ids.length) {
    // Delete by tag
    const tag = (cmd.id.match(/^(@.*)/) || []).pop();
    if (tag) {
      return state.tasks.reduce((tasks, t: TaskItem) => {
        if (t.tag === tag) {
          t.status = TaskStatus.NONE;
        }
        tasks.push(t);
        return tasks;
      }, []);
    }
    // Delete by status
    const status = (
      cmd.id.match(/^(finished|done|flag|flagged|ongoing|wip|wait|pending)/) ||
      []
    ).pop();
    if (status) {
      let taskStatus = null;
      switch (status) {
        case 'finished':
        case 'done':
          taskStatus = TaskStatus.DONE;
          break;
        case 'flag':
        case 'flagged':
          taskStatus = TaskStatus.FLAG;
          break;
        case 'ongoing':
        case 'wip':
          taskStatus = TaskStatus.WIP;
          break;
        case 'wait':
        case 'pending':
          taskStatus = TaskStatus.WAIT;
          break;
        default:
          break;
      }
      return state.tasks.reduce((tasks, t: TaskItem) => {
        if (taskStatus) {
          if (t.status === taskStatus && !t.archived) {
            t.status = TaskStatus.NONE;
          }
          tasks.push(t);
        }
        return tasks;
      }, []);
    }
  } else {
    // Delete by id
    return state.tasks.reduce((tasks, t) => {
      if (ids.indexOf(t.id) !== -1) {
        t.status = TaskStatus.NONE;
      }
      tasks.push(t);
      return tasks;
    }, []);
  }
}

export function flagCommand(tasksToUpdate: any, state, ids) {
  tasksToUpdate = state.tasks.map(t => {
    if (ids.indexOf(t.id) !== -1) {
      t.status =
        t.status === TaskStatus.FLAG ? TaskStatus.WAIT : TaskStatus.FLAG;
      t = stopWorkLogging(t);
    }
    return t;
  });
  return tasksToUpdate;
}

export function stopCommand(tasksToUpdate: any, state, ids) {
  tasksToUpdate = state.tasks.map(t => {
    if (ids.indexOf(t.id) !== -1) {
      if (t.status === TaskStatus.WIP) {
        t.status = TaskStatus.WAIT;
        t = stopWorkLogging(t);
      }
    }
    return t;
  });
  return tasksToUpdate;
}

// TODO: Remove the duplicate code here in beginCommand and stopCommand
export function switchCommand(tasksToUpdate: any, state, ids) {
  if (Array.isArray(ids) && ids.length) {
    const stopId = ids[0];
    const startId = ids[1];
    tasksToUpdate = state.tasks.map(t => {
      if (t.id === stopId) {
        if (t.status === TaskStatus.WIP) {
          t.status = TaskStatus.WAIT;
          t = stopWorkLogging(t);
        }
      }
      if (t.id === startId) {
        if (t.status !== TaskStatus.WIP) {
          t.status = TaskStatus.WIP;
          t.logs = (t.logs || []).concat({
            start: Date.now(),
            end: 0,
          });
        }
      }
      return t;
    });
  }
  return tasksToUpdate;
}

export function archiveCommand(ids, cmd, tasksToUpdate: any, state) {
  if (!ids.length) {
    // Archive by tag
    const tag = (cmd.id.match(/^(@.*)/) || []).pop();
    if (tag) {
      tasksToUpdate = state.tasks.map(t => {
        if (t.tag === tag) {
          t.archived = true;
        }
        return t;
      });
    }
  } else {
    // Archive by Ids
    tasksToUpdate = state.tasks.map(t => {
      if (ids.indexOf(t.id) !== -1) {
        t.archived = true;
      }
      return t;
    });
  }
  return tasksToUpdate;
}

export function restoreCommand(ids, cmd, tasksToUpdate: any, state) {
  if (!ids.length) {
    // Archive by tag
    const tag = (cmd.id.match(/^(@.*)/) || []).pop();
    if (tag) {
      tasksToUpdate = state.tasks.map(t => {
        if (t.tag === tag) {
          t.archived = false;
        }
        return t;
      });
    }
  } else {
    // Archive by Ids
    tasksToUpdate = state.tasks.map(t => {
      if (ids.indexOf(t.id) !== -1) {
        t.archived = false;
      }
      return t;
    });
  }
  return tasksToUpdate;
}

export function insertTaskCommand(cmd, state, tasksToUpdate: any) {
  const tag = cmd.tag || '@uncategorized';
  const task = cmd.text;
  if (task && task.length) {
    const nextId = state.tasks.reduce((maxId: number, t: TaskItem) => {
      if (t.status !== TaskStatus.NONE) {
        if (t.id > maxId) {
          maxId = t.id;
        }
      }
      return maxId;
    }, 0);
    tasksToUpdate = state.tasks
      .filter(t => t.id !== nextId + 1)
      .concat({
        id: nextId + 1,
        tag: tag,
        title: task,
        status: TaskStatus.WAIT,
        logs: [],
        archived: false,
        lastaction: Date.now(),
      } as TaskItem);
  }
  return tasksToUpdate;
}

export function editTaskCommand(ids, cmd, tasksToUpdate: any, state) {
  {
    const id = ids[0];
    const task = cmd.text;
    if (task && task.length) {
      tasksToUpdate = state.tasks.map(t => {
        if (t.id === id) {
          t.title = task;
        }
        return t;
      });
    }
  }
  return tasksToUpdate;
}

export function tagRenameCommand(cmd, tasksToUpdate: any, state) {
  {
    const [from, to] = cmd.tag.split(' ');
    tasksToUpdate = state.tasks.map(t => {
      if (t.tag.match(from)) {
        t.tag = to;
      }
      return t;
    });
  }
  return tasksToUpdate;
}

export function hideCommand(updateCandidate, cmd) {
  updateCandidate = (() => {
    switch (cmd.text) {
      case 'finished':
      case 'done':
        return {
          ...updateCandidate,
          taskVisibility: {
            ...updateCandidate.taskVisibility,
            done: false,
          },
        };
      case 'flag':
      case 'flagged':
        return {
          ...updateCandidate,
          taskVisibility: {
            ...updateCandidate.taskVisibility,
            flagged: false,
          },
        };
      case 'ongoing':
      case 'wip':
        return {
          ...updateCandidate,
          taskVisibility: {
            ...updateCandidate.taskVisibility,
            wip: false,
          },
        };
      case 'pending':
      case 'wait':
        return {
          ...updateCandidate,
          taskVisibility: {
            ...updateCandidate.taskVisibility,
            wait: false,
          },
        };
      default:
        return updateCandidate;
    }
  })();
  return updateCandidate;
}

export function showCommand(updateCandidate, cmd) {
  updateCandidate = (() => {
    switch (cmd.text) {
      case 'finished':
      case 'done':
        return {
          ...updateCandidate,
          taskVisibility: {
            ...updateCandidate.taskVisibility,
            done: true,
          },
        };
      case 'flag':
      case 'flagged':
        return {
          ...updateCandidate,
          taskVisibility: {
            ...updateCandidate.taskVisibility,
            flagged: true,
          },
        };
      case 'wip':
      case 'ongoing':
        return {
          ...updateCandidate,
          taskVisibility: {
            ...updateCandidate.taskVisibility,
            wip: true,
          },
        };
      case 'pending':
      case 'wait':
        return {
          ...updateCandidate,
          taskVisibility: {
            ...updateCandidate.taskVisibility,
            wait: true,
          },
        };
      default:
        return updateCandidate;
    }
  })();
  return updateCandidate;
}

export function searchCommand(updateCandidate: any, cmd) {
  if (cmd.command.match(/search/i)) {
    updateCandidate = {
      ...updateCandidate,
      filterBy: cmd.text,
    };
  }
  return updateCandidate;
}

export function otherCommand(updateCandidate, cmd, state) {
  updateCandidate = (() => {
    let commandText = cmd.command.toLowerCase();
    if (commandText === 'help') {
      return {
        ...updateCandidate,
        showHelp: true,
      };
    } else if (commandText === 'quickhelp') {
      return {
        ...updateCandidate,
        showQuickHelp: true,
      };
    } else if (commandText === 'today') {
      return {
        ...updateCandidate,
        showToday: !state.showToday,
      };
    } else if (commandText === 'dark') {
      return {
        ...updateCandidate,
        darkMode: true,
      };
    } else if (commandText === 'light') {
      return {
        ...updateCandidate,
        darkMode: false,
      };
    } else if (commandText === 'customize') {
      return {
        ...updateCandidate,
        showCustomCSS: !updateCandidate.showCustomCSS,
      };
    } else if (commandText === 'list-archived') {
      return {
        ...updateCandidate,
        showArchived: !updateCandidate.showArchived,
      };
    } else if (commandText === 'login') {
      // OK, Let me explain the weird @demo stuff here:
      // If the user is already has their data on another machine, and
      // they opened this app on a new machine, then login right away,
      // the tasks in the range of 1..12 will be conflict with the demo
      // tasks. So, we will explicitly remove these demo tasks if they're
      // actually a demo, when login.
      return {
        ...updateCandidate,
        tasks: updateCandidate.tasks.filter(t =>
          (t.id - 1) * (t.id - 12) <= 0 ? t.tag !== '@demo' : true,
        ),
        userWantToLogin: true,
      };
    } else if (commandText === 'logout') {
      return {
        ...updateCandidate,
        authToken: '',
        userName: '',
        userWantToLogin: true,
      };
    } else {
      return updateCandidate;
    }
  })();
  return updateCandidate;
}
