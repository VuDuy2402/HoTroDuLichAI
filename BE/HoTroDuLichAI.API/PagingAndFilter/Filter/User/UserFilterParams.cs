namespace HoTroDuLichAI.API
{
    public class UserFilterParams : PagingParams
    {
        public string? Query { get; set; }
        public UserFilterProperties? UserFilterProperties { get; set; }
    }
}