import { reportApi } from "../api/reportApi";
import { reqApi } from "../axios/httpRequest";
import { localStorageService } from "./localstorageService";


export const reportService = {
    getBaseReport: async (data) => {
        const token = localStorageService.getToken();
        if (token) {
            const response = await reqApi.post(reportApi.Report_Base_BaseReport, data);
            if (response) {
                return response;
            }
            return null;
        }
    },

    getPlaceTypeUsedReport: async (data) => {
        const token = localStorageService.getToken();
        if (token) {
            const response = await reqApi.post(reportApi.Report_Place_PlaceTypeUsedReport, data);
            if (response) {
                return response;
            }
            return null;
        }
    },

    get: async (data) => {
        const token = localStorageService.getToken();
        if (token) {
            const response = await reqApi.post(reportApi.Report_Place_PlaceTypeUsedReport, data);
            if (response) {
                return response;
            }
            return null;
        }
    },
}