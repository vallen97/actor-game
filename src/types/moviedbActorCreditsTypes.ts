export interface MovieDBActorCredits {
  data: Data;
  status: number;
  statusText: string;
  headers: Headers;
  config: Config;
  request: EnvOrRequest;
}
export interface Data {
  id: number;
  cast?: CastEntity[] | null;
  crew?: CrewEntity[] | null;
}
export interface CastEntity {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}
export interface CrewEntity {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string | null;
  credit_id: string;
  department: string;
  job: string;
}
export interface Headers {
  cache_control: string;
  content_type: string;
  etag: string;
}
export interface Config {
  transitional: Transitional;
  transformRequest?: null[] | null;
  transformResponse?: null[] | null;
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  env: EnvOrRequest;
  headers: Headers1;
  method: string;
  url: string;
}
export interface Transitional {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}
export interface EnvOrRequest {}
export interface Headers1 {
  Accept: string;
}
