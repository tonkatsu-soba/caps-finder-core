import PlayerCollection from '../entities/playerCollection';
import Player from '../entities/player';
import Commands from '../commands';

/**
 * Game state for the waiting phase before the game starts
 */
export default class WaitingState {
  constructor(players, history) {
    if (!(players instanceof PlayerCollection)) {
      throw new Error('Invalid parameter');
    }
    this.players = players;
    this.history = history;
    this.newPlayers = [];
  }

  handleInput({ command, data }) {
    const handler = {
      [Commands.ADDPLAYER]: () => this.ADDPLAYER(data.playerId),
      default: () => {
        throw new Error('Invalid action');
      },
    };
    if (![Commands.ADDPLAYER].includes(command)) {
      handler.default();
    } else {
      handler[command]();
    }
  }

  get canTransition() {
    return this.players.size + this.newPlayers.length > 1;
  }

  getPublicData() {
    return {
      players: this.players.players.map(player => ({ id: player.id })),
      canStart: this.canTransition,
      state: 'waiting',
    };
  }

  addPlayer(playerId) {
    this.newPlayers.push(new Player(playerId));
  }
}
