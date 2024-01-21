import { OAuth2Client } from "oslo/oauth2";

export interface OAuth2Provider {
	createAuthorizationURL(state: string): Promise<URL>;
	validateAuthorizationCode(code: string): Promise<Tokens>;
	refreshAccessToken?(refreshToken: string): Promise<Tokens>;
}

export interface Tokens {
	accessToken: string;
	refreshToken?: string | null;
	accessTokenExpiresAt?: Date;
	refreshTokenExpiresAt?: Date | null;
	idToken?: string;
}

export interface LichessTokens extends Tokens {};

const authorizeEndpoint = "https://lichess.org/oauth";
const tokenEndpoint = "https://lichess.org/api/token";

export class Lichess implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(
		clientId: string,
		clientSecret: string,
		options?: {
			redirectURI?: string;
            scopes: string[];
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI: options?.redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(
		state: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scopes: options?.scopes ?? []
		});
	}

	public async validateAuthorizationCode(code: string): Promise<LichessTokens> {
		const result = await this.client.validateAuthorizationCode(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: LichessTokens = {
			accessToken: result.access_token
		};
		return tokens;
	}
}

export interface GitHubTokens {
	accessToken: string;
}