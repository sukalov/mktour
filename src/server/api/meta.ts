import { OpenApiMeta } from 'trpc-to-openapi';

const meta = {
  usersAll: {
    openapi: {
      method: 'GET',
      path: '/users',
      summary: 'get all users',
      tags: ['users'],
    },
  },

  usersInfo: {
    openapi: {
      method: 'GET',
      path: '/users/{userId}',
      summary: 'get user by id',
      tags: ['users'],
    },
  },

  usersInfoByUsername: {
    openapi: {
      method: 'GET',
      path: '/users/username/{username}',
      summary: 'get user by username',
      tags: ['users'],
    },
  },

  usersContext: {
    openapi: {
      method: 'GET',
      path: '/users/context',
      summary: 'get user context',
      tags: ['users'],
    },
  },

  usersClubs: {
    openapi: {
      method: 'GET',
      path: '/users/{userId}/clubs',
      summary: 'get clubs where user is admin',
      tags: ['users'],
    },
  },

  usersDelete: {
    openapi: {
      method: 'DELETE',
      path: '/users/{userId}',
      summary: 'delete user',
      tags: ['users'],
    },
  },

  usersEdit: {
    openapi: {
      method: 'PATCH',
      path: '/auth',
      summary: 'edit user',
      tags: ['users'],
    },
  },

  usersAffiliations: {
    openapi: {
      method: 'GET',
      path: '/users/{userId}/affiliations',
      summary: 'get user affiliations',
      tags: ['users'],
    },
  },

  usersAffiliationRequests: {
    openapi: {
      method: 'GET',
      path: '/users/{userId}/affiliation-requests',
      summary: 'get user affiliation requests',
      tags: ['users'],
    },
  },

  usersTournaments: {
    openapi: {
      method: 'GET',
      path: '/users/{userId}/tournaments',
      summary: 'get user tournaments',
      tags: ['users'],
    },
  },

  usersNotifications: {
    openapi: {
      method: 'GET',
      path: '/users/{userId}/notifications',
      summary: 'get user notifications',
      tags: ['users'],
    },
  },

  usersNotificationStatus: {
    openapi: {
      method: 'PATCH',
      path: '/users/{userId}/notifications/{notificationId}',
      summary: 'change notification status',
      tags: ['users'],
    },
  },

  usersMarkAllNotificationsAsSeen: {
    openapi: {
      method: 'PATCH',
      path: '/users/{userId}/notifications/mark-all-as-seen',
      summary: 'mark all notifications as seen',
      tags: ['users'],
    },
  },

  usersCounter: {
    openapi: {
      method: 'GET',
      path: '/users/{userId}/counter',
      summary: 'get user notifications counter',
      tags: ['users'],
    },
  },

  usersLogout: {
    openapi: {
      method: 'POST',
      path: '/users/logout',
      summary: 'logout user',
      tags: ['users'],
    },
  },

  usersSelectClub: {
    openapi: {
      method: 'POST',
      path: '/users/select-club',
      summary: 'select club',
      tags: ['users'],
    },
  },

  usersDeleteNewUserCookie: {
    openapi: {
      method: 'GET',
      path: '/users/delete-new-user-cookie',
      summary: 'delete new user cookie',
      tags: ['users'],
    },
  },

  clubsAll: {
    openapi: {
      method: 'GET',
      path: '/clubs',
      summary: 'get all clubs',
      tags: ['clubs'],
    },
  },

  clubInfo: {
    openapi: {
      method: 'GET',
      path: '/clubs/{clubId}',
      summary: 'get club info',
      tags: ['clubs'],
    },
  },

  clubPlayers: {
    openapi: {
      method: 'GET',
      path: '/clubs/{clubId}/players',
      summary: 'get club players',
      tags: ['clubs'],
    },
  },

  clubTournaments: {
    openapi: {
      method: 'GET',
      path: '/clubs/{clubId}/tournaments',
      summary: 'get club tournaments',
      tags: ['clubs'],
    },
  },

  clubCreate: {
    openapi: {
      method: 'POST',
      path: '/clubs',
      summary: 'create club',
      tags: ['clubs'],
    },
  },

  clubEdit: {
    openapi: {
      method: 'PATCH',
      path: '/clubs/{clubId}',
      summary: 'edit club',
      tags: ['clubs'],
    },
  },

  clubDelete: {
    openapi: {
      method: 'DELETE',
      path: '/clubs/{clubId}',
      summary: 'delete club',
      description: `in case user is deleting their account, \`userDeletion\` should 
          is set to \`true\`. otherwise endpoint checks for other clubs where 
          user is a \`co-owner\` and rejects the operation if none found.`,
      tags: ['clubs'],
      protect: true,
    },
  },

  clubLeave: {
    openapi: {
      method: 'POST',
      path: '/clubs/{clubId}/leave',
      summary: 'leave club',
      tags: ['clubs'],
    },
  },

  clubAuthAffiliation: {
    openapi: {
      method: 'GET',
      path: '/clubs/{clubId}/auth-affiliation',
      summary: 'get auth user affiliation',
      tags: ['clubs'],
    },
  },

  clubAuthStatus: {
    openapi: {
      method: 'GET',
      path: '/clubs/{clubId}/auth-status',
      summary: 'get auth user status in club',
      tags: ['clubs'],
    },
  },

  clubAffiliatedUsers: {
    openapi: {
      method: 'GET',
      path: '/clubs/{clubId}/affiliated-users',
      summary: 'get club affiliated users',
      tags: ['clubs'],
    },
  },

  clubManagers: {
    openapi: {
      method: 'GET',
      path: '/clubs/{clubId}/managers',
      summary: 'get club managers',
      tags: ['clubs'],
    },
  },

  clubAddManager: {
    openapi: {
      method: 'POST',
      path: '/clubs/{clubId}/managers',
      summary: 'add club manager',
      tags: ['clubs'],
    },
  },

  clubDeleteManager: {
    openapi: {
      method: 'DELETE',
      path: '/clubs/{clubId}/managers',
      summary: 'delete club manager',
      tags: ['clubs'],
    },
  },

  clubNotifications: {
    openapi: {
      method: 'GET',
      path: '/clubs/{clubId}/notifications',
      summary: 'get club notifications',
      tags: ['clubs'],
    },
  },

  tournamentsAll: {
    openapi: {
      method: 'GET',
      path: '/tournaments',
      summary: 'get all tournaments',
      tags: ['tournaments'],
    },
  },

  tournamentsInfo: {
    openapi: {
      method: 'GET',
      path: '/tournaments/{tournamentId}',
      summary: 'get tournament info',
      tags: ['tournaments'],
    },
  },

  tournamentsPlayers: {
    openapi: {
      method: 'GET',
      path: '/tournaments/{tournamentId}/players',
      summary: 'get tournament players',
      tags: ['tournaments'],
    },
  },

  tournamentsGames: {
    openapi: {
      method: 'GET',
      path: '/tournaments/{tournamentId}/games',
      summary: 'get tournament games',
      tags: ['tournaments'],
    },
  },

  tournamentsRoundGames: {
    openapi: {
      method: 'GET',
      path: '/tournaments/{tournamentId}/round-games',
      summary: 'get tournament round games',
      tags: ['tournaments'],
    },
  },

  tournamentsCreate: {
    openapi: {
      method: 'POST',
      path: '/tournaments',
      summary: 'create tournament',
      tags: ['tournaments'],
    },
  },

  tournamentsEdit: {
    openapi: {
      method: 'PATCH',
      path: '/tournaments/{tournamentId}',
      summary: 'edit tournament',
      tags: ['tournaments'],
    },
  },

  tournamentsStart: {
    openapi: {
      method: 'POST',
      path: '/tournaments/{tournamentId}/start',
      summary: 'start tournament',
      tags: ['tournaments'],
    },
  },

  tournamentsReset: {
    openapi: {
      method: 'POST',
      path: '/tournaments/{tournamentId}/reset',
      summary: 'reset tournament',
      tags: ['tournaments'],
    },
  },

  tournamentsResetPlayers: {
    openapi: {
      method: 'POST',
      path: '/tournaments/{tournamentId}/reset-players',
      summary: 'reset tournament players',
      tags: ['tournaments'],
    },
  },

  tournamentsFinish: {
    openapi: {
      method: 'POST',
      path: '/tournaments/{tournamentId}/finish',
      summary: 'finish tournament',
      tags: ['tournaments'],
    },
  },

  tournamentsAuthStatus: {
    openapi: {
      method: 'GET',
      path: '/tournaments/{tournamentId}/auth-status',
      summary: 'get auth user status in tournament',
      tags: ['tournaments'],
    },
  },

  tournamentsSetGameResult: {
    openapi: {
      method: 'POST',
      path: '/tournaments/{tournamentId}/set-game-result',
      summary: 'set game result',
      tags: ['tournaments'],
    },
  },

  tournamentsUpdateSwissRoundsNumber: {
    openapi: {
      method: 'POST',
      path: '/tournaments/{tournamentId}/update-swiss-rounds-number',
      summary: 'update swiss rounds number',
      tags: ['tournaments'],
    },
  },

  tournamentsUpdatePairingNumbers: {
    openapi: {
      method: 'POST',
      path: '/tournaments/{tournamentId}/update-pairing-numbers',
      summary: 'update pairing numbers',
      tags: ['tournaments'],
    },
  },

  tournamentsUpdateRoundsNumber: {
    openapi: {
      method: 'POST',
      path: '/tournaments/{tournamentId}/update-rounds-number',
      summary: 'update rounds number',
      tags: ['tournaments'],
    },
  },

  tournamentsDelete: {
    openapi: {
      method: 'DELETE',
      path: '/tournaments/{tournamentId}',
      summary: 'delete tournament',
      tags: ['tournaments'],
    },
  },

  playersCreate: {
    openapi: {
      method: 'POST',
      path: '/players',
      summary: 'create player',
      tags: ['players'],
    },
  },
} as const satisfies Record<string, OpenApiMeta>;

export default meta;
