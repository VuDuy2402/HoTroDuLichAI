namespace HoTroDuLichAI.API
{
    #region address property
    public class AddressProperty
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateOnly? BirthDate { get; set; }
        public string ProvinceId { get; set; } = string.Empty;
        public string DistrictId { get; set; } = string.Empty;
        public string WardId { get; set; } = string.Empty;
        public int UsageCount { get; set; } = 0;
        public string FullAddress { get; set; } = string.Empty;
        public bool IsDefault { get; set; } = false;

        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }

        private DateTimeOffset? _modifiedDate;
        public DateTimeOffset? ModifiedDate
        {
            get => _modifiedDate?.ToLocalTime();
            set => _modifiedDate = value;
        }
    }
    #endregion address property
}