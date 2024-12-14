export const businessApi = {
  Business_GetWithPaging: "api/v1/admin/business/paging",
  Business_GetNewBusiness: "api/v1/admin/business/newbusiness/paging",
  // admin
  Business_Admin_GetWithPaging: "api/v1/admin/business/manage/paging",
  Business_Admin_GetManageRequestWithPaging: "api/v1/admin/business/manage/request/paging",
  Business_Admin_GetBusinessById: "api/v1/admin/business/manage",
  Business_Admin_GetBusinessForUpdateById: "api/v1/admin/business/manage/getforupdate",

  Business_Admin_CreateBusiness: "api/v1/admin/business/manage",
  Business_Admin_UpdateBusiness: "api/v1/admin/business/manage",
  Business_Admin_DeleteBusinessImages:
    "api/v1/admin/business/manage/images/delete",
  // admin


  // business services
  Business_Services_GetBusinessService: "api/v1/admin/business/services/getall",
  Business_Services_GetBusinessServiceById: "api/v1/admin/business/services/getbyid",
  Business_Services_DeleteBusinessServiceById: "api/v1/admin/business/services/deletebyid",
  Business_Services_UpdateBusinessServiceById: "api/v1/admin/business/services/updatebyid",
  Business_Services_CreateBusinessService: "api/v1/admin/business/services/create",
  // business services

  // my
  Business_My_GetWithPaging: "api/v1/admin/business/my/paging",
  // my

  // report
  Business_Report_ViewContact: "api/v1/admin/business/report/viewcontact",
  Business_Report_ServiceUsed: "api/v1/admin/business/report/serviceused",
  Business_Report_GetContactInfo: "api/v1/admin/business/contactperson",
  // report

  //request send
  Business_SendRequest_BecomeBusiness:
    "/api/v1/admin/business/becometobusiness/request",
  Business_SendRequest_ConfirmRegisterNewBusiness:
    "/api/v1/admin/business/becometobusiness/approve",
};
