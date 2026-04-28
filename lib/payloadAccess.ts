import type { Access } from "payload";

export const publicRead: Access = () => true;

export const authenticated: Access = ({ req }) => Boolean(req.user);
