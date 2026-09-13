import axios from "axios";
import { VacationFormModel, VacationLikesCountModel, VacationModel } from "../models/vacation-model";
import { appConfig } from "../utils/app-config";
import { formUtil } from "../utils/form-util";

class VacationService {
	
    // get all vacations:
    public async getAllVacations(): Promise<VacationLikesCountModel[]> {
        const response = await axios.get<VacationLikesCountModel[]>(appConfig.vacationsUrl);
        const vacations = response.data;
        return vacations;
    }

    // get one vacation:
    public async getOneVacation(vacationId: number): Promise<VacationLikesCountModel> {
        const response = await axios.get<VacationLikesCountModel>(`${appConfig.vacationsUrl}/${vacationId}`);
        const vacation = response.data;
        return vacation;
    }

    // create a new vacation:
    public async addNewVacation(vacation: VacationFormModel): Promise<void> {
        await axios.post<VacationModel>(appConfig.vacationsUrl, formUtil.toFormData(vacation));
    }

    // update existing vacation:
    public async updateVacation(vacation: VacationFormModel, vacationId: number): Promise<void> {
        await axios.put<VacationModel>(`${appConfig.vacationsUrl}/${vacationId}`, formUtil.toFormData(vacation));
    }

    // delete an existing vacation:
    public async deleteVacation(vacationId: number): Promise<void> {
        await axios.delete(`${appConfig.vacationsUrl}/${vacationId}`);
    }

    // like an existing vacation
    public async likeVacation(vacationId: number): Promise<void> {
        await axios.post(`${appConfig.vacationsUrl}/like/${vacationId}`);
    }

    // unlike existing vacation
    public async unlikeVacation(vacationId: number): Promise<void> {
        await axios.delete(`${appConfig.vacationsUrl}/like/${vacationId}`);
    }
    
}

export const vacationService = new VacationService();
