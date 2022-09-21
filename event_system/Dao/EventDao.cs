namespace event_system.Dao
{
    public class EventDao
    {
        public int? ID { get; set; }
        public string? Name { get; set; }
        public DateTime Date { get; set; }
        public IList<int> Guests { get; set; }
    }
}
