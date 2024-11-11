namespace HoTroDuLichAI.API
{
    public class UserPagingAndFilterParams : PagingParams
    {
        public string SearchQuery { get; set; } = string.Empty;
        public UserFilterProperty? UserFilterProperty { get; set; }
    }
}