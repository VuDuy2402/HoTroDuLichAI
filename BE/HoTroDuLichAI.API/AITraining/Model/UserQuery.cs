using Microsoft.ML.Data;

namespace HoTroDuLichAI.API
{
    public class UserQuery
    {
        [LoadColumn(0)]
        public string Text { get; set; } = string.Empty;

        [LoadColumn(1)]
        public string Intent { get; set; } = string.Empty;
    }
}