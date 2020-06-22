namespace Rubybooru.IqdbApi.Parsers
{
    public class Tag
    {
        public TagType Type { get; }
        public string Value { get; }

        public Tag(TagType type, string value)
        {
            Type = type;
            Value = value;
        }

        private bool Equals(Tag other)
        {
            return Type == other.Type && string.Equals(Value, other.Value);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            return obj.GetType() == GetType() && Equals((Tag) obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return ((int) Type * 397) ^ (Value != null ? Value.GetHashCode() : 0);
            }
        }
    }
}