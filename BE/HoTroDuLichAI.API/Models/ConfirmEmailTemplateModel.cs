namespace HoTroDuLichAI.API
{
    public class ConfirmEmailTemplateModel : BaseEmailTemplateModel
    {
        public string CustomerName { get; set; } = string.Empty;
        public string ConfirmationLink { get; set; } = string.Empty;
    }
}