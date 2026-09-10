import z from "zod";
import { StatusCode } from "./enums";
import { ClientError } from "./client-error";
import { UploadedFile } from "express-fileupload";
import { formatDate } from "../utils/format-date";

// from vacation table
export type VacationsModel = {
    vacationId: number; 
    destination: string; 
    description: string; 
    startDate: string; 
    endDate: string; 
    price: number; 
    imageName: string;
    imageUrl: string;
}

// model for returning like count.
export type VacationsLikesCountResponseModel = {
    vacationId: number; 
    destination: string; 
    description: string; 
    startDate: string; 
    endDate: string; 
    price: number; 
    imageName: string; 
    likesCount: number; 
    isLiked: boolean;
    imageUrl: string;
}

// what we get from the join query that returns like count.
export type VacationsLikesCountModel = {
    vacationId: number; 
    destination: string; 
    description: string; 
    startDate: Date; 
    endDate: Date; 
    price: number; 
    imageName: string; 
    likesCount: number; 
    isLiked: number;
}

const BaseVacationSchema = z.object({
    vacationId: z.number().int().positive().optional(),
    destination: z.string().min(2).max(30),
    description: z.string().min(2).max(1000),
    startDate: z.string().min(2).max(20),
    endDate: z.string().min(2).max(20),
    price: z.number().min(0).max(10_000),
    imageName: z.string().min(1).max(255).optional(),
    image: z.custom<UploadedFile>().optional(),
    imageUrl: z.url().optional()
});

// check if endDate bigger or equel to startEnd
const endAfterStart = (data: IVacationsFormModel) => data.endDate >= data.startDate;
const endAfterStartMessage = { message: "End date must not be before start date", path: ["endDate"] };

// Add vacation refine validation
const AddVacationSchema = BaseVacationSchema
    
    // check if startDate bigger or equel to corrent date
    .refine(data => data.startDate >= formatDate.format(new Date()), {
        message: "Start date cannot be in the past",
        path: ["startDate"]
    })

    // check if endDate bigger or equel to startEnd
    .refine(endAfterStart, endAfterStartMessage)
    
    // check if image was sended
    .refine(data => !!data.image, {
        message: "Image is required",
        path: ["image"]
    });

// Edit vacation refine validation
const EditVacationSchema = BaseVacationSchema

    // check if endDate bigger or equel to startEnd
    .refine(endAfterStart, endAfterStartMessage);

// Vacation Interface:
type IVacationsFormModel = z.infer<typeof BaseVacationSchema>;

// Vacation Model:
export class VacationsFormModel implements IVacationsFormModel {

    public vacationId: number;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public imageName: string;
    public image: UploadedFile;
    public imageUrl: string;

    public constructor(vacation: VacationsFormModel) {
        this.vacationId = vacation.vacationId;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = +vacation.price;
        this.imageName = vacation.imageName;
        this.image = vacation.image;
        this.imageUrl = vacation.imageUrl;
    }

    public validate(isAdd: boolean): void {
        const schema = isAdd ? AddVacationSchema : EditVacationSchema;
        const result = schema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }
}