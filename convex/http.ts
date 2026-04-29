/**
 * Convex HTTP routes. Convex Auth needs to register a few HTTP handlers
 * (e.g. for OAuth callbacks). Add them here.
 */
import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

export default http;
