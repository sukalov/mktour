import { log } from "next-axiom";
import { OAuth2Client } from "oslo/oauth2";

export interface OAuth2Provider {
	createAuthorizationURL(state: string): Promise<URL>;
	validateAuthorizationCode(code: string, options: {codeVerifier: string}): Promise<Tokens>;
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
    private clientId: string;
    private options: {
        redirectURI: string,
        scope: string[],
    }

	constructor(
		clientId: string,
		clientSecret: string,
		options: {
			redirectURI: string;
            scope: string[];
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI: options?.redirectURI,
		});
		this.clientSecret = clientSecret;
        this.options = options;
        this.clientId = clientId;
	}

	public async createAuthorizationURL(
		state: string,
		options?: {
			scope: string[];
            codeVerifier: string;
		}
	): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scopes: options?.scope ?? [],
            codeVerifier: options?.codeVerifier ?? ''
		});
	}

	public async validateAuthorizationCode(code: string, options: {codeVerifier: string}): Promise<LichessTokens> {
        const reqOptions: ReqOptions = {
			authenticateWith: "request_body",
			clientId: this.clientId,
            codeVerifier: options.codeVerifier,
            redirectURI: this.options.redirectURI,
            credentials: this.clientSecret
		}
        log.info(JSON.stringify(reqOptions))

		const result = await this.client.validateAuthorizationCode(code, reqOptions);
		const tokens: LichessTokens = {
			accessToken: result.access_token
		};
		return tokens;
	}
}

export interface GitHubTokens {
	accessToken: string;
}

interface ReqOptions {
    authenticateWith: "request_body" | undefined,
    clientId: string,
    codeVerifier: string,
    redirectURI: string,
    credentials: string
};