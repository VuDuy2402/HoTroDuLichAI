namespace HoTroDuLichAI.API
{
    public class BasePagedResult<T>
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        // public bool HasPrevious { get; set; }
        // public bool HasNext { get; set; }
        public string SearchQuery { get; set; } = string.Empty;
        public object? ObjFilterProperties { get; set; }
        public List<T> Items { get; set; } = new();
    }
}