export type VacationLikesCountModel = {
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

export type VacationFormModel = {
    destination: string; 
    description: string; 
    startDate: string; 
    endDate: string; 
    price: number;
    image: FileList;
}

export type VacationModel = {
    vacationId: number; 
    destination: string; 
    description: string; 
    startDate: string; 
    endDate: string; 
    price: number; 
    imageName: string;
    imageUrl: string;
}

export type VacationCountModel = {
    vacationCount: number;
}
