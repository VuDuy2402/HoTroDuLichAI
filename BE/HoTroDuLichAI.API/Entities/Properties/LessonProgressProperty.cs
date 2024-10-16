namespace HoTroDuLichAI
{
    public class LessonProgressProperty
    {
        public Guid LessonId { get; set; }
        public long Duration { get; set; }
        private long lastWatchedPosition;
        public long LastWatchedPosition
        {
            get => lastWatchedPosition;
            set
            {
                lastWatchedPosition = value;
                CalculatePercentageCompleted();
            }
        }
        public decimal PercentageCompleted { get; private set; }

        private void CalculatePercentageCompleted()
        {
            if (Duration > 0)
            {
                PercentageCompleted = (decimal)(LastWatchedPosition / Duration) * 100;
            }
            else
            {
                PercentageCompleted = 0;
            }
        }
    }
}