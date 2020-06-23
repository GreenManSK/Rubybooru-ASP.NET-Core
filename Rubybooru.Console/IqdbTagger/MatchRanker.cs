using System.Collections.Generic;
using System.Linq;
using Rubybooru.IqdbApi.Api;

namespace Rubybooru.Console.Runners
{
    public class MatchRanker
    {
        private readonly int minSimilarity;
        private readonly Dictionary<int, int> serviceValues;

        public MatchRanker(int minSimilarity, IEnumerable<ServiceType> services)
        {
            this.minSimilarity = minSimilarity;
            serviceValues = new Dictionary<int, int>();
            BuildServiceValues(services);
        }

        public List<Match> OrderBest(IEnumerable<Match> matches)
        {
            return matches.Where(m => m.Similarity >= minSimilarity)
                .OrderBy(m => serviceValues[ServiceType.GetTypeByUrl(m.Url).Id]).ToList();
        }

        private void BuildServiceValues(IEnumerable<ServiceType> services)
        {
            var value = 0;
            foreach (var service in services)
            {
                serviceValues.Add(service.Id, value++);
            }
        }
    }
}