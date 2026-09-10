import { OkPacketParams } from "mysql2";
import { saver } from "smart-saver";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { VacationsFormModel, VacationsLikesCountModel, VacationsLikesCountResponseModel, VacationsModel } from "../models/vacations-model";
import { appConfig } from "../utils/app-config";
import { dal } from "../utils/dal";
import { formatDate } from "../utils/format-date";

class VacationsService {

    // get vacations by userId
    public async getAllVacations(userId: number): Promise<VacationsLikesCountResponseModel[]> {
        
        // sql:
        const sql = `SELECT 
                        v.vacationId,
                        v.destination,
                        v.description,
                        v.startDate,
                        v.endDate,
                        v.price,
                        v.imageName,
                        COUNT(l.userId) AS likesCount,
                        COUNT(CASE WHEN l.userId = ? THEN 1 END) > 0 AS isLiked,
                        concat(?, imageName) as imageUrl
                    FROM vacations AS v
                    LEFT JOIN likes AS l
                        ON v.vacationId = l.vacationId
                    GROUP BY v.vacationId
                    ORDER BY v.startDate ASC`;
        const values = [userId, appConfig.vacationImagesBaseUrl];

        // execute sql
        const dbVacations = await dal.execute(sql, values) as VacationsLikesCountModel[];

        // turn 0's and 1's to true and false, price to number and split dates.
        const vacations: VacationsLikesCountResponseModel[] = dbVacations.map(v => ({
            ...v,
            price: +v.price,
            startDate: formatDate.format(v.startDate),
            endDate: formatDate.format(v.endDate),
            imageUrl: appConfig.vacationImagesBaseUrl + v.imageName,
            isLiked: v.isLiked === 1
        }));
        
        // return vacations
        return vacations;
    }

    public async addVacation(vacation: VacationsFormModel): Promise<VacationsModel> {

        // validate:
        vacation.validate(true);

        // save image to disk
        const imageName = await saver.save(vacation.image);

        // sql:
        const sql = `insert into vacations (destination, description, startDate, endDate, price, imageName) values (?,?,?,?,?,?)`;
        const values = [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price, imageName];
        
        // execute:
        const info = await dal.execute(sql, values) as OkPacketParams;

        // get added vacation
        const dbVacations = await this.getOneVacation(info.insertId!);

        // return added vacation
        return dbVacations;
    }

    public async getOneVacation(vacationId: number): Promise<VacationsModel> {
        
        // sql:
        const sql = "select *, concat(?, imageName) as imageUrl from vacations where vacationId = ?";
        const values = [appConfig.vacationImagesBaseUrl, vacationId];
        
        // execution:
        const vacations = await dal.execute(sql, values) as VacationsLikesCountModel[];

        // throw on empty vacations
        if (vacations.length === 0) {
            throw new ClientError(StatusCode.NotFound, "The vacation you're looking for doesn't exists or was deleted");
        }

        const dbVacation = vacations[0];
        
        // turn 0's and 1's to true and false, price to number and split dates.
        const vacation: VacationsModel = ({
            ...dbVacation,
            price: +dbVacation.price,
            startDate: formatDate.format(dbVacation.startDate),
            endDate: formatDate.format(dbVacation.endDate),
            imageUrl: appConfig.vacationImagesBaseUrl + dbVacation.imageName,
        });
        
        // return that vacation:
        return vacation;
    }

    // update vacation by vacationId
    public async updateVacation(vacation: VacationsFormModel): Promise<VacationsModel> {

        // validate:
        vacation.validate(false);

        // get the existing vacation:
        const dbVacation = await this.getOneVacation(vacation.vacationId);

        // save the new image and delete the old one, or keep the old one if no new image was sent:
        const imageName = await saver.update(vacation.image, dbVacation.imageName);

        // sql:
        const sql = `update vacations set destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, imageName = ? where vacationId = ?`;
        const values = [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price, imageName, vacation.vacationId];

        // execute:
        await dal.execute(sql, values);

        // get updated vacation
        const dbVacations = await this.getOneVacation(vacation.vacationId);

        // return updated vacation
        return dbVacations;
    }

    public async deleteVacation(vacationId: number): Promise<void> {
        
        // sql:
        const sql = "delete from vacations where vacationId = ?";
        const values = [vacationId];

        // execution:
        const info = await dal.execute(sql, values) as OkPacketParams;

        // check if vacation got deleted:
        if (info.affectedRows === 0) {
            throw new ClientError(StatusCode.NotFound, "The vacation you trying to delete doesn't exist");
        }

    }

    public async likeVacation(vacationId: number, userId: number): Promise<void> {

        // sql:
        const sql = "insert into likes (userId, vacationId) values (?, ?)";
        const values = [userId, vacationId];

        // execution:
        try {
            await dal.execute(sql, values);
        }
        catch (err: any) {
            
            // duplicate like:
            if (err.code === "ER_DUP_ENTRY") {
                throw new ClientError(StatusCode.Conflict, "This vacation is already liked by the user");
            }
            
            // no such vacation:
            if (err.code === "ER_NO_REFERENCED_ROW_2") {
                throw new ClientError(StatusCode.NotFound, "The vacation you're trying to like doesn't exist");
            }
            throw err;
        }
    }

    public async unlikeVacation(vacationId: number, userId: number): Promise<void> {

        // sql:
        const sql = "delete from likes where userId = ? and vacationId = ?";
        const values = [userId, vacationId];

        // execution:
        const info = await dal.execute(sql, values) as OkPacketParams;

        // if the user never liked this vacation:
        if (info.affectedRows === 0) {
            throw new ClientError(StatusCode.NotFound, "This vacation is not liked by the user");
        }

    }

}
export const vacationsService = new VacationsService();

