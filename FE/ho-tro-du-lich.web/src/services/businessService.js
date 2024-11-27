import { businessApi } from "../api/businessApi";
import { reqApi } from "../axios/httpRequest";
import { localStorageService } from "./localstorageService";

export const businessService = {
  getWithPaging: async (data) => {
    const response = await reqApi.post(
      businessApi.Business_GetWithPaging,
      data
    );
    if (response) {
      return response;
    }
    return null;
  },
  getNewPlacePaging: async (data) => {
    const response = await reqApi.post(
      businessApi.Business_GetNewBusiness,
      data
    );
    if (response) {
      return response;
    }
    return null;
  },

  getWithPagingAdmin: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        businessApi.Business_Admin_GetWithPaging,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  getWithPagingMy: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        businessApi.Business_My_GetWithPaging,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  getBusinessById: async (businessId) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(
        `${businessApi.Business_Admin_GetBusinessById}/${businessId}`
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  createBusinessAdmin: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        businessApi.Business_Admin_CreateBusiness,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  updateBusinesseAdmin: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.put(
        businessApi.Business_Admin_UpdateBusiness,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  deleteBusinessImagesAdmin: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        businessApi.Business_Admin_DeleteBusinessImages,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  sendRequestBecomeBusiness: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        businessApi.Business_SendRequest_BecomeBusiness,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  //report
  businessReportViewContact: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        businessApi.Business_Report_ViewContact,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  businessReportServiceUsed: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        businessApi.Business_Report_ServiceUsed,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  businessGetContactInfo: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(
        businessApi.Business_Report_GetContactInfo
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  //report
};
