import { DataModel } from "../models/data-model";

class DataService {

    public async get___(): Promise<DataModel[]> {
        return [] as DataModel[];
    }

}

export const dataService = new DataService();
