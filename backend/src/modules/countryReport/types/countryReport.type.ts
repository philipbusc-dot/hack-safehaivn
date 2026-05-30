export interface CountryReportInput {
    countryCode : string;
    countryName : string;
    severity: string;
    cases:number;
    note:string;
}
export interface CountryReport extends CountryReport {
    id: number
    createAt: Date;
    updateAt: Date;
}