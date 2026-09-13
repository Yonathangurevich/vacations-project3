import { Roles } from "./enums";

export type UserModel = {
	userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: Roles;
}
