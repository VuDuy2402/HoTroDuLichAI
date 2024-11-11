namespace HoTroDuLichAI.API
{
    public class NotificationPagingAndFilterParam : PagingParams
    {
        public string SearchQuery { get; set; } = string.Empty;
        public NotificationFilterProperty? FilterProperty { get; set; }

    }
}