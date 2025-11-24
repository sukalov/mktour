import { Team } from '@/types/lichess-api';

export const getUserLichessTeams = async (
  username: string,
): Promise<Team[]> => {
  try {
    const res = await fetch(`https://lichess.org/api/team/of/${username}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch teams: ${res.statusText}`);
    }
    const teamsFull = (await res.json()) as Array<Team>;
    return teamsFull.filter((team) =>
      team.leaders.find((leader) => leader.id === username),
    );
  } catch (e) {
    console.error(`ERROR: unable to connect to lichess. ${e}`);
    return [];
  }
};
