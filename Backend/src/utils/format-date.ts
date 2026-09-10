class FormatDate {

    public format(date: Date): string {
        
        // format the date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        // return format date.
        return `${year}-${month}-${day}`;
    }

}

export const formatDate = new FormatDate();