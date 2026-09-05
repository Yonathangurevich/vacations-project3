import { OkPacketParams } from "mysql2";
import { cyber } from "../utils/cyber";
import { dal } from "../utils/dal";
import { ClientError } from "../models/client-error";
import { Role, StatusCode } from "../models/enums";
import { UserModel } from "../models/user-model";
import { CredentialsModel } from "../models/credentials-model";

class UserService {

    // Add user:
    public async addUser(user: UserModel): Promise<string> {
        
        // create user roleId
        user.roleId = Role.User;
        
        // Validation:
        user.validate();

        // If email taken: 
        if (await this.isEmailTaken(user.email)) {
            throw new ClientError(StatusCode.Conflict, "Email already taken.");
        }

        // hash the password
        const hashedPassword = cyber.hash(user.password);

        // SQL:
        const sql = "insert into users(firstName, lastName, email, password, roleId) values(?, ?, ?, ?, ?)";
        const values = [user.firstName, user.lastName, user.email, hashedPassword, user.roleId];

        // Execute: 
        const info = await dal.execute(sql, values) as OkPacketParams;
        user.userId = info.insertId!;

        // Generate token:
        const token = cyber.generateToken(user);

        // Return token:
        return token;
    }

    // Login:
    public async login(credentials: CredentialsModel): Promise<string> {

        // Validation:
        credentials.validate();

        // hash the password
        const hashedPassword = cyber.hash(credentials.password);
        
        // SQL:
        const sql = "select * from vacations.users where email = ? and password = ?";
        const values = [credentials.email, hashedPassword];

        // Execute: 
        const users = await dal.execute(sql, values) as UserModel[];
        const user = users[0];

        // If no such user:
        if (!user) {
            throw new ClientError(StatusCode.Unauthorized, "Incorrect email or password.");
        }

        // Generate token:
        const token = cyber.generateToken(user);

        // Return token:
        return token;
    }

    // Check if email already taken:
    private async isEmailTaken(email: string): Promise<boolean> {

        // SQL:
        const sql = "select userId from users where email = ?";
        const values = [email];

        // Execute: 
        const users = await dal.execute(sql, values) as UserModel[];
        const user = users[0];

        // Return true if we have such email, false if we don't:
        return !!user;
    }

    // get all users emails
    public async getAllUsersEmails(): Promise<string[]> {
        
        // sql query
        const sql = "select * from users";

        // execute:
        const dbUsers = await dal.execute(sql) as UserModel[];
        
        // get only emails:
        const users = dbUsers.map(u => u.email);
        
        return users;
    }

}

export const userService = new UserService();
