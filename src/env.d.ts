/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** Cryptographically random base64 nonce, unique per request. Used in CSP headers. */
    nonce: string;
  }
}
