using System.Collections.Generic;

namespace Rubybooru.IqdbApi.Api
{
    public class Options
    {
        public static readonly Options Default = new Options(new HashSet<ServiceType>(ServiceType.Values), false);

        public ICollection<ServiceType> Services { get; }
        public bool IgnoreColors { get; }

        public Options(ICollection<ServiceType> services, bool ignoreColors)
        {
            Services = services;
            IgnoreColors = ignoreColors;
        }
    }
}