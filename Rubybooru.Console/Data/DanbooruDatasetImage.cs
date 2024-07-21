using System.Collections.Generic;
using Newtonsoft.Json;

namespace Rubybooru.Console.Data
{
    public class DanbooruDatasetImage
    {

        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("tag_string_character")]
        public string Characters { get; set; }

        [JsonProperty("tag_string_copyright")]
        public string Copyrights { get; set; }
    }
}