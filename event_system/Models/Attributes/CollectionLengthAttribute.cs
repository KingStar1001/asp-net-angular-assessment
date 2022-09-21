using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace event_system.Models.Attributes
{
    public class CollectionLengthAttribute : ValidationAttribute
    {
        private readonly int MinLength;

        public CollectionLengthAttribute(int minLength)
        {
            MinLength = minLength;
        }

        public override bool IsValid(object? value)
        {
            var collection = value as ICollection;
            return collection?.Count >= MinLength;
        }
    }
}
