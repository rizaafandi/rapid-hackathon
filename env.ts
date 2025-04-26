import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
 PORT: get('PORT').required().asPortNumber(),
 API_PREFIX: get('DEFAULT_API_PREFIX').default('/api/v1').asString(),
 NODE_ENV: get('NODE_ENV').asString(),
 API_WEATHER: get('API_WEATHER').asString(),
 API_GEMINI: get('API_GEMINI').asString()
};