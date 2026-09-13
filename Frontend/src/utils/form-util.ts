import { VacationFormModel } from "../models/vacation-model";

class FormUtil {

    // Convert vacation into FormData, so we could send also the image:
    public toFormData(vacation: VacationFormModel): FormData {
        const vacationFormData = new FormData();
        vacationFormData.append("destination", vacation.destination);
        vacationFormData.append("description", vacation.description);
        vacationFormData.append("startDate", vacation.startDate);
        vacationFormData.append("endDate", vacation.endDate);
        vacationFormData.append("price", String(vacation.price));
        vacationFormData.append("image", vacation.image[0]);
        return vacationFormData;
    }

}

export const formUtil = new FormUtil();