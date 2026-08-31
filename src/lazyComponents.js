import { lazy } from "react";

export const Register = lazy(() => import("./pages/registration"));
export const RegisteredUsers = lazy(() => import("./pages/RegisteredUsers"));
export const EventsManagement = lazy(() => import("./pages/event/eventManagement"));
